// BioWatch Notion MCP server (stdio, JS).
//
// Exposes two tools to Claude Code so every team member can read tasks from Notion:
//   - notion_get_subpages: recursive index of the task tree (titles + ids)
//   - notion_get_page_content: full body of a task page (Markdown-like)
//
// Requires NOTION_TOKEN in the local .env file (gitignored). The Notion
// integration must be granted access to the BioWatch root page.

import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "..");

const NOTION_API = "https://api.notion.com/v1";
const NOTION_VERSION = "2022-06-28";
const BIOWATCH_ROOT_PAGE_ID = "31150bea-018d-800e-843b-f3403306af0e";

function loadDotenv(path) {
  let raw;
  try {
    raw = readFileSync(path, "utf8");
  } catch {
    return;
  }
  for (const rawLine of raw.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq < 0) continue;
    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = value;
  }
}

loadDotenv(resolve(REPO_ROOT, ".env"));

function headers() {
  const token = process.env.NOTION_TOKEN;
  if (!token) {
    throw new Error(
      "NOTION_TOKEN missing. Add `NOTION_TOKEN=secret_...` to the project's " +
        ".env (create a Notion integration at https://www.notion.so/my-integrations, " +
        "then share the BioWatch root page with it).",
    );
  }
  return {
    Authorization: `Bearer ${token}`,
    "Notion-Version": NOTION_VERSION,
    "Content-Type": "application/json",
  };
}

function normalizeId(raw) {
  const s = String(raw).replace(/-/g, "").trim();
  if (s.length !== 32) return raw;
  return `${s.slice(0, 8)}-${s.slice(8, 12)}-${s.slice(12, 16)}-${s.slice(16, 20)}-${s.slice(20, 32)}`;
}

function extractPageTitle(page) {
  const props = page?.properties ?? {};
  for (const prop of Object.values(props)) {
    if (prop?.type === "title") {
      const parts = prop.title ?? [];
      const text = parts.map((p) => p.plain_text ?? "").join("");
      return text || "(untitled)";
    }
  }
  return "(untitled)";
}

function richText(parts) {
  return (parts ?? []).map((p) => p.plain_text ?? "").join("");
}

async function notionFetch(method, url, body) {
  const init = { method, headers: headers() };
  if (method !== "GET" && body !== undefined) {
    init.body = JSON.stringify(body);
  }
  const r = await fetch(url, init);
  if (!r.ok) {
    const text = await r.text().catch(() => "");
    const err = new Error(`Notion ${method} ${url} -> ${r.status}: ${text}`);
    err.status = r.status;
    throw err;
  }
  return r.json();
}

async function paginate(method, url, body) {
  const results = [];
  let cursor = null;
  while (true) {
    let data;
    if (method === "GET") {
      const params = new URLSearchParams({ page_size: "100" });
      if (cursor) params.set("start_cursor", cursor);
      data = await notionFetch("GET", `${url}?${params.toString()}`);
    } else {
      const payload = { page_size: 100, ...(body ?? {}) };
      if (cursor) payload.start_cursor = cursor;
      data = await notionFetch(method, url, payload);
    }
    results.push(...(data.results ?? []));
    if (!data.has_more) return results;
    cursor = data.next_cursor;
  }
}

async function walkPage(pageId, title, depth, maxDepth) {
  const node = { id: pageId, title, kind: "page", children: [] };
  if (depth >= maxDepth) return node;
  const blocks = await paginate("GET", `${NOTION_API}/blocks/${pageId}/children`);
  for (const b of blocks) {
    if (b.type === "child_page") {
      node.children.push(
        await walkPage(b.id, b.child_page?.title ?? "(untitled)", depth + 1, maxDepth),
      );
    } else if (b.type === "child_database") {
      node.children.push(
        await walkDatabase(
          b.id,
          b.child_database?.title ?? "(untitled)",
          depth + 1,
          maxDepth,
        ),
      );
    }
  }
  return node;
}

async function walkDatabase(dbId, title, depth, maxDepth) {
  const node = { id: dbId, title, kind: "database", children: [] };
  if (depth >= maxDepth) return node;
  const pages = await paginate("POST", `${NOTION_API}/databases/${dbId}/query`);
  for (const page of pages) {
    node.children.push(
      await walkPage(page.id, extractPageTitle(page), depth + 1, maxDepth),
    );
  }
  return node;
}

async function resolveRoot(nodeId, maxDepth) {
  try {
    const data = await notionFetch("GET", `${NOTION_API}/databases/${nodeId}`);
    const title =
      (data.title ?? []).map((p) => p.plain_text ?? "").join("") ||
      "(untitled database)";
    return await walkDatabase(nodeId, title, 0, maxDepth);
  } catch (err) {
    if (err.status !== 400 && err.status !== 404) throw err;
  }
  const page = await notionFetch("GET", `${NOTION_API}/pages/${nodeId}`);
  return await walkPage(nodeId, extractPageTitle(page), 0, maxDepth);
}

function formatTree(node, indent = 0) {
  const prefix = "  ".repeat(indent) + (indent > 0 ? "- " : "");
  let out = `${prefix}[${node.kind}] ${node.title} (${node.id})\n`;
  for (const c of node.children ?? []) out += formatTree(c, indent + 1);
  return out;
}

