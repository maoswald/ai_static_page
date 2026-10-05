# AI Context

This repository is the source for the public personal website at https://manueloswald.com.

The site presents Manuel Oswald's professional positioning: Enterprise Transformation, Technology Strategy and AI & Cloud. It is a minimal professional landing page with legal pages, structured data, social metadata, a sitemap, robots.txt, and a small quality-test suite.

## Stable Maintenance State

The site is considered feature-complete for its current purpose. Treat the current implementation as the v1 baseline. Future work should normally be limited to content updates, professional positioning updates, bug fixes, dependency/security maintenance, or explicitly requested features.

AI agents should not proactively introduce a new framework, backend, database, CMS, blog, complex animations, additional analytics, visual redesign, or broader product scope without an explicit request.

## What This Site Is

- A static personal/professional website
- A lightweight GitHub Pages site
- A small React/Vite project that builds to static files
- A visually precise single-page portfolio with separate legal pages
- A repository intended to remain understandable for future developers and AI coding agents

## What This Site Is Not

Do not turn this into any of the following unless explicitly requested:

- Blog
- SaaS product
- CMS
- Client-side app with routing/state
- Backend application
- Database-backed application

## Design Philosophy

The design is intentionally minimal, high-contrast, grid-based, and typographic. Preserve the red/orange, black, off-white palette; strong spacing; direct section hierarchy; and existing footer interaction model.

## Technical Philosophy

Keep runtime behavior small. Prefer static content, build-time metadata, simple CSS, and focused tests. Avoid new frameworks, analytics vendors, tracking tools, build layers, or client-side routing unless the task explicitly requires them.

## Major Architecture Decisions

- Vite builds the static site into `dist/`.
- React renders the homepage content from `src/App.tsx`.
- Global CSS and design tokens live in `src/index.css`.
- The HTML shell in `index.html` owns canonical metadata, JSON-LD, and the no-JavaScript fallback.
- `.figma/make/site.json` provides shared site metadata for Vite's HTML transform.
- `vite.config.ts` injects generated metadata and the optional Cloudflare Web Analytics beacon.
- `public/` contains static legal pages and public assets.
- GitHub Actions deploys `dist/` to GitHub Pages on pushes to `main`.

## Important Files

- `src/App.tsx`
- `src/index.css`
- `index.html`
- `.figma/make/site.json`
- `vite.config.ts`
- `public/`
- `tests/`
- `scripts/`
- `.github/workflows/pages.yml`

## Read First

Future agents should read:

- [ARCHITECTURE.md](ARCHITECTURE.md)
- [DESIGN.md](DESIGN.md)
- [TESTING.md](TESTING.md)
- [MAINTENANCE.md](MAINTENANCE.md)
