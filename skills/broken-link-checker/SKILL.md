---
name: broken-link-checker
description: "Find broken internal and external links, broken anchors, redirect chains, orphan pages, broken images, and dead sitemap URLs with squirrelscan audit rules via the squirrel CLI or hosted squirrelscan MCP server in Claude Code, Codex, Cursor, and other coding agents. It recommends whether to fix, redirect, remove, or leave each finding, and warns about credit costs for external link checks when signed in. Use when asked \"find broken links on my site\", \"check for 404s and redirect chains\", or \"clean up dead sitemap URLs\"."
license: See LICENSE file in repository root
compatibility: Requires the squirrel CLI installed and accessible in PATH, or the hosted squirrelscan MCP server connected
metadata:
  author: squirrelscan
  version: "0.1.1"
allowed-tools: Bash(squirrel:*) Read Edit Grep Glob
---

# Broken Link Checker

Find dead internal and external links, broken anchors, redirect chains, orphan pages and broken images and sitemap URLs, and decide what to do with each one.

Broken links are usually a decision, not a mechanical fix: the right answer is to correct a typo, point at the new URL, remove the link, or leave it. This skill gives each finding a decision.

## Before the first audit

Run `squirrel --version`. If it fails, install the CLI from [squirrelscan.com/download](https://squirrelscan.com/download) (the `squirrelscan` skill has `references/install.md`). Then run `squirrel auth status`:

- **Signed out, or `--offline`**: the audit runs on this machine, is free, and nothing is published.
- **Signed in**: the audit is billed in credits (50 plus 2 per audited page, plus 1 per distinct external link the cloud verifies), adds the site to the user's dashboard, can turn on recurring audits and publishes an unlisted report. Tell the user the cost (`squirrel credits`) and get a yes. Offer `--offline` or `--no-publish`. For a site the user does not own, add `--ephemeral`: nothing is added to the dashboard, scheduled or published.

Every flag below is checked against the squirrel CLI docs (https://docs.squirrelscan.com/cli/audit). Rule docs: `https://docs.squirrelscan.com/rules/{category}/{rule_id}`.

## Run it

```bash
squirrel audit https://example.com --level surface \
  --rule-include links,images/broken-images,reliability/broken-resources,crawl/sitemap-4xx \
  --format json -o links.json
```

- Internal link targets the crawl did not fetch are status-checked with one request each, at every level (free). External links are checked too; `--no-external-links` skips them and `--no-internal-links` skips the internal check. `--offline` never requests another site.
- **Cost**: signed in, the cloud charges 1 credit per distinct external link it verifies, up to one per page of the page budget, and nothing for a link it cannot verify. Say so before a signed-in `surface` or `full` run, and offer `--no-external-links` or `--offline` when the user only wants internal links. A link that sits behind a bot wall comes back as unverified, not broken.
- Use `--level full` for sign-off: `surface` samples one page per URL pattern, so a bad link in the 40th blog post may not be seen.
- The `llm` format lists at most 5 pages per rule. Use `--format json` (or `squirrel report <audit-id> --format json --category links`) for every broken link and every page it appears on.

## Decide per finding

| Finding | Decision |
|---------|----------|
| `links/broken-links`, `links/dead-links` (internal 404) | Typo or moved page: fix the link. Page removed on purpose: remove the link or add a redirect from the old URL |
| `links/broken-external-links` | Check the URL in a browser first. Moved: update. Gone: remove the link or link an archived copy. Blocked by a bot wall: keep, it is not broken |
| `links/redirect-chains`, `crawl/redirect-chain` | Update the link to the final URL; collapse chains into one hop |
| `links/https-downgrade` | Change `http://` to `https://` |
| `links/broken-anchors`, `links/anchor-target-conflict` | Fix the `#id` or add the target id |
| `links/orphan-pages`, `links/no-contextual-inbound`, `links/dead-end-pages` | Needs an editorial choice: link to it from a relevant page, or remove or noindex it |
| `links/invalid-links`, `links/tel-mailto` | Fix the malformed `href` |
| `images/broken-images`, `reliability/broken-resources`, `crawl/sitemap-4xx` | Fix the asset path, or remove the dead URL from the sitemap |

Never delete a link without telling the user which pages lose it. When a whole section is broken, list the pages and ask.

## Where the fix usually lives

| Stack | Redirects and links |
|-------|---------------------|
| Next.js | `redirects()` in `next.config.*`, links in MDX or a CMS, navigation components |
| WordPress | post content and menus (Appearance, Menus), a redirect manager plugin (for example the one in Yoast SEO Premium, or a dedicated redirect plugin), search-and-replace for a changed domain |
| Shopify | Online Store, Navigation (menus), and URL Redirects for removed products or pages |
| Webflow | Site settings, Hosting tab, 301 redirects; CMS item links |
| Cloudflare | Redirect Rules or Bulk Redirects |
| Vercel / Netlify | `vercel.json` `redirects`; `_redirects` or `netlify.toml` |

Prefer fixing the source link over adding a redirect: a redirect hides the broken link and adds a hop.

## Stop condition

Stop when a `--level full` re-audit (with `--refresh`) shows no broken internal links, every broken external link is fixed, removed or listed for the user with a reason, and redirect chains are collapsed. A link the tool could not verify is reported as "not checked", never "fine".

## Hand off

Page content and metadata: `seo-audit`. The wider fix loop: `audit-website`. Fail a build on new broken links: `website-ci-gate`.
