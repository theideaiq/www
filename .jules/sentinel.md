## 2025-02-24 - JSON-LD XSS Vulnerability
**Vulnerability:** Unsanitized `JSON.stringify` usage in `dangerouslySetInnerHTML` for JSON-LD script blocks allowed attackers to inject scripts via `</script>` breakouts if input contained user-controlled data (e.g., URL path).
**Learning:** `JSON.stringify` is not safe for HTML context injection as it doesn't escape `<` and `>`. Browsers terminate script blocks at the first occurrence of `</script>`.
**Prevention:** Use `safeJsonLdStringify` (implemented in `@repo/utils`) which escapes `<` and `>` to Unicode sequences (`\u003c`, `\u003e`) when embedding JSON in script tags.
