---
name: structured-data-audit
description: "Validate structured data with squirrelscan audit rules via the squirrel CLI or hosted squirrelscan MCP server in Claude Code, Codex, Cursor, and other coding agents, checking JSON-LD validity, type fit, and the site-wide entity map so pages reuse one organization with a stable @id instead of creating a new one per page. It applies fixes for Yoast, Next.js, Shopify, and Webflow. Use when asked \"check my JSON-LD\", \"audit my schema markup\", or \"fix duplicate Organization entities\"."
license: See LICENSE file in repository root
compatibility: Requires the squirrel CLI installed and accessible in PATH, or the hosted squirrelscan MCP server connected
metadata:
  author: squirrelscan
  version: "0.1.2"
allowed-tools: Bash(squirrel:*) Read Edit Grep Glob
---

# Structured Data Audit

Check a site's JSON-LD: is it valid, is it the right type for the page, and does the site describe each entity (the organization, the website, the authors, the products) once, with a stable identity, instead of redeclaring it differently on every page.

Valid markup does not guarantee rich results. Search engines decide eligibility, and markup must describe what is visible on the page.

## Before the first audit

Run `squirrel --version`. If it fails, install the CLI from [squirrelscan.com/download](https://squirrelscan.com/download) (the `squirrelscan` skill has `references/install.md`). Then run `squirrel auth status`:

- **Signed out, or `--offline`**: the audit runs on this machine, is free, and nothing is published.
- **Signed in**: the audit is billed in credits (50 plus 2 per audited page, plus 1 per distinct external link the cloud verifies), adds the site to the user's dashboard, can turn on recurring audits and publishes an unlisted report. Tell the user the cost (`squirrel credits`) and get a yes. Offer `--offline` or `--no-publish`. For a site the user does not own, add `--ephemeral`: nothing is added to the dashboard, scheduled or published.

Every flag below is checked against the squirrel CLI docs (https://docs.squirrelscan.com/cli/audit). Rule docs: `https://docs.squirrelscan.com/rules/{category}/{rule_id}`.

## Run it

```bash
squirrel audit https://example.com --level surface --rule-include schema --format json -o schema.json
squirrel entities                      # the site-wide entity graph from the latest audit
squirrel entities --problem no-id,conflict,split-identity,dangling
```

- `--rule-include schema` runs the per-page and site-wide structured data rules (`schema/json-ld-valid`, `schema/expected-type`, `schema/entity-*` and the type rules such as `schema/product`, `schema/article`, `schema/breadcrumb`, `schema/faq`, `schema/local-business`, `schema/organization`).
- The entity map collapses all JSON-LD into one graph. Sixty valid `Organization` blocks with no `@id` are sixty organizations to a search engine. Entity problems are `no-id`, `conflict`, `dangling`, `single-page` and `split-identity`. The `squirrelscan` skill's `references/entity-map.md` and `references/entity-map-fixes.md` have the shape that works and the exact change per stack. Read them when an `entity-*` finding appears.
- Use `--level full` when the entity map matters: it is built from the pages crawled.

## Fix order

1. **Parse errors first:** `schema/json-ld-valid` (a block that does not parse is ignored entirely).
2. **Identity:** give each real-world entity one stable `@id` (for example `https://example.com/#organization`), declare it fully once, and reference it by `@id` elsewhere. Rules: `schema/entity-id-format`, `schema/entity-organization-missing`, `schema/entity-website-missing`, `schema/entity-split-identity`, `schema/entity-conflicts`, `schema/entity-dangling`, `schema/entity-orphan`, `schema/entity-publisher-mismatch`.
3. **Type fit:** `schema/expected-type`, `schema/coverage-outlier` (a page type missing the markup its siblings have).
4. **Required and recommended properties** per type: `schema/product`, `schema/article`, `schema/organization`, `schema/local-business`, `schema/video`, `schema/review`, `schema/rating-scope`, `schema/faq`, `schema/breadcrumb`.
5. **Markup that claims more than the page shows:** where a finding says the markup states something the page does not, fix the page or remove the markup. Never add markup for content users cannot see.

## Where the fix usually lives

| Stack | Look here |
|-------|-----------|
| WordPress with Yoast SEO | Yoast outputs one schema graph with `@id`s. Duplicates come from the theme or another plugin also printing JSON-LD: disable one source. Organization details are in Yoast's site representation settings |
| Next.js | one `<script type="application/ld+json">` in the root layout for the Organization and WebSite (with `@id`), page-level scripts that reference those ids |
| Shopify | the theme's product JSON-LD (often duplicated by an app), and `theme.liquid` for Organization |
| Webflow | Site settings or page custom code (head) |
| Static and docs | the layout template's head, generated from site config so every page agrees |

Validate in the user's tools of choice once the audit is clean (for example Google's Rich Results Test); squirrelscan does not claim rich-result eligibility.

## Prove it

Re-audit, then `squirrel entities --diff`. An entity that gains an `@id` changes key, so read the `gainedId` section (and its `coverage`: `proven` or `partial`, and `notCrawled` should be empty) rather than the added and removed lists.

## Stop condition

Stop when `schema/json-ld-valid` is clean, no `entity-conflicts`, `entity-split-identity` or `entity-dangling` remain on a full crawl, each page type has the markup its siblings have or a reason it does not, and every finding about markup the page does not back up is resolved by fixing the page or the markup.

## Hand off

Titles, canonicals, content: `seo-audit`. The wider loop: `audit-website`.
