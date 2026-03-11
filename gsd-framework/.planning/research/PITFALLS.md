# Pitfalls Research

**Domain:** Bill Splitting Web Application
**Researched:** 2026-03-11
**Confidence:** MEDIUM (based on domain expertise and web development best practices)

---

## Critical Pitfalls

### Pitfall 1: Floating-Point Money Calculations

**What goes wrong:**
Using JavaScript's native `number` type (IEEE 754 floating-point) for currency calculations leads to precision errors. The classic example is `0.1 + 0.2 = 0.30000000000000004` instead of exactly `0.3`. This causes incorrect totals, awkward display values ("You owe $12.33333333333"), and failed equality checks.

**Why it happens:**
Floating-point numbers cannot exactly represent most decimal fractions. Only numbers that can be expressed as fractions with denominators that are powers of 2 (like 0.5, 0.25, 0.125) can be represented exactly. Common currency values like $0.10 or $0.20 cannot be represented precisely in binary floating-point.

**How to avoid:**
Store all amounts as integers representing cents (or the smallest currency unit). Perform all calculations in cents, then divide by 100 only for display. For example, store $12.50 as `1250` cents. Alternatively, use a library like `decimal.js` or `big.js` for arbitrary-precision decimal arithmetic.

```javascript
// WRONG
const total = 0.1 + 0.2; // 0.30000000000000004

// CORRECT - work in cents
const totalCents = 10 + 20; // 30 cents
const displayTotal = (totalCents / 100).toFixed(2); // "0.30"
```

**Warning signs:**
- Test cases failing with "expected 3.00, got 3.0000000000000004"
- Users reporting incorrect totals
- Display showing excessive decimal places
- Equality checks like `if (total === 10.00)` failing unexpectedly

**Phase to address:**
Phase 1 (Core Calculation Engine) - This must be solved before any calculation logic is written, as it affects the entire data model.

---

### Pitfall 2: Uneven Split Remainder Handling

**What goes wrong:**
When splitting a bill evenly among N people, the division often doesn't result in whole cents. For example, splitting $100 among 3 people is $33.333... per person. Developers often round and distribute, resulting in $33.33 x 3 = $99.99, leaving $0.01 unaccounted for. This "penny error" accumulates and confuses users who expect the math to add up exactly.

**Why it happens:**
Mathematical division of currency amounts often produces fractional cents. Without explicit handling of the remainder, rounding errors leave the total short or over by a few cents.

**How to avoid:**
Implement a "remainder distribution" algorithm. Calculate the base amount everyone pays, then distribute the leftover cents (typically 0 to N-1 cents) one by one to participants. Document which approach you use: first person pays extra, last person pays extra, or distribute evenly.

```javascript
function splitEvenly(totalCents, numPeople) {
  const baseAmount = Math.floor(totalCents / numPeople);
  const remainder = totalCents % numPeople;

  const splits = new Array(numPeople).fill(baseAmount);
  // Distribute remainder to first N people
  for (let i = 0; i < remainder; i++) {
    splits[i] += 1;
  }
  return splits;
}
// splitEvenly(10000, 3) => [3334, 3333, 3333] (sums to 10000)
```

**Warning signs:**
- Sum of individual amounts doesn't equal the total
- Users asking "where did the extra penny go?"
- Test cases with assertions like `expect(splits.reduce(sum) - total).toBe(0)` failing

**Phase to address:**
Phase 1 (Core Calculation Engine) - Part of the core splitting logic.

---

### Pitfall 3: Shared Item Assignment Complexity

**What goes wrong:**
Shared items (appetizers, pitchers, wine) can be shared among any subset of people, creating exponential complexity. A naive implementation may not handle partial sharing correctly (e.g., "Sarah and Mike share the nachos, but Jen doesn't"). Users get frustrated when they can't express real-world sharing scenarios, or worse, the math is wrong.

