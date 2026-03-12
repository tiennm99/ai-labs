# Roadmap: Expense Splitter

## Overview

Build a client-side bill splitting app that takes users from "we just ate" to "here's what everyone owes" in seconds. Start with the core data entry and assignment flow, add accurate calculations with tip handling, then enable persistence so users can reference past bills.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Bill Entry & Assignment** - Add people, items, and assign who ordered what
- [ ] **Phase 2: Calculation & Results** - See who owes what with tip calculations
- [ ] **Phase 3: Bill History** - Save, view, and load past bills

## Phase Details

### Phase 1: Bill Entry & Assignment
**Goal**: Users can create a bill by adding people and items with flexible assignments
**Depends on**: Nothing (first phase)
**Requirements**: PEOPLE-01, PEOPLE-02, PEOPLE-03, PEOPLE-04
**Success Criteria** (what must be TRUE):
  1. User can add people to the bill by entering their names
  2. User can add items with name and price to the bill
  3. User can assign any item to one or more specific people
  4. User can mark an item as "shared" to split it across selected people
**Plans**: 5 plans in 4 waves

Plans:
- [ ] 01-01: Test infrastructure (Vitest + test stubs for all requirements)
- [ ] 01-02: Core data layer (currency utils + billStore with CRUD)
- [ ] 01-03: People UI (PersonForm + PeopleList)
- [ ] 01-04: Items UI (ItemForm + ItemsList + ItemAssign)
- [ ] 01-05: Integration checkpoint (human verification)

### Phase 2: Calculation & Results
**Goal**: Users can see exactly who owes what with tip applied
**Depends on**: Phase 1
**Requirements**: CALC-01, CALC-02, CALC-03, CALC-04
**Success Criteria** (what must be TRUE):
  1. User can see each person's subtotal from their assigned items
  2. User can set a global tip percentage that applies to everyone
  3. User can see each person's final total with tip included
  4. User can view a clear summary showing who owes how much
**Plans**: TBD

Plans:
- [ ] 02-01: [To be defined during planning]

### Phase 3: Bill History
**Goal**: Users can save and retrieve their past bills
**Depends on**: Phase 2
**Requirements**: PERSIST-01, PERSIST-02, PERSIST-03
**Success Criteria** (what must be TRUE):
  1. User's bills are automatically saved to browser local storage
  2. User can view a list of their past bills
  3. User can load a past bill to review the details
**Plans**: TBD

Plans:
- [ ] 03-01: [To be defined during planning]

## Progress

**Execution Order:**
Phases execute in numeric order: 1 -> 2 -> 3

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Bill Entry & Assignment | 0/5 | Not started | - |
| 2. Calculation & Results | 0/TBD | Not started | - |
| 3. Bill History | 0/TBD | Not started | - |
