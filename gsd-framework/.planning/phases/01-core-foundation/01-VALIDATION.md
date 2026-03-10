---
phase: 01
slug: core-foundation
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-10
---

# Phase 01 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest 3.x |
| **Config file** | vitest.config.ts (Wave 0 creates) |
| **Quick run command** | `npm run test` |
| **Full suite command** | `npm run test -- --run` |
| **Estimated runtime** | ~2 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm run test`
- **After every plan wave:** Run `npm run test -- --run`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 5 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 01-01-01 | 01 | 1 | CORE-01 | unit | `npm run test` | ❌ W0 | ⬜ pending |
| 01-01-02 | 01 | 1 | CORE-01 | unit | `npm run test` | ❌ W0 | ⬜ pending |
| 01-02-01 | 02 | 1 | CORE-01 | unit | `npm run test` | ❌ W0 | ⬜ pending |
| 01-02-02 | 02 | 1 | CORE-01 | unit | `npm run test` | ❌ W0 | ⬜ pending |
| 01-03-01 | 03 | 1 | CORE-01 | unit | `npm run test` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `vitest.config.ts` — test framework configuration
- [ ] `src/__tests__/config.test.ts` — verifies config constants are valid
- [ ] `src/__tests__/Tile.test.ts` — verifies tile model behavior
- [ ] `src/__tests__/GameLoop.test.ts` — verifies loop start/stop/tick
- [ ] `src/__tests__/EventEmitter.test.ts` — verifies typed emit/on
- [ ] Framework install: `npm install -D vitest @vitest/coverage-v8 @types/node`

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Canvas renders colored background | CORE-01 | Visual verification | Run `npm run dev`, verify colored Canvas appears |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 5s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