async function renderBlocks(blockId, indent, maxDepth) {
  if (indent >= maxDepth) return "";
  const blocks = await paginate("GET", `${NOTION_API}/blocks/${blockId}/children`);
  const pad = "  ".repeat(indent);
  const lines = [];
  for (const b of blocks) {
    const btype = b.type ?? "";
    const data = b[btype] ?? {};
    const text = richText(data.rich_text);

    if (btype === "paragraph") {
      lines.push(text ? `${pad}${text}` : "");
    } else if (btype === "heading_1") {
      lines.push(`${pad}# ${text}`);
    } else if (btype === "heading_2") {
      lines.push(`${pad}## ${text}`);
    } else if (btype === "heading_3") {
      lines.push(`${pad}### ${text}`);
    } else if (btype === "bulleted_list_item") {
      lines.push(`${pad}- ${text}`);
    } else if (btype === "numbered_list_item") {
      lines.push(`${pad}1. ${text}`);
    } else if (btype === "to_do") {
      const mark = data.checked ? "x" : " ";
      lines.push(`${pad}- [${mark}] ${text}`);
    } else if (btype === "toggle") {
      lines.push(`${pad}▸ ${text}`);
    } else if (btype === "quote") {
      lines.push(`${pad}> ${text}`);
    } else if (btype === "callout") {
      const icon = data.icon?.emoji ?? "ℹ️";
      lines.push(`${pad}${icon} ${text}`);
    } else if (btype === "code") {
      const lang = data.language ?? "";
      lines.push(`${pad}\`\`\`${lang}\n${text}\n${pad}\`\`\``);
    } else if (btype === "divider") {
      lines.push(`${pad}---`);
    } else if (btype === "child_page") {
      lines.push(`${pad}↳ [page] ${data.title ?? "(untitled)"} (${b.id})`);
    } else if (btype === "child_database") {
      lines.push(`${pad}↳ [db] ${data.title ?? "(untitled)"} (${b.id})`);
    } else if (btype === "table_of_contents" || btype === "breadcrumb") {
      continue;
    } else if (text) {
      lines.push(`${pad}${text}`);
    }

    if (
      b.has_children &&
      btype !== "child_page" &&
      btype !== "child_database"
    ) {
      const nested = await renderBlocks(b.id, indent + 1, maxDepth);
      if (nested) lines.push(nested);
    }
  }
  return lines.join("\n");
}

// ---------------------------------------------------------------------------
// MCP server
// ---------------------------------------------------------------------------

const server = new Server(
  { name: "biowatch-notion", version: "0.1.0" },
  { capabilities: { tools: {} } },
);

const TOOLS = [
  {
    name: "notion_get_subpages",
    description:
      "BioWatch task index (Notion). Returns the recursive tree of task pages " +
      "[kind] title (id) under the project root. " +
      "Use this to LOCATE a task ID — then call `notion_get_page_content` with that ID " +
      "to read the task's implementation details, Definition of Ready (DoR) and Definition of Done (DoD). " +
      "Defaults page_id to the BioWatch task root.",
    inputSchema: {
      type: "object",
      properties: {
        page_id: {
          type: "string",
          description:
            "Optional Notion page or database ID (with or without dashes). Defaults to the BioWatch task root.",
        },
        max_depth: {
          type: "integer",
          description: "Recursion depth (default 5, max 10).",
          default: 5,
          minimum: 1,
          maximum: 10,
        },
      },
    },
  },
  {
    name: "notion_get_page_content",
    description:
      "Read the full body of a BioWatch task page from Notion as Markdown-like text. " +
      "Use this AFTER `notion_get_subpages` to fetch the implementation details, " +
      "Definition of Ready (DoR) and Definition of Done (DoD) of a specific task before starting work.",
    inputSchema: {
      type: "object",
      properties: {
        page_id: {
          type: "string",
          description: "Notion page ID of the task (with or without dashes).",
        },
        max_depth: {
          type: "integer",
          description: "Nested-block depth (default 4, max 8).",
          default: 4,
          minimum: 1,
          maximum: 8,
        },
      },
      required: ["page_id"],
    },
  },
];

server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: TOOLS }));

server.setRequestHandler(CallToolRequestSchema, async (req) => {
  const name = req.params.name;
  const args = req.params.arguments ?? {};

  if (name === "notion_get_subpages") {
    const pageId = normalizeId(args.page_id || BIOWATCH_ROOT_PAGE_ID);
    const maxDepth = Math.max(1, Math.min(Number(args.max_depth ?? 5), 10));
    const tree = await resolveRoot(pageId, maxDepth);
    return { content: [{ type: "text", text: formatTree(tree) }] };
  }

  if (name === "notion_get_page_content") {
    const raw = args.page_id;
    if (!raw) throw new Error("page_id is required");
    const pageId = normalizeId(raw);
    const maxDepth = Math.max(1, Math.min(Number(args.max_depth ?? 4), 8));
    const page = await notionFetch("GET", `${NOTION_API}/pages/${pageId}`);
    const title = extractPageTitle(page);
    const body = await renderBlocks(pageId, 0, maxDepth);
    const text = `# ${title}\n\n${body}`.replace(/\s+$/, "") + "\n";
    return { content: [{ type: "text", text }] };
  }

  throw new Error(`Unknown tool: ${name}`);
});

const transport = new StdioServerTransport();
await server.connect(transport);
