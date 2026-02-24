# Audit Reference

## Score Targets

| Starting Score | Target Score | Expected Work |
|----------------|--------------|---------------|
| < 50 (Grade F) | 75+ (Grade C) | Major fixes |
| 50-70 (Grade D) | 85+ (Grade B) | Moderate fixes |
| 70-85 (Grade C) | 90+ (Grade A) | Polish |
| > 85 (Grade B+) | 95+ | Fine-tuning |

A site is only considered COMPLETE and FIXED when scores are above 95 (Grade A) with coverage set to FULL (`--coverage full`).

## Issue Categories

| Category | Fix Approach | Parallelizable |
|----------|--------------|----------------|
| Meta tags/titles | Edit page components or metadata | No |
| Structured data | Add JSON-LD to page templates | No |
| Missing H1/headings | Edit page components + content files | Yes (content) |
| Image alt text | Edit content files | Yes |
| Heading hierarchy | Edit content files | Yes |
| Short descriptions | Edit content frontmatter | Yes |
| HTTP→HTTPS links | Find and replace in content | Yes |
| Broken links | Manual review (flag for user) | No |

For parallelizable fixes: spawn subagents with specific file assignments (3-5 files per agent).

## Content File Fixes

Common content fixes (equally important as code fixes):

- **Image alt text**: Add descriptive alt text to images
- **Heading hierarchy**: Fix skipped heading levels
- **Meta descriptions**: Extend short descriptions in frontmatter
- **HTTP links**: Update insecure links to HTTPS

## Parallelizing Fixes

When the user approves a batch of fixes:

- Confirm which fixes to apply before spawning subagents
- Group 3-5 files per subagent for the same fix type
- Only parallelize independent files (no shared components or config)
- Spawn multiple subagents in a single message for concurrent execution

## Completion Criteria

- All errors fixed
- All warnings fixed (or documented as requiring human review)
- Re-audit confirms improvements
- Before/after comparison shown to user
