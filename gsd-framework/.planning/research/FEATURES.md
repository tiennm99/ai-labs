# Feature Research

**Domain:** Bill Splitting Web Application
**Researched:** 2026-03-11
**Confidence:** MEDIUM

## Feature Landscape

### Table Stakes (Users Expect These)

Features users assume exist. Missing these = product feels incomplete.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Add people by name | Basic requirement - users need to identify who's splitting | LOW | Simple input form, array of names |
| Add items with prices | Core data entry - can't split without items | LOW | Form with item name + price fields |
| Assign items to people | The fundamental split operation | MEDIUM | UI challenge - need intuitive assignment flow |
| Calculate individual totals | Why users open a bill splitter | LOW | Sum assigned items per person |
| View final summary | Users need to see "who owes what" | LOW | Display per-person breakdown |
| Basic tip calculation | Tipping is standard in many contexts | LOW | Percentage applied to subtotal |
| Clear/reset bill | Users make mistakes or start fresh | LOW | Button to clear all data |

### Differentiators (Competitive Advantage)

Features that set the product apart. Not required, but valuable.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Custom tip per person | Reflects real-world where people tip differently (15% vs 20%) | MEDIUM | Per-person tip override, more calculation logic |
| Shared item handling | Appetizers, shared plates - common restaurant scenario | MEDIUM | Split item cost across selected people |
| Tax calculation/assignment | Tax can be split evenly or proportionally | MEDIUM | Different split methods for tax |
| Bill history (local storage) | Reference past bills, see patterns | LOW | localStorage persistence, list view |
| Uneven split percentages | Someone pays 60%, others 20% each | LOW | Percentage-based assignment option |
| Real-time running totals | See totals update as you assign items | LOW | Reactive UI updates |
| Receipt photo reference | Visual aid without OCR complexity | LOW | Store image, manual entry still required |
| Multiple currency support | Travel/dining abroad scenarios | MEDIUM | Currency selection and display |
| Equal split option | Quick split for simple bills | LOW | One-click divide evenly |

### Anti-Features (Commonly Requested, Often Problematic)

Features that seem good but create problems.

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| Payment processing | "Send money directly" convenience | Adds legal/compliance complexity, requires backend, PCI scope | Link to Venmo/PayPal profiles |
| Receipt OCR scanning | "Just snap and done" speed | OCR is unreliable, corrections take longer than manual entry | Photo reference + manual entry |
| User accounts/authentication | "Access bills anywhere" | Requires backend, auth complexity, security concerns | Local-only with export option |
| Bill sharing via link | "Send to friends" collaboration | Requires backend/database, sync complexity | Screenshot or text summary export |
| Real-time collaboration | "Everyone enters their own" | WebSocket infrastructure, conflict resolution, auth | Single-device entry (one person enters all) |
| Integration with payment apps | "Auto-pay what you owe" | API partnerships, varies by region, maintenance burden | Clear summary with manual payment |
| Expense tracking over time | "See spending patterns" | Scope creep into personal finance app | Keep focused: bill splitting only |
| Recurring bills | "Monthly dinner group" | Complexity for edge case, increases scope | Create new bill each time |

## Feature Dependencies

```
[Add People]
    └──required by──> [Assign Items]
                          └──required by──> [Calculate Totals]
                                                 └──required by──> [View Summary]

[Add Items]
    └──required by──> [Assign Items]

[Tip Calculation]
    └──enhances──> [View Summary]

[Shared Items]
    └──enhances──> [Assign Items] (more assignment options)

[Local Storage]
    └──enables──> [Bill History]

[Custom Tip Per Person]
    └──requires──> [Add People]
    └──conflicts──> [Simple Global Tip]
```

### Dependency Notes

- **Assign Items requires Add People + Add Items:** Cannot assign items until both people and items exist in the system
- **Calculate Totals requires Assign Items:** No totals until items are assigned to people
- **View Summary requires Calculate Totals:** Summary displays the calculated breakdown
- **Local Storage enables Bill History:** Persistence layer must exist before history feature works
- **Custom Tip Per Person conflicts with Simple Global Tip:** Two different mental models - pick one default, allow override

## MVP Definition

### Launch With (v1)

Minimum viable product - what's needed to validate the concept.

