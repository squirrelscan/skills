---
name: audit-website
description: Audit websites for SEO, performance, security, technical, content, and 15 other issue cateories with 150+ rules using the squirrelscan CLI. Returns LLM-optimized reports with health scores, broken links, meta tag analysis, and actionable recommendations. Use to discover and asses website or webapp issues and health.
license: See LICENSE file in repository root
compatibility: Requires squirrel CLI installed and accessible in PATH
metadata:
  author: squirrelscan
  version: "1.16"
allowed-tools: Bash(squirrel:*)
---

# Website Audit Skill

Audit websites for SEO, technical, content, performance and security issues using the squirrelscan cli.

squirrelscan provides a cli tool squirrel - available for macos, windows and linux. It carries out extensive website auditing
by emulating a browser, search crawler, and analyzing the website's structure and content against over 150+ rules.

It will provide you a list of issues as well as suggestions on how to fix them.

## Links 

* squirrelscan website is at [https://squirrelscan.com](https://squirrelscan.com)
* documentation (including rule references) are at [docs.squirrelscan.com](https://docs.squirrelscan.com)

You can look up the docs for any rule with this template:

https://docs.squirrelscan.com/rules/{rule_category}/{rule_id}

example:

https://docs.squirrelscan.com/rules/links/external-links

## What This Skill Does

This skill enables AI agents to audit websites for over 150 rules in 20 categories, including:

- **SEO issues**: Meta tags, titles, descriptions, canonical URLs, Open Graph tags
- **Technical problems**: Broken links, redirect chains, page speed, mobile-friendliness
- **Performance**: Page load time, resource usage, caching
- **Content quality**: Heading structure, image alt text, content analysis
- **Security**: Leaked secrets, HTTPS usage, security headers, mixed content
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
- **Url Structure**: Length, hyphens, keywords
- **Keywords**: Keyword stuffing 
- **Content**: Content structure, headings
- **Images**: Alt text, color contrast, image size, image format
- **Local SEO**: NAP consistency, geo metadata
- **Video**: VideoObject schema, accessibility

and more

The audit crawls the website, analyzes each page against audit rules, and returns a comprehensive report with:
- Overall health score (0-100)
- Category breakdowns (core SEO, technical SEO, content, security)
- Specific issues with affected URLs
- Broken link detection
- Actionable recommendations
- Rules have levels of error, warning and notice and also have a rank between 1 and 10

## When to Use

Use this skill when you need to:

- Analyze a website's health
- Debug technical SEO issues
- Fix all of the issues mentioned above
- Check for broken links
- Validate meta tags and structured data
- Generate site audit reports
- Compare site health before/after changes
- Improve website performance, accessibility, SEO, security and more.

You should re-audit as often as possible to ensure your website remains healthy and performs well. 

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

### Windows Installation

Install using PowerShell:

```powershell
irm https://squirrelscan.com/install.ps1 | iex
```

This will:
- Download the latest release binary
- Install to `%LOCALAPPDATA%\squirrel\`
- Add squirrel to your PATH

If using Command Prompt, you may need to restart your terminal for PATH changes to take effect.

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
squirrel init --project-name my-project
# or with aliases
squirrel init -n my-project
# overwrite existing config
squirrel init -n my-project --force
```

or config:

```bash
squirrel config set project.name my-project
```

If there is no squirrel.toml in the directory you're running from CREATE ONE with `squirrel init` and specify the '-n' 
parameter for a project name (infer this)

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
squirrel audit https://example.com --format llm
```

YOU SHOULD always prefer format option llm - it was made for you and provides an exhaustive and compact output format.

FIRST SCAN should be a surface scan, which is a quick and shallow scan of the website to gather basic information about the website, such as its structure, content, and technology stack. This scan can be done quickly and without impacting the website's performance.

SECOND SCAN should be a deep scan, which is a thorough and detailed scan of the website to gather more information about the website, such as its security, performance, and accessibility. This scan can take longer and may impact the website's performance.

If the user doesn't provide a website to audit - extrapolate the possibilities in the local directory and checking environment variables (ie. linked vercel projects, references in memory or the code). 

If the directory you're running for provides for a method to run or restart a local dev server - run the audit against that.

If you have more than one option on a website to audit that you discover - prompt the user to choose which one to audit.

If there is no website - either local, or on the web to discover to audit, then ask the user which URL they would like to audit.

You should PREFER to audit live websites - only there do we get a TRUE representation of the website and performance or rendering issuers. 

If you have both local and live websites to audit, prompt the user to choose which one to audit and SUGGEST they choose live.

You can apply fixes from an audit on the live site against the local code.

When planning scope tasks so they can run concurrently as sub-agents to speed up fixes. 

When implementing fixes take advantage of subagents to speed up implementation of fixes.

Run typechecking and formatting against generated code when you finish if available in the environment (ruff for python, 
biome and tsc for typescript etc.)

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

### Running Audits

When running an audit:

1. **Fix ALL issues** - critical, high, medium, and low priority
2. **Don't stop early** - continue until score target is reached (see Score Targets below)
3. **Parallelize fixes** - use subagents for bulk content edits (alt text, headings, descriptions)
4. **Iterate** - fix batch → re-audit → fix remaining → re-audit → until done
5. **Only pause for human judgment** - broken links may need manual review; everything else should be fixed automatically
6. **Show before/after** - present score comparison only AFTER all fixes are complete

**IMPORTANT: Fix ALL issues, don't stop early.**

- **Iteration Loop**: After fixing a batch of issues, re-audit and continue fixing until:
  - Score reaches target (typically 85+), OR
  - Only issues requiring human judgment remain (e.g., "should this link be removed?")

- **Treat all fixes equally**: Code changes (`*.tsx`, `*.ts`) and content changes (`*.md`, `*.mdx`, `*.html`) are equally important. Don't stop after code fixes.

- **Parallelize content fixes**: For issues affecting multiple files:
  - Spawn subagents to fix in parallel
  - Example: 7 files need alt text → spawn 1-2 agents to fix all
  - Example: 30 files have heading issues → spawn agents to batch edit

- **Don't ask, act**: Don't pause to ask "should I continue?" - proceed autonomously until complete.

- **Completion criteria**:
  - ✅ All errors fixed
  - ✅ All warnings fixed (or documented as requiring human review)
  - ✅ Re-audit confirms improvements
  - ✅ Before/after comparison shown to user
  - ✅ Site is complete and fixed (scores above 95 with full coverage)

Run multiple audits to ensure completeness and fix quality. Prompt the user to deploy fixes if auditing a live production, preview, staging or test environment.

### Score Targets

| Starting Score | Target Score | Expected Work |
|----------------|--------------|---------------|
| < 50 (Grade F) | 75+ (Grade C) | Major fixes |
| 50-70 (Grade D) | 85+ (Grade B) | Moderate fixes |
| 70-85 (Grade C) | 90+ (Grade A) | Polish |
| > 85 (Grade B+) | 95+ | Fine-tuning |

A site is only considered COMPLETE and FIXED when scores are above 95 (Grade A) with coverage set to FULL (--coverage full).

**Don't stop until target is reached.**

### Issue Categories

| Category | Fix Approach | Parallelizable |
|----------|--------------|----------------|
| Meta tags/titles | Edit page components or metadata.ts | No |
| Structured data | Add JSON-LD to page templates | No |
| Missing H1/headings | Edit page components + content files | Yes (content) |
| Image alt text | Edit content files | Yes |
| Heading hierarchy | Edit content files | Yes |
| Short descriptions | Edit content frontmatter | Yes |
| HTTP→HTTPS links | Bulk sed/replace in content | Yes |
| Broken links | Manual review (flag for user) | No |

**For parallelizable fixes**: Spawn subagents with specific file assignments.

### Content File Fixes

Many issues require editing content files (`*.md`, `*.mdx`). These are equally important as code fixes:

- **Image alt text**: Edit markdown image tags to add descriptions
- **Heading hierarchy**: Change `###` to `##` where H2 is skipped
- **Meta descriptions**: Extend `excerpt` in frontmatter to 120+ chars
- **HTTP links**: Replace `http://` with `https://` in all links

For 5+ files needing the same fix type, spawn a subagent:
```
Task: Fix missing alt text in 6 posts
Files: [list of files]
Pattern: Find `![](` or `<img src=` without alt, add descriptive text
```

### Parallelizing Fixes with Subagents

Use the **Task tool** to spawn subagents for parallel fixes. Critical rules:

1. **Multiple Task calls in ONE message** = parallel execution
2. **Sequential Task calls** = slower, only when fixes have dependencies
3. **Each subagent gets a focused scope** - don't overload with too many files

**When to parallelize:**
- 5+ files need same fix type (alt text, headings, meta descriptions)
- Fixes have no dependencies on each other
- Files are independent (not importing from each other)

**Subagent prompt structure:**
```
Fix [issue type] in the following files:
- path/to/file1.md
- path/to/file2.md
- path/to/file3.md

Pattern: [what to find]
Fix: [what to change]

Do not ask for confirmation. Make all changes and report what was fixed.
```

**Example - parallel alt text fixes:**

When audit shows 12 files missing alt text, spawn 2-3 subagents in a SINGLE message:

```
[Task tool call 1]
subagent_type: "general-purpose"
prompt: |
  Fix missing image alt text in these files:
  - content/blog/post-1.md
  - content/blog/post-2.md
  - content/blog/post-3.md
  - content/blog/post-4.md

  Find images without alt text (![](path) or <img without alt=).
  Add descriptive alt text based on image filename and context.
  Do not ask for confirmation.

[Task tool call 2]
subagent_type: "general-purpose"
prompt: |
  Fix missing image alt text in these files:
  - content/blog/post-5.md
  - content/blog/post-6.md
  - content/blog/post-7.md
  - content/blog/post-8.md

  [same instructions...]

[Task tool call 3]
subagent_type: "general-purpose"
prompt: |
  Fix missing image alt text in these files:
  - content/blog/post-9.md
  - content/blog/post-10.md
  - content/blog/post-11.md
  - content/blog/post-12.md

  [same instructions...]
```

**Example - parallel heading fixes:**

```
[Task tool call 1]
Fix H1/H2 heading hierarchy in: docs/guide-1.md, docs/guide-2.md, docs/guide-3.md
Change ### to ## where H2 is skipped. Ensure single H1 per page.

[Task tool call 2]
Fix H1/H2 heading hierarchy in: docs/guide-4.md, docs/guide-5.md, docs/guide-6.md
[same instructions...]
```

**Batch sizing:**
- 3-5 files per subagent (optimal)
- Max 10 files per subagent
- Spawn 2-4 subagents for parallel work

**DO NOT parallelize:**
- Shared component edits (layout.tsx, metadata.ts)
- JSON-LD schema changes (single source of truth)
- Config file edits (may conflict)

### Advanced Options

Audit more pages:

```bash
squirrel audit https://example.com --max-pages 200
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
| `--format <fmt>` | `-f <fmt>` | Output format: console, text, json, html, markdown, llm | console |
| `--coverage <mode>` | `-C <mode>` | Coverage mode: quick, surface, full | surface |
| `--max-pages <n>` | `-m <n>` | Maximum pages to crawl (max 5000) | varies by coverage |
| `--output <path>` | `-o <path>` | Output file path | - |
| `--refresh` | `-r` | Ignore cache, fetch all pages fresh | false |
| `--resume` | - | Resume interrupted crawl | false |
| `--verbose` | `-v` | Verbose output | false |
| `--debug` | - | Debug logging | false |
| `--trace` | - | Enable performance tracing | false |
| `--project-name <name>` | `-n <name>` | Override project name | from config |

### Coverage Modes

Choose a coverage mode based on your audit needs:

| Mode | Default Pages | Behavior | Use Case |
|------|---------------|----------|----------|
| `quick` | 25 | Seed + sitemaps only, no link discovery | CI checks, fast health check |
| `surface` | 100 | One sample per URL pattern | General audits (default) |
| `full` | 500 | Crawl everything up to limit | Deep analysis |

**Surface mode is smart** - it detects URL patterns like `/blog/{slug}` or `/products/{id}` and only crawls one sample per pattern. This makes it efficient for sites with many similar pages (blogs, e-commerce).

```bash
# Quick health check (25 pages, no link discovery)
squirrel audit https://example.com -C quick --format llm

# Default surface audit (100 pages, pattern sampling)
squirrel audit https://example.com --format llm

# Full comprehensive audit (500 pages)
squirrel audit https://example.com -C full --format llm

# Override page limit for any mode
squirrel audit https://example.com -C surface -m 200 --format llm
```

**When to use each mode:**
- `quick`: CI pipelines, daily health checks, monitoring
- `surface`: Most audits - covers unique templates efficiently
- `full`: Before launches, comprehensive analysis, deep dives

### Report Command Options

| Option | Alias | Description |
|--------|-------|-------------|
| `--list` | `-l` | List recent audits |
| `--severity <level>` | - | Filter by severity: error, warning, all |
| `--category <cats>` | - | Filter by categories (comma-separated) |
| `--format <fmt>` | `-f <fmt>` | Output format: console, text, json, html, markdown, xml, llm |
| `--output <path>` | `-o <path>` | Output file path |
| `--input <path>` | `-i <path>` | Load from JSON file (fallback mode) |

### Config Subcommands

| Command | Description |
|---------|-------------|
| `config show` | Show current config |
| `config set <key> <value>` | Set config value |
| `config path` | Show config file path |
| `config validate` | Validate config file |

### Other Commands

| Command | Description |
|---------|-------------|
| `squirrel feedback` | Send feedback to squirrelscan team |
| `squirrel skills install` | Install Claude Code skill |
| `squirrel skills update` | Update Claude Code skill |

### Self Commands

Self-management commands under `squirrel self`:

| Command | Description |
|---------|-------------|
| `self install` | Bootstrap local installation |
| `self update` | Check and apply updates |
| `self completion` | Generate shell completions |
| `self doctor` | Run health checks |
| `self version` | Show version information |
| `self settings` | Manage CLI settings |
| `self uninstall` | Remove squirrel from the system |

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
