---
name: audit-website
description: Audit websites for SEO, technical, content, and security issues using squirrelscan CLI. Returns LLM-optimized reports with health scores, broken links, meta tag analysis, and actionable recommendations. Use when analyzing websites, debugging SEO issues, or checking site health.
license: See LICENSE file in repository root
compatibility: Requires squirrel CLI installed and accessible in PATH
metadata:
  author: squirrelscan
  version: "1.4"
allowed-tools: Bash(squirrel:*)
---

# Website Audit Skill

Audit websites for SEO, technical, content, performance and security issues using the squirrelscan cli.

squirrelscan provides a cli tool squirrel - available for macos, windows and linux. It carries out extensive website auditing
by emulating a browser, search crawler, and analyzing the website's structure and content against over 140+ rules.

It will provide you a list of issues as well as suggestions on how to fix them.

## Links 

* squirrelscan website is at [https://squirrelscan.com](https://squirrelscan.com)
* documentation (including rule references) are at [docs.squirrelscan.com](https://docs.squirrelscan.com)

You can look up the docs for any rule with this template:

https://docs.squirrelscan.com/rules/{rule_category}/{rule_id}

example:

https://docs.squirrelscan.com/rules/links/external-links

## What This Skill Does

This skill enables AI agents to audit websites for over 140 rules in 20 categories, including:

- **SEO issues**: Meta tags, titles, descriptions, canonical URLs, Open Graph tags
- **Technical problems**: Broken links, redirect chains, page speed, mobile-friendliness
- **Performance**: Page load time, resource usage, caching
- **Content quality**: Heading structure, image alt text, content analysis
- **Security**: HTTPS usage, security headers, mixed content
- **Accessibility**: Alt text, color contrast, keyboard navigation
- **Usability**: Form validation, error handling, user flow
- **Links**: Checks for broken internal and external links
- **E-E-A-T**: Expertise, Experience, Authority, Trustworthiness
- **User Experience**: User flow, error handling, form validation
- **Mobile**: Checks for mobile-friendliness, responsive design, touch-friendly elements
- **Crawlability**: Checks for crawlability, robots.txt, sitemap.xml and more
- **Schema**: Schema.org markup, structured data, rich snippets
- **Legal**: Compliance with legal requirements, privacy policies, terms of service
- **Social**: Open graph, twitter cards and validating schemas, snippets etc.
- **Url Structure**: Length, hypehns, keywords
- **Keywords**: Keyword stuffing 
- **Content**: Content structure, headings
- **Images**: Alt text, color contrast, image size, image format
- **Local SEO**: NAP consistency, geo metadata
- **Mobile**: VideoObject schema, accessability

and more!

The audit crawls the website, analyzes each page against audit rules, and returns a comprehensive report with:
- Overall health score (0-100)
- Category breakdowns (core SEO, technical SEO, content, security)
- Specific issues with affected URLs
- Broken link detection
- Actionable recommendations

## When to Use

Use this skill when you need to:
- Analyze a website's health
- Debug technical SEO issues
- Fix all of the issues mentioned above
- Check for broken links
- Validate meta tags and structured data
- Generate site audit reports
- Compare site health before/after changes
- Improve website performance, accessability, SEO, security and more.

## Prerequisites

This skill requires the squirrel CLI to be installed and available in your PATH.

### Installation

If squirrel is not already installed, you can install it using:

```bash
curl -fsSL https://squirrelscan.com/install | bash
```

This will:
- Download the latest release binary
- Install to `~/.local/share/squirrel/releases/{version}/`
- Create a symlink at `~/.local/bin/squirrel`
- Initialize settings at `~/.squirrel/settings.json`

If `~/.local/bin` is not in your PATH, add it to your shell configuration:

```bash
export PATH="$HOME/.local/bin:$PATH"
```

### Verify Installation

Check that squirrel is installed and accessible:

```bash
squirrel --version
```

## Setup

Running `squirrel init` will setup a squirrel.toml file for configuration in the current directory.

Each project should have a squirrel project name for the database - by default this is the name of the 
website you audit - but you can set it yourself so that you can place all audits for a project in one database

You do this either on init with:

```bash
squirrel init --project-name my-project`
```

or config:

```bash
squirrel config set project.name my-project
```

The project name is used to identify the project in the database and is used to generate the database name. 

It is stored in ~/.squirrel/projects/<project-name>

## Usage

### Intro

There are three processes that you can run and they're all cached in the local project database:

- crawl - subcommand to run a crawl or refresh, continue a crawl
- analyze - subcommand to analyze the crawl results
- report - subcommand to generate a report in desired format (llm, text, console, html etc.)

the 'audit' command is a wrapper around these three processes and runs them sequentially:

```bash
squirrel audit https://example.com
```

### Setup

If the user doesn't provide a website to audit - extrapolate the possibilities in the local directory and checking environment variables (ie. linked vercel projects, references in memory or the code). 

If the directory you're running for provides for a method to run or restart a local dev server - run the audit against that.

If you have more than one option on a website to audit that you discover - prompt the user to choose which one to audit.

If there is no website - either local, or on the web to discover to audit, then ask the user which URL they would like to audit.

### Basic Workflow

The audit process is two steps:

1. **Run the audit** (saves to database, shows console output)
2. **Export report** in desired format

```bash
# Step 1: Run audit (default: console output)
squirrel audit https://example.com

# Step 2: Export as LLM format
squirrel report <audit-id> --format llm
```

### Advanced Options

Audit more pages:

```bash
squirrel audit https://example.com --maxPages 200
```

Force fresh crawl (ignore cache):

```bash
squirrel audit https://example.com --refresh
```

Resume interrupted crawl:

```bash
squirrel audit https://example.com --resume
```

Verbose output for debugging:

```bash
squirrel audit https://example.com --verbose
```

## Common Options

### Audit Command Options

| Option | Alias | Description | Default |
|--------|-------|-------------|---------|
| `--maxPages <n>` | `-m <n>` | Maximum pages to crawl (max 500) | 50 |
| `--refresh` | `-r` | Ignore cache, fetch all pages fresh | false |
| `--resume` | - | Resume interrupted crawl | false |
| `--verbose` | `-v` | Verbose output | false |
| `--debug` | - | Debug logging | false |

### Report Command Options

| Option | Alias | Description |
|--------|-------|-------------|
| `--format llm` | `-f llm` | Export in LLM-optimized format |
| `--format xml` | `-f xml` | Export in verbose XML format |
| `--format json` | `-f json` | Export in JSON format |

## Output Formats

### Console Output (default)

The `audit` command shows human-readable console output by default with colored output and progress indicators.

### LLM Format

To get LLM-optimized output, use the `report` command with `--format llm`:

```bash
squirrel report <audit-id> --format llm
```

The LLM format is a compact XML/text hybrid optimized for token efficiency (40% smaller than verbose XML):

- **Summary**: Overall health score and key metrics
- **Issues by Category**: Grouped by audit rule category (core SEO, technical, content, security)
- **Broken Links**: List of broken external and internal links
- **Recommendations**: Prioritized action items with fix suggestions

See [OUTPUT-FORMAT.md](references/OUTPUT-FORMAT.md) for detailed format specification.

## Examples

### Example 1: Quick Site Audit

```bash
# User asks: "Check squirrelscan.com for SEO issues"
squirrel audit https://squirrelscan.com
# Returns audit ID, e.g., "sqrl_abc123"

# Then export in LLM format
squirrel report sqrl_abc123 --format llm
```

### Example 2: Deep Audit for Large Site

```bash
# User asks: "Do a thorough audit of my blog with up to 500 pages"
squirrel audit https://myblog.com --maxPages 500
squirrel report sqrl_xyz789 --format llm
```

### Example 3: Fresh Audit After Changes

```bash
# User asks: "Re-audit the site and ignore cached results"
squirrel audit https://example.com --refresh
squirrel report sqrl_def456 --format llm
```

### Example 4: One-Line Workflow

```bash
# Audit and immediately export in LLM format
AUDIT_ID=$(squirrel audit https://example.com --quiet | tail -1) && squirrel report $AUDIT_ID --format llm
```

## Troubleshooting

### squirrel command not found

If you see this error, squirrel is not installed or not in your PATH.

**Solution:**
1. Install squirrel: `curl -fsSL https://squirrelscan.com/install | bash`
2. Add to PATH: `export PATH="$HOME/.local/bin:$PATH"`
3. Verify: `squirrel --version`

### Permission denied

If squirrel is not executable:

```bash
chmod +x ~/.local/bin/squirrel
```

### Crawl timeout or slow performance

For very large sites, the audit may take several minutes. Use `--verbose` to see progress:

```bash
squirrel audit https://example.com --format llm --verbose
```

### Invalid URL

Ensure the URL includes the protocol (http:// or https://):

```bash
# ✗ Wrong
squirrel audit example.com

# ✓ Correct
squirrel audit https://example.com
```

## How It Works

1. **Crawl**: Discovers and fetches pages starting from the base URL
2. **Analyze**: Runs audit rules on each page
3. **External Links**: Checks external links for availability
4. **Report**: Generates LLM-optimized report with findings

The audit is stored in a local database and can be retrieved later with `squirrel report` commands.

## Additional Resources

- **Output Format Reference**: [OUTPUT-FORMAT.md](references/OUTPUT-FORMAT.md)
- **squirrelscan Documentation**: https://docs.squirrelscan.com
- **CLI Help**: `squirrel audit --help`
