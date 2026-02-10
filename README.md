![squirrelscan](https://mintcdn.com/squirrelscan/CCMTmLbI4xfnpJbQ/logo/light.svg?fit=max&auto=format&n=CCMTmLbI4xfnpJbQ&q=85&s=1303484a4ea3c154c29dd5f6245e55cd)

# squirrelscan Skills

**CLI Website Audits for Humans, Agents & LLMs**

## What is squirrelscan?

[squirrelscan](https://squirrelscan.com) is a comprehensive website audit tool designed for developers, SEO professionals, and AI coding assistants. Built specifically to integrate seamlessly into modern development workflows and AI-assisted coding environments.

**Features:**

- 200+ audit rules across SEO, performance, accessibility, content, and security
- Leaked secrets detection (96 patterns: OpenAI, Anthropic, AWS, Stripe, and more)
- Multiple output formats: console, text, json, markdown, llm, html
- Designed for both human developers and AI agents
- Optimized for CI/CD pipelines and automation
- LLM-native output for AI-assisted debugging and optimization

Whether you're debugging SEO issues, validating site health, or enabling your AI assistant to autonomously fix website problems, squirrelscan fits into your workflow.

## Prerequisites

These skills require the **squirrel CLI** to be installed and accessible in your PATH.

**Install:** [squirrelscan.com/download](https://squirrelscan.com/download)

**Verify:**
```bash
squirrel --version
```

## Installing Skills

### Using Claude Code / Cowork

```bash
/plugin install squirrelscan/skills
```

### Using OpenAI Codex

Reference the `agents/openai.yaml` config from your skills setup.

### Using npx

```bash
npx skills add squirrelscan/skills
```

This will install all squirrelscan skills for your AI coding assistant.

### Manual Installation

Clone this repository to your skills directory:

```bash
git clone https://github.com/squirrelscan/skills.git ~/.skills/squirrelscan
```

Refer to your AI tool's documentation for skills directory configuration.

## Available Skills

### audit-website

Audit websites for SEO, technical, content, and security issues using squirrelscan CLI. Returns LLM-optimized reports with health scores, broken links, meta tag analysis, and actionable recommendations.

**Use when:** Analyzing websites, debugging SEO issues, checking site health, validating meta tags, finding broken links.

[View skill documentation →](audit-website/SKILL.md)

## Example Usage

Once installed, you can prompt your AI assistant to use squirrelscan skills:

### Basic Site Audit
```
Audit this website using the audit-website skill and make changes to fix all errors and warnings
```

### Targeted Analysis
```
Run an audit on example.com and show me the top 5 critical issues
```

### Automated Fixes
```
Audit my site and fix all broken links
```

### Post-Deployment Validation
```
Check squirrelscan.com for SEO issues after deployment
```

Your AI assistant will automatically use the squirrel CLI through the installed skills to perform audits and suggest or implement fixes.

## Contributing

Contributions are welcome! To suggest new skills or improvements:

1. Open an issue to discuss your idea
2. Fork this repository
3. Create a feature branch
4. Submit a pull request

All skills must follow the [Agent Skills Standard](https://agentskills.io/specification).

## License

MIT License — See [LICENSE](../LICENSE) file for details.

---

**Learn more:** [docs.squirrelscan.com](https://docs.squirrelscan.com) | [squirrelscan.com](https://squirrelscan.com)

## Compatible Agents

These skills work with:

- [Claude Code](https://claude.ai/code) - Anthropic's official CLI
- [AdaL](https://sylph.ai/adal) - Self-evolving AI coding agent with MCP support

