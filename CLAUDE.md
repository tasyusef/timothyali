# Project Rules

## Workflow
- **Always start in Plan mode.** Outline what you'll do and why before writing any code. Wait for approval before executing.
- **Verify your work.** After making changes, run the dev server, linters, and type checks. If there's a browser preview, open it and confirm the UI looks correct.
- **Keep PRs small and focused.** One feature or fix per PR. If scope creeps, suggest splitting into separate PRs.
- **Commit with clear messages.** Use conventional commits: `feat:`, `fix:`, `refactor:`, `style:`, `docs:`, `chore:`.

## Code Style
- Use functional components with hooks. No class components.
- Prefer named exports over default exports.
- Colocate component files: `ComponentName/index.tsx`, `ComponentName/styles.ts`, etc.
- Use `cn()` utility (clsx + tailwind-merge) for conditional class names.
- Avoid inline styles. Use Tailwind classes.
- Keep components under 150 lines. Extract sub-components when they grow.
- Use semantic HTML elements (`<nav>`, `<main>`, `<section>`, `<article>`, etc.).

## Design & UI
- Follow the project's design tokens (colors, spacing, typography) defined in `tailwind.config.ts`.
- Maintain consistent spacing using Tailwind's spacing scale — don't use arbitrary values like `p-[13px]`.
- All interactive elements must have visible focus states and hover states.
- Responsive by default: build mobile-first, then layer on `sm:`, `md:`, `lg:` breakpoints.
- Animations should be subtle and respect `prefers-reduced-motion`.
- Be creative.
- Be infitely resourceful.
- Ask me questions.

## Common Mistakes — Don't Repeat These
- Required: After every UI change, run the design-check agent. No exceptions.
- Required: After every change, run the code-reviewer agent, the code-simplifier agent, and the verify-app agent. No exceptions.
- Required: Before pushing any commit to github, run the verify-app agent. No Exceptions.
- Required: Use pnpm typecheck instead of pnpm build for verification.
- Required: Don't hardcode colors. Use design tokens from tailwind config.

## Testing
- Run `pnpm typecheck` after every change.
- Run `pnpm lint` before committing.
- Run `pnpm build` to catch build errors before pushing.
