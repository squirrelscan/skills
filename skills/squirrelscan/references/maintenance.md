# Maintenance and troubleshooting

Part of the `squirrelscan` skill, loaded on demand. The core audit loop is in `SKILL.md`.

## Maintenance

```bash
squirrel self doctor       # health checks
squirrel self update       # update the binary
squirrel self completion   # shell completions
squirrel skills update     # update installed agent skills
squirrel self disk         # per-project and total ~/.squirrel disk use
```

### Keeping these skills current

The CLI manages these skills (`squirrelscan` and `audit-website`) itself. This skill is version 2.0: the `metadata.version` at the top of `SKILL.md`.

```bash
squirrel skills status          # installed version, where, and the latest published
squirrel skills status --json   # the same, as JSON
squirrel skills update --check  # exit 1 when an update is available
squirrel skills update          # update what is installed; edited files are kept
```

Suggest `squirrel skills update` when `squirrel skills status` shows a newer version than this skill's own (an `↑` in the latest column), or when the user asks about updating squirrelscan or its skills. Don't run it unprompted in the middle of other work, and only add `--force` when the user wants their own edits to a skill file replaced (their copy is backed up first). With auto-update on, the default, the skills update along with the CLI and there is usually nothing to do. Skills installed earlier with `npx skills` are taken over by `squirrel skills install`. These commands need squirrel 0.0.99 or later; on an older version run `squirrel self update` first.

### Reclaiming disk space

Every audit keeps its full history in the project database, so re-auditing the same site grows `~/.squirrel` by roughly one audit each run (a 1,000-page site is about 95 MB per audit). `squirrel self disk` shows where the space is. `--prune` retires the audits beyond the newest `--keep` and rebuilds the database so the space returns to the filesystem:

```bash
squirrel self disk --prune --keep 3 --dry-run   # list what would go, delete nothing
squirrel self disk --prune --keep 3             # prints the plan, asks, then retires
squirrel self disk --prune --keep 3 --project my-project --yes
```

- `--keep <n>` is required: a retired audit's report can no longer be rendered, and `report --list`, `--diff` and `--regression-since` reach into that history, so the window is the user's call. Ask before choosing it for them.
- Retiring keeps everything the next audit reads (newest page record per URL, sub-resources, links, images), so an incremental re-crawl still gets its `ETag`s and does not refetch the site.
- Audits never prune on their own. Requires squirrel 0.0.92 or later; on older versions run `squirrel self update` first.

## Troubleshooting

- **`squirrel: command not found`**: install from [squirrelscan.com/download](https://squirrelscan.com/download) and ensure `~/.local/bin` is in PATH.
- **Session expired / 401**: run `squirrel auth login` again, or check `SQUIRRELSCAN_API_KEY`.
- **`403` with `forbidden_role`** (CLI, API or MCP): your role in that organization does not allow the action, such as a viewer running a tracked audit or changing a website. Retrying does not help: ask an owner or admin to change your role, or run the audit with `--no-publish`. Docs: https://docs.squirrelscan.com/cloud/team#roles
- **Slow or stuck crawl**: add `--verbose` to see progress; large sites can take minutes.
- **Audit dies after the first page** (connection refused, a sudden block, or a run of timeouts right after the crawl starts): the site's firewall may be banning the discovery probes, the requests for `llms.txt`, `/.well-known/*` and `/swagger.json` an audit sends before it crawls. A common fail2ban "sensitive files" jail bans an IP for asking for `/swagger.json`. Re-run with `--disable-discovery-probes`, or set `disable_discovery_probes = true` under `[crawler]` in `squirrel.toml` for that site. The agent experience checks that read the probes then say "not checked". An existing ban may last a while, so wait it out or ask the site owner to lift it. Needs squirrel 0.0.99 or later; on an older version run `squirrel self update` first. To keep those checks instead, let the audit through the firewall: https://docs.squirrelscan.com/cloud/firewall (for a CLI audit, allow your own IP or send a secret header with `-H`: https://docs.squirrelscan.com/configuration/crawler#or-let-squirrelscan-through).
- **Audit fails as a redirect, or is blocked, on a site behind an access gateway** (Cloudflare Access, Vercel deployment protection): the gateway needs a header, such as a Cloudflare Access service token (`CF-Access-Client-Id` and `CF-Access-Client-Secret`) set as custom request headers. Every rendering mode sends the website's custom headers, cloud browser renders included (to the rendered page's own origin only, on the audited host and its `www` twin), so rendering can stay on. A signed-in CLI audit's cloud renders never carry `-H` headers: run it with `--http` when headers come from `-H`. Audit the exact `https://` origin the gateway protects, because a redirect to another origin drops the headers. Gateways with no header route (Okta, Entra ID and similar) need the CLI on a network they admit. Docs: https://docs.squirrelscan.com/guides/failed-audits#access-gateway, https://docs.squirrelscan.com/cloud/firewall and https://docs.squirrelscan.com/cloud/firewall#which-renders-carry-them
- **Audit fails because the start URL redirects to another site** (a cloud audit failing as a redirect; on the CLI see "Redirected (`4`)" in `SKILL.md`): retrying the same URL fails the same way. A recent CLI prints `Audit the destination instead: squirrel audit <origin>` (the `llm` format offers the same command for the user to confirm; on an older CLI run `squirrel self update`). The destination is the audited site's choice, not the user's, so relay the command and run it only after the user confirms that is the site they meant. When the destination is a sign-in page (Okta, Auth0, Microsoft or Google sign-in, Cloudflare Access, Vercel deployment protection and similar, or a `login.`, `sso.` or `auth.` host), the CLI says the site needs authentication and offers no command: do not audit the sign-in host, and point the user at the access gateway entry above. Docs: https://docs.squirrelscan.com/guides/failed-audits#offsite-redirect and https://docs.squirrelscan.com/guides/failed-audits#access-gateway
- **Invalid URL**: include the protocol: `https://example.com`, not `example.com`.
- **Anything else**: run `squirrel self doctor`, then report it with the `bug_report` category: agents via the `send_feedback` MCP tool or `squirrel feedback --json` (see "Agent feedback" in `references/mcp.md`), humans via `squirrel feedback` or the support page at [squirrelscan.com/support](https://squirrelscan.com/support)
