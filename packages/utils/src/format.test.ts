import { describe, it, expect } from 'vitest';
import { formatCurrency } from './format';

describe('formatCurrency', () => {
  it('should format IQD without decimal places', () => {
    const result = formatCurrency(50000, 'IQD');
    // normalize non-breaking spaces to regular spaces for easier assertion
    const normalized = result.replace(/\u00A0/g, ' ');
    expect(normalized).toBe('IQD 50,000');
  });

  it('should format USD with 2 decimal places by default', () => {
    expect(formatCurrency(10.5, 'USD')).toBe('$10.50');
  });

  it('should handle zero amount correctly', () => {
    expect(formatCurrency(0, 'USD')).toBe('$0.00');

    const resultIQD = formatCurrency(0, 'IQD');
    const normalizedIQD = resultIQD.replace(/\u00A0/g, ' ');
    expect(normalizedIQD).toBe('IQD 0');
  });

  it('should use USD as default currency', () => {
    expect(formatCurrency(100)).toBe('$100.00');
  });
});
