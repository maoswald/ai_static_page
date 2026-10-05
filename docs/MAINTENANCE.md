# Maintenance

## Current Stable Baseline

- Production URL: `https://manueloswald.com`
- Version marker: v1 baseline, with `package.json` at `1.0.0`
- Architecture: static React/Vite homepage, plain static legal pages, custom static 404 page
- Deployment: GitHub Actions builds `dist/` and deploys to GitHub Pages from pushes to `main`
- Analytics: optional Cloudflare Web Analytics beacon, enabled only when `CLOUDFLARE_WEB_ANALYTICS_TOKEN` is configured for production builds
- SEO: canonical homepage metadata in `index.html`, Person JSON-LD in `index.html`, Open Graph/Twitter metadata from `.figma/make/site.json`, sitemap and robots files in `public/`
- Quality gates: formatting, production build, indexing validation, JSON-LD validation, link validation, analytics validation, axe accessibility, Playwright smoke tests, visual regression, and Lighthouse
- Local verification: `pnpm run verify`
- Full verification: `pnpm run verify:full`
- Common content changes: `src/App.tsx`
- Common design changes: `src/index.css`, plus `public/legal.css` for static legal pages
- Common metadata changes: `index.html`, `.figma/make/site.json`, and `vite.config.ts`

The site is feature-complete for its current purpose. Default maintenance should focus on content, positioning, bug fixes, dependency/security updates, and explicitly requested features. Do not expand the product scope by adding a backend, database, CMS, blog, extra analytics, complex animations, or a redesign without an explicit request.

## Change Hero Headline

Edit the hero `<h1>` in `src/App.tsx`. Keep line breaks intentional and rerun visual tests.

## Change Focus-Area Copy

Edit the `focusAreas` array in `src/App.tsx`.

## Change About or Beyond Work Copy

Edit the `editorial--about` or `editorial--beyond` sections in `src/App.tsx`.

## Change Footer Links

Edit the `links`, `legalLinks`, and `socialLinks` configuration in `src/App.tsx`. If public profile URLs change, also update JSON-LD `sameAs` in `index.html` and rerun `pnpm run validate:jsonld`.

## Replace the Open Graph Image

Replace `public/social-image.png`. Then update `.figma/make/site.json` if the production URL, width, height, or alt text changes. The current metadata expects:

- URL: `https://manueloswald.com/social-image.png`
- Width: `1200`
- Height: `630`

Rerun `pnpm run build`, `pnpm run validate:jsonld`, and `pnpm run validate:links`.

## Update JSON-LD

Edit the Person JSON-LD block in `index.html`. Keep it concise and public. Do not add private personal data. Validate with:

```sh
pnpm run build
pnpm run validate:jsonld
```

## Update Social Links

Homepage footer links live in `src/App.tsx`. Public profile links represented as structured data also live in `index.html` under `sameAs`.

## Change Colors

Edit color custom properties in `src/index.css`. If changing legal-page colors, keep `public/legal.css` aligned. Intentional color changes require visual baseline review.

## Change Typography

Edit font, weight, tracking, line-height, and responsive font-size rules in `src/index.css`. The static legal pages have their small shared type rules in `public/legal.css`. Keep text readable at mobile, tablet, and desktop widths.

## Change Analytics Configuration

Cloudflare Web Analytics is controlled by `CLOUDFLARE_WEB_ANALYTICS_TOKEN`. For GitHub Pages, configure it as a repository secret. Leave it empty or unset to disable analytics.

Local disabled check:

```sh
pnpm run build
pnpm run validate:analytics -- absent
```

Production-like enabled check:

```sh
CLOUDFLARE_WEB_ANALYTICS_TOKEN=your-token pnpm run build
pnpm run validate:analytics -- present
```

Do not commit real token values.

## Run Tests

```sh
pnpm run verify
```

Use `pnpm run verify:full` before releases or deployment-sensitive changes.

## Update Visual Baselines

Only after an approved visual change:

```sh
pnpm run build
pnpm exec playwright test tests/visual.spec.ts --update-snapshots
```

Review changed PNG files in `tests/visual.spec.ts-snapshots/`.

## Deploy

Merge or push to `main`. GitHub Actions builds, validates, uploads `dist/`, and deploys to GitHub Pages.

See [DEPLOYMENT.md](DEPLOYMENT.md).
