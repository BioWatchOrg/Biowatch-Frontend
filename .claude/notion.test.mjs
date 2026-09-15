import { test } from "node:test";
import assert from "node:assert/strict";

import { rt, heading, paragraphBlock, codeBlock, callout, buildDocBlocks } from "./notion.mjs";

test("rt wraps short content in a single rich_text chunk", () => {
  assert.deepEqual(rt("hello"), [{ type: "text", text: { content: "hello" } }]);
});

test("rt returns a single empty chunk for empty content", () => {
  assert.deepEqual(rt(""), [{ type: "text", text: { content: "" } }]);
});

test("rt splits content over 2000 chars into multiple chunks", () => {
  const content = "a".repeat(4500);
  const chunks = rt(content);

  assert.equal(chunks.length, 3);
  assert.equal(chunks[0].text.content.length, 2000);
  assert.equal(chunks[1].text.content.length, 2000);
  assert.equal(chunks[2].text.content.length, 500);
  assert.equal(chunks.map((c) => c.text.content).join(""), content);
});

test("heading builds a heading_1 block", () => {
  assert.deepEqual(heading("Titre"), {
    object: "block",
    type: "heading_1",
    heading_1: { rich_text: rt("Titre") },
  });
});

test("paragraphBlock builds a paragraph block", () => {
  assert.deepEqual(paragraphBlock("Texte"), {
    object: "block",
    type: "paragraph",
    paragraph: { rich_text: rt("Texte") },
  });
});

test("codeBlock defaults to typescript as the language", () => {
  const block = codeBlock("const x = 1;");
  assert.equal(block.type, "code");
  assert.equal(block.code.language, "typescript");
});

test("codeBlock accepts an explicit language", () => {
  const block = codeBlock("print(1)", "python");
  assert.equal(block.code.language, "python");
});

test("callout defaults to the 💡 emoji", () => {
  const block = callout("Note");
  assert.equal(block.type, "callout");
  assert.equal(block.callout.icon.emoji, "💡");
});

test("callout accepts a custom emoji", () => {
  const block = callout("Attention", "⚠️");
  assert.equal(block.callout.icon.emoji, "⚠️");
});

test("buildDocBlocks omits the Requirements section when not provided", () => {
  const blocks = buildDocBlocks("Résumé", "structure/", "workflow");

  assert.equal(blocks.length, 6);
  assert.deepEqual(
    blocks.map((b) => b.type),
    ["heading_1", "paragraph", "heading_1", "code", "heading_1", "callout"],
  );
});

test("buildDocBlocks omits the Requirements section when it's blank", () => {
  const blocks = buildDocBlocks("Résumé", "structure/", "workflow", "   ");
  assert.equal(blocks.length, 6);
});

test("buildDocBlocks appends the Requirements section when provided", () => {
  const blocks = buildDocBlocks("Résumé", "structure/", "workflow", "Ne pas dépasser 20%");

  assert.equal(blocks.length, 8);
  assert.deepEqual(
    blocks.map((b) => b.type),
    ["heading_1", "paragraph", "heading_1", "code", "heading_1", "callout", "heading_1", "callout"],
  );
  assert.equal(blocks[7].callout.rich_text[0].text.content, "Ne pas dépasser 20%");
});
