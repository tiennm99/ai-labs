import { signal } from '@preact/signals';

/**
 * Create a new bill store instance.
 * Factory pattern enables test isolation.
 * @returns {Object} Store with signals and actions
 */
export function createBillStore() {
  const people = signal([]);
  const items = signal([]);
  const assignments = signal(new Map());

  return {
    // Signals (read-only access via .value)
    people,
    items,
    assignments,

    // PEOPLE-01: Add person to bill
    addPerson(name) {
      const trimmed = name.trim();
      if (!trimmed) {
        return { success: false, error: 'Name required' };
      }

      const id = crypto.randomUUID();
      people.value = [...people.value, { id, name: trimmed }];
      return { success: true };
    },

    // PEOPLE-02: Add item to bill
    addItem(name, priceInput) {
      const trimmedName = name.trim();
      if (!trimmedName) {
        return { success: false, error: 'Item name required' };
      }

      const priceCents = Math.round(parseFloat(priceInput) * 100);
      if (isNaN(priceCents) || priceCents < 0) {
        return { success: false, error: 'Valid price required' };
      }

      const id = crypto.randomUUID();
      items.value = [...items.value, { id, name: trimmedName, priceCents }];
      return { success: true };
    },

    // PEOPLE-03, PEOPLE-04: Assign item to people
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

// Singleton store for application use
export const store = createBillStore();
