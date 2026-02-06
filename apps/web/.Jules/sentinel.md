## 2025-02-18 - Missing Webhook Signature Verification

**Vulnerability:** The Wayl payment adapter (`WaylAdapter`) and the payment webhook endpoint were accepting webhooks without verifying their cryptographic signature. This allows attackers to forge payment success events.
**Learning:** Security features like signature verification are often "left for later" or commented out during initial development (stubbed with comments like `// In a real scenario...`) and then forgotten.
**Prevention:**
1.  Enforce `verifyWebhook` interfaces to require `rawBody` and `signature` arguments from the start.
2.  Use "secure by default" factory methods that fail if secrets are missing, rather than silently skipping verification.
3.  Integration tests should include "invalid signature" cases, not just "happy path".
