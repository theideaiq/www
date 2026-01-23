import crypto from 'node:crypto';
import { WaylAdapter } from '@repo/payment-engine';
import { describe, expect, it } from 'vitest';

describe('WaylAdapter Webhook Verification', () => {
  const secret = 'test-secret';
  const adapter = new WaylAdapter({ apiKey: 'key', webhookSecret: secret });

  it('should reject if signature is missing', async () => {
    const payload = JSON.stringify({ status: 'Complete' });
    await expect(adapter.verifyWebhook(payload)).rejects.toThrow();
  });

  it('should reject if signature is invalid', async () => {
    const payload = JSON.stringify({ status: 'Complete' });
    await expect(
      adapter.verifyWebhook(payload, 'invalid-sig'),
    ).rejects.toThrow();
  });

  it('should accept if signature is valid', async () => {
    const payload = JSON.stringify({ status: 'Complete', id: '123' });
    const signature = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');

    const event = await adapter.verifyWebhook(payload, signature);
    expect(event.type).toBe('payment.success');
  });
});