- [ ] Add people by name - Core: identify who's splitting
- [ ] Add items with prices - Core: what was ordered
- [ ] Assign items to specific people - Core: who ordered what
- [ ] Mark items as "shared" - Common scenario: appetizers, shared plates
- [ ] Calculate per-person totals - Core: math must work
- [ ] Set tip percentage (global default) - Standard expectation
- [ ] View final summary with breakdown - Core: "who owes what"
- [ ] Clear/reset to start fresh - Basic usability

### Add After Validation (v1.x)

Features to add once core is working.

- [ ] Custom tip per person - Trigger: users request it, different tipping preferences
- [ ] Bill history (local storage) - Trigger: users want to reference past bills
- [ ] Equal split option - Trigger: users want quick simple splits
- [ ] Tax handling - Trigger: users confused about tax allocation
- [ ] Export summary as text/image - Trigger: users want to share results

### Future Consideration (v2+)

Features to defer until product-market fit is established.

- [ ] Receipt photo reference (no OCR) - Nice-to-have visual aid
- [ ] Multiple currency support - Edge case: international dining
- [ ] Percentage-based splits - Advanced: partial ownership scenarios
- [ ] Bill templates - Recurring similar bills

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| Add people by name | HIGH | LOW | P1 |
| Add items with prices | HIGH | LOW | P1 |
| Assign items to people | HIGH | MEDIUM | P1 |
| Mark items as shared | HIGH | MEDIUM | P1 |
| Calculate totals | HIGH | LOW | P1 |
| View summary | HIGH | LOW | P1 |
| Global tip percentage | HIGH | LOW | P1 |
| Clear/reset | MEDIUM | LOW | P1 |
| Custom tip per person | MEDIUM | MEDIUM | P2 |
| Bill history (local storage) | MEDIUM | LOW | P2 |
| Equal split option | MEDIUM | LOW | P2 |
| Tax handling | MEDIUM | MEDIUM | P2 |
| Export summary | LOW | LOW | P3 |
| Receipt photo reference | LOW | MEDIUM | P3 |
| Multiple currency | LOW | MEDIUM | P3 |

**Priority key:**
- P1: Must have for launch
- P2: Should have, add when possible
- P3: Nice to have, future consideration

## Competitor Feature Analysis

| Feature | Splitwise | Splid | Settle Up | Our Approach |
|---------|-----------|-------|-----------|--------------|
| Add people | Yes (contacts) | Yes (manual) | Yes (manual) | Manual entry, simple |
| Add items | Yes | Yes | Yes | Manual entry with price |
| Item assignment | Yes | Yes | Yes | Person picker per item |
| Shared items | Yes (split) | Yes | Yes | Explicit "shared" toggle |
| Tip handling | Global percentage | Per-person | Global | Global default, P2 per-person |
| Tax handling | Included | Separate | Separate | P2 feature |
| Bill history | Yes (cloud) | Yes (local) | Yes (cloud) | Local storage only |
| User accounts | Required | No | Required | No accounts (local only) |
| Payment integration | Yes (Venmo/PayPal) | No | No | No - out of scope |
| Receipt scanning | Yes (OCR) | No | Yes (OCR) | No - out of scope |
| Collaboration | Real-time sync | No | Real-time sync | No - single device |
| Export | Yes | Yes | Yes | P3: text/image export |

### Competitor Insights

**Splitwise (Market Leader):**
- Feature-rich but complex UI
- Requires account creation - friction for quick bill splitting
- OCR scanning is flagship feature but often inaccurate
- Payment integrations are key differentiator for power users
- Overkill for simple restaurant bill scenarios

**Splid:**
- Simple, focused on quick splits
- No accounts - closer to our approach
- Less feature bloat, faster to use
- Good UX reference for simplicity

**Settle Up:**
- Mid-ground between Splitwise and Splid
- Currency support for travel
- Some OCR features

**Our Position:**
- Focus on the "quick restaurant bill" use case
- No accounts = instant start, no friction
- Simple UI beats feature completeness
- Manual entry is faster than correcting bad OCR
- Custom tip per person is our differentiator (most don't do this well)

## Sources

- Splitwise.com - Official website feature tour
- Splitwise Google Play Store listing - Feature list and user reviews
- Settle Up (settleup.io) - Website feature overview
- Splid (splid.app) - Website feature overview
- PROJECT.md constraints and requirements

---
*Feature research for: Bill Splitting Web Application*
*Researched: 2026-03-11*
