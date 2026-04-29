# try-gstack

Sandbox repo for trying out [gstack](https://github.com/garrytan/gstack) — a collection of slash-command skills for Claude Code.

## gstack

This project uses gstack. Teammates: install it once on your machine, then any Claude Code session in this repo will pick it up.

### One-time install

```sh
git clone --single-branch --depth 1 https://github.com/garrytan/gstack.git ~/.claude/skills/gstack
cd ~/.claude/skills/gstack && ./setup
```

`./setup` requires `bun` (`npm install -g bun` works) and a working Playwright Chromium (run `sudo npx playwright install-deps` if libs are missing on Linux).

### Web browsing

For **all** web browsing, use the `/browse` skill from gstack.

**Never use `mcp__claude-in-chrome__*` tools.** `/browse` is the only sanctioned browser-control surface in this project.

### Available gstack skills

- `/office-hours`
- `/plan-ceo-review`
- `/plan-eng-review`
- `/plan-design-review`
- `/design-consultation`
- `/design-shotgun`
- `/design-html`
- `/review`
- `/ship`
- `/land-and-deploy`
- `/canary`
- `/benchmark`
- `/browse`
- `/connect-chrome`
- `/qa`
- `/qa-only`
- `/design-review`
- `/setup-browser-cookies`
- `/setup-deploy`
- `/setup-gbrain`
- `/retro`
- `/investigate`
- `/document-release`
- `/codex`
- `/cso`
- `/autoplan`
- `/plan-devex-review`
- `/devex-review`
- `/careful`
- `/freeze`
- `/guard`
- `/unfreeze`
- `/gstack-upgrade`
- `/learn`
