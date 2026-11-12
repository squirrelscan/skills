# Configuration and tailoring the audit

Part of the `squirrelscan` skill, loaded on demand. The core audit loop is in `SKILL.md`.

## Configuration

Project config lives in `squirrel.toml` (created by `squirrel init`). User settings live at `~/.squirrel/settings.json`.

```bash
squirrel config show
squirrel config set <key> <value>
squirrel config path
squirrel config validate
```

Useful sections: `[rules]` and `[[ignore]]` (see "Tailor the audit to the site" in this file), `[crawler]` (delays, headers, incremental re-crawl), `[cloud]` (render mode, max credits per audit), `[security]` (probing intensity and budget, see "Probing intensity" in `SKILL.md`).

With `respect_robots = true` under `[crawler]`, the crawl follows the site's `User-agent: SquirrelScan` robots.txt group, or its `*` group when there is none. `robots_user_agent` (default `SquirrelScan`) is the token matched; a custom `user_agent` does not change it. To have robots.txt read as your own bot, set `robots_user_agent` to its token, or to `""` to match on `user_agent`. Docs: https://docs.squirrelscan.com/configuration/crawler#robots_user_agent

### Technology detection

Every audit, local or cloud, fingerprints the site's technologies. Detection also reads the first-party script bundles the crawl already fetched (up to 64 KB each), so single page apps such as Lovable, Base44, Bolt and v0 builds, and their Supabase, Firebase and Clerk backends, are found offline too (squirrel 0.0.140 or later). It is informational and never affects the score. `[tech_detect] bundle_bytes` in `squirrel.toml` sets the per-bundle cap (0 to 262144); `0` turns bundle matching off. Bundles can contain keys: a signed-in audit sends up to 1 MB of bundle text per audit to the cloud detection service, so set `bundle_bytes = 0` when the user does not want that. Docs: https://docs.squirrelscan.com/cloud/technologies#script-bundles

### Custom request headers

Attach headers to every crawl request with the repeatable `-H "Name: Value"` flag or a `headers` map under `[crawler]`. The main use case is Web Bot Auth (Shopify / Cloudflare), so platforms that block unknown crawlers can authorize squirrelscan. Header values are secrets: squirrelscan redacts them in output, and you should source them from a secret store rather than committing them. Full recipe: https://docs.squirrelscan.com/guides/web-bot-auth

## Tailor the audit to the site: custom config and ignoring rules

squirrelscan results must be tailored to each site through rules. Not every rule applies to every site: a hobby site with no privacy, about or contact pages should not be told, on every audit, to add them. A finding class the user calls out of scope is disabled or waived, not re-reported, so the score reflects what matters for that site.

**When the user says a finding class is out of scope, offer to write the config** instead of listing the findings again: say which rules you would switch off, and write them once the user agrees. Do not disable a rule on your own to raise the score, and do not disable one the user has not said is out of scope. Tell the user the score changes because those rules no longer count.

### Local runs: `squirrel.toml`

Project config lives in `squirrel.toml` at the project root (`squirrel init` creates it). Every local run of the CLI reads it.

```toml
[rules]
enable = ["*"]                               # the default: every default-on rule
disable = ["eeat/*", "legal/privacy-policy"] # a category glob and an exact id

[[ignore]]
rule   = "security/cookie-flags"
items  = ["localization"]
reason = "Shopify sets this cookie itself"
```

- `[rules] disable` and `enable` take exact ids (`eeat/about-page`) and category globs (`eeat/*`). A `*` works only as the whole pattern or as the whole rule name, so `core/og-*` matches nothing. `disable` wins when a rule matches both. A disabled rule does not run and does not count toward the score.
- `[[ignore]]` waives findings of a rule that still runs, for named items, urls or selectors (`rule` plus one of `items`, `urls`, `selectors`, and an optional `reason`). Use `disable` when a whole class is out of scope and `[[ignore]]` when only some findings are not actionable. Waived findings are counted in the report, not hidden. `integrity/*` rules cannot be waived.
- `squirrel audit <url> --no-ignore` runs without applying the `[[ignore]]` entries, to see what they waive.
- `squirrel config show`, `set`, `path` and `validate` show, change, locate and check the config. `squirrel config validate` reports `[[ignore]]` entries that name a rule that does not exist.
- `--rule-exclude` and `--rule-include` narrow one run only, and a run with them produces a partial report that is not auto-published. Use the toml for a standing choice.

Docs: https://docs.squirrelscan.com/configuration/rules and https://docs.squirrelscan.com/configuration/ignore

### Rule ids come from the tool, never from a guess

Take ids from the `rules` dict of a report, or from the `list_rules` MCP tool (local and hosted), never from memory: a guessed id does nothing. Over the hosted MCP server, `get_report` with `format: "rule_ids"` lists every distinct failing rule id of a run, uncapped, which is the quickest way to build a disable list. Docs for any rule: `https://docs.squirrelscan.com/rules/{category}/{rule_id}`.

### Confirm the rules are gone

An id that matches no rule used to be accepted silently. Since squirrel v0.0.164, an unknown entry in `[rules] enable` or `disable` prints one warning on stderr naming the entry and the closest rule id (`did you mean "crawl/robots-txt"?`), and the audit runs unchanged. On an older CLI nothing warns. Either way, **re-run the audit after editing the config and confirm the rules no longer appear in the report.** A rule that is still reported was not matched.

### Which runs read the toml

| Run | Reads `squirrel.toml`? |
|-----|------------------------|
| Local CLI (`squirrel audit`, with or without `--offline`) | Yes |
| Local MCP server (`squirrel mcp`, tool `audit_website`) | Yes: it loads the project's `squirrel.toml` like the CLI |
| Hosted MCP `run_audit`, dashboard and scheduled cloud audits | No: the cloud cannot see the repository. They use the website's stored `disable_rules` |

So an audit over the hosted MCP of a site that has a `squirrel.toml` still reports the rules the toml disables, and its score differs from the local CLI's, until the same list is stored on the website. Cloud audits do not read `[[ignore]]` entries or `enable`.

### Cloud runs: the website's `disable_rules`

- `update_website_settings` takes `disable_rules`: exact ids and category globs, the same patterns as the toml's `disable`, stored per website and applied to every cloud audit of it. It replaces the stored list, so send the whole list; an empty list clears it. `*` and entries that match no rule are refused (up to 500 entries), so take ids from `list_rules` or `get_report` with `format: "rule_ids"`.
- `get_website_settings` returns `disable_rules` and `disabled_rule_count`, the rules they match.
- `get_report` shows what the config switched off: `rulesDisabledByConfig` in the `summary` and `rule_ids` formats, and a line such as "3 rules disabled by config" at the top of the `llm` and `markdown` formats. Read it before comparing scores: two runs compare only when they ran the same rules.
- After changing it, run the audit again (`run_audit`) and check the rules are gone from the report. A completed run keeps the rules it ran with.

Docs: https://docs.squirrelscan.com/developers/mcp
