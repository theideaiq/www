# Sentinel's Journal

## 2025-02-19 - Webhook Signature Verification Bypass
**Vulnerability:** The Wayl payment webhook handler accepted any payload without verifying the `x-signature` header, allowing attackers to forge payment success events and fulfill orders without payment. The adapter's `verifyWebhook` method was a stub that trusted the payload blindly.
**Learning:**
1. Default implementations or stubs in adapters can silently fail open if not rigorously tested.
2. Next.js API routes often default to `request.json()`, which consumes the stream and discards raw formatting needed for cryptographic verification.
**Prevention:**
1. Enforce signature verification on all webhooks immediately upon implementation.
2. Use `request.text()` (or similar raw body access) in webhook handlers to preserve the exact payload for HMAC verification, then parse JSON afterwards.
3. Use `crypto.timingSafeEqual` to prevent timing attacks during signature comparison.
