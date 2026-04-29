# TODOS

Tracked work, organized by component then priority (P0 highest → P4 lowest). See `~/.gstack/projects/tiennm99-try-gstack/tiennm99-main-design-20260429-160610.md` for the full plan.

## Distribution & Validation (Phase 0, pre-build)

- **Phase 0 SERP audit**
  **Priority:** P0
  **What:** 2-hour Google.com.vn / YouTube VN / TikTok VN audit on `góc nội tiếp`, `tam giác bằng nhau`, `tam giác đồng dạng`. Document positions 1–10 + dominant content type.
  **Why:** Determines whether text page can win SERP or whether we pivot to video-first.
  **Output:** `competitive-landscape.md` companion file.

- **Phase 0 TikTok / Shorts validation**
  **Priority:** P0
  **What:** 5 short videos (10–30s) of mock drag interactions (Figma + Lottie + screen-record). Post to test the visual-wow thesis BEFORE writing module code.
  **Why:** If videos flop, the entire visualizer wedge is dead before a weekend is invested.

- **Vetted Facebook group entry**
  **Priority:** P1
  **What:** Join "Hỏi đáp Toán THCS", "Toán học vui", "Giáo viên Toán". Post one helpful, non-self-promotional answer in each. Earn standing.
  **Why:** Distribution plan depends on these groups; founder must have presence before the launch post.

## TheoremCanvas primitive (weekend 1, before any module)

- **Build TheoremCanvas as single HTML file first**
  **Priority:** P1
  **What:** `<TheoremCanvas mode="..." initial={...} client:visible />` API. SVG canvas + Pointer Events drag + setPointerCapture per vertex. AbortController teardown. Per autoplan eng decision E1.
  **Where:** prototype as standalone `prototype.html`, then port into `src/components/TheoremCanvas.astro` once API feels right.

- **Vertex drag affordance + 48px hit-target**
  **Priority:** P1
  **What:** 14px filled circle, 2px white stroke, 4px drop shadow, 48px transparent square hit-target, `tabindex=0`, focused = 3px #D7263D ring. Per Design Decision D1.

- **Keyboard navigation for vertices**
  **Priority:** P1
  **What:** Tab cycles vertices; arrows ±4px; shift+arrow ±16px; Enter snaps to nearest interesting position. Per Design F6.1.

## Module 3 — Lớp 9 Góc nội tiếp (weekend 2, hero module)

- **Theorem panel + 3 worked SGK-style examples**
  **Priority:** P1
  **Status:** PARTIAL — v0.0.2.0 ships theorem panel + 1 worked example. 2 more examples remain.

- **First-load coaching state** (per Design F2.2)
  **Priority:** P2
  **What:** Animated ghost-finger gesture for 1.5s, "Kéo điểm M để khám phá" caption, dismissible, persisted in localStorage.

- **ARIA-live announcements on dragend**
  **Priority:** P2
  **What:** "Góc AMB bằng 47 độ" announced via `aria-live="polite"`. Per Design F6.4.

- **Multi-toggle theorem variants**
  **Priority:** P2
  **What:** Toggle between "góc nội tiếp" / "góc nội tiếp chắn nửa đường tròn = 90°" / "góc tạo bởi tiếp tuyến và dây cung". Each variant uses the same canvas with different fixed-point setup.

- **KaTeX inline rendering for theorem text**
  **Priority:** P3
  **What:** Currently uses Unicode (∠AMB, °) which renders fine in Be Vietnam Pro. Switch to KaTeX when notation gets richer (cung, đường tròn (O), etc.).

## Module 1 — Lớp 7 Tam giác bằng nhau

- **SAS / ASA / AAS / cạnh huyền-góc nhọn / cạnh huyền-cạnh góc vuông toggles**
  **Priority:** P2
  **What:** SSS shipped in v0.0.3.0. Add the other 5 cases as toggles on the same canvas — toggling switches which sides/angles get the matched encoding and which detector runs.

- **More worked examples (Module 1)**
  **Priority:** P3
  **What:** v0.0.3.0 ships 1 example. SGK textbook has many. Add 2 more.

## Module 2 — Lớp 8 Tam giác đồng dạng

- **Free-vertex-drag mode (AA / SAS / SSS đồng dạng detectors)**
  **Priority:** P2
  **What:** v0.0.4.0 ships scale-slider mode. Add a toggle to switch into free-drag mode where both triangles' vertices can be moved independently and the detector identifies which similarity case (if any) holds. Adds `src/geom-engine/similarity.ts`.

- **Numeric angle readouts on the canvas**
  **Priority:** P3
  **What:** Currently angles are pinned conceptually in prose. Add live numeric readouts (∠A, ∠B, ∠C and primes) so students see "the angles don't change" empirically.

