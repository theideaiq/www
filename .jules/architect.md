## 2025-01-26 - Middleware Naming Convention
Smell: Middleware files named `proxy.ts` causing them to be ignored by Next.js or requiring non-standard configuration.
Standard: Next.js middleware must be named `middleware.ts` (or `.js`) and placed in the root or `src` directory to ensure automatic detection and standard behavior.
