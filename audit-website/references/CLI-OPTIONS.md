# CLI Options Reference

## Audit Command Options

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

## Coverage Modes

| Mode | Default Pages | Behavior | Use Case |
|------|---------------|----------|----------|
| `quick` | 25 | Seed + sitemaps only, no link discovery | CI checks, fast health check |
| `surface` | 100 | One sample per URL pattern | General audits (default) |
| `full` | 500 | Crawl everything up to limit | Deep analysis |

Surface mode detects URL patterns like `/blog/{slug}` or `/products/{id}` and crawls one sample per pattern.

```bash
# Quick health check
squirrel audit https://example.com -C quick --format llm

# Default surface audit
squirrel audit https://example.com --format llm

# Full comprehensive audit
squirrel audit https://example.com -C full --format llm

# Override page limit
squirrel audit https://example.com -C surface -m 200 --format llm
```

## Report Command Options

| Option | Alias | Description |
|--------|-------|-------------|
| `--list` | `-l` | List recent audits |
| `--severity <level>` | - | Filter by severity: error, warning, all |
| `--category <cats>` | - | Filter by categories (comma-separated) |
| `--format <fmt>` | `-f <fmt>` | Output format: console, text, json, html, markdown, xml, llm |
| `--output <path>` | `-o <path>` | Output file path |
| `--input <path>` | `-i <path>` | Load from JSON file (fallback mode) |

## Config Subcommands

| Command | Description |
|---------|-------------|
| `config show` | Show current config |
| `config set <key> <value>` | Set config value |
| `config path` | Show config file path |
| `config validate` | Validate config file |

## Other Commands

| Command | Description |
|---------|-------------|
| `squirrel feedback` | Send feedback to squirrelscan team |
| `squirrel skills install` | Install Claude Code skill |
| `squirrel skills update` | Update Claude Code skill |

## Self Commands

| Command | Description |
|---------|-------------|
| `self install` | Bootstrap local installation |
| `self update` | Check and apply updates |
| `self completion` | Generate shell completions |
| `self doctor` | Run health checks |
| `self version` | Show version information |
| `self settings` | Manage CLI settings |
| `self uninstall` | Remove squirrel from the system |
