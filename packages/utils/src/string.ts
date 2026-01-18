/**
 * Safely decodes HTML entities in a string.
 */
const ENTITIES: Record<string, string> = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#39;': "'",
  '&nbsp;': ' ',
  '&apos;': "'",
};

const ENTITY_REGEX = /&[a-zA-Z0-9#]+;/g;
const NUMERIC_ENTITY_REGEX = /^&#\d+;$/;

export function decodeHtmlEntities(text: string): string {
  if (!text) return '';

  return text.replace(ENTITY_REGEX, (match) => {
    if (ENTITIES[match]) return ENTITIES[match];

    // Handle numeric entities
    if (NUMERIC_ENTITY_REGEX.test(match)) {
      // ⚡ Optimization: Use fromCodePoint for Emoji/Astral support
      return String.fromCodePoint(Number.parseInt(match.slice(2, -1), 10));
    }

    return match;
  });
}

// ⚡ Add this helper for your E-commerce slugs
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')     // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-');  // Replace multiple - with single -
}