## Testing & CI infrastructure (with first canvas module)

- **fast-check property tests**
  **Priority:** P1
  **What:** `∀ M on arc, |∠AMB − ∠AM₀B| < 0.5°` (inscribed-angle invariance). `∀ pointer, dist(projectToCircle(p, c), c.center) = c.r ± ε`.

- **Playwright e2e + multi-touch tests**
  **Priority:** P1
  **What:** Per-module happy-path + keyboard-path + multi-touch-path. Use `device: 'Pixel 5'` for touch profiles. Per autoplan test plan.

- **size-limit bundle gate**
  **Priority:** P2
  **What:** 200KB gz JS / 50KB gz CSS / 80KB woff2 fonts. CI fail-fast.

- **Lighthouse-CI gate**
  **Priority:** P2
  **What:** Mobile preset, ≥90 Perf + A11y. Run against `bun preview`.

- **axe-playwright a11y tests**
  **Priority:** P2
  **What:** Zero axe-violations on every module page.

- **Visual regression for tick-marks + Vietnamese diacritics**
  **Priority:** P2
  **What:** Argos / Playwright snapshot baselines.

## Retention & Distribution (post-MVP)

- **Zalo / Telegram subscribe CTA on every module**
  **Priority:** P2
  **What:** "Nhận theorem mới mỗi tuần" — turns hub into sequence. Per CEO finding (theme 4).

- **Lớp-9 course-spine "next theorem" footer card**
  **Priority:** P2
  **What:** Each lớp-9 module links forward to next theorem. Per Design F3.5.

- **OpenGraph image generation per module**
  **Priority:** P2
  **What:** Pre-rendered SVG-to-PNG of canvas hero state. Critical for FB / Zalo shares.

- **Schema.org `LearningResource` meta**
  **Priority:** P3
  **What:** Per-module structured data for Google rich results.

## Domain & infra (post-validation trigger)

- **Buy `.vn` / `.com.vn` domain**
  **Priority:** P1
  **What:** TRIGGER: 500 sessions/30d OR 1 organic teacher share OR ≥5 modules shipped (per RUNBOOK). VN registration takes 7–14 days.

- **Cloudflare Web Analytics**
  **Priority:** P2
  **What:** JS-injected, no cookies, no consent banner. Activate after first 50 daily sessions.

- **`PUBLIC_VERSION` env wiring**
  **Priority:** P3
  **What:** Currently `index.astro` reads `import.meta.env.PUBLIC_VERSION ?? '0.0.1.0'` — env never set. Wire it from CI build (read VERSION file) so footer doesn't rot on bump.

## Out of scope (deferred indefinitely or to v2)

- English / bilingual support
- Embed-as-iframe API (CSP frame-ancestors work)
- Comments via Giscus
- Account / auth / email capture
- Browser extension overlay (out of static scope)
- Anki-style spaced-repetition deck (different product shape)
- Print → digital QR bridge (distribution experiment, not engineering)
- Teacher-tool / B2B2C demo mode (build after Module 3 ships)

## Completed

- **Drag M around circle, project to circle constraint** — `src/components/inscribed-angle.ts` + `src/geom-engine/circle.ts:projectToCircle`. **Completed:** v0.0.2.0 (2026-04-29)
- **TheoremCanvas primitive first cut** — vanilla TS in Astro `<script>` tag, AbortController teardown on `astro:before-swap`. **Completed:** v0.0.2.0 (2026-04-29). Note: built directly in Astro rather than as a single HTML prototype first; the inscribed-angle pattern proved the shape, and the next module (lớp 7 / 8) will reuse this pattern.
- **SSS detector** — `src/geom-engine/triangle.ts:congruentSSS` with position-strict semantics. 10 unit tests including symmetry and EPSILON tolerance. **Completed:** v0.0.3.0 (2026-04-30)
- **SGK tick-mark encoding** — 1/2/3 ticks paired with the locked 3-color palette, rendered live during drag. Wired in Module 1 (Tam giác bằng nhau). **Completed:** v0.0.3.0 (2026-04-30). Tick rendering helper in `src/components/congruence-sss.ts:renderTicks` is reusable for future modules.
- **Scale slider clamped to [0.5, 2.0]** — `src/components/similarity-scale.ts` step 0.05. Cannot reach 0. **Completed:** v0.0.4.0 (2026-04-30)
- **Similarity ratio readout** — three ratio readouts (AB/A′B′, BC/B′C′, CA/C′A′) showing all-equal under scaling. **Completed:** v0.0.4.0 (2026-04-30) as part of Module 2.
