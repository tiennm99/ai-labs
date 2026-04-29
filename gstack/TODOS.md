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

- **Drag M around circle, project to circle constraint**
  **Priority:** P1
  **What:** `M = center + r·normalize(pointer − center)` every `pointermove`. No free movement. Per Eng failure mode #4.

- **Theorem panel + 3 worked SGK-style examples**
  **Priority:** P1

- **First-load coaching state** (per Design F2.2)
  **Priority:** P2
  **What:** Animated ghost-finger gesture for 1.5s, "Kéo điểm M để khám phá" caption, dismissible, persisted in localStorage.

- **ARIA-live announcements on dragend**
  **Priority:** P2
  **What:** "Góc AMB bằng 47 độ" announced via `aria-live="polite"`. Per Design F6.4.

## Module 1 — Lớp 7 Tam giác bằng nhau (weekend 3)

- **SSS / SAS / ASA / AAS / cạnh huyền-góc nhọn / cạnh huyền-cạnh góc vuông detectors**
  **Priority:** P1
  **What:** Pure geometry functions in `src/geom-engine/congruence.ts`. Use `EPSILON_LEN = 0.5`. Color-pair highlighting + green "Hai tam giác bằng nhau" badge.
  **Note:** Rigid-motion overlay animation EXPLICITLY DROPPED per autoplan (was scope creep).

- **SGK tick-mark encoding**
  **Priority:** P1
  **What:** 1/2/3 ticks for matching sides, 1/2/3 arcs for matching angles. Always paired with the 3-color palette (#D7263D / #1B998B / #F46036). Per Design Decision D3 — single largest a11y + pedagogical unlock.

## Module 2 — Lớp 8 Tam giác đồng dạng (weekend 4)

- **Similarity ratio + AA/SAS/SSS-similar detectors**
  **Priority:** P1
  **What:** `src/geom-engine/similarity.ts`. Live ratio display via numeric text-node updates only (KaTeX template rendered at build, never re-parsed during drag).

- **Scale slider clamped to [0.5, 2.0]**
  **Priority:** P1
  **What:** `min=0.5, max=2, step=0.05`. Cannot reach 0. Per Eng failure mode #3.

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
