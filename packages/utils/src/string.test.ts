import { describe, expect, it } from 'vitest';
import { safeJsonLdStringify } from './string';

describe('safeJsonLdStringify', () => {
  it('should serialize simple objects', () => {
    const data = { name: 'Test Product', price: 100 };
    expect(safeJsonLdStringify(data)).toBe(
      '{"name":"Test Product","price":100}',
    );
  });

  it('should escape script tags', () => {
    const data = { description: '<script>alert("xss")</script>' };
    const result = safeJsonLdStringify(data);
    expect(result).not.toContain('<script>');
    expect(result).toContain('\\u003cscript\\u003e');
  });

  it('should escape HTML entities', () => {
    const data = { name: "Ben & Jerry's" };
    const result = safeJsonLdStringify(data);
    expect(result).not.toContain('&');
    // JSON.stringify escapes " to \" automatically, but we want to ensure < > & are handled if they appear
    // Standard JSON.stringify does NOT escape < > &
    expect(result).toBe('{"name":"Ben \\u0026 Jerry\'s"}');
  });
});
