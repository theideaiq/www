import crypto from 'node:crypto';
import { describe, expect, it, vi } from 'vitest';
import { WaylAdapter } from './wayl';

// Mock the WaylClient from @repo/wayl
vi.mock('@repo/wayl', () => {
  return {
    WaylClient: class {
      links = {
        create: vi.fn(),
      };
      constructor() {}
    },
  };
});

describe('WaylAdapter', () => {
  const apiKey = 'test_api_key';
  const webhookSecret = 'test_webhook_secret';
  const adapter = new WaylAdapter({ apiKey, webhookSecret });

  describe('verifyWebhook', () => {
    it('should verify a valid signature', async () => {
      const payload = JSON.stringify({
        id: 'evt_123',
        status: 'Complete',
        referenceId: 'ref_123',
      });
      const signature = crypto
        .createHmac('sha256', webhookSecret)
        .update(payload)
        .digest('hex');

      const event = await adapter.verifyWebhook(payload, signature);

      expect(event).toEqual({
        id: 'evt_123',
        provider: 'wayl',
        type: 'payment.success',
        referenceId: 'ref_123',
        payload: JSON.parse(payload),
      });
    });

    it('should throw error for invalid signature', async () => {
      const payload = JSON.stringify({ id: 'evt_123' });
      const signature = 'invalid_signature';

      await expect(
        adapter.verifyWebhook(payload, signature),
      ).rejects.toThrow('Invalid signature');
    });

    it('should throw error if payload is not a string', async () => {
      const payload = { id: 'evt_123' }; // object, not string
      const signature = 'some_signature';

      await expect(adapter.verifyWebhook(payload, signature)).rejects.toThrow(
        'Payload must be a raw string',
      );
    });

    it('should throw error if signature is missing', async () => {
      const payload = JSON.stringify({ id: 'evt_123' });
      await expect(adapter.verifyWebhook(payload)).rejects.toThrow(
        'Missing signature',
      );
    });

    it('should throw error if webhook secret is not configured', async () => {
      const noSecretAdapter = new WaylAdapter({ apiKey });
      const payload = JSON.stringify({ id: 'evt_123' });
      const signature = 'some_signature';

      await expect(
        noSecretAdapter.verifyWebhook(payload, signature),
      ).rejects.toThrow('Webhook secret not configured');
    });

    it('should handle payment.failed event', async () => {
       const payload = JSON.stringify({
        id: 'evt_456',
        status: 'Failed',
        referenceId: 'ref_456',
      });
      const signature = crypto
        .createHmac('sha256', webhookSecret)
        .update(payload)
        .digest('hex');

      const event = await adapter.verifyWebhook(payload, signature);

      expect(event.type).toBe('payment.failed');
    });
  });
});
