![squirrelscan](https://mintcdn.com/squirrelscan/CCMTmLbI4xfnpJbQ/logo/light.svg?fit=max&auto=format&n=CCMTmLbI4xfnpJbQ&q=85&s=1303484a4ea3c154c29dd5f6245e55cd)

# squirrelscan Skills & Plugins

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

| Skill | What it does |
|-------|--------------|
| [`squirrelscan`](skills/squirrelscan/SKILL.md) | Operate the CLI: install, login, run audits, publish reports, credits, API keys, MCP setup, config, troubleshooting |
| [`audit-website`](skills/audit-website/SKILL.md) | The fix loop: audit a site, map findings to code, fix in batches, re-audit until it scores well |

The repo is also a **Claude Code plugin + marketplace** and a **Cursor plugin**, bundling both skills and the hosted squirrelscan MCP server.

## Prerequisites

All skills drive the **squirrel CLI**, which must be installed and in PATH.

**Install:** [squirrelscan.com/download](https://squirrelscan.com/download)

**Verify:**
```bash
squirrel --version
```

## Installing

Pick the path for your tool:

| Tool | Install |
|------|---------|
| Any agent (Agent Skills standard) | `npx skills add squirrelscan/skills` |
| Claude Code | `/plugin marketplace add squirrelscan/skills` then `/plugin install squirrelscan@squirrelscan` |
| Cursor | `npx skills add squirrelscan/skills`, or the plugin / MCP deeplink below |
| OpenAI Codex | `npx skills add squirrelscan/skills` (lands in `.agents/skills/`) |
| squirrel CLI | `squirrel skills install` |
| Manual | clone + symlink `skills/*` into your agent's skills dir |

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

One step installs both skills and connects the hosted squirrelscan MCP server. Updates ship automatically with new commits to this repo.

### Cursor

Three options, lightest to fullest:

1. **Skills**: `npx skills add squirrelscan/skills`. Cursor reads Agent Skills from `.cursor/skills/`, `.agents/skills/`, and their `~/` equivalents (it also picks up `~/.claude/skills/`).
2. **MCP only, one click**: [Add squirrelscan MCP to Cursor](cursor://anysphere.cursor-deeplink/mcp/install?name=squirrelscan&config=eyJ1cmwiOiJodHRwczovL21jcC5zcXVpcnJlbHNjYW4uY29tL21jcCJ9)
3. **Plugin**: this repo is also a Cursor plugin (`.cursor-plugin/`) bundling both skills and the MCP server, for install via the Cursor Marketplace.

### OpenAI Codex

Codex reads skills from `.agents/skills/` (project) or `~/.agents/skills/` (global). `npx skills add squirrelscan/skills` installs there, or clone and symlink the `skills/*` directories.

### From the squirrel CLI

```bash
squirrel skills install
squirrel skills update
```

### Manual

```bash
git clone https://github.com/squirrelscan/skills.git
```

Then copy or symlink `skills/squirrelscan` and `skills/audit-website` into your agent's skills directory (`make link` does this for Claude Code and `.agents/skills` consumers).

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

Contributions are welcome! To suggest new skills or improvements:

1. Open an issue to discuss your idea
2. Fork this repository
3. Create a feature branch
4. Submit a pull request

All skills follow the [Agent Skills Standard](https://agentskills.io/specification).

## License

MIT License — See [LICENSE](LICENSE) file for details.

---

**Learn more:** [docs.squirrelscan.com](https://docs.squirrelscan.com) | [squirrelscan.com](https://squirrelscan.com)
