# Contributing Guide

## 🧰 Setup

- **Node 20+** (22 LTS recommended).
- **npm 11.6.2** — the version pinned in `package.json` (`packageManager`) and used by CI.
  Install dependencies with it, even if your global npm is newer:

  ```bash
  npx -y npm@11.6.2 install              # install / update the lockfile
  npx -y npm@11.6.2 install -D <package> # add a dependency
  ```

  A lockfile generated with another npm version drops native binaries for other platforms
  and breaks `npm ci` in CI. The `Lint` workflow rejects it.

- Playwright browser (once): `npx playwright install chromium`.
- Line endings are LF everywhere (enforced by `.gitattributes`). If your checkout predates it
  and `npm run format:check` fails on files you did not touch, refresh your working copy:
  `git rm -r --cached -q . && git reset --hard` (commit or stash your work first).

## 📋 Picking a Ticket

1. Pick a ticket from the [project board](https://github.com/orgs/BioWatchOrg/projects/1).
2. Assign yourself and move it to **In progress** before starting.
3. Check its DoR / DoD in Notion before writing code.

## 🌿 Branch Naming

`<ticket>_<TYPE>_short-description`

Examples:

- `49_FEATURE_landing-page`
- `35_CHORE_migrate-react-to-v19`
- `17_FIX_broken-navbar`

## 🌲 Branch Strategy

| Branch      | Purpose                   | Who merges into it?    |
| ----------- | ------------------------- | ---------------------- |
| `main`      | Production — live app     | Only PRs from `dev`    |
| `dev`       | Integration — tested work | PRs from task branches |
| task branch | Your day-to-day work      | You, via PR            |

Always branch off from an up-to-date `dev`, never from `main`.

## 💬 Commit Messages

Format: `type: short description`

Types: `feat`, `fix`, `perf`, `refactor`, `test`, `docs`, `style`, `ci`, `build`, `chore`

Examples:

- `feat: add login form validation`
- `fix: resolve navbar overflow on mobile`
- `test: add e2e smoke tests`
- `ci: run e2e smoke tests on pull requests`

No squash: keep small, meaningful commits.

## ✅ Before Opening a PR

```bash
npm run lint
npm run format:check
npm run typecheck
npm run test:coverage
npm run test:e2e
```

## 🔄 Pull Requests

1. Open the PR against `dev` and link the ticket with `Closes #<ticket>`.
2. Fill in the PR template (Definition of Done checklist).
3. Add the `run-review` label to trigger the automated reviewer (advisory; re-apply it after
   pushing new commits).
4. Get **at least 1 human review**.
5. Merge only when all required checks are green.
6. `main` is only updated via a PR from `dev` after QA.

## 🚦 Required CI Checks

| Workflow  | What it checks                                                                   |
| --------- | -------------------------------------------------------------------------------- |
| `Lint`    | lockfile generated with npm 11.6.2, ESLint, Prettier, TypeScript                 |
| `Secrets` | gitleaks scan of the PR commits                                                  |
| `Test`    | Vitest with coverage — PRs touching `src/**/*.ts(x)` must increase line coverage |
| `E2E`     | Playwright smoke tests on the production build (report and traces as artifacts)  |

## 📝 Documentation

Every delivered feature is documented in the Notion **Documentation Technique** database
(see `CLAUDE.md`) and, when relevant, in the README.
