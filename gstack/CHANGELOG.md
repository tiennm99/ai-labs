# Changelog

All notable changes to **Hình Học Sống** are documented here. Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Versioning: 4-digit MAJOR.MINOR.PATCH.MICRO per gstack.

## [0.0.2.0] - 2026-04-29

### Added

- **Module 3 (lớp 9): Góc nội tiếp** — the first interactive theorem demo, live at `/lop-9/goc-noi-tiep/`.
  - Drag point M around the circle; ∠AMB stays constant when M is on the same arc (the inscribed-angle theorem in motion).
  - Live numeric readout of ∠AMB (inscribed) and ∠AOB (central). Color-coded per the locked autoplan palette: M and the inscribed-angle readout in pair1 (#D7263D), A/B and the central-angle readout in pair2 (#1B998B).
  - SVG canvas with `viewBox="0 0 400 400"`, `touch-action: none` scoped to the canvas, Pointer Events + `setPointerCapture` for unified mouse/touch/stylus handling, AbortController teardown on `astro:before-swap`.
  - Theorem statement panel with the SGK phrasing, plus one worked example walking the user through the 120° → 60° relationship for the canonical A=150°, B=30° configuration.
- `src/geom-engine/circle.ts` — pure circle module: `circle()`, `pointOnCircle()`, `projectToCircle()`, `angleAtVertex()` (clamped against IEEE-754 drift to prevent `acos` NaN). 17 unit tests including the inscribed-angle invariance property test (∀ M on the major arc, ∠AMB stays within 0.5° of the reference) — the killer-demo property is now a CI gate.
- Hub landing page upgrade: lớp 9 card is now a real link with `bg`-style hover affordance and "Khám phá" status badge. Lớp 7 + 8 cards still show "Sắp ra mắt" with `opacity: 0.7` to signal not-yet-clickable.

### Changed

- `i18n/vi.ts` extended with `module3.*` strings + per-grade `href` and a new `live` status. Every user-facing string still routed through `t()`.
- Landing-page card rendering now branches on `grade.href` to produce either an `<a>` (live) or a dimmed `<li>` (coming soon).
- `.gitignore` now ignores `.gstack/` (per-deploy reports written by `/land-and-deploy`).

### Notes

- KaTeX still deferred — the theorem text uses Unicode (∠AMB, °) directly, which renders fine in Be Vietnam Pro. KaTeX bundling lands when a future module needs it.
- Tick-mark encoding (Decision D3) not used here since inscribed-angle has no matching sides; ticks land with Module 1 (tam giác bằng nhau).
- Keyboard navigation, first-load coaching, and three theorem-toggle variants all deferred to v0.0.3.0+ per TODOS.md.

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
