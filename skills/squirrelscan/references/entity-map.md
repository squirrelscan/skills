# Structured data: the entity map

Part of the `squirrelscan` skill, loaded on demand. The core audit loop is in `SKILL.md`.

## Structured data: the entity map

Every audit collapses the site's JSON-LD into one graph of the entities it declares, rather than a list of the blocks it emits. A report's Entities section carries it: an interactive graph in `html`, a table in `markdown` and `text`, the whole document under `entities` in `json`, and an `<entities>` block in `llm` and `xml`.

This catches what a per-page validator cannot. Sixty valid `Organization` blocks with no `@id` are sixty organizations to a search engine, and nothing accumulates: not the reviews, not the profile links, not the authority.

```bash
squirrel entities                              # summary of the latest audit
squirrel entities --list                       # stored audits and their entity counts
squirrel entities "https://example.com/#org"   # one entity, by @id, key or name
squirrel entities --problem no-id              # the entities worth fixing
squirrel entities --problem split-identity     # one thing declared twice
squirrel entities -f jsonld -o graph.json      # export
squirrel entities --diff                       # what changed since the previous audit
```

Filters: `--type`, `--page`, `--problem` (repeatable or comma-separated), `--crawl <id>`, `--input <file>`. Formats: `json`, `jsonld`, `html`, `markdown`, `csv`, `dot`, `graphml`, `mermaid`. `--diff` takes `markdown` or `json`.

Problems: `no-id`, `conflict`, `dangling`, `single-page`, `split-identity`.

**When a `schema/entity-*` finding appears, read `references/entity-map-fixes.md`.** It has the shape that works and the exact change for Yoast, Rank Math, WordLift, Next.js, Astro and tangly.

### Proving a fix landed

`squirrel entities --diff` after re-auditing. An entity that gains an `@id` **changes key**, because the key is the `@id` when there is one, so a naive comparison reports it as one removal plus one addition and the fix reads as damage. The `gainedId` section is what says it landed.

Two things to check before calling it done:

- **`coverage`** on each `gainedId` row: `proven` means the newer audit visited every page that declared the broken version *and* found the replacement on all of them. `partial` means one of those could not be established, so re-audit the same scope as the first run.
- **`notCrawled`** should be empty. An entity listed there was not removed; its pages simply were not visited again.

A missing `gainedId` row is not proof of failure: the match needs the type and name unchanged, so changing the `@id` and the name in one edit shows up as a removal plus an addition instead.

Docs: https://docs.squirrelscan.com/guides/entity-map
