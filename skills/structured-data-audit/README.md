# Structured data audit skill for Claude Code, Codex and Cursor

`structured-data-audit` is an Agent Skills `SKILL.md` from squirrelscan: a JSON-LD validator and schema markup audit for coding agents. It runs squirrelscan's structured data rules and its site-wide entity map through the squirrel CLI or the hosted squirrelscan MCP server in Claude Code, Codex, Cursor and other agents. Valid markup does not guarantee rich results, and this skill does not claim eligibility.

## What it does

- Checks that JSON-LD parses, that it is the right type for the page and that required and recommended properties are present.
- Builds the entity map with `squirrel entities`: the site-wide graph of the entities your pages declare.
- Finds entity problems: `no-id`, `conflict`, `dangling`, `single-page` and `split-identity`.
- Gives each real-world entity (organization, website, authors, products) one stable `@id`, declared once and referenced elsewhere.
- Fixes in order: parse errors, identity, type fit, properties, then markup that claims more than the page shows.
- Never adds markup for content users cannot see.
- Proves a fix with `squirrel entities --diff`, reading the `gainedId` section and its coverage.
- Points to where the fix lives in Yoast SEO, Next.js, Shopify, Webflow and static sites.

## Questions it answers

- Check my JSON-LD
- Audit my schema markup
- Fix duplicate Organization entities
- Why does every page declare a separate Organization?
- Does my JSON-LD parse?
- Is the schema type right for each page type?
- Is my Product or Article markup missing required properties?
- Is my theme and my SEO plugin both printing JSON-LD?

## Install

With any Agent Skills tool (Claude Code, Codex, Cursor, Gemini CLI, Amp and others):

```bash
npx skills add squirrelscan/skills --skill structured-data-audit
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
Check my JSON-LD on https://example.com
```

```text
Audit my schema markup and show me the entity problems
```

```text
Fix duplicate Organization entities and give each one a stable @id
```

The agent audits the schema rules, reads the entity graph, fixes identity in the layout or plugin config and proves it with an entity diff.

## How it works

1. Check the CLI and sign-in status and tell you the cost.
2. Run `squirrel audit` with `--rule-include schema`, then `squirrel entities`, using `--level full` when the entity map matters.
3. Fix parse errors first, then identity, type fit and properties.
4. Re-audit, then run `squirrel entities --diff` to prove the change.
5. Stop when `schema/json-ld-valid` is clean and no conflicts, split identities or dangling references remain on a full crawl.

## Related skills

- [`seo-audit`](../seo-audit/): titles, canonicals and content.
- [`audit-website`](../audit-website/): the wider audit and fix loop.
- [`launch-checklist`](../launch-checklist/): structured data as part of a pre-launch pass.

## Links

- [squirrelscan.com](https://squirrelscan.com)
- [docs.squirrelscan.com](https://docs.squirrelscan.com)
- [Repo README](../../README.md)
- [`SKILL.md`](./SKILL.md) for this skill
- MIT licensed