**Why it happens:**
The data model for item-to-person assignment is often designed as binary (either one person or everyone), but real-world sharing is many-to-many. Developers underestimate the UX complexity of selecting multiple people per item and the calculation complexity of dividing shared items.

**How to avoid:**
Design the data model from the start as many-to-many: each item has an array of participant IDs. The cost is divided evenly among participants. For the UI, use checkboxes or a multi-select mechanism per item. Test edge cases: item assigned to 0 people, item assigned to 1 person (should work like individual item), item assigned to everyone.

```javascript
// Data model
{
  items: [
    { id: 1, name: "Nachos", priceCents: 1200, participants: ["sarah", "mike"] },
    { id: 2, name: "Salad", priceCents: 900, participants: ["jen"] },
    { id: 3, name: "Wine", priceCents: 2400, participants: ["sarah", "mike", "jen"] }
  ]
}

// Calculation
function calculateItemShare(item, personId) {
  if (!item.participants.includes(personId)) return 0;
  return Math.floor(item.priceCents / item.participants.length);
}
```

**Warning signs:**
- Users unable to express "just Sarah and Mike" sharing
- UI forcing all-or-nothing sharing selection
- Bugs when 1 person is selected (should behave like individual item)
- Confusion about what "shared" means in the UI

**Phase to address:**
Phase 1 (Core Calculation Engine) - Data model must support this from the start. UI can be refined in Phase 2.

---

### Pitfall 4: Tax and Tip Distribution Logic

**What goes wrong:**
Tax and tip are often added as flat percentages at the end, but this can be unfair when people ordered items at different price points. If one person ordered a $5 salad and another a $30 steak, adding 20% tip and splitting it equally is unfair. Alternatively, if tax is split by percentage but tip is flat, the logic becomes confusing.

**Why it happens:**
There's no single "correct" way to distribute tax and tip. Developers either pick one approach without considering alternatives, or implement multiple options with confusing UX. The per-person tip requirement in this project adds additional complexity.

**How to avoid:**
Decide on a clear policy and document it. Common approaches:
1. **Proportional**: Tax/tip distributed proportional to each person's subtotal
2. **Equal split**: Tax/tip divided equally among all participants
3. **Per-item**: Tax/tip applied to each item before splitting

For per-person custom tips (as specified in PROJECT.md), calculate each person's tip on their subtotal, then sum.

```javascript
function calculateWithCustomTips(items, people, taxRate) {
  const personTotals = {};

  for (const person of people) {
    let subtotal = 0;
    for (const item of items) {
      if (item.participants.includes(person.id)) {
        subtotal += Math.floor(item.priceCents / item.participants.length);
      }
    }
    const tax = Math.floor(subtotal * taxRate);
    const tip = Math.floor(subtotal * person.tipRate);
    personTotals[person.id] = subtotal + tax + tip;
  }
  return personTotals;
}
```

**Warning signs:**
- Confusion in code comments about "is this right?"
- Test cases with hand-calculated expected values that don't match
- Users questioning why their total doesn't match their mental math
- Tip calculation taking the wrong base (pre-tax vs post-tax)

**Phase to address:**
Phase 1 (Core Calculation Engine) - Must be decided before any calculation logic is implemented.

---

### Pitfall 5: LocalStorage Data Loss Scenarios

**What goes wrong:**
LocalStorage is volatile. Users can clear browser data, use private/incognito mode, switch browsers, or use different devices. Bill history can disappear unexpectedly. Additionally, localStorage has a quota (typically 5-10MB) and throws `QuotaExceededError` when full.

**Why it happens:**
LocalStorage is designed for preferences and small caches, not as a reliable database. It's origin-scoped and browser-specific. Private browsing modes may not persist data at all.

**How to avoid:**
1. Set expectations in the UI: "Bills are saved on this device only"
2. Implement an export feature (JSON download) for backup
3. Handle `QuotaExceededError` gracefully with a user-friendly message
4. Consider adding a "clear old bills" feature to manage storage
5. Feature-detect localStorage availability before use

