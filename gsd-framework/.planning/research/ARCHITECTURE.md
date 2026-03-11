# Architecture Research: Client-Side Bill Splitting App

**Domain:** Client-side web application (expense splitting)
**Researched:** 2026-03-11
**Confidence:** HIGH

## Standard Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                           UI Layer                               │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │ PeopleList  │  │  ItemsList  │  │  Summary    │             │
│  │  Component  │  │  Component  │  │  Component  │             │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘             │
│         │                │                │                     │
│  ┌──────┴──────┐  ┌──────┴──────┐  ┌──────┴──────┐             │
│  │ PersonForm  │  │  ItemForm   │  │  TipConfig  │             │
│  │  Component  │  │  Component  │  │  Component  │             │
│  └─────────────┘  └─────────────┘  └─────────────┘             │
├─────────────────────────────────────────────────────────────────┤
│                        State Manager                             │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              BillStore (Single Source of Truth)           │   │
│  │  - people: Person[]                                       │   │
│  │  - items: Item[]                                          │   │
│  │  - assignments: Map<itemId, personIds[]>                  │   │
│  │  - tipPreferences: Map<personId, percentage>              │   │
│  └──────────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────────┤
│                        Business Logic                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │  Calculator  │  │  Validator   │  │  Normalizer  │          │
│  │   Service    │  │   Service    │  │   Service    │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
├─────────────────────────────────────────────────────────────────┤
│                       Persistence Layer                          │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              StorageService (localStorage wrapper)         │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Typical Implementation |
|-----------|----------------|------------------------|
| BillStore | Single source of truth for bill state | Plain JS object with observer pattern or framework state |
| CalculatorService | Split calculations, tip distribution, totals | Pure functions for testability |
| StorageService | localStorage read/write, serialization | Async wrapper around localStorage API |
| ValidatorService | Input validation, business rules | Pure functions returning validation results |
| PeopleList/PersonForm | CRUD for people in the bill | UI components bound to store |
| ItemsList/ItemForm | CRUD for items, price entry | UI components with assignment UI |
| SummaryComponent | Display final split amounts | Computed from store via calculator |
| TipConfigComponent | Per-person tip percentage | UI bound to tipPreferences map |

## Recommended Project Structure

```
src/
├── index.html              # Entry point
├── main.js                 # App initialization, wire dependencies
├── components/             # UI components (view layer)
│   ├── people/
│   │   ├── PeopleList.js   # List all people
│   │   └── PersonForm.js   # Add/edit person
│   ├── items/
│   │   ├── ItemsList.js    # List all items
│   │   ├── ItemForm.js     # Add/edit item
│   │   └── ItemAssign.js   # Assign item to people
│   ├── summary/
│   │   ├── Summary.js      # Final breakdown display
│   │   └── TipConfig.js    # Per-person tip settings
│   └── common/
│       ├── Button.js       # Reusable button
│       ├── Input.js        # Reusable input
│       └── Modal.js        # Reusable modal
├── store/                  # State management
│   ├── BillStore.js        # Main store with state
│   └── StoreObserver.js    # Pub/sub for UI updates
├── services/               # Business logic
│   ├── Calculator.js       # Split math, totals
│   ├── Validator.js        # Input validation
│   └── StorageService.js   # localStorage wrapper
├── models/                 # Data shapes (if using TS or JSDoc)
│   ├── Person.js
│   ├── Item.js
│   └── Assignment.js
└── utils/                  # Pure utility functions
    ├── currency.js         # Format/parse money
    └── math.js             # Rounding helpers
```

### Structure Rationale

- **components/:** Organized by domain (people, items, summary) with shared UI in common/
- **store/:** Centralized state with observer pattern for reactive updates without framework overhead
- **services/:** Pure business logic separated from UI, easy to test in isolation
- **models/:** Data shape definitions, factory functions for creating valid entities
- **utils/:** Stateless helpers, no dependencies on app state

## Architectural Patterns

### Pattern 1: Unidirectional Data Flow

**What:** State changes flow in one direction: Action -> Store Update -> UI Re-render

**When to use:** Always for this domain - prevents state sync bugs

