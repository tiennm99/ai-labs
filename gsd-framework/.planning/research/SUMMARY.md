# Project Research Summary

**Project:** Expense Splitter (Client-side Bill Splitting Application)
**Domain:** Client-side web application (expense splitting)
**Researched:** 2026-03-11
**Confidence:** HIGH

## Executive Summary

This is a client-side bill splitting web application designed for quick restaurant bill scenarios. Industry leaders like Splitwise and Splid demonstrate that the core value proposition is accurate per-person calculations with minimal friction. The recommended approach is a lightweight Preact + Vite stack with Preact Signals for state management, prioritizing instant-load, no-account-required simplicity over feature completeness.

The key architectural decision is using unidirectional data flow with pure calculation functions, storing money as cents (integers) to avoid floating-point errors. Critical risks include floating-point precision bugs, uneven split remainder handling, and localStorage volatility. These are mitigated by designing the data model correctly from day one: cents-based calculations, many-to-many item assignments, and clear user expectations about local-only storage.

## Key Findings

### Recommended Stack

Use Preact 10.x with Vite 7.x for a minimal 3KB framework footprint with React-compatible APIs. Preact Signals handles state management without boilerplate. This stack prioritizes learning React patterns while keeping bundle size tiny for a client-only app.

**Core technologies:**
- **Preact 10.x:** UI framework - 3KB bundle, React-compatible API, official Vite integration
- **Vite 7.x:** Build tool - instant HMR, native ES modules, zero-config setup (requires Node.js 20.19+ or 22.12+)
- **Preact Signals 1.x:** State management - built into Preact, automatic fine-grained reactivity, no provider boilerplate

**Supporting technologies:**
- **Tailwind CSS 3.4.x:** Styling - rapid UI development (alternative: vanilla CSS for learning)
- **Vitest 2.x:** Testing - Vite-native, Jest-compatible API

### Expected Features

**Must have (table stakes - P1):**
- Add people by name - basic requirement for identifying who's splitting
- Add items with prices - core data entry for what was ordered
- Assign items to people (including shared items) - fundamental split operation
- Mark items as "shared" - common scenario for appetizers, shared plates
- Calculate per-person totals - core value proposition
- Set tip percentage (global default) - standard expectation
- View final summary with breakdown - "who owes what"
- Clear/reset to start fresh - basic usability

**Should have (competitive - P2):**
- Custom tip per person - differentiator, most competitors don't do this well
- Bill history (local storage) - reference past bills
- Equal split option - quick simple splits
- Tax handling - users often confused about tax allocation
- Export summary as text/image - share results without backend

**Defer (v2+):**
- Receipt photo reference (no OCR) - nice-to-have visual aid
- Multiple currency support - edge case for international dining
- Percentage-based splits - advanced partial ownership scenarios
- User accounts, payment processing, real-time collaboration - all out of scope (anti-features)

### Architecture Approach

Use unidirectional data flow with a single BillStore as source of truth. All calculation logic is pure functions for testability. Storage is isolated behind a StorageService wrapper. Money is always stored as cents (integers) to avoid floating-point errors.

**Major components:**
1. **BillStore** - single source of truth for people, items, assignments, tipPreferences
2. **Calculator** - pure functions for split calculations, tip distribution, totals
3. **StorageService** - localStorage wrapper with error handling (QuotaExceededError)
4. **UI Components** - PeopleList/PersonForm, ItemsList/ItemForm/ItemAssign, Summary/TipConfig

**Key data model:**
```
state: {
  people: [{id, name}],
  items: [{id, name, priceCents, participants: [personId, ...]}],
  tipPreferences: {personId: percentage},
  taxRate: number
}
```

### Critical Pitfalls

1. **Floating-Point Money Calculations** - Store all amounts as cents (integers), divide by 100 only for display. Never use JavaScript floats for currency.
2. **Uneven Split Remainder Handling** - Implement remainder distribution algorithm. Sum of splits must equal original total exactly.
3. **Shared Item Assignment Complexity** - Design data model as many-to-many from the start. Each item has array of participant IDs.
4. **Tax and Tip Distribution Logic** - Decide clear policy (proportional vs equal split). Per-person custom tips calculate on individual subtotals.
5. **LocalStorage Data Loss** - Set expectations ("saved on this device only"), handle QuotaExceededError, add export feature for backup.

