# Accounts, credits and cloud features

Part of the `squirrelscan` skill, loaded on demand. The core audit loop is in `SKILL.md`.

## Authentication and accounts

Local audits never require an account. Sign in to unlock cloud features (publishing, browser rendering, the cloud checks, scheduled crawls). Once signed in, every `squirrel audit` is a billed cloud audit; `--offline` runs one locally for free:

```bash
squirrel auth login      # browser-based login
squirrel auth status     # source, scopes, active org
squirrel auth whoami
squirrel auth logout
```

Headless / CI environments use an org API key instead:

```bash
squirrel keys create     # requires a login session; prints an sq_... key
```

Set it as `SQUIRRELSCAN_API_KEY` in the environment. Treat keys as secrets; never commit them.

In an organization, what you can do depends on your role (owner, admin, editor, viewer, billing). Running tracked audits and publishing needs owner, admin or editor; a viewer or billing member's audit still runs locally with complete results, but is not tracked or published, and the CLI says why (`forbidden_role`). Owners and admins invite members from **Settings → Team** in the dashboard: the invite is emailed with a link that works for 7 days, and the invitee accepts by signing in (or signing up) with the invited address: case aside, a `+tag` or Gmail-dot variant does not match. When the email could not go out, the Team page offers the link to copy and send. Docs: https://docs.squirrelscan.com/cloud/team

## Cloud features and credits

Cloud features are pay-as-you-go with credits (nothing charged up front). Every signed-in audit is billed at every level, quick included: 50 credits for the audit plus 2 per audited page, however the page was fetched. A cloud audit (dashboard, API, hosted MCP) also pays 1 credit per distinct external link it checks. Only an audit that runs signed out or with `--offline` costs nothing. Free accounts get 500 credits a month, one free allowance per email inbox: a newer account on the same inbox (`+tags` on the big webmail providers and Gmail dots fold together) or on a throwaway-inbox domain starts with 0. If a new free account shows 0 credits, that is not a bug: tell the user to sign in with their first account, upgrade, or contact https://squirrelscan.com/support. Check balance and pricing:

```bash
squirrel credits
```

When the balance, or `[cloud] max_credits_per_audit`, covers fewer pages than the level asks for, the audit runs on the pages it can pay for and says so. Tell the user rather than treating the smaller audit as the whole site. Below the 52 credits a one-page audit needs, `squirrel audit` runs local-only and says so, and the local MCP `audit_website` stops without registering or charging anything. Docs: https://docs.squirrelscan.com/cloud/credits

- `--render` / `--render-mode auto|all|off`: cloud browser rendering for client-rendered pages (uses credits, requires login).
- `--yes` skips spend confirmations up to the configured per-audit credit cap.
- `--fail-on "score<90"` (repeatable) makes CI runs exit non-zero when a threshold trips.
- The dashboard at [app.squirrelscan.com](https://app.squirrelscan.com) shows audit history, issues, and credit usage.

### Ephemeral runs

A signed-in `squirrel audit` adds the site to the user's dashboard, turns on recurring audits after its first successful audit, and publishes an unlisted report. For a site the user does not own or manage (a prospect, a client, a competitor), a one-off check, or a CI job against a preview URL, add `--ephemeral` (squirrel 0.0.141 or later): it still uses the cloud features, but adds nothing to the dashboard, schedules nothing and publishes nothing. `--publish` with it publishes an unlisted report attached to no dashboard site. It is charged exactly like the same audit without it, and the credit history lists it as an ephemeral CLI run with the domain, so do not present it as free. `[cloud] ephemeral = true` makes it the project default and `--no-ephemeral` overrides that for one run; with `--offline` it has no effect, since offline saves nothing anyway. The local MCP `audit_website` tool takes an `ephemeral` argument. Docs: https://docs.squirrelscan.com/cli/audit#ephemeral-runs

### Paused recurring audits

A recurring-audit schedule pauses itself for one of two reasons. The `schedule` block in hosted MCP results (`get_website_settings`, `update_website_settings`, `run_audit`, and `get_audit_status` on a completed run) then reads `state: "paused"` and carries `paused`: `reason`, `cause`, and `since` (when the schedule last changed, which is its pause unless it was edited since).

- `reason: "consecutive_failures"`: the site's last three audits failed the same permanent way. `cause` says how; tell the user in plain words: `dns_failure` (the domain does not resolve), `tls_failure` (the TLS certificate is not valid), `redirect_refused` (the start URL redirects off the site, or loops) or `bot_block` (bot protection, a firewall or a login wall refused the crawler). A null `cause` means the failures no longer read as one class: read the latest failed audit's `failure_reason_code` instead. Timeouts, server errors, rate limits and failures on squirrelscan's side never pause a schedule.
- `reason: "insufficient_credits"`: a scheduled run was skipped, uncharged, because the balance was below the audit base. It needs credits first: a top-up or an upgrade.

Help the user fix the cause, or report it if it is on squirrelscan's side, before resuming: a resume without a fix fails the same way, and one more failure of that kind pauses the schedule again at once. Resume with `update_website_settings` and a `schedule` cadence, or from the website's **Settings → Schedule** in the dashboard. Resuming a failure pause runs one audit straight away (unless one is already on its way), so it spends credits: say so. The call returns the estimate first and needs `confirm: true`. A resumed credit pause waits for its next scheduled slot. Docs: https://docs.squirrelscan.com/cloud/scheduled-audits#when-a-schedule-pauses-itself
