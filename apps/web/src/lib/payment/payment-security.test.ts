import { createHmac } from 'node:crypto';
import { WaylAdapter } from '@repo/payment-engine';
import { describe, expect, it } from 'vitest';

describe('WaylAdapter Security', () => {
  const secret = 'test-secret';
  const rawBody = JSON.stringify({
    id: 'test-id',
    referenceId: 'ref-123',
    status: 'Complete',
  });

  it('should verify valid signature', async () => {
    const adapter = new WaylAdapter({
      apiKey: 'test-key',
      webhookSecret: secret,
    });

    const signature = createHmac('sha256', secret)
      .update(rawBody)
      .digest('hex');

    const event = await adapter.verifyWebhook(rawBody, signature);
    expect(event.id).toBe('test-id');
    expect(event.type).toBe('payment.success');
  });

  it('should reject invalid signature', async () => {
    const adapter = new WaylAdapter({
      apiKey: 'test-key',
      webhookSecret: secret,
    });

    const signature = 'invalid-signature';
    await expect(adapter.verifyWebhook(rawBody, signature)).rejects.toThrow(
      'Invalid webhook signature',
    );
  });

  it('should reject missing signature', async () => {
    const adapter = new WaylAdapter({
      apiKey: 'test-key',
      webhookSecret: secret,
    });

    await expect(adapter.verifyWebhook(rawBody, undefined)).rejects.toThrow(
      'Missing webhook signature',
    );
  });

  it('should throw if secret is not configured', async () => {
    const adapter = new WaylAdapter({
      apiKey: 'test-key',
      // No secret provided
    });

    await expect(adapter.verifyWebhook(rawBody, 'sig')).rejects.toThrow(
      'Webhook secret is not configured',
    );
  });
});
