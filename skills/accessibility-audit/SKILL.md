---
name: accessibility-audit
description: "Audit a site with squirrelscan's accessibility audit rules via the squirrel CLI or hosted squirrelscan MCP server in Claude Code, Codex, Cursor, and other coding agents, checking accessible names, labels, ARIA, headings, landmarks, contrast, language, zoom, and target sizes. It supports an optional WCAG level filter and checklist, fixes issues by component and template, and says plainly that automated checks cover only part of WCAG and what a person must still check. Use when asked \"check my site's accessibility\" or \"run a WCAG audit\"."
license: See LICENSE file in repository root
compatibility: Requires the squirrel CLI installed and accessible in PATH, or the hosted squirrelscan MCP server connected
metadata:
  author: squirrelscan
  version: "0.1.2"
allowed-tools: Bash(squirrel:*) Read Edit Grep Glob
---

# Accessibility Audit

Find the accessibility problems a crawler can see (names, labels, ARIA, headings, landmarks, contrast, language, zoom, targets), fix them in templates and components, and be clear about what only a person can check.

squirrelscan's accessibility rules are hand-written checks that read each page's markup. They are not an axe-core run and they cover part of WCAG. A page with no findings has not been shown to conform: alt text quality, captions, keyboard flow, focus order and screen reader behaviour need a person.

## Before the first audit

Run `squirrel --version`. If it fails, install the CLI from [squirrelscan.com/download](https://squirrelscan.com/download) (the `squirrelscan` skill has `references/install.md`). Then run `squirrel auth status`:

- **Signed out, or `--offline`**: the audit runs on this machine, is free, and nothing is published.
- **Signed in**: the audit is billed in credits (50 plus 2 per audited page, plus 1 per distinct external link the cloud verifies), adds the site to the user's dashboard, can turn on recurring audits and publishes an unlisted report. Tell the user the cost (`squirrel credits`) and get a yes. Offer `--offline` or `--no-publish`. For a site the user does not own, add `--ephemeral`: nothing is added to the dashboard, scheduled or published.

Every flag below is checked against the squirrel CLI docs (https://docs.squirrelscan.com/cli/audit). Rule docs: `https://docs.squirrelscan.com/rules/{category}/{rule_id}`.

## Run it

```bash
# every accessibility rule, plus the image and zoom rules that also affect access
squirrel audit https://example.com --level surface \
  --rule-include a11y,images/alt-text,mobile/viewport-zoom --format json -o a11y.json

# narrow to a conformance level (WCAG success criteria at or below it)
squirrel audit https://example.com --level surface --rule-include a11y --wcag-level AA --format llm
```

- `--wcag-level A|AA|AAA` keeps the rules mapped to a success criterion at or below that level (`AA` keeps A and AA). Rules with no WCAG criterion are not run under it. The report is marked partial and is not auto-published.
- Use `--level surface` or `full`: accessibility problems live in templates, and surface samples one page per URL pattern first.
- Print the criterion checklist from a stored audit (not a conformance claim): `squirrel report <audit-id> --wcag-checklist markdown` (or `csv`).

## Reading the findings

- Export JSON for the full list; `llm` samples. Each finding names the element by selector, id or quoted text. Read `skippedChecks` as well: a skipped rule is not a pass.
- Group findings by template: one fix in a header, footer, card or form component clears many pages. Count affected pages, then fix the component, not each page.
- WCAG 2.2 adds criteria such as 2.4.11 Focus Not Obscured (Minimum) at Level AA, and removes 4.1.1 Parsing. Use the checklist output to see which criteria squirrelscan maps findings to, and do not claim one is met that it does not cover.

## Fix order

1. Page-level blockers: `a11y/aria-hidden-body`, `a11y/aria-hidden-focus`, `a11y/html-lang-valid`, `a11y/valid-lang`, `a11y/zoom-disabled`, `mobile/viewport-zoom`.
2. Names for controls: `a11y/button-name`, `a11y/aria-labels`, `a11y/link-text`, `a11y/form-labels`, `a11y/select-name`, `a11y/input-image-alt`, `images/alt-text`.
3. ARIA correctness: `a11y/aria-roles`, `a11y/aria-valid-attr`, `a11y/aria-valid-attr-value`, `a11y/aria-required-attr`, `a11y/aria-required-parent`, `a11y/aria-required-children`, `a11y/duplicate-id-aria`. Fix by using the native element first; ARIA that contradicts the element is worse than none.
4. Structure: `a11y/heading-order`, `a11y/empty-heading`, `a11y/landmark-one-main`, `a11y/landmark-regions`, `a11y/skip-link`, `a11y/list-structure`, `a11y/table-headers`.
5. Visual: `a11y/color-contrast` (measures text with an inline color against the background the markup determines, and counts what it could not measure), `a11y/focus-visible`, `a11y/touch-targets`, `a11y/reduced-motion`.

Do not fix contrast or focus styles by guessing: ask for the design tokens, change the token, and re-audit.

## Where the fix usually lives

| Stack | Look here |
|-------|-----------|
| Next.js / React | shared components (`Button`, `IconButton`, `Input`), the root layout (`<html lang>`, skip link, one `<main>`), `next/image` `alt` props, global CSS (`:focus-visible`) |
| WordPress | theme templates (`header.php`, `searchform.php`), page-builder widgets, plugin output you cannot edit (replace the plugin), media library alt text |
| Shopify | theme Liquid (`theme.liquid`, `header.liquid`, product card snippets), product media alt text in the admin, apps that inject widgets |
| Webflow | element settings panel (alt text, custom attributes such as `aria-label`), Site settings language, heading tags set per element |
| Static sites and docs | layout templates and the markdown renderer's heading levels |

## Stop condition

Stop when a `--level full` re-audit with `--wcag-level AA` has no error-severity accessibility findings, every skipped check is explained, and the user has the manual checklist for what the tool cannot check: keyboard-only walk through key flows, a screen reader pass on the main journey, captions and transcripts, meaningful alt text, focus order, and forms' error messages. Report it as "no automated findings", never "WCAG compliant".

## Hand off

Non-accessibility findings: `audit-website`. A pre-release check across everything: `launch-checklist`. Gate in CI: `website-ci-gate`.