## Implications for Roadmap

Based on research, suggested phase structure:

### Phase 1: Core Calculation Engine
**Rationale:** Must be solved before any UI work. Data model and calculation logic are the foundation - get this wrong and everything else is built on sand.
**Delivers:** Working calculation engine with unit tests proving correctness
**Addresses:** Add people, add items, assign items, mark shared, calculate totals, global tip, view summary
**Avoids:** Floating-point errors, remainder bugs, shared item complexity, tax/tip confusion
**Stack:** Preact, Vite, Vitest
**Architecture:** BillStore, Calculator (pure functions), models (Person, Item, Assignment)

### Phase 2: UI Components & Persistence
**Rationale:** With calculation engine proven correct, build UI that consumes it. Add localStorage for bill history.
**Delivers:** Functional user interface with bill history
**Uses:** Preact components, Preact Signals, StorageService
**Implements:** PeopleList, ItemsList, ItemAssign, Summary, TipConfig components
**Addresses:** Clear/reset, bill history (local storage)
**Avoids:** XSS (escape user input), localStorage errors (QuotaExceededError handling), input validation edge cases

### Phase 3: Polish & P2 Features
**Rationale:** Enhance core experience with competitive differentiators after MVP is solid.
**Delivers:** Custom tip per person, equal split option, tax handling, export summary
**Uses:** Existing Calculator patterns extended for per-person tips
**Addresses:** Custom tip per person (differentiator), equal split, tax handling, export

### Phase Ordering Rationale

- **Phase 1 first:** Calculation correctness is non-negotiable. All pitfalls in PITFALLS.md trace back to Phase 1 decisions. Unit tests prove correctness before UI work.
- **Phase 2 second:** UI consumes proven calculation engine. Persistence layer is independent of calculation logic.
- **Phase 3 last:** P2 features are enhancements, not blockers. Get core right first.

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 3 (Custom tip per person):** UX for per-person tip configuration needs design exploration - how to present without cluttering UI

Phases with standard patterns (skip research-phase):
- **Phase 1 (Core Engine):** Well-documented patterns for money handling, pure functions, unit testing
- **Phase 2 (UI Components):** Standard Preact component patterns, localStorage API is well-documented

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Official docs verified for Vite 7.x, Preact 10.x, Signals 1.x. Version compatibility confirmed. |
| Features | MEDIUM | Competitor analysis based on public websites, not internal data. User need prioritization is inferred. |
| Architecture | HIGH | Standard patterns for client-side apps, well-documented in MDN and community resources. |
| Pitfalls | MEDIUM | Based on domain expertise and web development best practices. Some patterns from personal experience. |

**Overall confidence:** HIGH

### Gaps to Address

- **Per-person tip UX:** How to present per-person tip configuration without cluttering the interface. Solution: Design exploration during Phase 3 planning, consider progressive disclosure (global tip shown, "customize" reveals per-person).
- **Shared item UI:** Multi-select mechanism for assigning items to subset of people. Solution: Use checkbox list or person chips per item, test with real users in Phase 2.
- **Bill history navigation:** How to present history list when user has many bills. Solution: Defer to Phase 3, implement pagination if needed.

## Sources

### Primary (HIGH confidence)
- Vite Official Docs (https://vite.dev/) - Version 7.3.1, Node.js requirements
- Preact Official Docs (https://preactjs.com/) - Vite integration, Signals documentation
- MDN Web Docs: Web Storage API - localStorage patterns, error handling
- Stack Overflow: "Is floating-point math broken?" - Floating-point precision issues

### Secondary (MEDIUM confidence)
- Splitwise.com - Feature analysis from public website
- Splid (splid.app) - Feature analysis, UX reference for simplicity
- Settle Up (settleup.io) - Feature analysis
- SplitPro GitHub (https://github.com/oss-apps/split-pro) - Reference implementation patterns
- Personal experience with financial application development

### Tertiary (LOW confidence)
- Competitor feature gaps inferred from public information - validate during user testing

---
*Research completed: 2026-03-11*
*Ready for roadmap: yes*
