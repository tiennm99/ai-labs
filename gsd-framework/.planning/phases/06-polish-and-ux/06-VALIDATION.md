---
phase: 6
slug: polish-and-ux
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-11
---

# Phase 6 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest (node environment) |
| **Config file** | vitest.config.ts |
| **Quick run command** | `npm run test -- --run` |
| **Full suite command** | `npm run test` |
| **Estimated runtime** | ~5 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm run test -- --run`
- **After every plan wave:** Run `npm run test`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 5 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 06-01-01 | 01 | 1 | UX-01 | unit | `npm run test -- --run src/__tests__/Renderer.test.ts` | ❌ W0 | ⬜ pending |
| 06-01-02 | 01 | 1 | UX-01 | unit | `npm run test -- --run src/__tests__/Renderer.test.ts` | ❌ W0 | ⬜ pending |
| 06-02-01 | 02 | 1 | UX-01 | unit | `npm run test -- --run src/__tests__/Renderer.test.ts` | ❌ W0 | ⬜ pending |
| 06-03-01 | 03 | 2 | UX-02 | unit | `npm run test -- --run src/__tests__/Game.test.ts` | ❌ W0 | ⬜ pending |
| 06-03-02 | 03 | 2 | UX-02 | unit | `npm run test -- --run src/__tests__/Renderer.test.ts` | ❌ W0 | ⬜ pending |
| 06-04-01 | 04 | 2 | UX-03 | unit | `npm run test -- --run src/__tests__/Game.test.ts` | ❌ W0 | ⬜ pending |
| 06-04-02 | 04 | 2 | UX-03 | unit | `npm run test -- --run src/__tests__/Game.test.ts` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `src/__tests__/Renderer.test.ts` — Add tests for MatchAnimation class
- [ ] `src/__tests__/Renderer.test.ts` — Add tests for RippleAnimation class
- [ ] `src/__tests__/Renderer.test.ts` — Add tests for glow effect in drawPathLine()
- [ ] `src/__tests__/Game.test.ts` — Add tests for responsive canvas scaling logic
- [ ] `src/__tests__/Game.test.ts` — Add tests for touch prevention behavior

*Existing test infrastructure covers all phase requirements; Wave 0 adds test cases for new functionality.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Visual "pop" feel of match animation | UX-01 | Subjective feel, requires human judgment | Play game, match tiles, verify animation feels satisfying |
| Glow visibility on different screens | UX-01 | Visual perception varies by display | Test on multiple devices, verify glow is visible |
| Ripple effect visual appeal | UX-02 | Subjective visual feedback | Touch tiles on mobile, verify ripple looks good |
| Responsive layout feel | UX-03 | Requires device testing | Test on phone portrait/landscape, verify grid fits well |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 5s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
