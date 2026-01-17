---
name: audit-website
description: Audit websites for SEO, technical, content, and security issues using squirrelscan CLI. Returns LLM-optimized reports with health scores, broken links, meta tag analysis, and actionable recommendations. Use when analyzing websites, debugging SEO issues, or checking site health.
license: See LICENSE file in repository root
compatibility: Requires squirrel CLI installed and accessible in PATH
metadata:
  author: squirrelscan
  version: "1.0"
allowed-tools: Bash(squirrel:*)
---

# Website Audit Skill

Audit websites for SEO, technical, content, and security issues using the squirrelscan CLI.

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

## What This Skill Does

This skill enables AI agents to audit websites for:
- **SEO issues**: Meta tags, titles, descriptions, canonical URLs, Open Graph tags
- **Technical problems**: Broken links, redirect chains, page speed, mobile-friendliness
- **Content quality**: Heading structure, image alt text, content analysis
- **Security**: HTTPS usage, security headers, mixed content

The audit crawls the website, analyzes each page against audit rules, and returns a comprehensive report with:
- Overall health score (0-100)
- Category breakdowns (core SEO, technical SEO, content, security)
- Specific issues with affected URLs
- Broken link detection
- Actionable recommendations

## When to Use

Use this skill when you need to:
- Analyze a website's SEO health
- Debug technical SEO issues
- Check for broken links
- Validate meta tags and structured data
- Generate site audit reports
- Compare site health before/after changes

## Usage

### Basic Audit

Audit a website with default settings (up to 500 pages):

```bash
squirrel audit https://example.com --format llm
```

### Advanced Options

Audit more pages:

```bash
squirrel audit https://example.com --format llm --maxPages 200
```

Force fresh crawl (ignore cache):

```bash
squirrel audit https://example.com --format llm --refresh
```

Resume interrupted crawl:

```bash
squirrel audit https://example.com --format llm --resume
```

Verbose output for debugging:

```bash
squirrel audit https://example.com --format llm --verbose
```

## Common Options

| Option | Alias | Description | Default |
|--------|-------|-------------|---------|
| `--format llm` | `-f llm` | Output format optimized for LLMs | Required for this skill |
| `--maxPages <n>` | `-m <n>` | Maximum pages to crawl (max 500) | 50 |
| `--refresh` | `-r` | Ignore cache, fetch all pages fresh | false |
| `--resume` | - | Resume interrupted crawl | false |
| `--verbose` | `-v` | Verbose output | false |
| `--debug` | - | Debug logging | false |

## Output Format

The `--format llm` option returns a report optimized for LLM consumption. The output includes:

- **Summary**: Overall health score and key metrics
- **Issues by Category**: Grouped by audit rule category (core SEO, technical, content, security)
- **Broken Links**: List of broken external and internal links
- **Recommendations**: Prioritized action items

See [OUTPUT-FORMAT.md](references/OUTPUT-FORMAT.md) for detailed format specification.

## Examples

### Example 1: Quick Site Audit

```bash
# User asks: "Check squirrelscan.com for SEO issues"
squirrel audit https://squirrelscan.com --format llm
```

### Example 2: Deep Audit for Large Site

```bash
# User asks: "Do a thorough audit of my blog with up to 500 pages"
squirrel audit https://myblog.com --format llm --maxPages 500
```

### Example 3: Fresh Audit After Changes

```bash
# User asks: "Re-audit the site and ignore cached results"
squirrel audit https://example.com --format llm --refresh
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
