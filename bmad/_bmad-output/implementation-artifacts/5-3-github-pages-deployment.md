# Story 5.3: GitHub Pages Deployment

Status: done

## Story

As a developer,
I want the game automatically deployed to GitHub Pages on push to main,
so that the game is publicly accessible without manual deployment steps.

## Acceptance Criteria

1. Given the Vite config, when the production build runs, then the `base` option is set to the repository name for correct asset paths on GitHub Pages, and `npm run build` produces a `dist/` directory
2. Given a `.github/workflows/deploy.yml` workflow file, when code is pushed to the main branch, then GitHub Actions runs `npm ci`, `npm run build`, and deploys the `dist/` directory to GitHub Pages
3. Given the deployment completes, when a user visits the GitHub Pages URL, then the game loads and is fully playable with all assets loading correctly
4. Given the production bundle, then it is under 50KB gzipped (NFR4)

## Tasks / Subtasks

- [x] Task 1: Set Vite base path for GitHub Pages (AC: #1)
  - [x] Added `base: '/try-bmad/'` to vite.config.js
  - [x] Verified dist/ output has correct `/try-bmad/` prefixed asset paths
- [x] Task 2: Create GitHub Actions deploy workflow (AC: #2)
  - [x] Created `.github/workflows/deploy.yml` with actions/deploy-pages
  - [x] Triggers on push to main, uses Node.js 20, npm ci, npm run build
  - [x] Uses upload-pages-artifact + deploy-pages (modern approach, no gh-pages branch)
- [x] Task 3: Verify build and bundle size (AC: #1, #4)
  - [x] Build succeeds, dist/ contains index.html + CSS + JS with correct paths
  - [x] Gzipped bundle: 22.4KB total (well under 50KB)
  - [x] All 90 tests pass

## Dev Notes

### Vite Config Change

Add `base` to vite.config.js:
```javascript
export default defineConfig({
  base: '/try-bmad/',
  plugins: [svelte(), tailwindcss()],
})
```

### GitHub Actions Workflow

Use the modern `actions/deploy-pages` approach (not gh-pages branch):
```yaml
permissions:
  contents: read
  pages: write
  id-token: write
```

### Current Bundle Size

Last build: 22KB gzipped total (CSS 3.5KB + JS 18.5KB) — well under 50KB limit.

### Font Path Note

Font files in `public/fonts/` use absolute paths (`/fonts/ClearSans-*.woff2`). With `base: '/try-bmad/'`, Vite automatically prefixes static asset URLs, but `@font-face src: url('/fonts/...')` in CSS needs to work correctly. Vite handles this — URLs starting with `/` in CSS are resolved relative to the `base` path in production builds.

### FRs Covered

- FR31: GitHub Pages deployment

### References

- [Source: _bmad-output/planning-artifacts/epics.md — Epic 5, Story 5.3]
- [Source: _bmad-output/planning-artifacts/architecture.md — Infrastructure & Deployment]
- [Source: vite.config.js — current config]

## Dev Agent Record

### Agent Model Used
Claude Opus 4.6 (1M context)

### Debug Log References

### Completion Notes List
- Added `base: '/try-bmad/'` to vite.config.js for correct GitHub Pages asset paths
- Created `.github/workflows/deploy.yml` using modern actions/deploy-pages approach
- Build produces 22.4KB gzipped bundle (well under 50KB NFR4 limit)
- All 90 tests pass

### File List
- vite.config.js (modified — added base path)
- .github/workflows/deploy.yml (created — GitHub Actions deploy workflow)
