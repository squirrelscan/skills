![squirrelscan](https://mintcdn.com/squirrelscan/CCMTmLbI4xfnpJbQ/logo/light.svg?fit=max&auto=format&n=CCMTmLbI4xfnpJbQ&q=85&s=1303484a4ea3c154c29dd5f6245e55cd)

# squirrelscan skills and plugins

**Website audits for AI agents: skills, plugins, and MCP in one repo**

## What is squirrelscan?

[squirrelscan](https://squirrelscan.com) is a website audit tool built for AI agents. It crawls a site, analyzes every page against 260+ rules across SEO, performance, security, accessibility, content, and more, and returns a health score plus concrete, fixable issues.

**Features:**

- 260+ audit rules across 21 categories
- Leaked secrets detection (96 patterns: OpenAI, Anthropic, AWS, Stripe, and more)
- Multiple output formats: console, text, json, markdown, llm, html
- Diff reports for regressions between audits
- LLM-native output for AI-assisted debugging and optimization
- Optimized for CI/CD pipelines and automation

## What's in this repo

This repo is the one home of the squirrelscan agent skills and agent plugins. Every install path below reads it; nothing else carries a copy.

| Skill | What it does |
|-------|--------------|
| [`squirrelscan`](skills/squirrelscan/SKILL.md) | Operate the CLI: install, login, run audits, publish reports, credits, API keys, the entity map, MCP setup, config, troubleshooting |
| [`audit-website`](skills/audit-website/SKILL.md) | The fix loop: audit a site, map findings to code, fix in batches, re-audit until it scores well |

Each plugin bundles both skills and the hosted squirrelscan MCP server:

| Plugin | Files |
|--------|-------|
| Claude Code marketplace + plugin | `.claude-plugin/marketplace.json`, `.claude-plugin/plugin.json`, `.mcp.json` |
| Cursor plugin | `.cursor-plugin/plugin.json`, `.cursor-plugin/mcp.json` |
| [Agent Plugins](https://agent-plugins.org) 1.0.0 (open standard, loads in Cursor) | `plugin.json`, `mcp.json` |

Codex reads each skill's `agents/openai.yaml` for its display metadata.

`manifest.json` lists every skill's version and every file in it with its sha256 and size. The squirrel CLI installs and updates the skills from it: it downloads only the files whose hash changed and verifies each one before writing anything.

## Prerequisites

All skills drive the **squirrel CLI**, which must be installed and in PATH.

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

Installs both skills (`squirrelscan` and `audit-website`) for whichever agents you select: Claude Code, Codex, Cursor, Gemini CLI, Amp, and more. Skills follow the [Agent Skills](https://agentskills.io) standard, so the same `SKILL.md` works across tools. To install just one skill:

```bash
npx skills add squirrelscan/skills --skill audit-website
```

### Claude Code plugin (recommended for Claude Code)

```
/plugin marketplace add squirrelscan/skills
/plugin install squirrelscan@squirrelscan
```

One step installs both skills and connects the hosted squirrelscan MCP server.

### Cursor

1. **Skills**: `npx skills add squirrelscan/skills`. Cursor reads Agent Skills from `.cursor/skills/`, `.agents/skills/`, and their `~/` equivalents (it also picks up `~/.claude/skills/`).
2. **MCP only, one click**: [Add squirrelscan MCP to Cursor](cursor://anysphere.cursor-deeplink/mcp/install?name=squirrelscan&config=eyJ1cmwiOiJodHRwczovL21jcC5zcXVpcnJlbHNjYW4uY29tL21jcCJ9)
3. **Plugin** (skills + MCP): this repo is a Cursor plugin (`.cursor-plugin/`). Teams can import it as a team marketplace (Dashboard, **Plugins & MCPs**, **Add Marketplace**, **Import from Repo**), or clone it into `~/.cursor/plugins/local/squirrelscan` and reload the window ([Cursor docs](https://cursor.com/docs/plugins#test-plugins-locally)).

### OpenAI Codex

Codex reads skills from `.agents/skills/` (project) or `~/.agents/skills/` (global). `npx skills add squirrelscan/skills` installs there, or clone and symlink the `skills/*` directories.

### From the squirrel CLI

```bash
squirrel skills install
squirrel skills update
```

`squirrel skills update` refreshes both skills, global and project installs alike. From v0.0.99, the CLI's own auto-update also refreshes globally installed squirrelscan skills, once for each new CLI version it installs. Project installs stay with `squirrel skills update`.

### Manual

```bash
git clone https://github.com/squirrelscan/skills.git
```

Then copy or symlink `skills/squirrelscan` and `skills/audit-website` into your agent's skills directory (`make link` does this for Claude Code and `.agents/skills` consumers).

## Updates and versions

- **Skills** carry their own version in `SKILL.md` (`metadata.version`). Bump it with every content change.
- **Plugins** carry no `version` field, on purpose, and CI rejects one. Claude Code treats a plugin's version string as its update key, so a version nobody remembers to bump freezes every install. Without one it uses the commit, so each push to `main` is an update ([Claude Code docs](https://code.claude.com/docs/en/plugins-reference#version-management)). Third-party marketplaces don't auto-update by default: run `/plugin marketplace update squirrelscan` then `/plugin update squirrelscan@squirrelscan`, or turn on auto-update for the marketplace in `/plugin`.
- **npx installs** update with `npx skills update`, `squirrel skills update`, or the squirrel CLI's auto-update.

`bun run scripts/check-skills.ts` (CI runs it on pull requests and on pushes to `main`) checks that every `SKILL.md` parses the way installers read it, and that the plugin manifests agree: same name, same description, no version, one MCP endpoint.

## Moving from squirrelscan/squirrelscan

The skills and plugins used to ship from the [squirrelscan/squirrelscan](https://github.com/squirrelscan/squirrelscan) repo too. They now ship only from here.

- **Claude Code**: the old `squirrelscan/squirrelscan` marketplace now points its plugin at this repo, so it keeps working. Pick up the move with `/plugin marketplace update squirrelscan` then `/plugin update squirrelscan@squirrelscan`. To switch marketplaces instead, remove the old one first: both are named `squirrelscan`, and Claude Code won't add a second marketplace under a name that is already taken. Removing it also uninstalls the plugin, so reinstall it from here:

  ```
  /plugin marketplace remove squirrelscan
  /plugin marketplace add squirrelscan/skills
  /plugin install squirrelscan@squirrelscan
  ```
- **npx skills**: run `squirrel skills update` and installs recorded from `squirrelscan/squirrelscan` are re-added from here, global and project alike. From v0.0.99 the CLI's auto-update does the same for global installs. Without the CLI: `npx skills add squirrelscan/skills -g`.
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

Bump the skill's `metadata.version` in its `SKILL.md` too, so installs can tell the versions apart.

All skills follow the [Agent Skills Standard](https://agentskills.io/specification).

## License

MIT License. See [LICENSE](LICENSE) file for details.

---

**Learn more:** [docs.squirrelscan.com](https://docs.squirrelscan.com) | [squirrelscan.com](https://squirrelscan.com)
