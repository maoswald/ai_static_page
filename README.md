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
- **Cloudflare Web Analytics:** create a Cloudflare Web Analytics site in the Cloudflare dashboard, copy its token, and set `CLOUDFLARE_WEB_ANALYTICS_TOKEN` in the production build environment. Leave the variable empty or unset to disable analytics. The beacon is emitted only for `vite build` in production mode; local development and development-mode builds do not include it. Verify a production build with `pnpm run validate:analytics -- present` after building with the token, or `pnpm run validate:analytics -- absent` when analytics is disabled.
- **Legal information:** replace the placeholder copy in `public/imprint.html` and review `public/privacy.html` before publishing.

## Formatting and verification

Run `pnpm format` to format the project and `pnpm build` to create the production bundle in `dist/`. After building, run `pnpm run validate:jsonld` to verify the generated homepage contains one valid Person JSON-LD block.

## GitHub Pages deployment

This repository publishes to GitHub Pages through `.github/workflows/pages.yml` whenever changes land on `main`. The workflow installs dependencies with pnpm, runs `pnpm build`, uploads the generated `dist/` directory, and deploys it with GitHub's Pages deployment action.

The custom domain is configured by `public/CNAME`, so the built site includes a `CNAME` file for `manueloswald.com`. In the repository settings, set Pages to use GitHub Actions as the source and configure the domain DNS to point at GitHub Pages.
