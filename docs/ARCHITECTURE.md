# Architecture

## Purpose

This repository builds the static public website for https://manueloswald.com. The site is a minimal professional landing page with legal pages, structured SEO metadata, and automated quality checks.

## Technology Stack

- React 19 and React DOM 19
- Vite 8
- TypeScript 5.7
- Tailwind CSS v4 through `@tailwindcss/vite`
- Playwright for smoke, accessibility, and visual tests
- axe through `@axe-core/playwright`
- Lighthouse CI
- pnpm, pinned through `.mise.toml`

## Repository Structure

- `src/App.tsx` contains homepage content, section data, icons, and footer link configuration.
- `src/main.tsx` mounts React into `#root`.
- `src/index.css` contains Tailwind import, CSS design tokens, layout, responsive rules, and interaction states.
- `index.html` is the Vite HTML shell with metadata, JSON-LD, and no-JavaScript fallback content.
- `public/` contains static assets, legal pages, and the shared legal-page stylesheet.
- `.figma/make/site.json` contains site metadata consumed by the Vite config.
- `scripts/` contains validation and quality orchestration scripts.
- `tests/` contains Playwright accessibility, smoke, and visual tests.
- `.github/workflows/pages.yml` builds, validates, and deploys the site.

## Build System

`pnpm run build` runs `vite build` and emits static production output to `dist/`. The Vite config also transforms the HTML shell to inject metadata, Open Graph/Twitter tags, favicon links, optional analytics, and accessibility helpers when configured.

## Content and Page Structure

The homepage is rendered by React from `src/App.tsx`. It includes:

- Hero
- Focus Areas
- Beyond Work
- About Me
- Footer with legal and social/contact links

The legal pages are plain static HTML files:

- `public/imprint.html`
- `public/privacy.html`

They share `public/legal.css`.

The custom GitHub Pages 404 page is:

- `public/404.html`

## CSS and Design Architecture

Homepage CSS is centralized in `src/index.css`. Design tokens are CSS custom properties on `:root`, including colors, font family, weights, tracking, line heights, spacing, footer dimensions, icon dimensions, focus outlines, border, and transition timing. Tailwind is imported, but the visual system is primarily custom CSS rather than utility-heavy markup.

Static legal pages use `public/legal.css` to avoid duplicating their small shared style block. The custom 404 page keeps inline CSS so GitHub Pages can serve it as a standalone error document.

## Responsive Implementation

The homepage uses a CSS grid at larger widths. It changes layout at:

- `max-width: 980px`
- `max-width: 680px`

At mobile widths the page becomes a vertical flex layout. Reduced motion is handled with `@media (prefers-reduced-motion: reduce)`.

## Static Asset Handling

Static public files live in `public/` and are copied into `dist/` by Vite. The canonical social image is `public/social-image.png`; favicon is `public/favicon.svg`; legal-page CSS is `public/legal.css`; the custom domain is preserved through `public/CNAME`.

## SEO Architecture

Homepage canonical metadata is in `index.html`. Generated title, description, Open Graph, Twitter/X image metadata, favicon tags, and optional robots metadata are injected by `vite.config.ts` from `.figma/make/site.json`.

The production canonical domain is `https://manueloswald.com`. Do not use `github.io` canonical URLs.

## JSON-LD

The Person JSON-LD block is embedded in `index.html` as `<script type="application/ld+json">`. It describes Manuel Oswald, includes the canonical URL and social image, and only includes public profile URLs intentionally represented by the site.

Validation lives in `scripts/validate-jsonld.mjs`.

## Open Graph and Social Metadata

Open Graph and Twitter/X image metadata are configured in `.figma/make/site.json` and injected by `vite.config.ts`. The canonical image URL is `https://manueloswald.com/social-image.png`, backed by `public/social-image.png`.

## Analytics

Cloudflare Web Analytics is optional. `vite.config.ts` emits the official Cloudflare beacon only for production builds when `CLOUDFLARE_WEB_ANALYTICS_TOKEN` is configured through the environment or site config. Local builds without the token do not include analytics.

Do not add Google Analytics, Google Tag Manager, cookies, heatmaps, session recording, or advertising trackers without an explicit request.

## Search Console Setup

Google Search Console ownership is intended to use a Domain property with DNS TXT verification. The repository must not include a Search Console HTML verification tag unless a token is explicitly supplied and that verification method is intentionally chosen.

## Sitemap and Robots

- `public/sitemap.xml` lists public indexable URLs using `https://manueloswald.com`.
- `public/robots.txt` allows crawlers and references the production sitemap.
- `scripts/validate-indexing.mjs` checks sitemap, robots, canonical URL, noindex behavior, and production URL hygiene.

## Testing Architecture

The quality stack checks:

- Static SEO/indexing output
- JSON-LD validity
- Link correctness
- Analytics presence or absence
- Lighthouse scores
- Accessibility with axe
- Smoke behavior with Playwright
- Visual regression screenshots with Playwright

See [TESTING.md](TESTING.md).

## CI/CD

`.github/workflows/pages.yml` runs on pull requests, pushes to `main`, and manual dispatch. It installs pnpm dependencies, installs Playwright Chromium, builds the site, runs validators, runs the quality suite, and deploys only on pushes to `main`.

## GitHub Pages Deployment

The workflow uploads `dist/` as the Pages artifact and deploys it with `actions/deploy-pages`. `public/CNAME` ensures the built output includes the custom domain file for `manueloswald.com`.

## Custom Domain Behavior

The production domain is `manueloswald.com`. DNS is managed outside the repository, documented in [DEPLOYMENT.md](DEPLOYMENT.md). The repository contains no DNS credentials or private verification values.

## Environment and Configuration Strategy

- Tool versions are pinned in `.mise.toml`.
- Public site metadata is in `.figma/make/site.json`.
- The Cloudflare Web Analytics token is configured through `CLOUDFLARE_WEB_ANALYTICS_TOKEN`.
- `.env.example` documents the variable without a real value.
- Actual `.env` files are ignored.

## Public vs Private Configuration

Safe public configuration:

- Canonical domain
- Public social/profile URLs
- Open Graph image URL
- Sitemap and robots files
- Empty `.env.example`

Private configuration:

- Real Cloudflare Web Analytics token
- DNS verification TXT values
- Account credentials or API tokens

## Things Intentionally Not Used

- No backend
- No database
- No runtime CMS
- No client-side routing
- No multi-page application framework beyond Vite's static output
- No unnecessary analytics tooling
- No Google Analytics or Google Tag Manager
- No cookies introduced by this project
