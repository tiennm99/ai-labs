# Phase 1: Bill Entry & Assignment - Research

**Researched:** 2026-03-12
**Domain:** Preact + Signals for client-side bill splitting with item assignment
**Confidence:** HIGH

## Summary

Phase 1 implements the core data entry and assignment flow for the bill splitter. Users need to add people, add items with prices, and assign items to specific people or mark them as shared. The research indicates using Preact Signals for reactive state management with a many-to-many data model for item-to-person assignments.

**Primary recommendation:** Use Preact Signals with a single store pattern. Store prices as cents (integers) to avoid floating-point errors. Design the assignment data model as a Map from the start to support flexible sharing scenarios.

## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| PEOPLE-01 | User can add people to the bill by name | Preact Signals array CRUD pattern, unique ID generation |
| PEOPLE-02 | User can add items with name and price | Signal array pattern, price validation, cents storage |
| PEOPLE-03 | User can assign items to specific people | Many-to-many assignment map, checkbox multi-select UI |
| PEOPLE-04 | User can mark items as "shared" to split across selected people | Same data model as PEOPLE-03 (array of participant IDs) |

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Preact | 10.x | UI framework | 3KB bundle, React-compatible API, project research established |
| @preact/signals | 1.x | State management | Built into Preact, automatic reactivity, no boilerplate |
| Vite | 7.x | Build tool | Industry standard, instant HMR, Preact template |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Vitest | 2.x | Unit testing | Required for validation per project config |
| Tailwind CSS | 3.4.x | Styling | Optional, rapid UI development |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Preact Signals | Zustand | More boilerplate, not Preact-native |
| Tailwind CSS | Vanilla CSS | More verbose, but good for learning fundamentals |

**Installation:**
```bash
npm create vite@latest expense-splitter -- --template preact
cd expense-splitter
npm install
npm install @preact/signals
npm install -D vitest
```

## Architecture Patterns

### Recommended Project Structure
```
src/
├── main.jsx                 # App entry point
├── app.jsx                  # Root component
├── components/
│   ├── people/
│   │   ├── PeopleList.jsx   # Display all people
│   │   └── PersonForm.jsx   # Add new person
│   ├── items/
│   │   ├── ItemsList.jsx    # Display all items
│   │   ├── ItemForm.jsx     # Add new item with price
│   │   └── ItemAssign.jsx   # Multi-select for assignment
│   └── common/
│       ├── Button.jsx       # Reusable button
│       ├── Input.jsx        # Reusable text input
│       └── Checkbox.jsx     # Multi-select checkbox
├── store/
│   └── billStore.js         # Central state with signals
├── utils/
│   ├── currency.js          # Cents <-> dollars conversion
│   └── id.js                # Unique ID generation
└── tests/
    ├── billStore.test.js    # Store CRUD tests
    └── currency.test.js     # Money handling tests
```

### Pattern 1: Signal-Based Store with Actions

**What:** Centralize all bill state in a single store object using signals. Actions modify state immutably.

**When to use:** Always for this phase - provides single source of truth and easy testing.

**Example:**
```javascript
// Source: Preact Signals docs - https://preactjs.com/guide/v10/signals
import { signal, computed, batch } from '@preact/signals';

// Store factory for testability
function createBillStore() {
  const people = signal([]);
  const items = signal([]);
  const assignments = signal(new Map()); // itemId -> personIds[]

  return {
    people,
    items,
    assignments,

    // Actions
    addPerson(name) {
      const id = crypto.randomUUID();
      people.value = [...people.value, { id, name }];
    },

    addItem(name, priceCents) {
      const id = crypto.randomUUID();
      items.value = [...items.value, { id, name, priceCents }];
    },

    assignItem(itemId, personIds) {
      const newMap = new Map(assignments.value);
      newMap.set(itemId, personIds);
      assignments.value = newMap;
    },

    // Computed: items with their assignments
    itemsWithAssignments: computed(() => {
      return items.value.map(item => ({
        ...item,
        assignedTo: assignments.value.get(item.id) || []
      }));
    })
  };
}

export const store = createBillStore();
```

### Pattern 2: Money as Cents (Integer)

**What:** Store all prices as integer cents. Convert to dollars only for display.

**When to use:** Always - prevents floating-point errors (0.1 + 0.2 !== 0.3).

**Example:**
```javascript
// utils/currency.js
export function dollarsToCents(dollars) {
  return Math.round(parseFloat(dollars) * 100);
}

export function centsToDollars(cents) {
  return (cents / 100).toFixed(2);
}

export function formatCurrency(cents) {
  return `$${centsToDollars(cents)}`;
}

// Usage in form
function ItemForm() {
  const handleSubmit = (e) => {
    const priceInput = e.target.price.value;
    const priceCents = dollarsToCents(priceInput);
    store.addItem(name, priceCents);
  };
}
```

### Pattern 3: Multi-Select Assignment UI

