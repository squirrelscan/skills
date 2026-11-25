![squirrelscan](https://mintcdn.com/squirrelscan/CCMTmLbI4xfnpJbQ/logo/light.svg?fit=max&auto=format&n=CCMTmLbI4xfnpJbQ&q=85&s=1303484a4ea3c154c29dd5f6245e55cd)

# squirrelscan skills and plugins

**Website audit skills for Claude Code, Codex, Cursor and other coding agents: skills, plugins, and MCP in one repo**

Setup guides: [squirrelscan for Claude Code](https://squirrelscan.com/for/claude-code) and the [Claude Code docs](https://docs.squirrelscan.com/developers/agents/claude-code).

## What is squirrelscan?

[squirrelscan](https://squirrelscan.com) is a website audit tool built for AI agents. It crawls a site, analyzes every page against 350+ rules across SEO, performance, security, accessibility, content, and more, and returns a health score plus concrete, fixable issues.

**Features:**

- 350+ audit rules across 22 categories
- Leaked secrets detection (96 patterns: OpenAI, Anthropic, AWS, Stripe, and more)
- Multiple output formats: console, text, json, markdown, llm, html
- Diff reports for regressions between audits
- LLM-native output for AI-assisted debugging and optimization
- Optimized for CI/CD pipelines and automation

## What's in this repo

This repo is the one home of the squirrelscan agent skills and agent plugins. Every install path below reads it; nothing else carries a copy.

| Skill | What it does | Install |
|-------|--------------|---------|
| [`squirrelscan`](skills/squirrelscan/SKILL.md) | Operate the CLI: install, login, run audits, publish reports, credits, API keys, the entity map, MCP setup, config, troubleshooting | `npx skills add squirrelscan/skills --skill squirrelscan` |
| [`audit-website`](skills/audit-website/SKILL.md) | The fix loop: audit a site, map findings to code, fix in batches, re-audit until it scores well | `npx skills add squirrelscan/skills --skill audit-website` |
| [`security-audit`](skills/security-audit/SKILL.md) | Leaked secrets, exposed files and endpoints, headers, cookies and signs of compromise; asks about ownership before aggressive probing | `npx skills add squirrelscan/skills --skill security-audit` |
| [`supabase-security-audit`](skills/supabase-security-audit/SKILL.md) | Whether the public anon key can read tables with Row Level Security off, and secret keys in the browser; RLS fixes | `npx skills add squirrelscan/skills --skill supabase-security-audit` |
| [`accessibility-audit`](skills/accessibility-audit/SKILL.md) | Accessible names, ARIA, headings, contrast, with a WCAG level filter and checklist; says what needs a person | `npx skills add squirrelscan/skills --skill accessibility-audit` |
| [`seo-audit`](skills/seo-audit/SKILL.md) | Crawlability, indexing, canonicals, titles, descriptions, duplicates, fixed template-first | `npx skills add squirrelscan/skills --skill seo-audit` |
| [`broken-link-checker`](skills/broken-link-checker/SKILL.md) | Dead links, anchors, redirect chains, orphan pages, broken images; a decision per finding | `npx skills add squirrelscan/skills --skill broken-link-checker` |
| [`performance-audit`](skills/performance-audit/SKILL.md) | What slows loading: images, scripts, compression, caching, layout shift | `npx skills add squirrelscan/skills --skill performance-audit` |
| [`structured-data-audit`](skills/structured-data-audit/SKILL.md) | JSON-LD validity and the site-wide entity map | `npx skills add squirrelscan/skills --skill structured-data-audit` |
| [`agent-experience-audit`](skills/agent-experience-audit/SKILL.md) | How agents and crawlers read a site: bot access, content without JavaScript, `llms.txt`, `AGENTS.md` | `npx skills add squirrelscan/skills --skill agent-experience-audit` |
| [`website-ci-gate`](skills/website-ci-gate/SKILL.md) | Fail CI on a score threshold, errors or new findings; GitHub Actions, GitLab, preview deploys | `npx skills add squirrelscan/skills --skill website-ci-gate` |
| [`security-headers`](skills/security-headers/SKILL.md) | CSP, HSTS and other header config for Cloudflare, Vercel, Netlify, nginx, Next.js; no CLI needed | `npx skills add squirrelscan/skills --skill security-headers` |
| [`launch-checklist`](skills/launch-checklist/SKILL.md) | A pre-launch pass that runs the others in launch order and ends in a go or no-go list | `npx skills add squirrelscan/skills --skill launch-checklist` |

The skills are in [`skills.sh.json`](skills.sh.json) groups: audit and fix, security, quality checks, CI and launch.

Each plugin bundles every skill in `skills/` and the hosted squirrelscan MCP server:

| Plugin | Files |
|--------|-------|
| Claude Code marketplace + plugin | `.claude-plugin/marketplace.json`, `.claude-plugin/plugin.json`, `.mcp.json` |
| Claude Code channel plugin (opt in) | `plugins/squirrelscan-channel/` |
| Cursor plugin | `.cursor-plugin/plugin.json`, `.cursor-plugin/mcp.json` |
| [Agent Plugins](https://agent-plugins.org) 1.0.0 (open standard, loads in Cursor) | `plugin.json`, `mcp.json` |

Codex reads each skill's `agents/openai.yaml` for its display metadata.

`manifest.json` lists the skills the squirrel CLI installs (`squirrelscan` and `audit-website`, set by `CLI_SKILLS` in `scripts/manifest.ts`), each with its version and every file in it with its sha256 and size. The CLI downloads only the files whose hash changed and verifies each one before writing anything. The task-specific skills are not in it: `squirrel skills install` installs only the two main skills, and the others come from `npx skills add` or the plugins.

## Prerequisites

The audit skills drive the **squirrel CLI**, which must be installed and in PATH (or the hosted MCP server connected). `security-headers` needs neither.

**Install:** [squirrelscan.com/download](https://squirrelscan.com/download)

**Verify:**
```bash
squirrel --version
```

## Installing

Pick the path for your tool:

| Tool | Skills only | Skills + MCP server |
|------|-------------|---------------------|
| Claude Code | `npx skills add squirrelscan/skills` | `/plugin marketplace add squirrelscan/skills` then `/plugin install squirrelscan@squirrelscan` |
| Cursor | `npx skills add squirrelscan/skills` | the Cursor plugin in this repo, or the [one-click MCP link](cursor://anysphere.cursor-deeplink/mcp/install?name=squirrelscan&config=eyJ1cmwiOiJodHRwczovL21jcC5zcXVpcnJlbHNjYW4uY29tL21jcCJ9) plus skills |
| OpenAI Codex | `npx skills add squirrelscan/skills` (lands in `.agents/skills/`) | skills plus the MCP server in `~/.codex/config.toml` ([docs](https://docs.squirrelscan.com/developers/agents/codex)) |
| Gemini CLI, GitHub Copilot, Amp and other Agent Skills tools | `npx skills add squirrelscan/skills` | skills plus the MCP server ([docs](https://docs.squirrelscan.com/developers/agents)) |
| Any Agent Plugins client | | this repo: `plugin.json`, `mcp.json` and `skills/` |
| squirrel CLI | `squirrel skills install` | |
| Manual | clone + symlink `skills/*` into your agent's skills dir | |

### Agent Skills via npx (works everywhere)

```bash
npx skills add squirrelscan/skills
```

Installs every skill in the table above for whichever agents you select: Claude Code, Codex, Cursor, Gemini CLI, Amp, and more. Skills follow the [Agent Skills](https://agentskills.io) standard, so the same `SKILL.md` works across tools. To install just one skill:

```bash
npx skills add squirrelscan/skills --skill audit-website
```

### Claude Code plugin (recommended for Claude Code)

```
/plugin marketplace add squirrelscan/skills
```

```
/plugin install squirrelscan@squirrelscan
```

One step installs all the skills and connects the hosted squirrelscan MCP server.

### Claude Code channel (opt in)

A separate plugin, `squirrelscan-channel`, runs `squirrel channel` and pushes cloud audit events into your running session, so your agent can pull the report and fix what it finds. It is not part of the main plugin, so nobody gets a background process they did not ask for.

```
/plugin install squirrelscan-channel@squirrelscan
claude --channels plugin:squirrelscan-channel@squirrelscan
```

It needs a CLI release with the `channel` command, and until squirrelscan is on Anthropic's channel allowlist you need the development flag instead of `--channels`. Details: [plugins/squirrelscan-channel](plugins/squirrelscan-channel/README.md).

### Cursor

1. **Skills**: `npx skills add squirrelscan/skills`. Cursor reads Agent Skills from `.cursor/skills/`, `.agents/skills/`, and their `~/` equivalents (it also picks up `~/.claude/skills/`).
2. **MCP only, one click**: [Add squirrelscan MCP to Cursor](cursor://anysphere.cursor-deeplink/mcp/install?name=squirrelscan&config=eyJ1cmwiOiJodHRwczovL21jcC5zcXVpcnJlbHNjYW4uY29tL21jcCJ9)
3. **Plugin** (skills + MCP): this repo is a Cursor plugin (`.cursor-plugin/`). Teams can import it as a team marketplace (Dashboard, **Plugins & MCPs**, **Add Marketplace**, **Import from Repo**), or clone it into `~/.cursor/plugins/local/squirrelscan` and reload the window ([Cursor docs](https://cursor.com/docs/plugins#test-plugins-locally)).

### OpenAI Codex

Codex reads skills from `.agents/skills/` (project) or `~/.agents/skills/` (global). `npx skills add squirrelscan/skills` installs there, or clone and symlink the `skills/*` directories.

### From the squirrel CLI

```bash
squirrel skills               # what is installed where, against the latest version
squirrel skills install
squirrel skills update
```

From v0.0.99 the CLI installs the skills itself, from `manifest.json`, into `~/.claude/skills` and `~/.agents/skills` (or a repo's own with `--project`), takes over installs made with `npx skills` of the two skills it manages, and keeps them current with its own auto-update. See [docs.squirrelscan.com/cli/skills](https://docs.squirrelscan.com/cli/skills).

### Manual

```bash
git clone https://github.com/squirrelscan/skills.git
```

Then copy or symlink the `skills/*` directories you want into your agent's skills directory (`make link` does this for Claude Code and `.agents/skills` consumers).

## Updates and versions

- **Skills** carry their own version in `SKILL.md` (`metadata.version`). Bump it with every content change.
- **Plugins** carry a semver `version` (`claude plugin validate --strict` and the OpenAI listing both need one). The `squirrelscan` plugin's version is the squirrelscan skill's `metadata.version` padded to three parts (skill `1.16` is plugin `1.16.0`) in `.claude-plugin/plugin.json`, `.cursor-plugin/plugin.json` and `plugin.json`; marketplace entries carry none. Claude Code treats the version string as the update key, so an install updates only when we bump it: **bump the skill version with every skill content change, and the plugin versions move with it** (CI fails on drift). Changes that touch only plugin files (MCP config, manifests) need a skill version bump too, or installs will not see them. `squirrelscan-channel` has its own semver, bumped when that plugin changes. Third-party marketplaces don't auto-update by default: run `/plugin marketplace update squirrelscan` then `/plugin update squirrelscan@squirrelscan`, or turn on auto-update for the marketplace in `/plugin` ([Claude Code docs](https://code.claude.com/docs/en/plugins-reference#version-management)).
- **npx installs** update with `npx skills update`, `squirrel skills update`, or the squirrel CLI's auto-update.

`bun run scripts/check-skills.ts` (CI runs it on pull requests and on pushes to `main`) checks that every `SKILL.md` parses the way installers read it, and that the plugin manifests agree: same name, same description, a version that matches the skill, one MCP endpoint, and a complete OpenAI listing block.

## Moving from squirrelscan/squirrelscan

The skills and plugins used to ship from the [squirrelscan/squirrelscan](https://github.com/squirrelscan/squirrelscan) repo too. They now ship only from here.

- **Claude Code**: the old `squirrelscan/squirrelscan` marketplace now points its plugin at this repo, so it keeps working. Pick up the move with `/plugin marketplace update squirrelscan` then `/plugin update squirrelscan@squirrelscan`. To switch marketplaces instead, remove the old one first: both are named `squirrelscan`, and Claude Code won't add a second marketplace under a name that is already taken. Removing it also uninstalls the plugin, so reinstall it from here:

  ```
  /plugin marketplace remove squirrelscan
  ```

  ```
  /plugin marketplace add squirrelscan/skills
  ```

  ```
  /plugin install squirrelscan@squirrelscan
  ```
- **npx skills**: from squirrel v0.0.99, `squirrel skills install` (or `squirrel skills update`) takes over installs made with `npx skills`, whichever repo they came from, and removes them from its lock file. Without the CLI: `npx skills add squirrelscan/skills -g`.
- **Cursor plugin**: install it from this repo as above. Cursor's marketplace manifests can't point at another repository, so a copy of the old one does not follow the move.

## MCP server

The hosted MCP server lives at `https://mcp.squirrelscan.com/mcp` (streamable-http; OAuth or `Authorization: Bearer sq_...` API key). A local stdio server is available via `squirrel mcp`. Docs: [docs.squirrelscan.com/developers/mcp](https://docs.squirrelscan.com/developers/mcp)

## Example prompts

```
Audit this website and fix all errors and warnings
```

```
Run an audit on example.com and show me the top 5 critical issues
```

```
Check my site for broken links and leaked secrets
```

```
Re-audit after the deploy and diff against the last report
```

## Contributing

Skill and plugin changes land here, and only here. Contributions are welcome! To suggest new skills or improvements:

1. Open an issue to discuss your idea
2. Fork this repository
3. Create a feature branch
4. Submit a pull request

After changing anything under `skills/`, regenerate the manifest and commit it with the change (CI fails when it is stale):

```bash
bun run scripts/manifest.ts
```

Every skill carries a full semver `metadata.version` (`MAJOR.MINOR.PATCH`): patch for wording and fixes, minor for a new capability or section, major for a breaking change to how the skill is invoked. `make bump SKILL=<name> PART=patch|minor|major` bumps it and regenerates `manifest.json` (for `squirrelscan` it also moves the three plugin manifests). `bun scripts/check-skills.ts` fails when a file under `skills/<name>/` changed against `origin/main` without that skill's version going up, and `make hooks` installs a pre-commit hook (`.githooks/`) that runs the same check on staged changes. A new skill starts at `0.1.0`. Skills older than the rule may still read `major.minor`; the CLI compares versions as dotted numbers, so `3.3` and `3.3.0` are equal.

All skills follow the [Agent Skills Standard](https://agentskills.io/specification).

## License

MIT License. See [LICENSE](LICENSE) file for details.

---

**Learn more:** [docs.squirrelscan.com](https://docs.squirrelscan.com) | [squirrelscan.com](https://squirrelscan.com)
