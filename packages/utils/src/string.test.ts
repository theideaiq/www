import { describe, expect, it } from 'vitest';
import { safeJsonLdStringify } from './string';

describe('safeJsonLdStringify', () => {
  it('should escape < and >', () => {
    const input = {
      name: '<script>alert("XSS")</script>',
    };
    const output = safeJsonLdStringify(input);
    expect(output).not.toContain('<script>');
    expect(output).toContain('\\u003cscript\\u003e');
    expect(output).toContain('\\u003c/script\\u003e');
  });

  it('should escape &', () => {
    const input = {
      url: 'https://example.com?a=1&b=2',
    };
    const output = safeJsonLdStringify(input);
    expect(output).toContain('https://example.com?a=1\\u0026b=2');
  });

  it('should escape line separators', () => {
    const input = {
      text: 'Hello\u2028World',
    };
    const output = safeJsonLdStringify(input);
    expect(output).toContain('Hello\\u2028World');
  });

  it('should handle normal objects', () => {
    const input = {
      name: 'John Doe',
      age: 30,
    };
    const output = safeJsonLdStringify(input);
    // When parsed back, special chars (except line separators in strings) are handled by JSON.parse
    // But since we modified the string representation, JSON.parse(output) should still result in equivalent object
    // Wait, JSON.parse('\\u003c') is '<'.
    expect(JSON.parse(output)).toEqual(input);
  });
});
