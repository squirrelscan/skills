---
name: agent-experience-audit
description: "Evaluate your site's agent experience with squirrelscan audit rules via the squirrel CLI or hosted squirrelscan MCP server in Claude Code, Codex, Cursor, and other coding agents, checking robots.txt bot access, content present without JavaScript, llms.txt, AGENTS.md, markdown responses, API discovery, and machine-readable policies. It leaves allow or block bot decisions to the site owner and focuses on how AI agents and crawlers read the site rather than visibility in AI answers. Use when asked \"how well does my site work for AI agents\" or \"audit my llms.txt\"."
license: See LICENSE file in repository root
compatibility: Requires the squirrel CLI installed and accessible in PATH, or the hosted squirrelscan MCP server connected
metadata:
  author: squirrelscan
  version: "0.1.1"
allowed-tools: Bash(squirrel:*) Read Edit Grep Glob
---

# Agent Experience Audit

Check how well a site works for AI agents and crawlers that read it: which bots robots.txt lets in, whether the content is in the HTML or only appears after JavaScript, whether there is an `llms.txt`, `AGENTS.md`, markdown responses, discoverable APIs, and machine-readable policies.

Agent experience (AX) is the squirrelscan term for this. It is about access and readability, not rankings or visibility in AI answers: squirrelscan does not measure those, and neither does this skill.

## Before the first audit

Run `squirrel --version`. If it fails, install the CLI from [squirrelscan.com/download](https://squirrelscan.com/download) (the `squirrelscan` skill has `references/install.md`). Then run `squirrel auth status`:

- **Signed out, or `--offline`**: the audit runs on this machine, is free, and nothing is published.
- **Signed in**: the audit is billed in credits (50 plus 2 per audited page, plus 1 per distinct external link the cloud verifies), adds the site to the user's dashboard, can turn on recurring audits and publishes an unlisted report. Tell the user the cost (`squirrel credits`) and get a yes. Offer `--offline` or `--no-publish`. For a site the user does not own, add `--ephemeral`: nothing is added to the dashboard, scheduled or published.

Every flag below is checked against the squirrel CLI docs (https://docs.squirrelscan.com/cli/audit). Rule docs: `https://docs.squirrelscan.com/rules/{category}/{rule_id}`.

## Run it

```bash
squirrel audit https://example.com --level surface --rule-include ax --format json -o ax.json

# one discovery file only, fast
squirrel audit https://example.com --level quick --rule-include ax/llms-txt --discovery-probe-path /llms.txt
```

- The `ax` category includes: `ax/ai-crawlers` and `ax/agent-blocking` (per-bot access), `ax/content-without-js`, `ax/token-weight`, `ax/answer-blocks`, `ax/llms-txt`, `ax/agents-md`, `ax/markdown-response`, `ax/api-discovery`, `ax/well-known-agent`, `ax/webmcp`, `ax/content-signals`, `ax/noai-signals`, `ax/rsl-license`, `ax/pay-per-crawl`, `ax/commerce-readiness`. Three legacy `ai/` rules (`ai/llm-parsability`, `ai/page-type-match`, `ai/site-metadata`) belong to the same group and are cloud-backed.
- The discovery files (`/llms.txt`, `/.well-known/*`, `AGENTS.md` and others) are fetched by 28 discovery probes that run even at `--passive`. `--disable-discovery-probes` turns them off, and then those rules report not checked. Say so instead of reporting them clean.
- Check `ax/ai-crawlers` evidence for the per-bot verdicts before changing robots.txt.

## The decision is the owner's

Allowing or blocking a crawler is a business decision. A news publisher may block training crawlers on purpose; a docs site usually wants agents in. Never change `robots.txt` bot rules on your own. Show the user the per-bot result, ask which bots they want in, and record the policy in the repo. A WAF or CDN bot setting can block agents regardless of robots.txt (`ax/agent-blocking`).

## Fix order

1. **Can agents reach it?** `ax/ai-crawlers`, `ax/agent-blocking`, plus a block served by a CDN or WAF.
2. **Is the content in the HTML?** `ax/content-without-js`, `perf/browser-required`, `ax/token-weight`. If the main text only exists after client-side rendering, server-render or pre-render it: agents that do not run JavaScript see an empty page.
3. **Is it easy to read and quote?** `ax/answer-blocks` (a direct answer early in the page, under a clear heading), `ax/markdown-response` (a markdown version of a page, where the site serves one).
4. **Discovery files:** `ax/llms-txt` (a proposed convention, not a standard: no crawler is obliged to fetch it, and its absence is never a defect), `ax/agents-md`, `ax/api-discovery`, `ax/well-known-agent`.
5. **Policies the owner chooses:** `ax/content-signals`, `ax/noai-signals`, `ax/rsl-license`, `ax/pay-per-crawl`.

An SPA that answers 200 with its HTML shell for `/llms.txt` is a failure, not a file: serve a real text file or return 404.

## Where the fix usually lives

| Stack | Look here |
|-------|-----------|
| Next.js | `app/robots.ts`, `app/llms.txt/route.ts` or `public/llms.txt`, server components (not client-only data fetching) for main content |
| WordPress | Settings, Reading, plus an SEO plugin's robots editor; a file in the web root for `llms.txt` |
| Shopify | `robots.txt.liquid`; files in the theme or a redirect for `llms.txt` |
| Webflow | Site settings, SEO tab (robots.txt); hosting for static files |
| Cloudflare | its bot and AI crawler settings (dashboard), which can block bots on top of robots.txt; check them before editing robots.txt |
| Vercel / Netlify | `public/` files and `headers`/redirects for `/llms.txt` and markdown routes |

## Stop condition

Stop when each `ax` rule is either clean, knowingly waived with the owner's reason, or reported as not checked with the cause; the bot policy is written down; and the main content of each page type is present in the HTML. Do not claim the site will be cited or recommended by any assistant.

## Hand off

Metadata, canonicals, sitemaps: `seo-audit`. Structured data: `structured-data-audit`. The wider loop: `audit-website`.
