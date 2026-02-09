import { createHmac } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { WaylAdapter } from './wayl';

describe('WaylAdapter', () => {
  const secret = 'test-secret';
  const adapter = new WaylAdapter({
    apiKey: 'test-key',
    webhookSecret: secret,
  });

  it('should verify signature correctly', async () => {
    const payloadObject = {
      id: 'evt_123',
      status: 'Complete',
      referenceId: 'ref_123',
    };
    const payload = JSON.stringify(payloadObject);

    // Create valid signature
    const hmac = createHmac('sha256', secret);
    hmac.update(payload);
    const validSignature = hmac.digest('hex');

    const event = await adapter.verifyWebhook(payload, validSignature);

    expect(event).toBeDefined();
    expect(event.provider).toBe('wayl');
    expect(event.type).toBe('payment.success');
    expect(event.payload).toEqual(payloadObject);

    // Invalid signature
    const invalidSignature = 'invalid-signature';
    await expect(
      adapter.verifyWebhook(payload, invalidSignature),
    ).rejects.toThrow();
  });

  it('should throw if payload is not a string', async () => {
    await expect(adapter.verifyWebhook({ foo: 'bar' }, 'sig')).rejects.toThrow(
      'Payload must be a string',
    );
  });

  it('should throw if signature is missing', async () => {
    await expect(adapter.verifyWebhook('{}')).rejects.toThrow(
      'Missing signature',
    );
  });
});
