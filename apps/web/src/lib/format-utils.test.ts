import { formatIQD } from '@repo/utils';
import { describe, expect, it } from 'vitest';

describe('Format Utils (@repo/utils)', () => {
  describe('formatIQD', () => {
    it('should format numbers with 0 decimals', () => {
      expect(formatIQD(50000)).toBe('50,000');
      expect(formatIQD(1234)).toBe('1,234');
      expect(formatIQD(0)).toBe('0');
    });

    it('should round decimal inputs', () => {
      // Intl.NumberFormat defaults to half-up or similar depending on locale/implementation
      // For en-IQ decimal, let's verify behavior
      expect(formatIQD(50000.5)).toBe('50,001');
      expect(formatIQD(50000.1)).toBe('50,000');
    });
  });
});
