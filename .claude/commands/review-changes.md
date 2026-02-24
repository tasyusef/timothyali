---
allowed-tools: Bash(git:*), Read
description: Review uncommitted changes for bugs, design issues, and code quality.
---

1. Run `git diff` to see all uncommitted changes.
2. Review the diff for:
   - **Bugs:** Logic errors, missing null checks, broken references, incorrect types.
   - **UI/UX issues:** Missing responsive breakpoints, hardcoded values that should use tokens, missing hover/focus states, accessibility gaps (missing aria labels, poor semantic HTML).
   - **Code quality:** Components that are too large, duplicated logic, inconsistent patterns, unused imports.
   - **Consistency:** Does this match the conventions in CLAUDE.md and the existing codebase?
3. Provide a clear summary: what looks good, what needs attention, and specific suggestions to fix any issues found.

Be direct and specific. Don't pad with compliments — focus on what matters.
