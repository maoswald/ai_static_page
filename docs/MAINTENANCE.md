# Maintenance

## Change Hero Headline

Edit the hero `<h1>` in `src/App.tsx`. Keep line breaks intentional and rerun visual tests.

## Change Focus-Area Copy

Edit the `focusAreas` array in `src/App.tsx`.

## Change About or Beyond Work Copy

Edit the `editorial--about` or `editorial--beyond` sections in `src/App.tsx`.

## Change Footer Links

Edit the `links` object and footer anchors in `src/App.tsx`. If public profile URLs change, also update JSON-LD `sameAs` in `index.html` and rerun `pnpm run validate:jsonld`.

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

Edit color custom properties in `src/index.css`. Intentional color changes require visual baseline review.

## Change Typography

Edit font, weight, tracking, line-height, and responsive font-size rules in `src/index.css`. Keep text readable at mobile, tablet, and desktop widths.

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
pnpm run build
pnpm run validate:indexing
pnpm run validate:jsonld
pnpm run validate:links
pnpm run validate:analytics -- absent
pnpm run quality
```

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
