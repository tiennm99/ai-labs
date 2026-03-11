---
phase: 05
slug: board-generation-and-recovery
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-11
---

# Phase 05 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest (node environment) |
| **Config file** | vitest.config.ts |
| **Quick run command** | `npm test -- --run` |
| **Full suite command** | `npm test` |
| **Estimated runtime** | ~5 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm test -- --run`
- **After every plan wave:** Run `npm test`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 5 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 05-01-01 | 01 | 1 | BOARD-01 | unit | `npm test -- --run GridManager.test.ts` | ✅ enhance | ⬜ pending |
| 05-01-02 | 01 | 1 | BOARD-01 | unit | `npm test -- --run GridManager.test.ts` | ✅ enhance | ⬜ pending |
| 05-02-01 | 02 | 1 | BOARD-01 | unit | `npm test -- --run GridManager.test.ts` | ✅ enhance | ⬜ pending |
| 05-03-01 | 03 | 2 | BOARD-01 | integration | `npm test -- --run Game.test.ts` | ✅ enhance | ⬜ pending |
| 05-03-02 | 03 | 2 | BOARD-01 | unit | `npm test -- --run Game.test.ts` | ✅ enhance | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `src/__tests__/GridManager.test.ts` — Add tests for `generateRandomGrid()` solvability verification
- [ ] `src/__tests__/GridManager.test.ts` — Add tests for `shuffleTiles()` method
- [ ] `src/__tests__/Game.test.ts` — Add tests for auto-shuffle trigger on no-moves
- [ ] `src/__tests__/Game.test.ts` — Add tests for shuffle overlay display
- [ ] `src/types/index.ts` — Add `board:shuffling` and `board:shuffled` events to GameEvents interface

*Existing infrastructure covers most requirements; tests will be enhanced during Wave 1.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Shuffle animation visual smoothness | BOARD-01 | Visual quality assessment | Run game, clear tiles until no-moves, observe crossfade animation |
| Overlay message readability | BOARD-01 | UI/UX assessment | Verify "Shuffling..." text is readable and positioned correctly |

*Core behaviors have automated verification; visual polish requires manual check.*

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 5s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
