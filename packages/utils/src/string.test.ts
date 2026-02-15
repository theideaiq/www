import { describe, expect, it } from 'vitest';
import { safeJsonLdStringify } from './string';

describe('safeJsonLdStringify', () => {
  it('should stringify simple object', () => {
    const obj = { name: 'Test' };
    expect(safeJsonLdStringify(obj)).toBe('{"name":"Test"}');
  });

  it('should escape HTML entities', () => {
    const obj = {
      name: '<script>alert("xss")</script>',
      desc: 'Tom & Jerry',
    };
    const result = safeJsonLdStringify(obj);
    expect(result).toContain('\\u003cscript\\u003e');
    expect(result).toContain('\\u003c/script\\u003e');
    expect(result).toContain('Tom \\u0026 Jerry');
    expect(result).not.toContain('<script>');
  });
});
