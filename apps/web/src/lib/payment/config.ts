import { webEnv } from '@repo/env/web';
import { PaymentFactory } from '@repo/payment-engine';

export const paymentFactory = {
  getProvider: (amount: number) => {
    return PaymentFactory.getProvider(amount, {
      waylKey: webEnv.WAYL_SECRET_KEY,
      waylWebhookSecret: webEnv.WAYL_WEBHOOK_SECRET,
      zainKey: webEnv.ZAIN_SECRET_KEY,
    });
  },
  getProviderByName: (name: string) => {
    return PaymentFactory.getProviderByName(name, {
      waylKey: webEnv.WAYL_SECRET_KEY,
      waylWebhookSecret: webEnv.WAYL_WEBHOOK_SECRET,
      zainKey: webEnv.ZAIN_SECRET_KEY,
    });
  },
};
