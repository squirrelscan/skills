# Broken link checker skill for Claude Code, Codex and Cursor

`broken-link-checker` is an Agent Skills `SKILL.md` from squirrelscan: a broken link checker, 404 finder and redirect chain cleaner for coding agents. It runs squirrelscan's link audit rules through the squirrel CLI or the hosted squirrelscan MCP server in Claude Code, Codex, Cursor and other agents. Broken links are usually a decision, not a mechanical fix, so it gives each finding a decision.

## What it does

- Finds broken internal and external links, broken anchors, redirect chains, orphan pages, broken images and dead sitemap URLs.
- Recommends per finding whether to fix, redirect, remove or leave the link.
- Status-checks internal link targets the crawl did not fetch, and checks external links unless you pass `--no-external-links`.
- Warns about cost before a signed-in run: the cloud charges 1 credit per distinct external link it verifies. Offers `--no-external-links` or `--offline` for internal-only checks.
- Treats a link behind a bot wall as unverified, not broken.
- Uses `--level full` for sign-off, because `surface` samples one page per URL pattern.
- Never deletes a link without telling you which pages lose it.
- Prefers fixing the source link over adding a redirect, and points to where redirects live in Next.js, WordPress, Shopify, Webflow, Cloudflare, Vercel and Netlify.

## Questions it answers

- Find broken links on my site
- Check for 404s and redirect chains
- Clean up dead sitemap URLs
- Which pages link to a page that returns 404?
- Which of my external links are dead?
- Which pages are orphans with no inbound links?
- Are there broken anchors or broken images on my site?
- Should I redirect or remove a link to a deleted page?

## Install

With any Agent Skills tool (Claude Code, Codex, Cursor, Gemini CLI, Amp and others):

```bash
npx skills add squirrelscan/skills --skill broken-link-checker
```

- **Claude Code plugin** (installs all the skills plus the hosted squirrelscan MCP server):

  ```
  /plugin marketplace add squirrelscan/skills
  /plugin install squirrelscan@squirrelscan
  ```

- **Codex**: `npx skills add` lands the skill in `.agents/skills/`. To add the MCP server too, configure it in `~/.codex/config.toml` ([Codex docs](https://docs.squirrelscan.com/developers/agents/codex)).
- **Cursor**: use the Cursor plugin in this repo, or the [one-click MCP link](cursor://anysphere.cursor-deeplink/mcp/install?name=squirrelscan&config=eyJ1cmwiOiJodHRwczovL21jcC5zcXVpcnJlbHNjYW4uY29tL21jcCJ9) plus the skill.
- **Gemini CLI, GitHub Copilot, Amp and other Agent Skills tools**: `npx skills add` plus the MCP server ([docs](https://docs.squirrelscan.com/developers/agents)).

**Requirements:** the squirrel CLI installed and in PATH ([squirrelscan.com/download](https://squirrelscan.com/download), check with `squirrel --version`), or the hosted squirrelscan MCP server connected (`https://mcp.squirrelscan.com/mcp`).

Install the CLI on macOS or Linux:

```bash
curl -fsSL https://install.squirrelscan.com | bash
```

## Use it in Claude Code, Codex or Cursor

```
Find broken links on https://example.com and tell me what to do with each one
Check for 404s and redirect chains, internal links only
Clean up dead sitemap URLs in this repo
```

The agent runs the link audit rules, exports every broken link with the pages it appears on, proposes a decision for each, and edits links or redirects only after you agree.

## How it works

1. Check the CLI and sign-in status, and say what external link checks cost when signed in.
2. Run `squirrel audit` with the `links`, `images/broken-images`, `reliability/broken-resources` and `crawl/sitemap-4xx` rules.
3. Export the full list as JSON, since the `llm` format lists at most 5 pages per rule.
4. Decide per finding using the decision table: fix, redirect, remove or leave.
5. Re-audit at `--level full` with `--refresh`. A link the tool could not verify is reported as not checked, never fine.

## Related skills

- [`seo-audit`](../seo-audit/): page content and metadata.
- [`audit-website`](../audit-website/): the wider fix loop.
- [`website-ci-gate`](../website-ci-gate/): fail a build on new broken links.

## Links

- [squirrelscan.com](https://squirrelscan.com)
- [docs.squirrelscan.com](https://docs.squirrelscan.com)
- [Repo README](../../README.md)
- [`SKILL.md`](./SKILL.md) for this skill
- MIT licensed
