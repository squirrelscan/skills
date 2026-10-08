# squirrelscan-channel

An opt-in Claude Code [channel](https://code.claude.com/docs/en/channels) for squirrelscan. It runs `squirrel channel`, a stdio MCP server that polls your squirrelscan cloud account and pushes audit events into your running Claude Code session:

- `audit_complete`: a cloud audit finished
- `audit_failed`: a cloud audit failed
- `issues_detected`: an audit found issues

Each event carries `category`, `website_id`, `run_id` and `domain`. Your agent pulls the report with `get_report` or `list_issues`, triages, fixes, re-audits and checks the result with `compare_audits`. The `squirrelscan` skill in the main plugin tells it how.

This is a separate plugin on purpose. The main `squirrelscan` plugin does not start a polling process for everyone who installs it, and it keeps working on CLI versions that have no `channel` command.

## Requirements

- The squirrel CLI with the `channel` command ([squirrelscan/squirrelscan#569](https://github.com/squirrelscan/squirrelscan/issues/569)). Check with `squirrel channel --help`. Update with `squirrel self update`.
- A squirrelscan login: `squirrel auth login`. With no login the channel sends one event telling you to run it.
- Claude Code with channels available (research preview), signed in with claude.ai or a Console API key.

## Install

```
/plugin marketplace add squirrelscan/skills
/plugin install squirrelscan-channel@squirrelscan
```

Then start a session with the channel switched on. A channel runs only when you name it for the session:

```bash
claude --channels plugin:squirrelscan-channel@squirrelscan
```

## Until squirrelscan is on the channel allowlist

Channels are a research preview, and `--channels` only accepts plugins on Anthropic's allowlist or on your organization's. squirrelscan-channel is not on either yet, so:

- Use the development flag, in an interactive session. Claude Code shows a confirmation prompt first, and ignores the flag with `-p` or the Agent SDK:

  ```bash
  claude --dangerously-load-development-channels plugin:squirrelscan-channel@squirrelscan
  ```

- On Team and Enterprise plans, an owner must turn channels on (`channelsEnabled`, in Organization settings, Claude Code, Channels). The development flag does not bypass that.
- An admin can approve the plugin for the whole organization by adding `{ "marketplace": "squirrelscan", "plugin": "squirrelscan-channel" }` to `allowedChannelPlugins` in managed settings. That list replaces Anthropic's default allowlist, so keep any official channel plugins you still want in it.

## Security

Events are one-line summaries built from ids, counts and fixed strings. They never contain text from crawled pages. Your agent should still treat everything in an event as data, not instructions.
