---
name: launch-checklist
description: "Run a pre-launch pass for a new site, redesign, or migration using squirrelscan audit rules via the squirrel CLI or hosted squirrelscan MCP server in Claude Code, Codex, Cursor, and other coding agents. It runs one full baseline audit, then works through security, indexing, link, accessibility, performance, and header checks in launch order, ending with a go or no-go list. Use when asked \"is my site ready to launch\", \"run a pre-launch website check\", or \"audit my migration before cutover\"."
license: See LICENSE file in repository root
compatibility: Requires the squirrel CLI installed and accessible in PATH, or the hosted squirrelscan MCP server connected
metadata:
  author: squirrelscan
  version: "0.1.0"
allowed-tools: Bash(squirrel:*) Read Edit Grep Glob
---

# Launch Checklist

A pre-launch pass for a new site, a redesign or a migration. It runs one baseline audit, then calls the topic skills in the order that matters for a launch, and ends with a go or no-go list.

Run it on the staging or pre-production URL first, and again on the live URL after DNS and deploy. Everything it can check is deterministic; it cannot judge copy, design or legal compliance.

## Before the first audit

Run `squirrel --version`. If it fails, install the CLI from [squirrelscan.com/download](https://squirrelscan.com/download) (the `squirrelscan` skill has `references/install.md`). Then run `squirrel auth status`:

- **Signed out, or `--offline`**: the audit runs on this machine, is free, and nothing is published.
- **Signed in**: the audit is billed in credits (50 plus 2 per audited page, plus 1 per distinct external link the cloud verifies), adds the site to the user's dashboard, can turn on recurring audits and publishes an unlisted report. Tell the user the cost (`squirrel credits`) and get a yes. Offer `--offline` or `--no-publish`. For a site the user does not own, add `--ephemeral`: nothing is added to the dashboard, scheduled or published.

Every flag below is checked against the squirrel CLI docs (https://docs.squirrelscan.com/cli/audit). Rule docs: `https://docs.squirrelscan.com/rules/{category}/{rule_id}`.

## 1. Baseline

```bash
squirrel audit https://staging.example.com --level full --format json -o launch-baseline.json
```

Read the score, the error-severity findings and the `Not checked:` line. If the audit exits `3`, `4` or `5` nothing was audited: fix access or the URL first.

## 2. Blockers (no-go until clear)

| Area | Check | Skill |
|------|-------|-------|
| Compromise and leaks | `integrity/*` findings, `security/leaked-secrets`, exposed files and endpoints (`security-audit`) | `security-audit`, `supabase-security-audit` for Supabase |
| HTTPS | `security/https`, `security/http-to-https`, `security/tls-certificate`, `security/mixed-content` | `security-audit` |
| Indexing | A staging `noindex` or a `Disallow: /` robots.txt must be gone on the live site (`core/robots-meta`, `crawl/robots-txt`); canonicals point at the live host (`core/canonical`); sitemap exists and lists live URLs (`crawl/sitemap-exists`, `crawl/sitemap-domain`) | `seo-audit` |
| Broken links | Broken internal links, old-URL redirects after a migration (`links/broken-links`, `links/redirect-chains`) | `broken-link-checker` |
| Errors | `crawl/server-errors`, `crawl/custom-404`, `reliability/js-errors`, `reliability/broken-forms` | `audit-website` |

Do not remove `noindex` from staging itself: remove it only in the production build, and check it on the live URL after launch.

## 3. Should fix before launch

- Titles, descriptions, headings, Open Graph (`seo-audit`).
- Image alt text, labels, contrast, keyboard basics (`accessibility-audit`; run `--wcag-level AA`).
- Largest image, scripts, compression and caching (`performance-audit`).
- Security headers (`security-headers`).
- Structured data for the Organization and main page types (`structured-data-audit`).
- `robots.txt` bot policy decided by the owner (`agent-experience-audit`).

## 4. Human checks (the tool cannot do these)

Forms work end to end; analytics and consent are wired; the 404 page and error states; legal pages and cookie notice match the real data use; redirects from the old domain or URLs; email sending domain; the sitemap submitted in Search Console after launch.

## 5. Go / no-go

Write a table the user can read: each blocker row as clear, not clear or not checked (with why), the before and after score, and what was deferred. "Not checked" is not "clear".

## 6. After launch

Re-audit the live URL with `--refresh` (never trust a cached crawl), compare with the baseline (`squirrel report --diff <baseline-audit-id>`), and add `website-ci-gate` so the launch quality holds.

## Stop condition

Stop when every blocker row is clear on the live URL, or the user has accepted each open item in writing in the go/no-go table.

## Hand off

For fixing, use the topic skill named in each row, or `audit-website` for the general loop.
