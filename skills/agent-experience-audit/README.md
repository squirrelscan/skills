# Agent experience audit skill for Claude Code, GitHub Copilot, Codex and Cursor

`agent-experience-audit` is an Agent Skills `SKILL.md` from squirrelscan that checks how well a site works for AI agents and crawlers: the AX audit, an `llms.txt` checker and an AI crawler access check in one skill. It runs squirrelscan's agent experience audit rules through the squirrel CLI or the hosted squirrelscan MCP server in Claude Code, GitHub Copilot, Codex, Cursor and other coding agents. It is about access and readability, not rankings or visibility in AI answers.

## What it does

- Checks which bots `robots.txt` lets in, per bot, and whether a CDN or WAF blocks agents regardless of `robots.txt`.
- Checks whether the main content is in the HTML or only appears after JavaScript.
- Checks for `llms.txt`, `AGENTS.md`, markdown responses, API discovery, well-known agent files and machine-readable policies.
- Leaves allow or block decisions to the site owner: it shows the per-bot result, asks which bots you want in and never changes `robots.txt` bot rules on its own.
- Treats `llms.txt` as a proposed convention: its absence is never a defect, but an SPA that answers 200 with its HTML shell for `/llms.txt` is a failure.
- Says when discovery probes were turned off and the related rules report not checked, instead of calling them clean.
- Does not measure visibility in AI answers and never claims a site will be cited or recommended by an assistant.

## Questions it answers

- How well does my site work for AI agents?
- Audit my llms.txt
- Which AI crawlers does my robots.txt let in?
- Is my main content visible without JavaScript?
- Is Cloudflare blocking AI agents on top of robots.txt?
- Does my site have an AGENTS.md or an llms.txt?
- Does my site serve markdown versions of pages?
- Can agents discover my API?

## Install

With any Agent Skills tool (Claude Code, GitHub Copilot, Codex, Cursor, Gemini CLI, Amp and others):

```bash
npx skills add squirrelscan/skills --skill agent-experience-audit
```

- **Claude Code plugin** (installs all the skills plus the hosted squirrelscan MCP server):

  ```
  /plugin marketplace add squirrelscan/skills
  ```

  ```
  /plugin install squirrelscan@squirrelscan
  ```

- **Codex**: `npx skills add` lands the skill in `.agents/skills/`. To add the MCP server too, configure it in `~/.codex/config.toml` ([Codex docs](https://docs.squirrelscan.com/developers/agents/codex)).
- **GitHub Copilot**: `npx skills add squirrelscan/skills --skill agent-experience-audit -a github-copilot` (project `.agents/skills/`, or `~/.copilot/skills/` with `-g`). Add the hosted MCP server too, see the [GitHub Copilot docs](https://docs.squirrelscan.com/developers/agents/copilot).
- **Cursor**: use the Cursor plugin in this repo, or the [one-click MCP link](cursor://anysphere.cursor-deeplink/mcp/install?name=squirrelscan&config=eyJ1cmwiOiJodHRwczovL21jcC5zcXVpcnJlbHNjYW4uY29tL21jcCJ9) plus the skill.
- **Gemini CLI, Amp and other Agent Skills tools**: `npx skills add` plus the MCP server ([docs](https://docs.squirrelscan.com/developers/agents)).

**Requirements:** the squirrel CLI installed and in PATH ([squirrelscan.com/download](https://squirrelscan.com/download), check with `squirrel --version`), or the hosted squirrelscan MCP server connected (`https://mcp.squirrelscan.com/mcp`).

Install the CLI on macOS or Linux:

```bash
curl -fsSL https://install.squirrelscan.com | bash
```

## Use it in Claude Code, GitHub Copilot, Codex or Cursor

```text
How well does my site work for AI agents? Audit https://example.com
```

```text
Audit my llms.txt and tell me what is wrong with it
```

```text
Which AI bots can reach my site, and which ones does my CDN block?
```

The agent runs the `ax` audit rules, shows you the per-bot verdicts, asks which bots you want in, then fixes server rendering and discovery files and records the policy in the repo.

## How it works

1. Check the CLI and sign-in status, tell you the cost and offer `--offline`, as with every squirrelscan audit skill.
2. Run `squirrel audit` with `--rule-include ax` at `--level surface`, or a single discovery rule at `--level quick`.
3. Fix in order: can agents reach it, is the content in the HTML, is it easy to read and quote, discovery files, then policies the owner chooses.
4. Stop when each `ax` rule is clean, knowingly waived with the owner's reason, or reported as not checked with the cause.

## Related skills

- [`seo-audit`](../seo-audit/): metadata, canonicals and sitemaps.
- [`structured-data-audit`](../structured-data-audit/): JSON-LD validity and the entity map.
- [`audit-website`](../audit-website/): the wider audit and fix loop.

## Links

- [squirrelscan.com](https://squirrelscan.com)
- [docs.squirrelscan.com](https://docs.squirrelscan.com)
- [Repo README](../../README.md)
- [`SKILL.md`](./SKILL.md) for this skill
- MIT licensed