**What:** For each item, show checkboxes for all people. Selected checkboxes = people who share that item.

**When to use:** PEOPLE-03 and PEOPLE-04 requirements.

**Example:**
```javascript
// components/items/ItemAssign.jsx
function ItemAssign({ item }) {
  const assignedTo = store.assignments.value.get(item.id) || [];

  const togglePerson = (personId) => {
    const current = assignedTo.includes(personId)
      ? assignedTo.filter(id => id !== personId)
      : [...assignedTo, personId];
    store.assignItem(item.id, current);
  };

  return (
    <div class="item-assign">
      {store.people.value.map(person => (
        <label key={person.id}>
          <input
            type="checkbox"
            checked={assignedTo.includes(person.id)}
            onChange={() => togglePerson(person.id)}
          />
          {person.name}
        </label>
      ))}
    </div>
  );
}
```

### Anti-Patterns to Avoid
- **Storing prices as floats:** Causes precision errors. Use cents (integers).
- **Using person name as ID:** Breaks with duplicate names. Use UUID.
- **Storing derived data:** Only store source data. Calculate totals on read.
- **Binary shared/individual model:** Real sharing is many-to-many. Use participant array from the start.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Unique IDs | Custom counter/UUID function | `crypto.randomUUID()` | Built-in, collision-resistant, no dependencies |
| State management | Custom event emitter | Preact Signals | Already in stack, automatic reactivity |
| Form validation | Complex validation library | Simple validation functions | Overkill for this scope |

**Key insight:** The bill splitter domain is simple enough that custom solutions add complexity without benefit. Stick to native APIs and Signals.

## Common Pitfalls

### Pitfall 1: Floating-Point Money
**What goes wrong:** `0.1 + 0.2 = 0.30000000000000004` in JavaScript
**Why it happens:** IEEE 754 floating-point cannot exactly represent most decimals
**How to avoid:** Store as cents (integers). Convert only for display.
**Warning signs:** Test failures with "expected 3.00, got 3.0000000000000004"

### Pitfall 2: Duplicate Person Names
**What goes wrong:** Two "John Smith"s cause assignment confusion
**Why it happens:** Using name as identifier instead of unique ID
**How to avoid:** Always use `crypto.randomUUID()` for person and item IDs
**Warning signs:** Assignments affecting wrong person

### Pitfall 3: Empty Assignment State
**What goes wrong:** Item with no assignments causes divide-by-zero in calculations (Phase 2)
**Why it happens:** Not handling the 0 participants edge case
**How to avoid:** Default to empty array `[]`, validate before calculation
**Warning signs:** `Infinity` or `NaN` in calculated totals

### Pitfall 4: Missing Input Validation
**What goes wrong:** Negative prices, empty names, non-numeric input
**Why it happens:** Assuming well-behaved user input
**How to avoid:** Validate all inputs before adding to store
**Warning signs:** App accepting "$-5.00" or empty item names

## Code Examples

### Adding a Person (PEOPLE-01)
```javascript
// Source: Preact Signals docs pattern
import { signal } from '@preact/signals';

function createBillStore() {
  const people = signal([]);

  return {
    people,
    addPerson(name) {
      const trimmed = name.trim();
      if (!trimmed) return { success: false, error: 'Name required' };

      const id = crypto.randomUUID();
      people.value = [...people.value, { id, name: trimmed }];
      return { success: true };
    }
  };
}
```

### Adding an Item with Price (PEOPLE-02)
```javascript
function createBillStore() {
  const items = signal([]);

  return {
    items,
    addItem(name, priceInput) {
      const trimmedName = name.trim();
      const priceCents = Math.round(parseFloat(priceInput) * 100);

      if (!trimmedName) return { success: false, error: 'Item name required' };
      if (isNaN(priceCents) || priceCents < 0) {
        return { success: false, error: 'Valid price required' };
      }

      const id = crypto.randomUUID();
      items.value = [...items.value, { id, name: trimmedName, priceCents }];
      return { success: true };
    }
  };
}
```

