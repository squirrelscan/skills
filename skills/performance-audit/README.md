# Performance audit skill for Claude Code, Codex and Cursor

`performance-audit` is an Agent Skills `SKILL.md` from squirrelscan: a page speed and Core Web Vitals audit skill for coding agents. It runs squirrelscan's performance audit rules through the squirrel CLI or the hosted squirrelscan MCP server, then fixes slow-loading causes by template in Claude Code, Codex, Cursor and other agents. It reads markup, headers and fetched resources, so it finds causes, not real-user measurements.

## What it does

- Checks the largest image, render-blocking resources, script and image weight, compression, caching, server response, fonts and layout shift.
- Fixes biggest effect first: loading the main content, bytes, delivery, then stability and responsiveness.
- Does not lazy-load the main (largest) image, a common regression the audit flags.
- Gets each rule's exact fix from its docs page, not from memory.
- Audits the live site, because only there do compression, caching, HTTP version and server response reflect production.
- Compares before and after with `--refresh` and `squirrel report --diff`, and reports the rules that cleared.
- States the Core Web Vitals thresholds from web.dev (Largest Contentful Paint 2.5 s, Interaction to Next Paint 200 ms, Cumulative Layout Shift 0.1 at the 75th percentile) and says these audits do not replace field data from the Chrome UX Report or PageSpeed Insights.
- Points to where the fix usually lives in Next.js, WordPress, Shopify, Webflow, Cloudflare, Vercel and Netlify.

## Questions it answers

- Why is my site slow?
- Audit page performance
- Fix layout shift
- Which images are too large or in the wrong format?
- What is blocking rendering on my pages?
- Is my site compressed and cached correctly?
- Why is my largest contentful paint slow?
- Which scripts add the most weight to my pages?

## Install

With any Agent Skills tool (Claude Code, Codex, Cursor, Gemini CLI, Amp and others):

```bash
npx skills add squirrelscan/skills --skill performance-audit
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
Why is my site slow? Audit https://example.com and fix what you can in this repo
Fix layout shift on my product pages
Re-audit after the deploy and show the before and after performance score
```

The agent runs the performance and image rules at surface level, fixes the template-level causes in order, then re-audits and reports which rules cleared.

## How it works

1. Check the CLI and sign-in status and tell you the cost.
2. Run `squirrel audit` with `--rule-include perf,images` at `--level surface` against the live site.
3. Read the `perf` category score and fix in order: main content loading, bytes, delivery, stability, hygiene.
4. Re-audit with `--refresh` after the deploy and diff against the baseline.
5. Stop when error-severity `perf` findings are cleared on a `--level full` re-audit and you know lab-style checks do not replace field data.

## Related skills

- [`broken-link-checker`](../broken-link-checker/): broken assets and links.
- [`audit-website`](../audit-website/): anything else, and the fix loop.
- [`website-ci-gate`](../website-ci-gate/): fail CI on a performance score threshold.

## Links

- [squirrelscan.com](https://squirrelscan.com)
- [docs.squirrelscan.com](https://docs.squirrelscan.com)
- [Repo README](../../README.md)
- [`SKILL.md`](./SKILL.md) for this skill
- MIT licensed