**Trade-offs:** Slightly more boilerplate, but eliminates "where did this come from?" bugs

**Example:**
```javascript
// User clicks "Add Person"
// 1. Component dispatches action
function handleAddPerson(name) {
  const action = { type: 'ADD_PERSON', payload: { name } };
  store.dispatch(action);
}

// 2. Store updates state
function reducer(state, action) {
  if (action.type === 'ADD_PERSON') {
    return {
      ...state,
      people: [...state.people, { id: generateId(), name: action.payload.name }]
    };
  }
  return state;
}

// 3. Store notifies subscribers
store.subscribe((newState) => {
  peopleList.render(newState.people);
});
```

### Pattern 2: Pure Calculator Functions

**What:** All calculation logic is pure functions with no side effects

**When to use:** For any math/derivation from state - enables easy testing and debugging

**Trade-offs:** May need to pass more parameters, but worth it for testability

**Example:**
```javascript
// Pure function - same input always = same output, no side effects
function calculateSplit(items, assignments, tipPreferences, taxRate) {
  const perPerson = new Map();

  // Initialize per-person totals
  for (const personId of Object.keys(tipPreferences)) {
    perPerson.set(personId, { subtotal: 0, tip: 0, tax: 0, total: 0 });
  }

  // Assign item costs
  for (const item of items) {
    const assignedTo = assignments.get(item.id) || [];
    const splitCount = assignedTo.length || 1;
    const perPersonShare = item.price / splitCount;

    for (const personId of assignedTo) {
      perPerson.get(personId).subtotal += perPersonShare;
    }
  }

  // Apply tax and tips
  for (const [personId, totals] of perPerson) {
    totals.tax = totals.subtotal * taxRate;
    totals.tip = (totals.subtotal + totals.tax) * (tipPreferences[personId] / 100);
    totals.total = totals.subtotal + totals.tax + totals.tip;
  }

  return perPerson;
}
```

### Pattern 3: Storage Adapter Pattern

**What:** Wrap localStorage in a service with consistent interface, handle serialization

**When to use:** Always - isolates persistence details, enables future migration

**Trade-offs:** Thin abstraction, but provides test seam and error handling

**Example:**
```javascript
const StorageService = {
  save(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      return { success: true };
    } catch (e) {
      if (e.name === 'QuotaExceededError') {
        return { success: false, error: 'Storage full' };
      }
      return { success: false, error: e.message };
    }
  },

  load(key) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      console.error('Failed to load from storage:', e);
      return null;
    }
  }
};
```

## Data Flow

### Request Flow (User Action to UI Update)

```
[User adds item]
       |
       v
[ItemForm Component] --> dispatches action
       |
       v
[BillStore.reducer()] --> returns new state
       |
       v
[StorageService.save()] --> persists to localStorage
       |
       v
[Store notifies subscribers]
       |
       v
[ItemsList re-renders] + [Summary recalculates]
```

### State Management

```
┌─────────────────────────────────────────────────────────────┐
│                        BillStore                             │
│  state: {                                                    │
│    people: [{id, name}],                                     │
│    items: [{id, name, price}],                               │
│    assignments: {itemId: [personId, ...]},                   │
│    tipPreferences: {personId: percentage},                   │
│    taxRate: number                                           │
│  }                                                           │
└──────────────────────┬──────────────────────────────────────┘
                       | (subscribe)
        ┌──────────────┼──────────────┐
        v              v              v
  [PeopleList]   [ItemsList]   [Summary]
        |              |              |
        └──────────────┴──────────────┘
                       |
                       v
              [Calculator.calculateSplit()]
                       |
                       v
              Derived data for display
```

### Key Data Flows

1. **Add Person Flow:** User input -> PersonForm -> dispatch ADD_PERSON -> Store updates people array -> StorageService persists -> Subscribers notified -> PeopleList + ItemAssign dropdowns update

2. **Assign Item Flow:** User clicks person chip -> ItemAssign -> dispatch ASSIGN_ITEM -> Store updates assignments map -> StorageService persists -> Summary recalculates split

