---
name: performance-audit
description: "Diagnose slow page loads with squirrelscan audit rules via the squirrel CLI or hosted squirrelscan MCP server in Claude Code, Codex, Cursor, and other coding agents, checking the largest image, render-blocking resources, script and image weight, compression, caching, server response, fonts, and layout shift. It applies stack-specific fixes and compares before and after results, noting that markup and header checks do not replace real-user field data. Use when asked \"why is my site slow\", \"audit page performance\", or \"fix layout shift\"."
license: See LICENSE file in repository root
compatibility: Requires the squirrel CLI installed and accessible in PATH, or the hosted squirrelscan MCP server connected
metadata:
  author: squirrelscan
  version: "0.1.2"
allowed-tools: Bash(squirrel:*) Read Edit Grep Glob
---

# Performance Audit

Find what makes a site slow to load and fix it by template: render-blocking resources, the largest image, oversized scripts and images, missing compression and caching, slow server response, font loading and layout shift.

squirrelscan's performance rules read the page's markup, headers and fetched resources. They flag the causes behind Core Web Vitals; they are not real-user measurements. Google's thresholds, judged at the 75th percentile of field data, are: Largest Contentful Paint 2.5 s or less, Interaction to Next Paint 200 ms or less, Cumulative Layout Shift 0.1 or less (https://web.dev/articles/vitals). To confirm a fix moved real users, the user needs field data (the Chrome UX Report or PageSpeed Insights).

## Before the first audit

Run `squirrel --version`. If it fails, install the CLI from [squirrelscan.com/download](https://squirrelscan.com/download) (the `squirrelscan` skill has `references/install.md`). Then run `squirrel auth status`:

- **Signed out, or `--offline`**: the audit runs on this machine, is free, and nothing is published.
- **Signed in**: the audit is billed in credits (50 plus 2 per audited page, plus 1 per distinct external link the cloud verifies), adds the site to the user's dashboard, can turn on recurring audits and publishes an unlisted report. Tell the user the cost (`squirrel credits`) and get a yes. Offer `--offline` or `--no-publish`. For a site the user does not own, add `--ephemeral`: nothing is added to the dashboard, scheduled or published.

Every flag below is checked against the squirrel CLI docs (https://docs.squirrelscan.com/cli/audit). Rule docs: `https://docs.squirrelscan.com/rules/{category}/{rule_id}`.

## Run it

```bash
squirrel audit https://example.com --level surface \
  --rule-include perf,images --format json -o perf.json
```

- Audit the live site: only there do compression, caching, HTTP version and server response times reflect production. A local dev server shows development bundles.
- `surface` covers one page per template, which is what performance work needs. Add `--level full` for sign-off.
- Read the `perf` category score: `squirrel report <audit-id> --group performance --format llm`.

## Fix order (biggest effect first)

1. **Loading the main content:** `perf/lcp-hints`, `perf/lcp-fetchpriority`, `perf/lazy-above-fold`, `perf/render-blocking`, `perf/critical-request-chains`, `perf/preconnect`, `perf/ttfb`.
2. **Bytes:** `perf/total-byte-weight`, `perf/js-file-size`, `perf/css-file-size`, `perf/duplicate-js`, `perf/legacy-js`, `perf/unminified-js`, `perf/unminified-css`, `perf/content-in-js-bundle`, `perf/framework-data-payload`, `images/image-file-size`, `images/modern-format`, `images/responsive-size`.
3. **Delivery:** `perf/compression`, `perf/asset-compression`, `perf/cache-headers`, `perf/bad-caching`, `perf/http2`.
4. **Stability and responsiveness:** `perf/cls-hints`, `images/dimensions`, `perf/font-loading`, `perf/font-delivery`, `perf/inp-hints`, `perf/dom-size`.
5. **Hygiene:** `perf/source-maps`, `perf/js-libraries`, `perf/js-redirects`, `images/lazy-loading`, `images/offscreen-lazy`.

Do not lazy-load the main (largest) image: the audit flags that, and it is a common regression. Get each rule's exact fix from its docs page.

## Where the fix usually lives

| Stack | Look here |
|-------|-----------|
| Next.js | `next/image` (`priority` on the hero, `sizes`), `next/font`, `next/dynamic` for heavy client components, third-party `<Script strategy>`, bundle analyzer for duplicate packages |
| WordPress | one caching plugin (not several), an image optimization plugin or service, removing unused plugins and page-builder widgets, theme scripts loading on every page, a CDN |
| Shopify | theme assets and Liquid, uninstalling apps (each can inject scripts; removing the app may leave code in `theme.liquid`), image sizes via the `image_url` filter |
| Webflow | image settings and formats, removing unused interactions and custom code, font loading settings |
| Cloudflare | caching rules and cache TTLs, compression (Brotli), HTTP/2 and HTTP/3, image resizing |
| Vercel / Netlify | `headers` for `Cache-Control` on hashed assets (`public, max-age=31536000, immutable`), edge caching, image optimization |

## Prove it

Re-audit with `--refresh` after the deploy (cached pages would show the old numbers), then compare with the baseline: `squirrel report --diff <baseline-audit-id> --format llm`. Report the before and after score and the specific rules that cleared.

## Stop condition

Stop when error-severity `perf` findings are cleared on a `--level full` re-audit, the remaining warnings are listed with their cost and effort, and the user has been told lab-style checks do not replace field data. To stop it regressing, see `website-ci-gate` (`--fail-on 'score:perf<80'` style gates).

## Hand off

Broken assets and links: `broken-link-checker`. Anything else, and the fix loop: `audit-website`.
