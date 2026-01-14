# Scribe Journal

This journal tracks critical learnings regarding the project's "Knowledge Graph" and Style Guide.

## 2024-05-23 - Initial Setup

Insight: Starting the Scribe journal to track documentation standards and critical learnings.
Rule: Documentation must be clear, accurate, and verified against the actual code behavior.

## 2024-05-23 - Environment Variable Parity

Insight: `YOUTUBE_API_KEY` was required in code but missing from `README.md`, causing potential setup friction.
Rule: Every `process.env` usage in the codebase must have a corresponding entry in `README.md` or `.env.example`.

## 2024-05-23 - i18n Navigation Imports

Insight: Developers frequently import `Link`, `useRouter`, etc. from `next/link` or `next/navigation` instead of the locale-aware wrappers, causing broken navigation and page reloads.
Rule: All navigation components and hooks must be imported from `@/i18n/navigation` to ensure proper locale handling and performance.

## 2025-01-13 - Missing .env.example

Insight: The `apps/web/.env.example` file was referenced in the root README installation steps but was missing from the repository, causing installation failures.
Rule: Documentation instructions must be verified by running them in a clean environment to ensure referenced files exist.

## 2025-01-14 - Copy-Paste Documentation Errors

Insight: The `README.md` contained copy-paste errors in the setup instructions (copying web env to admin), which would cause application crashes due to missing variables.
Rule: Do not assume similar-looking commands are identical. Always verify setup instructions by running them line-by-line in a clean environment.
