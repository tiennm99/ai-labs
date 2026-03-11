---
phase: 02
slug: grid-and-input
status: draft
nyquist_compliant: true
wave_0_complete: true
created: 2026-03-11
---

# Phase 02 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest 2.x |
| **Config file** | vitest.config.ts (from Phase 1) |
| **Quick run command** | `npm test -- --run` |
| **Full suite command** | `npm test -- --run` |
| **Estimated runtime** | ~5 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm test -- --run`
- **After every plan wave:** Run `npm test -- --run`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 10 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 02-00-01 | 00 | 0 | CORE-02, CORE-03 | setup | `npm test -- --run src/__tests__/GridManager.test.ts` | ✅ | ⬜ pending |
| 02-00-02 | 00 | 0 | CORE-02, CORE-03 | setup | `npm test -- --run src/__tests__/Renderer.test.ts` | ✅ | ⬜ pending |
| 02-00-03 | 00 | 0 | CORE-02, CORE-03 | setup | `npm test -- --run src/__tests__/Game.test.ts` | ✅ | ⬜ pending |
| 02-01-01 | 01 | 1 | CORE-02, CORE-03 | unit | `npm test -- --run src/__tests__/GridManager.test.ts` | ✅ | ⬜ pending |
| 02-01-02 | 01 | 1 | CORE-02, CORE-03 | unit | `npx tsc --noEmit` | ✅ | ⬜ pending |
| 02-02-01 | 02 | 1 | CORE-02 | unit | `npm test -- --run src/__tests__/Renderer.test.ts` | ✅ | ⬜ pending |
| 02-03-01 | 03 | 2 | CORE-02, CORE-03 | unit | `npm test -- --run src/__tests__/Game.test.ts` | ✅ | ⬜ pending |
| 02-03-02 | 03 | 2 | CORE-02, CORE-03 | unit | `npm test -- --run src/__tests__/Game.test.ts -t "input"` | ✅ | ⬜ pending |
| 02-03-03 | 03 | 2 | CORE-02, CORE-03 | unit | `npm test -- --run src/__tests__/Game.test.ts -t "resize"` | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [x] `src/__tests__/GridManager.test.ts` — stubs for CORE-02 (grid data structure)
- [x] `src/__tests__/Renderer.test.ts` — stubs for CORE-02 (tile rendering)
- [x] `src/__tests__/Game.test.ts` — stubs for CORE-03 (input handling)
- [x] Existing Vitest infrastructure covers all phase requirements

**Status:** ✅ Complete (Plan 02-00 establishes test infrastructure)

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Visual feedback (fade-in animation) | CORE-02 | Animation smoothness is subjective | Run dev server, select tiles, observe fade-in timing |
| Touch responsiveness on mobile | CORE-03 | Requires physical touch device | Test on phone/tablet, verify no lag |
| Grid centering on different screens | CORE-02 | Visual appearance check | Resize browser, verify grid stays centered |

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all MISSING references
- [x] No watch-mode flags
- [x] Feedback latency < 10s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
