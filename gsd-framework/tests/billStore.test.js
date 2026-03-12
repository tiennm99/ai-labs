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

    it('trims whitespace from name', () => {
      const result = store.addPerson('  Bob  ');
      expect(result.success).toBe(true);
      expect(store.people.value[0].name).toBe('Bob');
    });
  });

  describe('addItem (PEOPLE-02)', () => {
    it('adds item with name and price', () => {
      const result = store.addItem('Pizza', '15.99');
      expect(result.success).toBe(true);
      expect(store.items.value[0].priceCents).toBe(1599);
    });

    it('rejects empty item name', () => {
      const result = store.addItem('', '10.00');
      expect(result.success).toBe(false);
    });

    it('rejects negative price', () => {
      const result = store.addItem('Item', '-5.00');
      expect(result.success).toBe(false);
    });

    it('rejects non-numeric price', () => {
      const result = store.addItem('Item', 'abc');
      expect(result.success).toBe(false);
    });
  });

  describe('setAssignment (PEOPLE-03, PEOPLE-04)', () => {
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

    it('returns empty array for unassigned item', () => {
      store.addItem('Standalone', '5.00');
      const itemId = store.items.value[0].id;

      expect(store.getAssignedPeople(itemId)).toEqual([]);
    });
  });
});
