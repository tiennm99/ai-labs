---
phase: 4
slug: game-state-management
status: draft
nyquist_compliant: true
wave_0_complete: false
created: 2026-03-11
---

# Phase 4 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest 4.0.18 |
| **Config file** | vitest.config.ts |
| **Quick run command** | `npm test -- --run <TestName>` |
| **Full suite command** | `npm test -- --run` |
| **Estimated runtime** | ~5 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm test -- --run <TestName>`
- **After every plan wave:** Run `npm test -- --run`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 5 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 04-01-01 | 01 | 1 | CORE-09 | unit | `npm test -- --run GameStateManager` | ❌ W0 | ⬜ pending |
| 04-01-02 | 01 | 1 | CORE-09 | unit | `npm test -- --run GameStateManager` | ❌ W0 | ⬜ pending |
| 04-02-01 | 02 | 2 | CORE-08 | unit | `npm test -- --run NoMovesDetector` | ❌ W0 | ⬜ pending |
| 04-02-02 | 02 | 2 | CORE-09 | unit | `npm test -- --run GameStateManager` | ❌ W0 | ⬜ pending |
| 04-02-03 | 02 | 2 | CORE-08 | integration | `npm test -- --run Game` | ❌ W0 | ⬜ pending |
| 04-02-04 | 02 | 2 | CORE-09 | integration | `npm test -- --run Game` | ❌ W0 | ⬜ pending |
| 04-03-01 | 03 | 3 | CORE-09 | integration | `npm test -- --run Game` | ❌ W0 | ⬜ pending |
| 04-03-02 | 03 | 3 | CORE-09 | integration | `npm test -- --run Game` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `src/__tests__/GameStateManager.test.ts` — state transition tests, win/lose detection
- [ ] `src/__tests__/NoMovesDetector.test.ts` — type-optimized detection algorithm tests
- [ ] `src/__tests__/Game.integration.test.ts` — restart and overlay integration tests
- [ ] Framework: Vitest already configured (no install needed)

---

## Manual-Only Verifications

Plan 04-03 Task 3 includes a checkpoint:human-verify for manual testing of restart functionality.

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references (completes after Plan 04-00 executes)
- [x] No watch-mode flags
- [x] Feedback latency < 5s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** Pending (Wave 0 test files will be created by Plan 04-00, then set `wave_0_complete: true`)
