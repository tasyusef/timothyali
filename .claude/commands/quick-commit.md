---
allowed-tools: Bash(git:*), Read
description: Quick commit and push without creating a PR. For small fixes and incremental work.
argument-hint: [optional: commit message]
---

1. Run `git diff --stat` to see what changed.
2. Stage all changes with `git add -A`.
3. If an argument was provided, use it as the commit message. Otherwise, write a concise conventional commit message based on the diff.
4. Commit and push to the current branch.
