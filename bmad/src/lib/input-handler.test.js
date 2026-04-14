import { describe, it, expect } from 'vitest';
import { getDirectionFromKey, getDirectionFromSwipe } from './input-handler.js';

describe('getDirectionFromKey', () => {
  // Existing arrow key mappings
  describe('arrow keys', () => {
    it('maps ArrowUp to up', () => {
      expect(getDirectionFromKey('ArrowUp')).toBe('up');
    });
    it('maps ArrowDown to down', () => {
      expect(getDirectionFromKey('ArrowDown')).toBe('down');
    });
    it('maps ArrowLeft to left', () => {
      expect(getDirectionFromKey('ArrowLeft')).toBe('left');
    });
    it('maps ArrowRight to right', () => {
      expect(getDirectionFromKey('ArrowRight')).toBe('right');
    });
  });

  // WASD mappings
  describe('WASD keys', () => {
    it('maps w to up', () => {
      expect(getDirectionFromKey('w')).toBe('up');
    });
    it('maps a to left', () => {
      expect(getDirectionFromKey('a')).toBe('left');
    });
    it('maps s to down', () => {
      expect(getDirectionFromKey('s')).toBe('down');
    });
    it('maps d to right', () => {
      expect(getDirectionFromKey('d')).toBe('right');
    });
    it('maps W (uppercase) to up', () => {
      expect(getDirectionFromKey('W')).toBe('up');
    });
    it('maps A (uppercase) to left', () => {
      expect(getDirectionFromKey('A')).toBe('left');
    });
    it('maps S (uppercase) to down', () => {
      expect(getDirectionFromKey('S')).toBe('down');
    });
    it('maps D (uppercase) to right', () => {
      expect(getDirectionFromKey('D')).toBe('right');
    });
  });

  // Vim hjkl mappings
  describe('Vim hjkl keys', () => {
    it('maps h to left', () => {
      expect(getDirectionFromKey('h')).toBe('left');
    });
    it('maps j to down', () => {
      expect(getDirectionFromKey('j')).toBe('down');
    });
    it('maps k to up', () => {
      expect(getDirectionFromKey('k')).toBe('up');
    });
    it('maps l to right', () => {
      expect(getDirectionFromKey('l')).toBe('right');
    });
    it('maps H (uppercase) to left', () => {
      expect(getDirectionFromKey('H')).toBe('left');
    });
    it('maps J (uppercase) to down', () => {
      expect(getDirectionFromKey('J')).toBe('down');
    });
    it('maps K (uppercase) to up', () => {
      expect(getDirectionFromKey('K')).toBe('up');
    });
    it('maps L (uppercase) to right', () => {
      expect(getDirectionFromKey('L')).toBe('right');
    });
  });

  // Unmapped keys return null
  describe('unmapped keys', () => {
    it('returns null for unmapped keys', () => {
      expect(getDirectionFromKey('x')).toBeNull();
      expect(getDirectionFromKey('Enter')).toBeNull();
      expect(getDirectionFromKey(' ')).toBeNull();
      expect(getDirectionFromKey('Escape')).toBeNull();
    });
  });
});

describe('getDirectionFromSwipe', () => {
  describe('cardinal swipes', () => {
    it('detects swipe right', () => {
      expect(getDirectionFromSwipe(100, 100, 150, 105)).toBe('right');
    });
    it('detects swipe left', () => {
      expect(getDirectionFromSwipe(100, 100, 50, 105)).toBe('left');
    });
    it('detects swipe up', () => {
      expect(getDirectionFromSwipe(100, 100, 105, 50)).toBe('up');
    });
    it('detects swipe down', () => {
      expect(getDirectionFromSwipe(100, 100, 105, 150)).toBe('down');
    });
  });

  describe('threshold enforcement', () => {
    it('returns null for movement below 10px threshold', () => {
      expect(getDirectionFromSwipe(100, 100, 103, 105)).toBeNull();
    });
    it('returns null for zero movement', () => {
      expect(getDirectionFromSwipe(100, 100, 100, 100)).toBeNull();
    });
    it('detects direction at exact 10px threshold', () => {
      expect(getDirectionFromSwipe(100, 100, 110, 100)).toBe('right');
    });
  });

  describe('dominant axis detection', () => {
    it('chooses horizontal when deltaX > deltaY (diagonal)', () => {
      expect(getDirectionFromSwipe(100, 100, 130, 115)).toBe('right');
    });
    it('chooses vertical when deltaY > deltaX (diagonal)', () => {
      expect(getDirectionFromSwipe(100, 100, 115, 130)).toBe('down');
    });
    it('chooses horizontal when deltas are equal', () => {
      // Equal deltas: horizontal wins as tiebreaker
      expect(getDirectionFromSwipe(100, 100, 120, 120)).toBe('right');
    });
  });
});
