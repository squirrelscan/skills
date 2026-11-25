# squirrelscan skill: website audits from Claude Code, Codex and Cursor

`squirrelscan` is the core Agent Skills `SKILL.md` for the squirrelscan website audit tool: the skill that teaches Claude Code, Codex, Cursor and other coding agents to operate the `squirrel` CLI. squirrelscan crawls a site like a search engine and checks every page against 350+ audit rules in 22 categories (SEO, performance, security, accessibility, content, structured data, agent experience and more), then returns a health score and concrete, fixable findings. Use it for installing and updating the CLI, login, running audits and reading reports.

## What it does

- Runs `squirrel audit <url>` and reads the report, using `--format llm` when an agent reads the output and JSON when it needs every affected page.
- Explains the three audit levels: `quick` (25 pages), `surface` (100 pages, one page per URL pattern) and `full` (500 pages).
- Tells you before a signed-in audit what it costs and what it leaves behind, and offers `--no-publish`, `--ephemeral` and `--offline`.
- Sets the probing level by who owns the site: `--passive` for sites you do not own, and `--aggressive` or `--pentest` only when you own or may test the site.
- Handles exit codes and audits that did not run: `3` blocked, `4` redirected to another site, `5` unreachable. None of these is a score.
- Reads skipped and not-checked rules as unchecked, never as clean.
- Covers publishing and sharing reports, diffs, cloud credits, API keys and MCP server setup.
- Covers the entity map: the site-wide graph of entities a site declares in JSON-LD, and fixing identity problems such as an organization declared separately on every page.
- Offers the companion skills when a request matches, and loads a reference file only when the task needs it.

## Commands it covers

`squirrel audit`, `crawl`, `analyze`, `report`, `entities`, `init`, `config`, `auth`, `keys`, `credits`, `mcp`, `skills`, `self` and `feedback`. Every command supports `--help`.

## Questions it answers

- Check my website's SEO, speed or health
- How do I install or update the squirrel CLI?
- How do I sign in and create an API key for squirrelscan?
- What does a squirrelscan audit cost in credits?
- How do I publish and share an audit report?
- What do squirrel exit codes 3, 4 and 5 mean?
- How do I set up the squirrelscan MCP server?
- How do I disable a rule that does not apply to my site?

## Install

With any Agent Skills tool (Claude Code, Codex, Cursor, Gemini CLI, Amp and others):

```bash
npx skills add squirrelscan/skills --skill squirrelscan
```

- **Claude Code plugin** (installs all the skills plus the hosted squirrelscan MCP server):

  ```
  /plugin marketplace add squirrelscan/skills
  ```

  ```
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

```text
Audit https://example.com with squirrelscan and show me the top issues
```

```text
Install the squirrel CLI and run a first audit
```

```text
Publish the last audit as a shareable report
```

The agent checks sign-in and cost, runs the audit at the right level, reads the report and, for the full fix workflow, hands over to `audit-website`.

## How it works

1. Run `squirrel auth status` before the first audit and tell you the cost, the dashboard and schedule side effects and what gets published.
2. Run `squirrel audit` at the level you need, with probing set by who owns the site.
3. Read the report: `--format llm` is a sample, JSON is the full list, and a `Not checked:` line names rules that did not run.
4. Treat a finding as a finding, not always a bug: ask before changing a deliberate `noindex` or `robots.txt` block.
5. Load a reference for installation, accounts and credits, reports, MCP, entity maps, configuration or maintenance when the task needs one.

## Related skills

- [`audit-website`](../audit-website/): the full audit, fix and re-audit loop.
- [`security-audit`](../security-audit/): leaks, exposed files and signs of compromise.
- [`seo-audit`](../seo-audit/): crawlability, indexing and metadata.
- [`structured-data-audit`](../structured-data-audit/): JSON-LD and the entity map.
- [`website-ci-gate`](../website-ci-gate/): audits in CI.

## Links

- [squirrelscan.com](https://squirrelscan.com)
- [docs.squirrelscan.com](https://docs.squirrelscan.com)
- [Repo README](../../README.md)
- [`SKILL.md`](./SKILL.md) for this skill
- MIT licensed
