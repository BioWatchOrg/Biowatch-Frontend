# Contributing Guide

## 🌿 Branch Naming

`ticketNumber_Feature_short-description`
Examples:

- `42_Feature_user-login`
- `17_Fix_broken-navbar`

## 🌲 Branch Strategy

| Branch        | Purpose                       | Who merges into it?         |
| ------------- | ----------------------------- | --------------------------- |
| `main`        | Production — live app         | Only PRs from `development` |
| `development` | Dev environment — tested work | PRs from feature branches   |
| feature/fix   | Your day-to-day work branches | You, via PR                 |

## 💬 Commit Messages

Follow this structure: `type: short description`

Types: `feat`, `fix`, `style`, `refactor`, `docs`, `chore`

Examples:

- `feat: add login form validation`
- `fix: resolve navbar overflow on mobile`
- `docs: update README setup instructions`

## 🔄 Workflow

1. Pick a ticket from the project board
2. Branch off from `development` (never from `main`)
   git checkout development
   git checkout -b 42_Feature_user-login
3. Commit small and often
4. Open a PR targeting `development` and link it with `Closes #42`
5. Request a review before merging
6. `main` is only updated via a PR from `development` when releasing to production
