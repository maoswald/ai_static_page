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
- **Canonical URL:** replace `https://example.com/` in `index.html`.
- **Legal information:** replace the placeholder copy in `public/imprint.html` and review `public/privacy.html` before publishing.

## Formatting and verification

Run `pnpm format` to format the project and `pnpm build` to create the production bundle in `dist/`.

## GitHub Pages deployment

Set `FIGMA_PUBLIC_URL` to the repository subpath when building (for example, `/portfolio`) so Vite emits correct asset URLs. Publish the generated `dist/` directory with GitHub Actions or the Pages deployment action.
