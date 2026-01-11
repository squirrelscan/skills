# LLM Format Output Reference

> **Status**: This document will be completed after `--format llm` is implemented in the squirrel CLI.

## Overview

The `--format llm` output is optimized for LLM consumption, providing a structured, concise report that agents can easily parse and present to users.

## Format Structure

_To be documented after implementation._

The LLM format will include:

### 1. Summary Section
- Overall health score (0-100)
- Total pages audited
- Issue counts by severity (errors, warnings, passes)
- Key metrics at a glance

### 2. Issues by Category
Grouped audit results by category:
- Core SEO
- Technical SEO
- Content Quality
- Security
- Performance

Each issue includes:
- Rule name and description
- Severity level (error, warning, info)
- Affected URLs
- Recommended action

### 3. Broken Links
List of broken links with:
- Source page URL
- Target URL
- Error type (404, timeout, etc.)

### 4. Recommendations
Prioritized action items based on issue severity and impact.

## Example Output

_Example output will be added after `--format llm` is implemented._

## Differences from Other Formats

| Format | Purpose | Best For |
|--------|---------|----------|
| `console` | Human-readable terminal output | Interactive CLI use |
| `text` | Plain text, no colors | Piping, scripting |
| `json` | Full structured data | Programmatic access, storage |
| `html` | Interactive web report | Sharing, presentations |
| `llm` | LLM-optimized summary | AI agent consumption |

The LLM format balances detail with conciseness, optimized for:
- Quick parsing by LLMs
- Natural language presentation
- Actionable insights
- Token efficiency

## Implementation Notes

The LLM format is designed to:
1. Reduce token usage compared to full JSON
2. Highlight critical issues first
3. Provide context for each issue
4. Be easy to explain to non-technical users
5. Support follow-up questions from agents

---

**TODO**: Update this document with actual format specification and examples once `--format llm` is implemented.
