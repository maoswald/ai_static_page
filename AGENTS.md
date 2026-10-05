# Purpose

This repository contains the source for https://manueloswald.com.

# Project Goals

- Simplicity
- Visual consistency
- Accessibility
- Performance
- Minimal JavaScript
- Low maintenance
- GitHub Pages compatibility

# Before Making Changes

Read these first:

- [docs/AI_CONTEXT.md](docs/AI_CONTEXT.md)
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
- [docs/DESIGN.md](docs/DESIGN.md)
- [docs/TESTING.md](docs/TESTING.md)
- [docs/MAINTENANCE.md](docs/MAINTENANCE.md)

# Non-Negotiable Rules

- Do not redesign unless explicitly requested.
- Preserve the established visual language.
- Do not introduce frameworks unnecessarily.
- Do not introduce a backend or database.
- Prefer static HTML/CSS and simple build-time behavior.
- Reuse existing design tokens and components.
- Preserve responsive behavior.
- Preserve accessibility.
- Do not expose personal or private data.
- The canonical production domain is `https://manueloswald.com`.
- Do not use `github.io` as a production canonical URL.
- Keep changes narrowly scoped.
- Do not refactor unrelated parts opportunistically.

# Required Validation

Use the actual project commands:

- Build: `pnpm run build`
- Full quality suite: `pnpm run quality`
- Accessibility: `pnpm run quality:a11y`
- Lighthouse: `pnpm run quality:lighthouse`
- Smoke tests: `pnpm run test:smoke`
- Visual regression: `pnpm run quality:visual`
- Indexing checks: `pnpm run validate:indexing`
- JSON-LD checks: `pnpm run validate:jsonld`
- Link checks: `pnpm run validate:links`
- Analytics disabled locally: `pnpm run validate:analytics -- absent`
- Analytics enabled in production builds with a configured token: `pnpm run validate:analytics -- present`

# Important Project Locations

- Site content: [src/App.tsx](src/App.tsx)
- Styles and design tokens: [src/index.css](src/index.css)
- HTML shell, canonical URL, no-JavaScript fallback, JSON-LD: [index.html](index.html)
- Open Graph, Twitter/X metadata, social image configuration: [.figma/make/site.json](.figma/make/site.json)
- Head/SEO metadata and Cloudflare analytics injection: [vite.config.ts](vite.config.ts)
- Static legal pages and assets: [public/](public/)
- Sitemap and robots: [public/sitemap.xml](public/sitemap.xml), [public/robots.txt](public/robots.txt)
- Tests: [tests/](tests/)
- Quality scripts: [scripts/](scripts/)
- CI and deployment: [.github/workflows/pages.yml](.github/workflows/pages.yml)

# Deployment

The site deploys through GitHub Actions in [.github/workflows/pages.yml](.github/workflows/pages.yml). Pushes to `main` build the static `dist/` output, run validations and quality checks, upload the Pages artifact, and deploy to GitHub Pages. Pull requests run the build and checks but do not deploy.
