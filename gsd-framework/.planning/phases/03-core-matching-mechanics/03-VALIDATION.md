---
phase: 03
slug: core-matching-mechanics
status: ready
nyquist_compliant: true
wave_0_complete: false
created: 2026-03-11
---

# Phase 03 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest |
| **Config file** | vitest.config.ts |
| **Quick run command** | `npm test -- --run src/__tests__/PathFinder.test.ts` |
| **Full suite command** | `npm test -- --run` |
| **Estimated runtime** | ~5 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm test -- --run` (affected test files only)
- **After every plan wave:** Run `npm test -- --run` (full suite)
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 10 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 03-01-01 | 01 | 1 | CORE-04 | unit | `npm test -- --run src/__tests__/PathFinder.test.ts` | ❌ W0 | ⬜ pending |
| 03-01-02 | 01 | 1 | CORE-04 | unit | `npm test -- --run src/__tests__/PathFinder.test.ts` | ❌ W0 | ⬜ pending |
| 03-02-01 | 02 | 2 | CORE-05, CORE-06 | unit | `npm test -- --run src/__tests__/Scoring.test.ts` | ❌ W0 | ⬜ pending |
| 03-02-02 | 02 | 2 | CORE-05, CORE-06 | unit | `npm test -- --run src/__tests__/MatchEngine.test.ts` | ❌ W0 | ⬜ pending |
| 03-02-03 | 02 | 2 | CORE-07 | unit | `npm test -- --run src/__tests__/GridManager.test.ts` | ✅ exists | ⬜ pending |
| 03-02-04 | 02 | 2 | BOARD-02 | manual | HTML element check | ✅ exists | ⬜ pending |
| 03-02-05 | 02 | 2 | CORE-05, CORE-06, BOARD-02 | unit | `npm test -- --run src/__tests__/Game.test.ts` | ✅ exists | ⬜ pending |
| 03-03-01 | 03 | 3 | BOARD-02 | unit | `npm test -- --run src/__tests__/Renderer.test.ts` | ✅ exists | ⬜ pending |
| 03-03-02 | 03 | 3 | BOARD-02 | unit | `npm test -- --run src/__tests__/Renderer.test.ts` | ✅ exists | ⬜ pending |
| 03-03-03 | 03 | 3 | BOARD-02 | unit | `npm test -- --run src/__tests__/Renderer.test.ts` | ✅ exists | ⬜ pending |
| 03-03-04 | 03 | 3 | BOARD-02 | unit | `npm test -- --run src/__tests__/Game.test.ts` | ✅ exists | ⬜ pending |
| 03-03-05 | 03 | 3 | BOARD-02 | manual | Visual verification in browser | N/A | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `src/__tests__/PathFinder.test.ts` — stubs for BFS pathfinding tests
- [ ] `src/__tests__/MatchEngine.test.ts` — stubs for match validation tests
- [ ] `src/__tests__/Scoring.test.ts` — stubs for scoring system tests
- [ ] Extend `src/__tests__/Renderer.test.ts` — add shake animation and path drawing tests

*Note: Existing vitest infrastructure from Phase 1 covers framework setup. Wave 0 adds test stubs for new Phase 3 components.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Visual feedback for match success | BOARD-02 | Canvas animation timing/feel | 1. Start dev server `npm run dev`<br>2. Select two matching tiles with valid path<br>3. Verify: Connection line draws for ~300ms<br>4. Verify: Tiles disappear smoothly<br>5. Verify: Score popup appears and updates |
| Visual feedback for match failure (wrong type) | BOARD-02 | Canvas animation feel | 1. Select two different tile types<br>2. Verify: Both tiles shake horizontally for ~200ms<br>3. Verify: Tiles deselect after shake |
| Visual feedback for match failure (path too long) | BOARD-02 | Visual distinction from wrong type | 1. Select matching tiles requiring 3+ turns<br>2. Verify: Different shake pattern (circular vs horizontal)<br>3. Verify: Tiles deselect after shake |
| Score overlay positioning/styling | CORE-07 | Visual design preference | 1. Match multiple tiles<br>2. Verify: Score appears in top-right corner<br>3. Verify: Semi-transparent background<br>4. Verify: Text is readable |

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all MISSING references
- [x] No watch-mode flags
- [x] Feedback latency < 10s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** ready for execution
