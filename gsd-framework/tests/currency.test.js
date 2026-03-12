import { describe, it, expect } from 'vitest';
import { dollarsToCents, centsToDollars, formatCurrency } from '../src/utils/currency.js';

describe('currency utilities', () => {
  describe('dollarsToCents', () => {
    it('converts decimal string to cents', () => {
      expect(dollarsToCents('15.99')).toBe(1599);
    });

    it('converts integer string to cents', () => {
      expect(dollarsToCents('20')).toBe(2000);
    });

    it('handles single decimal place', () => {
      expect(dollarsToCents('10.5')).toBe(1050);
    });

    it('handles zero', () => {
      expect(dollarsToCents('0')).toBe(0);
    });

    it('rounds floating point precision', () => {
      // 10.99 * 100 = 1098.9999... in JS
      expect(dollarsToCents('10.99')).toBe(1099);
    });
  });

  describe('centsToDollars', () => {
    it('converts cents to dollar string', () => {
      expect(centsToDollars(1599)).toBe('15.99');
    });

    it('handles zero', () => {
      expect(centsToDollars(0)).toBe('0.00');
    });

    it('pads single digit cents', () => {
      expect(centsToDollars(1050)).toBe('10.50');
    });
  });

  describe('formatCurrency', () => {
    it('formats cents as dollar string with $ prefix', () => {
      expect(formatCurrency(1599)).toBe('$15.99');
    });

    it('formats zero', () => {
      expect(formatCurrency(0)).toBe('$0.00');
    });
  });
});