3. **Calculate Summary Flow:** Store state change -> Summary component receives new state -> calls Calculator.calculateSplit() -> renders per-person breakdown

4. **Load History Flow:** App init -> StorageService.load('bills') -> parse JSON -> hydrate BillStore -> all components render

## Build Order (Dependencies)

```
Phase 1: Foundation (no dependencies)
├── utils/currency.js        # Format money, parse input
├── utils/math.js            # Rounding, division
└── models/Person.js         # Person factory/validator

Phase 2: Core Services (depends on Phase 1)
├── services/Validator.js    # Uses currency utils
├── services/StorageService.js
└── store/StoreObserver.js   # Pub/sub base class

Phase 3: State Layer (depends on Phase 2)
├── models/Item.js           # Item factory
├── models/Assignment.js     # Assignment factory
└── store/BillStore.js       # Uses Observer, StorageService

Phase 4: Business Logic (depends on Phase 2-3)
└── services/Calculator.js   # Pure functions, uses math utils

Phase 5: UI Components (depends on Phase 3-4)
├── components/common/*      # Reusable UI primitives
├── components/people/*      # Depends on BillStore
├── components/items/*       # Depends on BillStore
└── components/summary/*     # Depends on BillStore, Calculator

Phase 6: Integration (depends on all)
├── main.js                  # Wire everything together
└── index.html               # Load and initialize
```

### Build Order Rationale

1. **Utils first:** Zero dependencies, needed everywhere
2. **Services second:** Need utils, don't need state
3. **Store third:** Needs services (storage), provides state to UI
4. **Calculator parallel:** Pure functions, only needs utils
5. **UI last:** Consumes everything above
6. **Integration final:** Wires the dependency graph

## Anti-Patterns

### Anti-Pattern 1: Storing Derived Data

**What people do:** Store calculated totals per person in localStorage

**Why it's wrong:** Source of truth drifts - if items change but totals don't recalc, data is inconsistent

**Do this instead:** Store only source data (people, items, assignments). Calculate totals on read.

### Anti-Pattern 2: Direct localStorage in Components

**What people do:** Components call localStorage directly

**Why it's wrong:** Hard to test, hard to change storage strategy, no error handling

**Do this instead:** All storage goes through StorageService, components only interact with store

### Anti-Pattern 3: Two-Way Binding Without Store

**What people do:** Form inputs directly update DOM elements that display totals

**Why it's wrong:** Unpredictable update order, hard to debug, state scattered

**Do this instead:** All state changes go through store, UI subscribes and re-renders

### Anti-Pattern 4: Storing Money as Floating Point

**What people do:** Store prices as `12.99` (float)

**Why it's wrong:** Floating point errors accumulate (`0.1 + 0.2 !== 0.3`)

**Do this instead:** Store as cents (integers: `1299`) or use a decimal library. Format for display only.

## Scaling Considerations

| Scale | Architecture Adjustments |
|-------|--------------------------|
| Single user, <100 bills | Current architecture is optimal |
| Single user, 1000+ bills | Add bill list/archive view, lazy load, consider IndexedDB |
| Multi-device sync | Requires backend - outside current scope |

### Scaling Priorities

1. **First bottleneck:** localStorage size (5-10MB limit) - mitigate with bill archival, only keep recent in active storage
2. **Second bottleneck:** UI performance with many items - mitigate with virtualization or pagination

## Integration Points

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| None | N/A | Client-side only, no external API calls |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| UI <-> Store | Subscribe/notify pattern | Components subscribe to store changes |
| Store <-> StorageService | Direct function calls | Synchronous for simplicity |
| Store <-> Calculator | Pull on demand | Calculator called when summary renders |

## Sources

- MDN Web Docs: MVC Architecture - https://developer.mozilla.org/en-US/docs/Glossary/MVC
- MDN Web Docs: Client-side Frameworks - https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Client-side_JavaScript_frameworks/Introduction
- MDN Web Docs: Web Storage API - https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API
- SplitPro Reference Implementation - https://github.com/oss-apps/split-pro (full-stack reference, adapted for client-only)

---
*Architecture research for: Client-side bill splitting web application*
*Researched: 2026-03-11*
