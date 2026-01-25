import { describe, expect, it } from 'vitest';
import { formatIQD } from './format';

describe('formatIQD', () => {
  it('formats standard amounts correctly', () => {
    expect(formatIQD(100)).toBe('100');
    expect(formatIQD(1000)).toBe('1,000');
    expect(formatIQD(50000)).toBe('50,000');
    expect(formatIQD(1234567)).toBe('1,234,567');
  });

  it('handles zero', () => {
    expect(formatIQD(0)).toBe('0');
  });

  it('truncates decimal places', () => {
    expect(formatIQD(100.5)).toBe('101'); // Rounds
    expect(formatIQD(100.1)).toBe('100');
    expect(formatIQD(100.99)).toBe('101');
  });

  it('handles negative numbers', () => {
    expect(formatIQD(-5000)).toBe('-5,000');
  });

  it('handles infinite and NaN', () => {
    expect(formatIQD(Number.NaN)).toBe('0');
    expect(formatIQD(Number.POSITIVE_INFINITY)).toBe('0');
  });
});
