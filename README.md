# Manuel Oswald — Personal Website

A responsive single-page portfolio built with React, Vite, TypeScript, and Tailwind CSS v4. It produces a static bundle suitable for GitHub Pages.

## Local development

Install dependencies with `pnpm install`, then run `pnpm dev`. In Figma Make, the development server is already running and updates automatically.

## Project structure

- `src/App.tsx` — page content, icons, and external link configuration
- `src/index.css` — design tokens, page layout, and responsive rules
- `public/` — favicon and static legal pages
- `index.html` — metadata and the no-JavaScript content fallback

## Customization

- **Content:** edit the section copy in `src/App.tsx`.
- **Colors and typography:** edit the custom properties at the top of `src/index.css`.
- **Social links:** edit the `links` object at the top of `src/App.tsx`.
- **Canonical URL:** `index.html` points to `https://manueloswald.com/`.
- **Structured data:** the Person JSON-LD is defined in `index.html`. Update the professional `description`, `jobTitle`, `image`, and `knowsAbout` values there. Add or remove `sameAs` entries only for public profile URLs that are also intentionally represented by the site.
- **Social image:** the canonical social preview image is `public/social-image.png`. Its Open Graph and Twitter metadata are configured in `.figma/make/site.json`.
- **Cloudflare Web Analytics:** create a Cloudflare Web Analytics site in the Cloudflare dashboard, copy its token, and set `CLOUDFLARE_WEB_ANALYTICS_TOKEN` in the production build environment. For GitHub Pages, add it as a repository secret named `CLOUDFLARE_WEB_ANALYTICS_TOKEN`; pushes to `main` build with that secret and validate that the beacon is present. Pull requests and local builds without the variable validate that analytics is disabled. Leave the variable empty or unset to disable analytics. The beacon is emitted only for `vite build` in production mode; local development and development-mode builds do not include it. Verify a production build with `pnpm run validate:analytics -- present` after building with the token, or `pnpm run validate:analytics -- absent` when analytics is disabled.
- **Legal information:** replace the placeholder copy in `public/imprint.html` and review `public/privacy.html` before publishing.

## Formatting and verification

Run `pnpm format` to format the project and `pnpm build` to create the production bundle in `dist/`. After building, run `pnpm run validate:jsonld` to verify the generated homepage contains one valid Person JSON-LD block, and `pnpm run validate:indexing` to verify robots, sitemap, canonical URLs, noindex pages, and production URL hygiene.

## Quality checks

The production bundle is checked with Lighthouse CI and Playwright/axe against the built `dist/` output. Install the local browser once with `pnpm exec playwright install chromium`, then run:

- `pnpm run quality` — start `vite preview` and run all quality checks.
- `pnpm run quality:lighthouse` — run only Lighthouse CI.
- `pnpm run quality:a11y` — run only Playwright/axe accessibility checks.
- `pnpm run quality:visual` — run only Playwright visual regression checks.
- `pnpm run test:smoke` — run the focused Playwright smoke tests against an already running preview server.

Lighthouse checks `/`, `/privacy.html`, and `/imprint.html`. Thresholds are Performance >= 90, Accessibility >= 95, Best Practices >= 95, and SEO >= 95. Performance, accessibility, and best-practices thresholds are enforced for every checked page. SEO >= 95 is enforced for the homepage only, because the legal pages are intentionally `noindex`. Search Console/indexing correctness is enforced by `pnpm run validate:indexing`.

Accessibility checks cover the same pages with axe WCAG 2 A/AA and WCAG 2.1 A/AA rules, plus a heading-outline check. Smoke tests cover homepage sections, footer links, legal-page navigation, responsive overflow at mobile/tablet/desktop widths, no-JavaScript fallback content, and footer keyboard focus/hover behavior. Visual regression checks capture full-page homepage screenshots at 390 x 844, 1024 x 768, and 1440 x 1000, with Playwright Chromium and a 1% max differing-pixel ratio. To approve an intentional visual change, run `pnpm run build`, start a preview server, then run `pnpm exec playwright test tests/visual.spec.ts --update-snapshots` and review the updated PNG baselines before committing them. Update the tests when section headings, footer links, intentional page paths, or approved visual baselines change. Failures should be treated as real issues unless they come from an intentional legal-page indexing choice or a known Lighthouse fluctuation.

## Google Search Console

Use a Search Console Domain property for `manueloswald.com`; do not add an HTML verification tag unless Google provides a token and you intentionally choose that method.

1. Open Google Search Console and create a **Domain** property for `manueloswald.com`.
2. Copy Google's DNS TXT verification value.
3. In IONOS DNS settings for `manueloswald.com`, add the TXT record exactly as Google provides it.
4. Wait for DNS propagation, then click **Verify** in Search Console.
5. After verification, submit `https://manueloswald.com/sitemap.xml`.
6. Use URL Inspection for `https://manueloswald.com/` to request indexing if needed.

## GitHub Pages deployment

This repository publishes to GitHub Pages through `.github/workflows/pages.yml` whenever changes land on `main`. The workflow installs dependencies with pnpm, runs `pnpm build`, uploads the generated `dist/` directory, and deploys it with GitHub's Pages deployment action.

The custom domain is configured by `public/CNAME`, so the built site includes a `CNAME` file for `manueloswald.com`. In the repository settings, set Pages to use GitHub Actions as the source and configure the domain DNS to point at GitHub Pages.
