# Requirements: Expense Splitter

**Defined:** 2026-03-11
**Core Value:** Everyone leaves knowing exactly what they owe - no arguing, no awkward math at the table.

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### People & Items

- [ ] **PEOPLE-01**: User can add people to the bill by name
- [ ] **PEOPLE-02**: User can add items with name and price
- [ ] **PEOPLE-03**: User can assign items to specific people
- [ ] **PEOPLE-04**: User can mark items as "shared" to split across selected people

### Calculations

- [ ] **CALC-01**: System calculates per-person subtotal from assigned items
- [ ] **CALC-02**: User can set a global tip percentage
- [ ] **CALC-03**: System applies tip to calculate final per-person total
- [ ] **CALC-04**: System displays clear breakdown showing who owes what

### Persistence

- [ ] **PERSIST-01**: System saves bills to browser local storage
- [ ] **PERSIST-02**: User can view history of past bills
- [ ] **PERSIST-03**: User can load a past bill to review

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Enhanced Features

- **PEOPLE-05**: User can edit/delete people and items after adding
- **PEOPLE-06**: User can use quick equal split option for simple bills
- **PEOPLE-07**: User can split by percentage (e.g., someone pays 60%)
- **CALC-05**: User can set custom tip percentage per person
- **CALC-06**: System handles tax with multiple split options (even, proportional)
- **PERSIST-04**: User can export summary as text or image

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| User accounts/authentication | Local storage only - no backend complexity |
| Backend server | Fully client-side app |
| Mobile native apps | Web-first, works in mobile browser |
| Receipt scanning/OCR | Manual entry is faster than correcting bad OCR |
| Payment processing | Calculation only - no money transfer |
| Bill sharing via link | Local storage is device-specific |
| Real-time collaboration | Single-device entry (one person enters all) |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| PEOPLE-01 | Phase 1 | Pending |
| PEOPLE-02 | Phase 1 | Pending |
| PEOPLE-03 | Phase 1 | Pending |
| PEOPLE-04 | Phase 1 | Pending |
| CALC-01 | Phase 1 | Pending |
| CALC-02 | Phase 1 | Pending |
| CALC-03 | Phase 1 | Pending |
| CALC-04 | Phase 1 | Pending |
| PERSIST-01 | Phase 2 | Pending |
| PERSIST-02 | Phase 2 | Pending |
| PERSIST-03 | Phase 2 | Pending |

**Coverage:**
- v1 requirements: 11 total
- Mapped to phases: 11
- Unmapped: 0 ✓

---
*Requirements defined: 2026-03-11*
*Last updated: 2026-03-11 after initial definition*
