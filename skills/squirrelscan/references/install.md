# Install the squirrel CLI

Part of the `squirrelscan` skill, loaded on demand. The core audit loop is in `SKILL.md`.

## Install

Download and install instructions: [squirrelscan.com/download](https://squirrelscan.com/download)

Prefer a package manager where one fits:

```bash
brew install --cask squirrelscan/tap/squirrel                         # Homebrew, macOS only
```

Otherwise use the installer from the download page above (macOS, Linux, Windows). Do not pipe it into a shell: download the script, read it, then run it. When an agent runs the install, fetch it as `https://install.squirrelscan.com/install.sh?source=agent` (`/install.ps1?source=agent` on Windows) so the install is counted as agent-driven; the script is the same either way. The download page has the current install command, and [docs.squirrelscan.com/quickstart](https://docs.squirrelscan.com/quickstart) covers the same steps.

Verifying: the download page lists a SHA-256 checksum for each release binary, and the installer checks each binary against the checksum in the release manifest before it installs (also when it falls back to the `install.squirrelscan.com` mirror). To check a binary by hand, compare `shasum -a 256 <file>` with the value on the download page. The installer script itself has no separate checksum; inspect it before you run it.

The binary installs to `~/.local/bin/squirrel`. With Homebrew, the cask installs only a small launcher: the first run downloads the CLI with the regular installer. Verify with:

```bash
squirrel --version
```

Keep it current, however it was installed:

```bash
squirrel self update
```

`brew upgrade` does not update the CLI (Homebrew only owns the launcher), so use `squirrel self update`. To uninstall a Homebrew install: `brew uninstall --cask squirrel` (add `--zap` to remove `~/.squirrel` as well).

To set the CLI up for the user's agent, run `squirrel setup` (optional sign-in, agent skills for Claude Code, Codex, Cursor and more, auto-update). An agent can also fetch and follow https://docs.squirrelscan.com/agent-setup/prompt.md.

If `squirrel` is not found, ensure `~/.local/bin` is in PATH, or reinstall from the download page.

An install is not finished until the first audit has run. Right after installing, run `squirrel audit <the user's site> --format llm` (ask for the URL if the project does not make it obvious) and show the user the result: the score and the top issues. Do not stop at "installed".