```javascript
function saveBill(bill) {
  try {
    const bills = JSON.parse(localStorage.getItem('bills') || '[]');
    bills.push(bill);
    localStorage.setItem('bills', JSON.stringify(bills));
    return true;
  } catch (e) {
    if (e.name === 'QuotaExceededError') {
      alert('Storage full! Please export and clear old bills.');
    }
    return false;
  }
}

function storageAvailable() {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
}
```

**Warning signs:**
- Bug reports of "my bills disappeared"
- Errors in console about `QuotaExceededError`
- App crashes when localStorage is disabled
- Data not persisting between sessions

**Phase to address:**
Phase 2 (Persistence Layer) - When implementing bill history and localStorage integration.

---

### Pitfall 6: Input Validation Edge Cases

**What goes wrong:**
Users enter unexpected inputs: negative prices, empty names, duplicate names, prices with more than 2 decimal places, extremely large numbers, or special characters. Without validation, the app produces nonsensical results or crashes.

**Why it happens:**
Developers assume well-behaved input during initial development. Edge cases are discovered only when real users interact with the app.

**How to avoid:**
Implement input validation at entry points:

| Input | Validation |
|-------|------------|
| Price | Must be non-negative number, max 2 decimal places, reasonable upper bound |
| Person name | Required, non-empty after trimming, unique within bill |
| Tip percentage | Must be 0-100 (or allow >100 for generous tippers) |
| Item name | Required, non-empty after trimming |

```javascript
function validatePrice(input) {
  const num = parseFloat(input);
  if (isNaN(num) || num < 0) return { valid: false, error: 'Price must be a positive number' };
  if (num > 99999.99) return { valid: false, error: 'Price exceeds maximum' };
  if (!/^\d+(\.\d{1,2})?$/.test(input)) {
    return { valid: false, error: 'Price must have at most 2 decimal places' };
  }
  return { valid: true, value: Math.round(num * 100) }; // Convert to cents
}
```

**Warning signs:**
- App accepting negative prices
- Two people with the same name causing calculation bugs
- Decimal input like "12.345" being accepted and causing display issues
- Very large numbers causing floating-point overflow

**Phase to address:**
Phase 2 (UI/UX Polish) - Input validation goes hand-in-hand with form handling.

---

## Technical Debt Patterns

Shortcuts that seem reasonable but create long-term problems.

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Store prices as floats | Faster to implement | Floating-point errors propagate everywhere | Never |
| Skip remainder handling | Simpler code | Totals don't add up, user confusion | Never |
| Use person name as ID | Simpler data model | Breaks with duplicate names, renames | Prototyping only |
| No input validation | Faster to code | Garbage data causes crashes later | Never |
| Inline all logic in UI components | Quick start | Hard to test, can't reuse logic | Prototyping only |
| Skip localStorage availability check | Simpler code | Crashes in private browsing | Never |

---

## Performance Traps

Patterns that work at small scale but fail as usage grows.

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Storing all bills in single localStorage key | Slow load/save with many bills | Use indexed keys or pagination | ~100+ bills |
| Re-rendering entire UI on every change | Sluggish feel with many items | Use targeted updates | ~50+ items |
| No pagination on bill history | Long list becomes unusable | Add pagination or lazy loading | ~20+ bills |
| Storing full bill objects in memory | Memory pressure with large history | Load on demand, archive old bills | ~1000+ bills |

Note: For a learning project with local storage, most of these won't be practical concerns. Focus on the first two if the app feels slow.

---

## Security Mistakes

Domain-specific security issues beyond general web security.

| Mistake | Risk | Prevention |
|---------|------|------------|
| XSS via item/person names | Malicious scripts execute when rendering user input | Escape all user input before rendering, use textContent not innerHTML |
| Storing sensitive data in localStorage | Visible to anyone with device access | Don't store sensitive info; this app stores only bill data (low sensitivity) |
| No input sanitization | Unexpected behavior or crashes | Validate and sanitize all inputs |

