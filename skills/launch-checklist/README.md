# Launch checklist skill for Claude Code, Codex and Cursor

`launch-checklist` is an Agent Skills `SKILL.md` from squirrelscan: a pre-launch website check for a new site, a redesign or a migration. It runs one full baseline audit through the squirrel CLI or the hosted squirrelscan MCP server, then works through the other squirrelscan skills in launch order and ends with a go or no-go list. It runs in Claude Code, Codex, Cursor and other coding agents.

## What it does

- Runs a baseline audit at `--level full` and reads the score, the error-severity findings and the `Not checked:` line.
- Treats blockers as no-go until clear: compromise and leaks, HTTPS, indexing, broken links and server errors.
- Checks that a staging `noindex` or `Disallow: /` is gone on the live site and that canonicals and the sitemap point at the live host.
- Lists what should be fixed before launch: titles and descriptions, accessibility, performance, security headers, structured data and the bot policy.
- Lists the human checks the tool cannot do: forms end to end, analytics and consent, the 404 page, legal pages, redirects from the old domain, email sending domain and the sitemap submission in Search Console.
- Never removes `noindex` from staging itself: only in the production build, checked again on the live URL.
- Writes a go or no-go table where each blocker is clear, not clear or not checked, with the before and after score.
- Says what it cannot judge: copy, design and legal compliance.

## Questions it answers

- Is my site ready to launch?
- Run a pre-launch website check
- Audit my migration before cutover
- Did I leave noindex or a robots.txt Disallow on the live site?
- Do my canonicals and sitemap point at the production domain?
- Which redirects do I need after changing domains?
- What should I fix before launch and what can wait?

## Install

With any Agent Skills tool (Claude Code, Codex, Cursor, Gemini CLI, Amp and others):

```bash
npx skills add squirrelscan/skills --skill launch-checklist
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
Is my site ready to launch? Check https://staging.example.com
```

```text
Run a pre-launch website check and give me a go or no-go list
```

```text
Audit my migration before cutover and compare the live site with the baseline
```

The agent audits staging first, works through the blockers with the matching skills, then re-audits the live URL after DNS and deploy and gives you the go or no-go table.

## How it works

1. Run the full baseline audit on the staging or pre-production URL.
2. Work through the blocker table, using `security-audit`, `seo-audit`, `broken-link-checker` and `audit-website` for fixes.
3. Handle the should-fix list and hand the human checks to you.
4. Write the go or no-go table, with "not checked" never counted as clear.
5. After launch, re-audit the live URL with `--refresh`, compare with the baseline and add `website-ci-gate`.

## Related skills

- [`security-audit`](../security-audit/): leaks, exposed files, HTTPS and signs of compromise.
- [`seo-audit`](../seo-audit/): indexing, canonicals and sitemaps.
- [`broken-link-checker`](../broken-link-checker/): redirects and dead links after a migration.
- [`website-ci-gate`](../website-ci-gate/): hold launch quality in CI.

## Links

- [squirrelscan.com](https://squirrelscan.com)
- [docs.squirrelscan.com](https://docs.squirrelscan.com)
- [Repo README](../../README.md)
- [`SKILL.md`](./SKILL.md) for this skill
- MIT licensed
