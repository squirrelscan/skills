# Website audit and fix skill for Claude Code, Codex and Cursor

`audit-website` is an Agent Skills `SKILL.md` from squirrelscan: the website audit agent skill that audits a site, maps each finding to the code or content behind it, fixes in batches and re-audits until the site scores well. It runs 350+ audit rules across SEO, performance, security, technical, content, accessibility and more, through the squirrel CLI or the hosted squirrelscan MCP server. It works in Claude Code, Codex, Cursor and other coding agents, and is the general fix loop the narrower squirrelscan skills hand back to.

## What it does

- Runs a squirrelscan audit and reads the LLM-optimized report: score, grade and top findings by severity.
- Starts with a quick pass to learn the site's structure, then goes deeper: `surface` (one page per URL pattern) for template-level coverage and `full` for sign-off.
- Checks intent before calling something broken, since a `noindex`, a `robots.txt` block or a page behind a login can be what you want.
- Gets the fix from the rule's docs page (or `get_rule` over MCP), not from the report.
- Proposes fixes, confirms with you before changing anything, then fixes in batches and verifies that the project still builds.
- Re-audits with `--refresh` after deploys and shows before and after scores, with `squirrel report --diff` or `compare_audits` for regressions.
- Tells you the cost and what a signed-in audit leaves behind (dashboard entry, recurring audits, an unlisted report) before it runs, and offers `--offline`, `--no-publish` and `--ephemeral`.
- Reads skipped and not-checked rules as unchecked, and does not start a fix loop when the exit code is `3`, `4` or `5`, because nothing was audited.
- Tailors the audit to the site: a finding class that does not apply can be disabled in `squirrel.toml`.

## Questions it answers

- Audit my website and fix all errors and warnings
- Run an audit on example.com and show me the top 5 critical issues
- Check my site for broken links and leaked secrets
- Re-audit after the deploy and diff against the last report
- What is wrong with my website, and how do I fix it?
- What is my site's health score, and how do I raise it?
- Which findings should I fix first?
- Which finding is intentional and which is a real bug?

## Install

With any Agent Skills tool (Claude Code, Codex, Cursor, Gemini CLI, Amp and others):

```bash
npx skills add squirrelscan/skills --skill audit-website
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
Audit this website and fix all errors and warnings
```

```text
Run an audit on example.com and show me the top 5 critical issues
```

```text
Re-audit after the deploy and diff against the last report
```

The agent asks which site to audit, tells you the cost, runs the audit, proposes fixes for your approval, edits the source files, re-audits and shows the score change.

## How it works

1. Run `squirrel auth status`, tell you the cost and side effects, and get a yes.
2. Run `squirrel audit <url> --format llm`, quick first and then `surface` or `full`. Over MCP, use `run_audit`, `get_audit_status` and `get_report`.
3. Present the report and check intent for each finding that might be deliberate.
4. Export the full JSON list, map findings to source files, and fix in batches after you approve.
5. Re-audit with `--refresh` and repeat until errors are fixed or confirmed intentional and the rest needs a human decision.

## Over MCP

With the hosted squirrelscan MCP server connected (`https://mcp.squirrelscan.com/mcp`), the same loop runs with its tools: `whoami`, `run_audit`, `get_audit_status`, `get_report`, `list_issues`, `get_issue`, `get_rule`, `comment_on_issue` and `compare_audits`. Every hosted audit is a billed cloud audit, and `run_audit` returns an estimate for you to confirm before it spends credits.

## Related skills

- [`squirrelscan`](../squirrelscan/): operate the CLI: install, login, reports, credits, MCP setup.
- [`seo-audit`](../seo-audit/): a focused technical SEO pass.
- [`security-audit`](../security-audit/): a focused security pass.
- [`launch-checklist`](../launch-checklist/): a pre-launch pass that runs the others in launch order.
- [`website-ci-gate`](../website-ci-gate/): keep the score from regressing in CI.

## Links

- [squirrelscan.com](https://squirrelscan.com)
- [docs.squirrelscan.com](https://docs.squirrelscan.com)
- [Repo README](../../README.md)
- [`SKILL.md`](./SKILL.md) for this skill
- MIT licensed
