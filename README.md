# timothyali.com

Personal portfolio of Timothy Ali — a designer working across product, brand, and motion.
Swiss-modernist design language: dark mode primary, 12-column grids, fluid type, no decorative UI.

Built with **SvelteKit 2 + Svelte 5**, Tailwind CSS v4, and zero animation dependencies —
Svelte transitions, springs, and the View Transitions API do all the motion work.
Fully prerendered and deployed on Vercel.

## Development

```bash
pnpm install
pnpm dev
```

Open [http://localhost:5173](http://localhost:5173).

## Commands

| Command        | Purpose                                |
| -------------- | -------------------------------------- |
| `pnpm dev`     | Dev server                             |
| `pnpm build`   | Production build (prerenders the site) |
| `pnpm preview` | Preview the production build           |
| `pnpm check`   | svelte-check type checking             |
| `pnpm lint`    | Prettier + ESLint                      |
| `pnpm format`  | Format the codebase                    |

## Architecture

- **Routes** live in `src/routes` — each case study is its own page under `work/`.
- **Blog posts** are markdown with frontmatter in `src/content/posts`, compiled by mdsvex.
- **Images** in `src/lib/images` are optimized at build time by `@sveltejs/enhanced-img`
  (AVIF/WebP + responsive srcset); videos are served from `static/videos`.
- **Design tokens** are defined in `src/app.css` (Tailwind v4 `@theme` + Swiss utility classes).
- **OG images** are generated at build time with satori + resvg (`/og/[key].png`).

See `CLAUDE.md` for the full project rules and design system documentation.
