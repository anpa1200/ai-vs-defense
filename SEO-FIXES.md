# SEO and AI-searchability fixes

Status at preparation time (2026-08-14): validated locally and awaiting publication. Search-engine submission remains a post-deployment human action.

## Issue 4 — Docusaurus metadata

- `docusaurus.config.js` centralizes the browser-title suffix on the `1200km` site title, declares the exact portfolio `og:site_name`, retains the project cover as the default social card, and enables the metadata build plugin.
- `src/pages/index.js` keeps the project name as the root page title and supplies its authored value-statement description.
- `seo/descriptions.json` is the source of truth for 14 unique indexable-route descriptions, each 140–160 characters.
- `src/theme/DocItem/Metadata/index.js` applies those authored values and Twitter parity during server rendering, hydration, and client-side navigation.
- `seo-metadata-plugin.cjs` enforces exactly one ` | 1200km` suffix, description rules, Open Graph/Twitter parity, a real social image, unique descriptions, and one branded 404 title during every production build.

## Issue 7 — HexStrike destinations

- `docusaurus.config.js` labels both `github.com/0x4m4/hexstrike-ai` navigation links as `HexStrike AI (upstream project)`.
- Article and local-guide links were audited. They do not present the upstream GitHub repository as Andrey Pautov's repository or fork.

## Issue 8 — accurate sitemap dates

- `docusaurus.config.js` enables Git-derived document update times and date-valued sitemap entries, including the custom root route.
- `.github/workflows/deploy.yml` checks out full Git history so those dates remain source-derived in CI.

## Issue 9 — structured data

- `src/pages/index.js` emits a root `BreadcrumbList` with absolute URLs.
- `seo-metadata-plugin.cjs` preserves framework breadcrumbs, supplies a valid fallback when absent, and exposes Git-derived document update times as `article:modified_time`.
- `src/theme/DocItem/Metadata/index.js` exposes the same modified time and social metadata in the hydrated application head.

## Exact touched-file manifest

- `.github/workflows/deploy.yml`
- `SEO-FIXES.md`
- `docusaurus.config.js`
- `seo-metadata-plugin.cjs`
- `seo/descriptions.json`
- `src/pages/index.js`
- `src/theme/DocItem/Metadata/index.js`

## Validation

- `npm run build` passed in a full-history worktree.
- Audited 14 indexable routes: 14 exact branded titles, 14 unique compliant descriptions, 14 canonical URLs, 14 Open Graph/Twitter parity matches, 14 project-cover matches, and 14 valid `BreadcrumbList` blocks.
- All 13 document routes expose `article:modified_time`; the custom root uses its Git date in the sitemap.
- `build/sitemap.xml` contains 14 URLs and 14 `<lastmod>` values.

## Deploy and human follow-ups

1. Publish this source repository and verify the deployment workflow completes successfully.
2. Rebuild the 1200km.com aggregate sitemap after the sub-site is live.
3. Resubmit the aggregate sitemap in Google Search Console and Bing Webmaster Tools, then inspect representative root and inner-document URLs.
