import { describe, expect, it } from 'vitest';
import { decodeHtmlEntities, slugify } from '@repo/utils';

describe('String Utils (@repo/utils)', () => {
  describe('slugify', () => {
    it('should convert text to a url-friendly slug', () => {
      expect(slugify('Hello World!')).toBe('hello-world');
      expect(slugify('  Spaced   String  ')).toBe('spaced-string');
      expect(slugify('Complex@#$Chars')).toBe('complexchars');
      expect(slugify('Multiple--Dashes')).toBe('multiple-dashes');
      expect(slugify('')).toBe('');
    });
  });

  describe('decodeHtmlEntities', () => {
    it('should decode named entities', () => {
      expect(decodeHtmlEntities('&amp;')).toBe('&');
      expect(decodeHtmlEntities('&lt;')).toBe('<');
      expect(decodeHtmlEntities('&gt;')).toBe('>');
      expect(decodeHtmlEntities('&quot;')).toBe('"');
      expect(decodeHtmlEntities('&#39;')).toBe("'");
      expect(decodeHtmlEntities('&nbsp;')).toBe(' ');
    });

    it('should decode numeric entities', () => {
      expect(decodeHtmlEntities('&#65;')).toBe('A');
      expect(decodeHtmlEntities('&#128512;')).toBe('😀'); // Emoji
    });

    it('should handle mixed content', () => {
      expect(decodeHtmlEntities('Tom &amp; Jerry')).toBe('Tom & Jerry');
      expect(decodeHtmlEntities('1 &lt; 2')).toBe('1 < 2');
    });

    it('should handle empty or null input', () => {
      expect(decodeHtmlEntities('')).toBe('');
      // @ts-expect-error testing runtime safety
      expect(decodeHtmlEntities(null)).toBe('');
    });
  });
});
