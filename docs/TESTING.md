# Testing

## Overview

The project uses lightweight checks for a small static site. There is no separate unit-test layer; validation is covered by static scripts, Lighthouse CI, Playwright, axe, smoke tests, and visual regression.

## Verification Commands

Normal local verification:

```sh
pnpm run verify
```

This is the default command to run before committing. It checks formatting, builds the site, validates static output, starts one local preview server, then runs accessibility and smoke tests.

Full verification:

```sh
pnpm run verify:full
```

This is the CI-equivalent command. It runs the normal static gates plus Lighthouse and the full Playwright suite, including visual regression.

Static-only verification:

```sh
pnpm run verify:static
```

This checks formatting, build output, indexing, JSON-LD, links, and analytics expectations without starting the preview server.

## Build

```sh
pnpm run build
```

Confirms Vite can generate the production `dist/` output.

## Indexing Validation

```sh
pnpm run validate:indexing
```

Checks robots, sitemap, canonical URLs, noindex behavior, and production URL hygiene. A failure usually means search-engine output or static public files are inconsistent.

## JSON-LD Validation

```sh
pnpm run validate:jsonld
```

Checks the homepage Person JSON-LD. A failure means structured data is missing, duplicated, invalid, or includes unsupported fields.

## Link Checking

```sh
pnpm run validate:links
```

Checks generated internal links and external URL syntax without depending on third-party uptime. Broken internal links should be fixed before merging.

## Analytics Validation

Local analytics-disabled build:

```sh
pnpm run validate:analytics -- absent
```

Production-like analytics-enabled build:

```sh
pnpm run validate:analytics -- present
```

Use the `present` check only after building with `CLOUDFLARE_WEB_ANALYTICS_TOKEN` configured.

## Lighthouse

```sh
pnpm run quality:lighthouse
```

Runs Lighthouse CI against:

- `/`
- `/privacy.html`
- `/imprint.html`

Thresholds in `lighthouserc.cjs`:

- Performance >= 90
- Accessibility >= 95
- Best Practices >= 95

SEO correctness is covered by the indexing validator because legal pages are intentionally `noindex`.

## Accessibility

```sh
pnpm run quality:a11y
```

Runs Playwright with axe against the configured pages and checks heading outlines. Failures usually indicate missing accessible names, invalid ARIA, heading issues, contrast problems, or other automatically detectable accessibility regressions.

## Smoke Tests

```sh
pnpm run quality:smoke
```

This starts a preview server and runs the smoke tests.

The underlying Playwright-only command is:

```sh
pnpm run test:smoke
```

Smoke tests cover:

- Homepage section visibility
- Footer links
- Internal legal pages
- Responsive overflow at mobile, tablet, and desktop widths
- No-JavaScript fallback content
- Footer keyboard focus and hover states
- 404 behavior

`pnpm run test:smoke` expects a preview server to already be running.

## Visual Regression

```sh
pnpm run quality:visual
```

Checks Playwright screenshot baselines with:

- `maxDiffPixelRatio: 0.01`
- `threshold: 0.2`

Update baselines only after an approved intentional visual change:

```sh
pnpm run build
pnpm exec playwright test tests/visual.spec.ts --update-snapshots
```

## Full Quality Suite

```sh
pnpm run quality
```

Starts a local preview server and runs Lighthouse, accessibility, smoke, and visual checks against the built site.

## Failure Artifacts

Playwright traces are retained on failure. CI uploads `test-results/`, `playwright-report/`, and `.lighthouseci/` only when a verification step fails.
