---
name: audit-website
description: Audit websites for SEO, performance, security, technical, content, and 15 other issue categories with 230+ rules using the squirrelscan CLI. Returns LLM-optimized reports with health scores, broken links, meta tag analysis, and actionable recommendations. Use to discover and assess website or webapp issues and health.
license: See LICENSE file in repository root
compatibility: Requires squirrel CLI installed and accessible in PATH
metadata:
  author: squirrelscan
  version: "1.22"
allowed-tools: Bash(squirrel:*) Read Edit Grep Glob
---

# Website Audit Skill

Audits websites for 230+ rules across 21 categories (SEO, technical, performance, content, security, accessibility, links, mobile, schema, and more) using the `squirrel` CLI. Returns health scores (0-100), issues grouped by severity with fix recommendations, and broken link detection.

Rule docs: `https://docs.squirrelscan.com/rules/{rule_category}/{rule_id}`
Website: [squirrelscan.com](https://squirrelscan.com) | Docs: [docs.squirrelscan.com](https://docs.squirrelscan.com)

## When to Use

Use when auditing website health, debugging SEO/technical issues, detecting broken links, or comparing site health before/after changes.

## Prerequisites

This skill requires the squirrel CLI installed and in PATH.

**Install:** [squirrelscan.com/download](https://squirrelscan.com/download)

**Verify:**
```bash
squirrel --version
```

## Setup

Run `squirrel init` to create a `squirrel.toml` config in the current directory. If none exists, create one and specify a project name:

```bash
squirrel init -n my-project
# overwrite existing config
squirrel init -n my-project --force
```

## Usage

### Intro

There are three processes that you can run and they're all cached in the local project database:

- crawl - subcommand to run a crawl or refresh, continue a crawl
- analyze - subcommand to analyze the crawl results
- report - subcommand to generate a report in desired format (llm, text, console, html etc.)

the 'audit' command is a wrapper around these three processes and runs them sequentially:

```bash
squirrel audit https://example.com --format llm
```

Always use `--format llm` for token-efficient output.

**Recommended scan strategy:**
1. First scan: surface coverage (`-C surface`) for a quick overview
2. Second scan: full coverage (`-C full`) for deep analysis

Prefer auditing live websites for accurate performance and rendering data. Fixes from a live audit can be applied against local code. After applying fixes, verify the project still builds and passes existing checks. Use subagents to parallelize independent fixes.

### Workflow

1. **Run audit** → 2. **Present results** → 3. **Propose fixes** (get user confirmation) → 4. **Apply fixes** (parallelize with subagents) → 5. **Re-audit** → 6. **Show before/after** → repeat until score reaches 95+ or only human-judgment issues remain

```bash
# Single-step audit with LLM output
squirrel audit https://example.com --format llm

# Two-step: audit then export
squirrel audit https://example.com
squirrel report <audit-id> --format llm

# Regression diffs between audits
squirrel report --diff <audit-id> --format llm
squirrel report --regression-since example.com --format llm
```

**Fix strategy:** Confirm fixes with user before applying. Parallelize independent content fixes (alt text, headings, descriptions) using subagents (3-5 files per agent). Flag broken links and structural changes for user review. A site is complete when score exceeds 95 (Grade A) with `--coverage full`.

See [AUDIT-REFERENCE.md](references/AUDIT-REFERENCE.md) for score targets, issue categories, and fix approach details.

## Key Options

| Option | Description |
|--------|-------------|
| `--format llm` | LLM-optimized output (preferred) |
| `-C quick/surface/full` | Coverage: quick (25 pages), surface (100, default), full (500) |
| `--max-pages <n>` | Override page limit (max 5000) |
| `--refresh` | Ignore cache, fetch fresh |
| `--resume` | Resume interrupted crawl |
| `--verbose` | Verbose output for debugging |

Surface mode samples one page per URL pattern (e.g., `/blog/{slug}`). Use `quick` for CI, `surface` for general audits, `full` for deep analysis.

Always prefer `--format llm` — it returns a compact XML/text hybrid optimized for token efficiency. See [OUTPUT-FORMAT.md](references/OUTPUT-FORMAT.md) for format details.

See [CLI-OPTIONS.md](references/CLI-OPTIONS.md) for full option reference including report, config, and self commands.

## Examples

### Example 1: Quick Site Audit with LLM Output

```bash
# User asks: "Check squirrelscan.com for SEO issues"
squirrel audit https://squirrelscan.com --format llm
```

### Example 2: Deep Audit for Large Site

```bash
# User asks: "Do a thorough audit of my blog with up to 500 pages"
squirrel audit https://myblog.com --max-pages 500 --format llm
```

### Example 3: Fresh Audit After Changes

```bash
# User asks: "Re-audit the site and ignore cached results"
squirrel audit https://example.com --refresh --format llm
```

### Example 4: Two-Step Workflow (Reuse Previous Audit)

```bash
# First run an audit
squirrel audit https://example.com
# Note the audit ID from output (e.g., "a1b2c3d4")

# Later, export in different format
squirrel report a1b2c3d4 --format llm
```

## Output

On completion give the user a summary of all of the changes you made.

## Troubleshooting

### squirrel command not found

If you see this error, squirrel is not installed or not in your PATH.

**Solution:**
1. Install squirrel: [squirrelscan.com/download](https://squirrelscan.com/download)
2. Ensure `~/.local/bin` is in PATH
3. Verify: `squirrel --version`

### Permission denied

If squirrel is not executable, ensure the binary has execute permissions. Reinstalling from [squirrelscan.com/download](https://squirrelscan.com/download) will fix this.

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

## Additional Resources

- [OUTPUT-FORMAT.md](references/OUTPUT-FORMAT.md) — LLM format specification
- [CLI-OPTIONS.md](references/CLI-OPTIONS.md) — Full CLI option reference
- [docs.squirrelscan.com](https://docs.squirrelscan.com) — Documentation
- `squirrel audit --help` — CLI help
