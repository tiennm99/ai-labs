# Changelog

All notable changes to **Hình Học Sống** are documented here. Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Versioning: 4-digit MAJOR.MINOR.PATCH.MICRO per gstack.

## [0.0.1.0] - 2026-04-29

### Added

- Astro project scaffold with TypeScript strict mode and `base: '/try-gstack/'` for GitHub Pages subdirectory hosting.
- Vietnamese-first BaseLayout with `lang="vi"`, canonical URL, OpenGraph, robots meta, `X-Frame-Options: DENY`.
- Be Vietnam Pro typography (self-hosted via `@fontsource/be-vietnam-pro`, Vietnamese subset, weights 400/500/700) with locked sizes/line-heights and `font-feature-settings: kern, locl`.
- Tailwind 3 with the locked SGK 3-color palette (#D7263D / #1B998B / #F46036) and `max-w-prose: 56ch`.
- Landing page (hub) with three placeholder grade cards (lớp 7 / 8 / 9), each marked "Sắp ra mắt".
- `src/i18n/vi.ts` + `t()` helper — every user-facing string routed through i18n from day 1 so English can ship later by adding `en.ts`.
- `src/geom-engine/` pure module (no DOM imports) with `Vec2`, `add/sub/scale/dot/len/dist/normalize`, `EPSILON_LEN = 0.5`, and `approxEqualLen` helper.
- Vitest with v8 coverage, 95% line/function/statement and 90% branch threshold against the geom-engine module.
- GitHub Actions: `ci.yml` runs typecheck + tests + build on PRs and pushes to `main`; `deploy.yml` deploys to GitHub Pages from `main` via `actions/deploy-pages@v4`.
- `RUNBOOK.md` with rollback procedure and domain-purchase trigger thresholds (500 sessions / 30d, 1 organic teacher share, or ≥5 modules shipped).
