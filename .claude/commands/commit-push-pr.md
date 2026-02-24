---
allowed-tools: Bash(git:*), Bash(pnpm:*), Read, Write
description: Commit, push, and create a PR. Used dozens of times daily.
argument-hint: [optional: branch name or PR title]
---

1. Run `git diff --stat` and `git diff --cached --stat` to see what changed.
2. Run `pnpm typecheck` and `pnpm lint`. If either fails, fix the issues first.
3. Stage all changes with `git add -A`.
4. Write a clear conventional commit message based on the actual diff. Keep it concise.
5. Commit the changes.
6. Push the branch to origin.
7. If the GitHub CLI (`gh`) is available, create a PR with a descriptive title and body summarizing the changes. If not, output the command the user would need to run.

If an argument was provided, use it as the PR title or branch name as appropriate.