Note: Since this is a client-side-only app with no authentication, security concerns are minimal. The main risk is XSS through user-provided names.

---

## UX Pitfalls

Common user experience mistakes in bill splitting apps.

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| Requiring exact price entry (no $ symbol) | Users confused whether to type "$12.50" or "12.50" | Accept both, parse flexibly |
| Forcing a specific flow (add people first, then items) | Users may want to add items as they see them on receipt | Allow flexible order, validate only at calculation time |
| No visual feedback on who's sharing what | Users lose track of assignments | Use color coding or icons to show assignments |
| Showing too many decimal places | "You owe $12.333333" looks unprofessional | Always display as currency: $12.33 |
| No summary before final calculation | Users can't verify inputs before seeing totals | Show itemized summary with ability to edit |
| Confusing "shared" terminology | Does "shared" mean everyone or selected people? | Use explicit "Share with..." with multi-select |
| No way to undo/clear | One mistake requires starting over | Add undo, clear, and edit functionality |

---

## "Looks Done But Isn't" Checklist

Things that appear complete but are missing critical pieces.

- [ ] **Calculation Engine:** Often missing remainder handling - verify sum of splits equals original total exactly
- [ ] **Shared Items:** Often missing partial sharing (subset of people) - test with 2 of 3 people sharing an item
- [ ] **Tip Calculation:** Often using wrong base (pre-tax vs post-tax) - verify against manual calculation
- [ ] **LocalStorage:** Often missing error handling - test in private browsing mode
- [ ] **Input Validation:** Often missing edge cases - test negative numbers, empty strings, duplicates
- [ ] **Display Formatting:** Often showing raw numbers - verify all currency displays show $ and 2 decimals
- [ ] **Bill History:** Often missing ability to view/delete past bills - test full CRUD cycle

---

## Recovery Strategies

When pitfalls occur despite prevention, how to recover.

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Floating-point throughout codebase | HIGH | Refactor all money handling to use cents; audit every calculation |
| No remainder handling | MEDIUM | Add remainder distribution logic; existing bills may have penny errors (user can re-calculate) |
| Wrong data model for sharing | HIGH | Migrate data model to support many-to-many; may require re-entering bills |
| No localStorage error handling | LOW | Add try-catch and user messaging; no data migration needed |
| Missing input validation | MEDIUM | Add validation; clean up any corrupted data in storage |

---

## Pitfall-to-Phase Mapping

How roadmap phases should address these pitfalls.

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| Floating-point calculations | Phase 1 (Core Engine) | Unit test: 0.1 + 0.2 must equal 0.30 exactly |
| Uneven split remainders | Phase 1 (Core Engine) | Unit test: sum of splits must equal original total |
| Shared item complexity | Phase 1 (Core Engine) | Unit test: item shared by 2 of 3 people |
| Tax/tip distribution | Phase 1 (Core Engine) | Unit test: verify against hand-calculated expected value |
| LocalStorage issues | Phase 2 (Persistence) | Integration test: save/load in private mode |
| Input validation | Phase 2 (UI/UX) | Manual test: try negative prices, empty names, duplicates |
| XSS prevention | Phase 2 (UI/UX) | Manual test: enter `<script>alert(1)</script>` as name |
| UX polish items | Phase 2 (UI/UX) | User testing: observe first-time users |

---

## Sources

- Stack Overflow: "Is floating-point math broken?" (https://stackoverflow.com/questions/588004/is-floating-point-math-broken) - HIGH confidence
- MDN Web Docs: "Using the Web Storage API" (https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API) - HIGH confidence
- Personal experience with financial application development and bill splitting UX patterns - MEDIUM confidence
- Common patterns observed in existing bill splitting applications (Splitwise, Tricount, etc.) - MEDIUM confidence

---
*Pitfalls research for: Bill Splitting Web Application*
*Researched: 2026-03-11*
