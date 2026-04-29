# try-gstack

A sandbox repo for trying out [gstack](https://github.com/garrytan/gstack) — a collection of slash-command skills for Claude Code covering planning, code review, deploys, design, browser automation, and more.

## Purpose

This repo exists to experiment with gstack workflows in isolation, without polluting other projects. Use it to:

- Explore the available gstack slash commands
- Test setup steps (`/setup-deploy`, `/setup-browser-cookies`, `/setup-gbrain`)
- Try planning and review flows (`/plan-eng-review`, `/plan-design-review`, `/review`, `/ship`)
- Practice with the `/browse` skill instead of `mcp__claude-in-chrome__*` tools

## Installing gstack

```sh
git clone --single-branch --depth 1 https://github.com/garrytan/gstack.git ~/.claude/skills/gstack
cd ~/.claude/skills/gstack && ./setup
```

See `CLAUDE.md` for the project-level convention on which gstack skills are in scope here.
