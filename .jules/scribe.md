# Scribe's Journal

## 2026-02-14 - Removing Stale "Known Issues" and Clarifying Environment Requirements
Insight: The README "Known Issues" section incorrectly stated that a Capacitor patch was missing and needed, causing confusion. The patch is no longer required with newer `@capacitor/cli` versions. Additionally, developers were encountering `ERR_PNPM_UNSUPPORTED_ENGINE` during setup due to strict Node.js version checks.
Rule: Do not document "Known Issues" that are resolved or obsolete. Instead, provide "Troubleshooting" steps for common setup hurdles like engine version mismatches.
