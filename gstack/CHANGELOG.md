# Changelog

All notable changes to **Hình Học Sống** are documented here. Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Versioning: 4-digit MAJOR.MINOR.PATCH.MICRO per gstack.

## [0.0.4.0] - 2026-04-30

### Added

- **Module 2 (lớp 8): Tam giác đồng dạng** — third interactive theorem demo, live at `/lop-8/tam-giac-dong-dang/`. MVP completes the autoplan plan's 3-module hero set.
  - Slider-driven scale-similarity demo: a fixed △ABC on the left, a scaled △A′B′C′ on the right with vertices computed at runtime as `centroid_target + k · (vertex − centroid_ABC)` for `k ∈ [0.5, 2.0]`, step 0.05.
  - Live readout table: 6 side lengths + 3 ratios (AB/A′B′, BC/B′C′, CA/C′A′). All 3 ratios stay equal as `k` varies — the killer-demo property of similarity in motion. Color-keyed and tick-marked per Decision D3 (1/2/3 ticks paired with the 3-color palette).
  - The `k` value displays prominently above the slider in pair1 red. ARIA-labels on the slider so screen readers can drive the demo by keyboard.
  - Page reuses `src/components/similarity-scale.ts` + `renderTicks` helper (extracted as a pattern from Module 1). No new geom-engine module needed — `triangle.sides()` and `vec.scale()` carry the math.
- Hub: lớp 8 card now links forward with "Khám phá" status. All three grade cards are now live.

### Changed

- The Astro build now extracts shared geom-engine chunks (`vec.js` ~441B, `triangle.js` ~288B) instead of inlining per-page scripts. Per-page script weight: ~2–3.6KB. Cached across modules after first visit.

### Notes

- Module 2's MVP picks the BONUS variant from the autoplan plan (slider-driven scale) over the harder free-vertex-drag form. Reasoning: scale slider gives the strongest "wow" moment in a single gesture and ships in one weekend; free-drag with AA/SAS/SSS đồng dạng detectors is a separate UI surface. Free-drag deferred to v0.0.5.0+ (P2 in TODOS.md).
- Angles are not displayed numerically but are pinned conceptually in the prose: "khi △A′B′C′ phóng/thu theo hệ số k, các cạnh nhân với k nhưng các góc tại A, B, C không thay đổi". Numeric angle readouts arrive when the free-drag mode lands.

## [0.0.3.0] - 2026-04-30

### Added

- **Module 1 (lớp 7): Tam giác bằng nhau (SSS)** — second interactive theorem demo, live at `/lop-7/tam-giac-bang-nhau/`.
  - Two side-by-side triangles ABC and A′B′C′ in a 400×300 viewBox. All 6 vertices independently draggable via Pointer Events + setPointerCapture per vertex. Drag-clamping keeps every vertex inside the canvas (16-px padding) so the triangles never escape view.
  - SGK-correct encoding per autoplan Decision D3 — color and tick marks paired: AB/A′B′ in pair1 #D7263D with **1 tick**, BC/B′C′ in pair2 #1B998B with **2 ticks**, CA/C′A′ in pair3 #F46036 with **3 ticks**. Tick marks are perpendicular SVG line segments rendered at the midpoint of each side, redrawn live during drag. This is both a11y-correct (color is never the only signal) and matches what every Vietnamese textbook does.
  - Live side-length readout table — six values, color-keyed to the matching tick-pair colors.
  - Green pill badge "Hai tam giác bằng nhau (c.c.c)" appears whenever all 3 corresponding side pairs match within `EPSILON_LEN = 0.5` viewBox units. ARIA-live polite so screen readers announce the moment the triangles become congruent.
- `src/geom-engine/triangle.ts` — third pure module: `triangle()`, `sides()`, `congruentSSS()` with position-strict semantics (AB↔A′B′, etc., not arbitrary permutations — preserves the SGK label-correspondence convention).
- 10 new unit tests including translation invariance, similar-not-congruent rejection, EPSILON tolerance, position-strict label correspondence (permuted side-length sets are NOT counted as congruent), and symmetry of the relation.
- Hub landing page: lớp 7 card now links to the module with "Khám phá" status.

### Notes

- Per autoplan: rigid-motion overlay animation EXPLICITLY DROPPED from MVP (was scope creep — rotation+reflection interpolation = days, not hours). The green badge + tick-mark color match is the entire success state.
- SAS / ASA / AAS / cạnh huyền-góc nhọn / cạnh huyền-cạnh góc vuông toggles deferred — SSS alone validates the canvas + tick-mark + badge pattern. Other cases land in v0.0.5.0+ as toggles on the same canvas.
- Worked examples count: 1 (autoplan called for 3). Same posture as Module 3 — content additions don't gate the killer-demo ship.

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
