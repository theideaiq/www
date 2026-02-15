import { createHmac, timingSafeEqual } from 'node:crypto';
import { type Link, WaylClient } from '@repo/wayl';
import type {
  OrderData,
  PaymentProvider,
  PaymentSession,
  WebhookEvent,
} from '../types';

export class WaylAdapter implements PaymentProvider {
  public readonly name = 'wayl';
  public readonly client: WaylClient;
  private webhookSecret?: string;

  constructor(config: {
    apiKey: string;
    baseUrl?: string;
    webhookSecret?: string;
  }) {
    this.client = new WaylClient({
      apiKey: config.apiKey,
      baseUrl: config.baseUrl,
    });
    this.webhookSecret = config.webhookSecret;
  }

  async createCheckoutSession(order: OrderData): Promise<PaymentSession> {
    const response = await this.client.links.create({
      referenceId: order.referenceId,
      total: order.amount,
      currency: order.currency,
      webhookUrl: order.webhookUrl,
      webhookSecret: order.webhookSecret || this.webhookSecret,
      redirectionUrl: order.redirectionUrl,
      // Mapping 'description' to 'customParameter' as an example, or could leave it out
      customParameter: order.description,
    });

    return {
      sessionId: response.data.id,
      url: response.data.url,
      provider: this.name,
      metadata: {
        referenceId: response.data.referenceId,
      },
    };
  }

  async verifyWebhook(
    rawBody: string,
    signature?: string,
  ): Promise<WebhookEvent> {
    if (!this.webhookSecret) {
      throw new Error('Webhook secret is not configured');
    }

    if (!signature) {
      throw new Error('Missing webhook signature');
    }

    // Verify signature
    const hmac = createHmac('sha256', this.webhookSecret);
    const digest = hmac.update(rawBody).digest('hex');

    const signatureBuffer = Buffer.from(signature);
    const digestBuffer = Buffer.from(digest);

    if (
      signatureBuffer.length !== digestBuffer.length ||
      !timingSafeEqual(signatureBuffer, digestBuffer)
    ) {
      throw new Error('Invalid webhook signature');
    }

    const data = JSON.parse(rawBody) as Link;

    let type: WebhookEvent['type'] = 'payment.failed';
    if (data.status === 'Complete' || data.status === 'Delivered') {
      type = 'payment.success';
    }

    return {
      id: data.id,
      provider: this.name,
      type,
      referenceId: data.referenceId,
      payload: data,
    };
  }
}
