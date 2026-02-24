## Full Audit

Run a complete code audit using all available agents. Follow this exact order:

### Phase 1 — Parallel (readonly)
Run these three agents simultaneously. They are all readonly and independent:
- `@code-reviewer` — bugs, accessibility, performance, security, types
- `@design-check` — design tokens, responsive, interaction states, visual consistency
- `@seo-check` — metadata, semantic HTML, images, structured data, crawlability

Wait for all three to finish before proceeding.

### Phase 2 — Review & Simplify
1. Summarize all findings from Phase 1, grouped by severity (critical, warning, suggestion).
2. Run `@code-simplifier` to clean up code (dead code, unused imports, complexity).

### Phase 3 — Verify
Run `@verify-app` to confirm nothing is broken after changes.

### Final Output
Provide a single summary with:
- Total issues found per category
- What was auto-fixed by code-simplifier
- What still needs manual attention
- Pass/fail status from verify-app
