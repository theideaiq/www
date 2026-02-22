import { describe, expect, it } from 'vitest';
import { safeJsonLdStringify } from './string';

describe('safeJsonLdStringify', () => {
  it('should stringify simple objects correctly', () => {
    const input = { name: 'Test Product', price: 100 };
    const expected = JSON.stringify(input);
    expect(safeJsonLdStringify(input)).toBe(expected);
  });

  it('should escape < and >', () => {
    const input = { description: '<script>alert(1)</script>' };
    const result = safeJsonLdStringify(input);
    expect(result).toContain('\\u003cscript\\u003ealert(1)\\u003c/script\\u003e');
    expect(result).not.toContain('<');
    expect(result).not.toContain('>');
  });

  it('should escape &', () => {
    const input = { name: 'Ben & Jerry' };
    const result = safeJsonLdStringify(input);
    expect(result).toContain('Ben \\u0026 Jerry');
    expect(result).not.toContain('&');
  });

  it('should escape line separators', () => {
    const input = { description: 'Line 1\u2028Line 2' };
    const result = safeJsonLdStringify(input);
    expect(result).toContain('Line 1\\u2028Line 2');
  });

  it('should escape paragraph separators', () => {
    const input = { description: 'Para 1\u2029Para 2' };
    const result = safeJsonLdStringify(input);
    expect(result).toContain('Para 1\\u2029Para 2');
  });
});
