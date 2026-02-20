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

// Pre-compiled regex for performance (avoids recompilation in loops).
const ENTITY_REGEX = /&[a-zA-Z0-9#]+;/g;
// Update regex to handle hex entities (e.g. &#x41;) and decimal (e.g. &#65;)
const NUMERIC_ENTITY_REGEX = /^&#[xX]?([0-9a-fA-F]+);$/;

/**
 * Decodes HTML entities in a string to their corresponding characters.
 * Handles named entities and numeric entities (decimal).
 *
 * @param text - The string containing HTML entities.
 * @returns The decoded string.
 */
export function decodeHtmlEntities(text: string): string {
  if (!text) return '';

  return text.replace(ENTITY_REGEX, (match) => {
    if (ENTITIES[match]) return ENTITIES[match];

    // Handle numeric entities
    const numericMatch = match.match(NUMERIC_ENTITY_REGEX);
    if (numericMatch) {
      const isHex = match[2] === 'x' || match[2] === 'X'; // This check is fragile with match, let's use radix
      const value = numericMatch[1];
      const radix = match.toLowerCase().includes('&#x') ? 16 : 10;
      return String.fromCodePoint(Number.parseInt(value!, radix));
    }

    return match;
  });
}

/**
 * Converts a string into a URL-friendly slug.
 *
 * @param text - The text to slugify.
 * @returns The slugified string.
 *
 * @example
 * slugify("Hello World!") // -> "hello-world"
 */
export function slugify(text: string | null | undefined): string {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w-]+/g, '') // Remove all non-word chars
    .replace(/--+/g, '-'); // Replace multiple - with single -
}

/**
 * Safely stringifies a JSON object for use in a script tag.
 * Escapes HTML characters to prevent XSS (Cross-Site Scripting).
 *
 * @param json - The JSON object to stringify.
 * @returns The safe JSON string.
 */
// biome-ignore lint/suspicious/noExplicitAny: JSON can be any type
export function safeJsonLdStringify(json: any): string {
  return JSON.stringify(json).replace(/</g, '\u003c').replace(/>/g, '\u003e');
}
