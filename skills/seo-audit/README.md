# SEO audit skill for Claude Code, Codex and Cursor

`seo-audit` is an Agent Skills `SKILL.md` from squirrelscan: a technical SEO audit skill and website SEO checker for coding agents. It runs squirrelscan's audit rules through the squirrel CLI or the hosted squirrelscan MCP server in Claude Code, Codex, Cursor and other agents, and fixes template-level issues first. It finds technical and on-page problems; it does not know what your searchers want or how pages rank.

## What it does

- Checks crawlability and indexability: `robots.txt`, sitemaps, canonicals, noindex and server errors.
- Checks titles, descriptions, headings, duplicate content, URLs, social tags, languages and image alt text.
- Groups findings by rule, then by template: a title over 60 characters on 41 pages is one change to a title template.
- Fixes in indexability-first order: crawl and index, discovery, what each page says, duplicate or thin content, then URLs, social, language and images.
- Checks intent before calling anything broken, since a `noindex`, a `robots.txt` block or a canonical to another page can be deliberate.
- Leaves staging and preview `noindex` in place.
- Points to where the fix lives in Next.js metadata, WordPress with Yoast SEO, Shopify, Webflow and static sites.
- Does not promise rankings: it says what was fixed and what the tool cannot judge.

## Questions it answers

- Run an SEO audit on my site
- Why aren't my pages indexed?
- Check my meta tags and sitemap
- Which pages have missing or duplicate titles and meta descriptions?
- Are my canonicals pointing at the right URLs?
- Is my robots.txt blocking pages I want indexed?
- Is my sitemap valid, and does it list live URLs only?
- How do I fix SEO titles in Next.js metadata or Yoast?

## Install

With any Agent Skills tool (Claude Code, Codex, Cursor, Gemini CLI, Amp and others):

```bash
npx skills add squirrelscan/skills --skill seo-audit
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
Run an SEO audit on https://example.com
Why aren't my pages indexed? Check robots, canonicals and the sitemap
Check my meta tags and sitemap and fix the title template
```

The agent runs the crawl, core, content, URL, social, language and image rules at surface level, fixes the templates behind the findings and re-audits with `--refresh`.

## How it works

1. Check the CLI and sign-in status and tell you the cost.
2. Run `squirrel audit` at `--level surface` with the SEO-related rule categories.
3. Read errors in `crawl` and `core` first, grouped by template, and check intent before changing anything.
4. Fix in order and re-audit with `--refresh` after the deploy.
5. Stop when a `--level full` re-audit has no error-severity findings in `crawl` and `core`, and what is left is judgment listed for you.

## Related skills

- [`broken-link-checker`](../broken-link-checker/): dead links and redirect chains.
- [`structured-data-audit`](../structured-data-audit/): JSON-LD and schema markup.
- [`performance-audit`](../performance-audit/): page speed.
- [`launch-checklist`](../launch-checklist/): a pre-launch pass that includes indexing checks.

## Links

- [squirrelscan.com](https://squirrelscan.com)
- [docs.squirrelscan.com](https://docs.squirrelscan.com)
- [Repo README](../../README.md)
- [`SKILL.md`](./SKILL.md) for this skill
- MIT licensed
