# Design

## Visual Principles

The site is minimal, direct, typographic, and grid-led. It relies on strong contrast, large display text, deliberate spacing, and a restrained color palette. Do not redesign or soften the visual language unless explicitly requested.

## Design Tokens

Design tokens live in `src/index.css` under `:root`.

## Colors

- `--color-red: #ff2d08`
- `--color-dark: #191918`
- `--color-light: #f2f2f1`
- `--color-hover: #d9d9d7`
- `--color-ink: #080808`
- `--color-muted: #555552`
- `--color-line: #c4c4c1`
- `--color-white: #f8f8f6`

## Typography

- Font stack: `"Helvetica Neue", Helvetica, Arial, sans-serif`
- Regular weight: `400`
- Bold weight: `700`
- Label tracking: `0.28em`
- Display line-height: `0.99`
- Copy line-height: `1.45`

Typography uses `clamp()` in CSS for responsive sizing. The hero headline intentionally uses tight negative letter spacing.

## Spacing

The main page spacing token is:

- `--space-page: clamp(2rem, 4.45vw, 4.3rem)`

Mobile changes this to:

- `--space-page: clamp(1.35rem, 6.5vw, 2.25rem)`

## Grid and Layout

The desktop homepage uses `.page-grid` with named grid areas:

- `hero`
- `focus`
- `beyond`
- `about`
- `footer`

The footer uses legal links on the left and three equal social/contact icon cells on the right.

## Responsive Behavior

Breakpoints are implemented in `src/index.css`:

- `@media (max-width: 980px)` changes the desktop grid to a two-column tablet layout.
- `@media (max-width: 680px)` changes the page to a vertical flex layout.

The site supports a minimum body width of `320px` and clips horizontal overflow at the page-grid level.

## Footer Interactions

Footer social links are square-ish icon cells with:

- off-white background
- border-left dividers
- hover background using `--color-hover`
- keyboard focus through the global `a:focus-visible` rule

## Hover and Focus States

Hover transitions use:

- `--transition: 180ms ease`

Reduced motion disables smooth scrolling and social-link transitions.

## Icon Style

The site uses inline SVG icons. Focus-area icons use stroked line art; footer icons use compact social/contact marks. Icons are part of `src/App.tsx`.

## Visual Regression Baseline

Playwright visual baselines live in `tests/visual.spec.ts-snapshots/`. Screenshots cover:

- Homepage mobile: `390 x 844`
- Homepage tablet: `1024 x 768`
- Homepage desktop: `1440 x 1000`
- 404 mobile
- 404 desktop

Intentional design changes may require updating baselines:

```sh
pnpm run build
pnpm exec playwright test tests/visual.spec.ts --update-snapshots
```

Review updated PNGs before committing.
