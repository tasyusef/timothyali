---
allowed-tools: Bash(pnpm:*), Bash(npx:*), Read, Write, Edit
description: Run typecheck, lint, and build. Fix any errors found. Repeat until clean.
---

Run the following checks in order. If any fail, fix the issues and re-run until all pass:

1. `pnpm typecheck` — fix any TypeScript errors.
2. `pnpm lint` — fix any ESLint errors. Prefer auto-fix with `pnpm lint --fix` first.
3. `pnpm build` — fix any build errors.

After all three pass cleanly, report what was fixed.
