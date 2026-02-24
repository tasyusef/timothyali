---
allowed-tools: Read, Write
description: Scaffold a new component with the project's conventions. Creates the file structure and boilerplate.
argument-hint: <ComponentName> [ui|feature]
---

Create a new component following the project's conventions:

1. Parse the argument for the component name and type (default to "ui" if not specified).
2. If type is "ui", create in `src/components/ui/`.
3. If type is "feature", create in `src/components/[feature-name]/`.
4. Create the component file with:
   - Named export (not default)
   - TypeScript interface for props
   - Proper use of `cn()` for className merging
   - Semantic HTML
   - Basic responsive structure
5. Include a brief comment at the top describing what the component does.