### Assigning Items to People (PEOPLE-03, PEOPLE-04)
```javascript
// Same data model handles both specific assignment and "shared"
function createBillStore() {
  const assignments = signal(new Map());

  return {
    assignments,

    // Assign to specific people (shared or individual)
    setAssignment(itemId, personIds) {
      const newMap = new Map(assignments.value);
      newMap.set(itemId, [...personIds]); // Copy array
      assignments.value = newMap;
    },

    // Get people assigned to an item
    getAssignedPeople(itemId) {
      return assignments.value.get(itemId) || [];
    }
  };
}

// "Shared" is just assignment to multiple people - no special case needed
// store.setAssignment('nachos-id', ['sarah', 'mike', 'jen']); // Shared by 3
// store.setAssignment('salad-id', ['sarah']); // Individual item
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Redux for state | Preact Signals | Signals release | Less boilerplate, finer-grained updates |
| Counter-based IDs | crypto.randomUUID() | Modern browsers | No collision handling needed |
| parseFloat for money | Integer cents | Industry standard | No floating-point errors |

**Deprecated/outdated:**
- `Math.random()` for IDs: Use `crypto.randomUUID()` instead
- Redux/Zustand for this scope: Overkill, use Signals

## Open Questions

1. **Should unassigned items be allowed?**
   - What we know: Items can exist without assignments (new items, user hasn't selected yet)
   - What's unclear: Should we require assignment before moving to Phase 2 calculation?
   - Recommendation: Allow unassigned items in Phase 1. Phase 2 can show warning or exclude from totals.

2. **What's the max reasonable number of people/items?**
   - What we know: Typical restaurant bill is 2-8 people, 5-20 items
   - What's unclear: Do we need pagination or virtualization?
   - Recommendation: No pagination needed for Phase 1. Typical use case is well within UI limits.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest 2.x |
| Config file | `vitest.config.js` (to be created in Wave 0) |
| Quick run command | `npm test` |
| Full suite command | `npm test -- --run` |

### Phase Requirements -> Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|--------------|
| PEOPLE-01 | Add person by name | unit | `vitest run tests/billStore.test.js -t "add person"` | No - Wave 0 |
| PEOPLE-02 | Add item with name/price | unit | `vitest run tests/billStore.test.js -t "add item"` | No - Wave 0 |
| PEOPLE-03 | Assign item to specific people | unit | `vitest run tests/billStore.test.js -t "assign"` | No - Wave 0 |
| PEOPLE-04 | Mark item as shared | unit | `vitest run tests/billStore.test.js -t "shared"` | No - Wave 0 |

### Sampling Rate
- **Per task commit:** `npm test` (watch mode during development)
- **Per wave merge:** `npm test -- --run` (full suite, non-watch)
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `tests/billStore.test.js` - covers PEOPLE-01, PEOPLE-02, PEOPLE-03, PEOPLE-04
- [ ] `tests/currency.test.js` - covers cents/dollars conversion
- [ ] `vitest.config.js` - Vitest configuration
- [ ] Framework install: `npm install -D vitest` - if not already installed

### Test File Structure
```javascript
// tests/billStore.test.js
import { describe, it, expect, beforeEach } from 'vitest';
import { createBillStore } from '../src/store/billStore.js';

describe('BillStore', () => {
  let store;

  beforeEach(() => {
    store = createBillStore();
  });

  describe('addPerson (PEOPLE-01)', () => {
    it('adds person with valid name', () => {
      const result = store.addPerson('Alice');
      expect(result.success).toBe(true);
      expect(store.people.value).toHaveLength(1);
      expect(store.people.value[0].name).toBe('Alice');
    });

    it('rejects empty name', () => {
      const result = store.addPerson('');
      expect(result.success).toBe(false);
    });
  });

  describe('addItem (PEOPLE-02)', () => {
    it('adds item with name and price', () => {
      const result = store.addItem('Pizza', '15.99');
      expect(result.success).toBe(true);
      expect(store.items.value[0].priceCents).toBe(1599);
    });
  });

  describe('assignItem (PEOPLE-03, PEOPLE-04)', () => {
    it('assigns item to one person', () => {
      store.addPerson('Alice');
      const personId = store.people.value[0].id;
      store.addItem('Salad', '10.00');
      const itemId = store.items.value[0].id;

      store.setAssignment(itemId, [personId]);
      expect(store.getAssignedPeople(itemId)).toEqual([personId]);
    });

    it('assigns item to multiple people (shared)', () => {
      store.addPerson('Alice');
      store.addPerson('Bob');
      const [id1, id2] = store.people.value.map(p => p.id);
      store.addItem('Nachos', '12.00');
      const itemId = store.items.value[0].id;

      store.setAssignment(itemId, [id1, id2]);
      expect(store.getAssignedPeople(itemId)).toHaveLength(2);
    });
  });
});
```

## Sources

### Primary (HIGH confidence)
- Preact Signals Official Docs - https://preactjs.com/guide/v10/signals - Signal patterns, store factory, computed values
- Vitest Official Docs - https://vitest.dev/guide/ - Testing setup, API reference
- Project Stack Research - .planning/research/STACK.md - Technology choices

### Secondary (MEDIUM confidence)
- Project Architecture Research - .planning/research/ARCHITECTURE.md - Component structure, data flow
- Project Pitfalls Research - .planning/research/PITFALLS.md - Domain-specific gotchas

### Tertiary (LOW confidence)
- None for this phase

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Based on project-level research, official docs verified
- Architecture: HIGH - Preact Signals patterns well-documented, architecture research complete
- Pitfalls: HIGH - Domain pitfalls documented in project research

**Research date:** 2026-03-12
**Valid until:** 30 days (stable stack, low churn)
