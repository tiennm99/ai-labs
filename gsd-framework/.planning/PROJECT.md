# Expense Splitter

## What This Is

A web app for splitting restaurant bills fairly among friends. Handles the messy reality of shared appetizers, individual items, different tip preferences, and tax calculations. Add people, add items, assign who ordered what, and get a clear summary of who owes how much.

Learning project to practice building a complete web application.

## Core Value

Everyone leaves knowing exactly what they owe - no arguing, no awkward math at the table.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Add people to a bill by name
- [ ] Add items with prices
- [ ] Assign items to specific people or mark as "shared"
- [ ] Set custom tip percentage per person
- [ ] View final summary: "Sarah owes $34.50, Mike owes $28.20..."
- [ ] Save bills to local storage for history

### Out of Scope

- User accounts/authentication — local storage only
- Backend server — fully client-side
- Mobile native apps — web-first
- Receipt scanning/OCR — manual entry
- Payment processing — calculation only, no money transfer
- Bill sharing via link — local storage means device-specific

## Context

Learning project for practicing web development. Focus on clean UX for the item assignment flow - that's where most bill splitters get confusing. The core interaction is: how quickly can someone go from "we just ate" to "here's what everyone owes"?

## Constraints

- **Tech stack**: Client-side web app (HTML/CSS/JS or framework)
- **Persistence**: Browser local storage only
- **Complexity**: Keep it focused - bill splitting, not a full finance app

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Local storage only | Simplifies architecture, good for learning, no auth complexity | — Pending |
| Custom tip per person | Reflects real-world scenario where people tip differently | — Pending |

---
*Last updated: 2026-03-11 after initialization*
