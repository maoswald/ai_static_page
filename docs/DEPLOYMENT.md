# Deployment

## Architecture

The site is deployed as static GitHub Pages output. Vite builds the project into `dist/`, and GitHub Actions uploads that directory as the Pages artifact.

## Workflow

Deployment is defined in `.github/workflows/pages.yml`.

The workflow runs on:

- Pull requests to `main`
- Pushes to `main`
- Manual `workflow_dispatch`

Pull requests build and validate the site but do not deploy. Pushes to `main` deploy after the build and quality checks succeed.

## Build and Validation Steps

The workflow:

1. Checks out the repository.
2. Sets up pnpm 10.34.3.
3. Sets up Node.js 22 with pnpm caching.
4. Installs dependencies with `pnpm install --frozen-lockfile`.
5. Installs Playwright Chromium.
6. Runs `pnpm run verify:full`.
7. Uploads failure artifacts only if verification fails.
8. Uploads `dist/` and deploys it on pushes to `main`.

`pnpm run verify:full` performs the production build, static validation, analytics validation, Lighthouse, accessibility, smoke tests, and visual regression. The build output is reused for deployment.

## Security and Permissions

The workflow grants repository contents read access by default. Pages write and OIDC permissions are granted only to the deployment job. The Cloudflare Web Analytics token is passed only for push builds, not pull request builds.

## Production Domain

The production domain is:

https://manueloswald.com

The custom domain file is `public/CNAME`, which is copied into `dist/` during the build.

## HTTPS

HTTPS is provided by GitHub Pages for the custom domain.

## DNS

DNS is managed outside this repository through IONOS. The repository documents the expected production domain but must not include DNS credentials, private TXT verification values, or account secrets.

## Search Console

Use a Google Search Console Domain property for `manueloswald.com` and verify ownership with a DNS TXT record in IONOS. After verification, submit:

```text
https://manueloswald.com/sitemap.xml
```

Do not add a Search Console HTML verification tag unless Google supplies a token and that method is explicitly chosen.

## Analytics Secret

Cloudflare Web Analytics is enabled in production only when the GitHub Actions environment receives `CLOUDFLARE_WEB_ANALYTICS_TOKEN`. Configure it as a GitHub repository secret. Do not commit real token values.

## Production Verification

After deployment, verify:

- `https://manueloswald.com/`
- `https://manueloswald.com/privacy.html`
- `https://manueloswald.com/imprint.html`
- `https://manueloswald.com/sitemap.xml`
- `https://manueloswald.com/robots.txt`
- `https://manueloswald.com/social-image.png`
