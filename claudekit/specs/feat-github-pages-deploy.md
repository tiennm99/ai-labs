# GitHub Actions: Deploy to GitHub Pages

## Status
Draft

## Authors
Claude Code — 2026-04-12

## Overview
Add a GitHub Actions workflow to automatically build and deploy the Suika game to GitHub Pages on every push to `main`. This gives the game a publicly accessible URL with zero hosting cost.

## Background / Problem Statement
The game currently has no deployment pipeline. To share or play it, someone must clone the repo and run `npm run dev` locally. GitHub Pages is the natural fit: the repo is already hosted on GitHub (`tiennm99/try-claudekit`), the game is a static Vite build, and Pages is free for public repos.

## Goals
- Automated deploy on every push to `main`
- Game accessible at `https://tiennm99.github.io/try-claudekit/`
- Build failures block deployment (no broken deploys)
- Run existing tests before deploying

## Non-Goals
- Custom domain setup
- Preview deployments for pull requests
- CDN or caching configuration beyond GitHub Pages defaults
- Server-side rendering or API routes

## Technical Dependencies
- **GitHub Actions** — built-in CI/CD, no external service needed
- **actions/configure-pages** / **actions/upload-pages-artifact** / **actions/deploy-pages** — official GitHub Pages deployment actions
- **Vite** (already in devDeps) — needs `base` config for subdirectory hosting

## Detailed Design

### 1. Vite Base Path Configuration

GitHub Pages serves this repo at `/try-claudekit/`, so asset paths must be prefixed. Create a minimal `vite.config.js`:

```js
import { defineConfig } from "vite";

export default defineConfig({
  base: "/try-claudekit/",
});
```

This affects only production builds (`npm run build`). Dev server (`npm run dev`) ignores `base` for local paths.

### 2. GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch: # allow manual trigger

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - run: npm ci

      - run: npm test

      - run: npm run build

      - uses: actions/configure-pages@v5

      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist

      - id: deployment
        uses: actions/deploy-pages@v4
```

### 3. File Changes Summary

| File | Change |
|------|--------|
| `vite.config.js` (new) | Set `base: "/try-claudekit/"` |
| `.github/workflows/deploy.yml` (new) | Build + test + deploy workflow |

### 4. GitHub Repository Setting

GitHub Pages source must be set to **"GitHub Actions"** (not branch-based). This is a one-time manual step in repo Settings > Pages > Source.

## User Experience
- **Developers**: Push to `main` triggers automatic deployment. Build/test failures show in the Actions tab and block deploy.
- **Players**: Visit `https://tiennm99.github.io/try-claudekit/` to play. No install required.
- **Manual trigger**: The `workflow_dispatch` event allows re-deploying from the Actions tab without a new commit.

## Testing Strategy

### Pre-deploy gate
The workflow runs `npm test` before building. If any test fails, the job stops and nothing is deployed.

### Verification after implementation
- Push a commit to `main` and confirm the Actions run completes successfully
- Visit the Pages URL and verify the game loads and is playable
- Verify asset paths resolve correctly (no 404s for JS/CSS bundles)
- Test that a failing test prevents deployment by temporarily breaking a test

### Local validation
- Run `npm run build` locally and serve `dist/` with `npx vite preview` to verify the base path works

## Performance Considerations
- Build is fast (~5s for a small Vite project). No caching beyond `npm ci` + Node module cache needed.
- GitHub Pages serves with its own CDN. No additional optimization required for this scale.

## Security Considerations
- Workflow uses minimal permissions (`contents: read`, `pages: write`, `id-token: write`)
- No secrets or tokens needed — Pages deployment uses OIDC via `id-token: write`
- `concurrency` group prevents race conditions between overlapping deploys

## Documentation
- Update README or docs to include the live URL once deployed

## Implementation Phases

### Phase 1: Core (MVP)
1. Create `vite.config.js` with `base` setting
2. Create `.github/workflows/deploy.yml`
3. Set GitHub Pages source to "GitHub Actions" in repo settings
4. Push to `main` and verify deployment

### Phase 2: Optional Enhancements (if desired later)
- Add PR preview deployments
- Add build status badge to README
- Custom domain configuration

## Open Questions
- Should the repo name change in the future, the `base` path in `vite.config.js` must be updated to match. Consider using an environment variable if this is likely.

## References
- [Vite — Deploying to GitHub Pages](https://vite.dev/guide/static-deploy#github-pages)
- [GitHub Actions — deploy-pages](https://github.com/actions/deploy-pages)
- [GitHub Pages documentation](https://docs.github.com/en/pages)
