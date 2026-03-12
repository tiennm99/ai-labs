---
phase: 1
slug: bill-entry-assignment
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-12
---

# Phase 1 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest 2.x |
| **Config file** | `vitest.config.js` (Wave 0 creates) |
| **Quick run command** | `npm test` |
| **Full suite command** | `npm test -- --run` |
| **Estimated runtime** | ~5 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm test`
- **After every plan wave:** Run `npm test -- --run`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 5 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 01-01-01 | 01 | 1 | PEOPLE-01 | unit | `npm test -- -t "add person"` | ❌ W0 | ⬜ pending |
| 01-01-02 | 01 | 1 | PEOPLE-02 | unit | `npm test -- -t "add item"` | ❌ W0 | ⬜ pending |
| 01-02-01 | 02 | 1 | PEOPLE-03 | unit | `npm test -- -t "assign"` | ❌ W0 | ⬜ pending |
| 01-02-02 | 02 | 1 | PEOPLE-04 | unit | `npm test -- -t "shared"` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `vitest.config.js` — Vitest configuration
- [ ] `tests/billStore.test.js` — stubs for PEOPLE-01, PEOPLE-02, PEOPLE-03, PEOPLE-04
- [ ] `tests/currency.test.js` — cents/dollars conversion tests
- [ ] `npm install -D vitest` — if framework not detected

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| None | - | - | - |

*All phase behaviors have automated verification.*

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 5s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
