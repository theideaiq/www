import { describe, it, expect } from 'vitest';
import { WaylAdapter } from './wayl';
import crypto from 'node:crypto';

describe('WaylAdapter', () => {
  const webhookSecret = 'test-secret';
  const adapter = new WaylAdapter({ apiKey: 'test-key', webhookSecret });

  it('verifies valid signature', async () => {
    const payload = {
      id: 'test-link-id',
      status: 'Complete',
      referenceId: 'ref-123',
    };
    const rawBody = JSON.stringify(payload);
    const signature = crypto
      .createHmac('sha256', webhookSecret)
      .update(rawBody)
      .digest('hex');

    const result = await adapter.verifyWebhook(payload, signature, rawBody);
    expect(result.type).toBe('payment.success');
    expect(result.id).toBe('test-link-id');
  });

  it('rejects invalid signature', async () => {
    const payload = {
        id: 'test-link-id',
        status: 'Complete',
        referenceId: 'ref-123',
    };
    const rawBody = JSON.stringify(payload);
    const signature = 'invalid-signature';

    await expect(adapter.verifyWebhook(payload, signature, rawBody)).rejects.toThrow(
      'Invalid webhook signature'
    );
  });

  it('rejects missing signature', async () => {
    const payload = {};
    const rawBody = JSON.stringify(payload);
    await expect(adapter.verifyWebhook(payload, '', rawBody)).rejects.toThrow(
        'Missing webhook signature'
    );
  });
});
