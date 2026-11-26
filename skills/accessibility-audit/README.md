# Accessibility audit skill for Claude Code, GitHub Copilot, Codex and Cursor

`accessibility-audit` is an Agent Skills `SKILL.md` from squirrelscan, the skill people look for as a WCAG audit skill or an accessibility checker for coding agents. It runs squirrelscan's accessibility audit rules through the squirrel CLI or the hosted squirrelscan MCP server, then fixes what it finds by component and template. It works in Claude Code, GitHub Copilot, Codex, Cursor and other coding agents, and it says plainly that automated checks cover only part of WCAG.

## What it does

- Checks accessible names, labels, ARIA, headings, landmarks, contrast, language, zoom and target sizes.
- Uses hand-written squirrelscan rules that read each page's markup. It is not an axe-core run.
- Takes an optional WCAG level filter (`--wcag-level A|AA|AAA`) and prints a criterion checklist from a stored audit.
- Groups findings by template, so one fix in a header, footer, card or form component clears many pages.
- Fixes in a set order: page-level blockers, names for controls, ARIA correctness, structure, then visual issues.
- Asks for design tokens before changing contrast or focus styles, instead of guessing.
- Reads skipped checks as not checked, never as passed.
- Reports "no automated findings", never "WCAG compliant", and hands over the manual checklist: keyboard-only walk, screen reader pass, captions, alt text quality, focus order and form error messages.
- Points to where the fix usually lives in Next.js and React, WordPress, Shopify, Webflow and static sites.

## Questions it answers

- Check my site's accessibility
- Run a WCAG audit
- Why does this button have no accessible name?
- Which form fields on my site are missing labels?
- Which pages fail color contrast?
- Does my site have a skip link and exactly one main landmark?
- Are my ARIA roles and attributes valid?
- What can an automated accessibility check not tell me?

## Install

With any Agent Skills tool (Claude Code, GitHub Copilot, Codex, Cursor, Gemini CLI, Amp and others):

```bash
npx skills add squirrelscan/skills --skill accessibility-audit
```

- **Claude Code plugin** (installs all the skills plus the hosted squirrelscan MCP server):

  ```
  /plugin marketplace add squirrelscan/skills
  ```

  ```
  /plugin install squirrelscan@squirrelscan
  ```

- **Codex**: `npx skills add` lands the skill in `.agents/skills/`. To add the MCP server too, configure it in `~/.codex/config.toml` ([Codex docs](https://docs.squirrelscan.com/developers/agents/codex)).
- **GitHub Copilot**: `npx skills add squirrelscan/skills --skill accessibility-audit -a github-copilot` (project `.agents/skills/`, or `~/.copilot/skills/` with `-g`). Add the hosted MCP server too, see the [GitHub Copilot docs](https://docs.squirrelscan.com/developers/agents/copilot).
- **Cursor**: use the Cursor plugin in this repo, or the [one-click MCP link](cursor://anysphere.cursor-deeplink/mcp/install?name=squirrelscan&config=eyJ1cmwiOiJodHRwczovL21jcC5zcXVpcnJlbHNjYW4uY29tL21jcCJ9) plus the skill.
- **Gemini CLI, Amp and other Agent Skills tools**: `npx skills add` plus the MCP server ([docs](https://docs.squirrelscan.com/developers/agents)).

**Requirements:** the squirrel CLI installed and in PATH ([squirrelscan.com/download](https://squirrelscan.com/download), check with `squirrel --version`), or the hosted squirrelscan MCP server connected (`https://mcp.squirrelscan.com/mcp`).

Install the CLI on macOS or Linux:

```bash
curl -fsSL https://install.squirrelscan.com | bash
```

## Use it in Claude Code, GitHub Copilot, Codex or Cursor

```text
Run a WCAG AA audit on https://example.com and fix the issues in this repo
```

```text
Check my site's accessibility and group the findings by component
```

```text
Print the WCAG checklist for the last audit
```

The agent runs `squirrel audit` with the accessibility rules, maps each finding to a component or template, fixes in batches, re-audits and gives you the list of checks a person still has to do.

## How it works

1. Check `squirrel --version` and `squirrel auth status`, tell you the cost of a signed-in audit, and offer `--offline`.
2. Run the audit at `--level surface` with the accessibility rules, optionally with `--wcag-level AA`.
3. Read the JSON findings and `skippedChecks`, then group findings by template.
4. Fix in order: page-level blockers, control names, ARIA, structure, visual.
5. Re-audit at `--level full` with `--wcag-level AA`. Stop when no error-severity findings remain, every skipped check is explained and you have the manual checklist.

## Related skills

- [`audit-website`](../audit-website/): the general audit and fix loop for non-accessibility findings.
- [`launch-checklist`](../launch-checklist/): a pre-release pass across everything, including accessibility.
- [`website-ci-gate`](../website-ci-gate/): fail CI when accessibility findings return.

## Links

- [squirrelscan.com](https://squirrelscan.com)
- [docs.squirrelscan.com](https://docs.squirrelscan.com)
- [Repo README](../../README.md)
- [`SKILL.md`](./SKILL.md) for this skill
- MIT licensed
