# Development

## Prerequisites

Use the versions in `.mise.toml`:

- Node.js 22
- pnpm 10.34.3

## Install

```sh
pnpm install
```

## Local Development

```sh
pnpm run dev
```

In Figma Make, the Vite development server is already running on `$PORT` and updates automatically.

## Production Build

```sh
pnpm run build
```

The build writes static output to `dist/`.

## Local Preview

```sh
pnpm run preview
```

The quality scripts start their own preview server when needed.

## Formatting

```sh
pnpm run format
```

## Static Validation

Run these after `pnpm run build`:

```sh
pnpm run validate:indexing
pnpm run validate:jsonld
pnpm run validate:links
pnpm run validate:analytics -- absent
```

For a production-like analytics build with a configured token:

```sh
CLOUDFLARE_WEB_ANALYTICS_TOKEN=your-token pnpm run build
pnpm run validate:analytics -- present
```

Do not commit real tokens.

## Testing

```sh
pnpm run quality
```

Focused commands:

```sh
pnpm run quality:lighthouse
pnpm run quality:a11y
pnpm run quality:visual
pnpm run test:smoke
```

`pnpm run test:smoke` expects a preview server to already be running.

## Full Verification

For a normal local build without analytics:

```sh
pnpm run build
pnpm run validate:indexing
pnpm run validate:jsonld
pnpm run validate:links
pnpm run validate:analytics -- absent
pnpm run quality
```
