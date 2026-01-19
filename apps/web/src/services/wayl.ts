import 'server-only';
import { Logger } from '@repo/utils';

export const wayl = {
  /**
   * Creates a payment session with the Wayl payment gateway.
   *
   * @param amount - The amount to charge.
   * @param currency - The currency code (e.g., 'IQD', 'USD').
   * @param description - Description of the transaction.
   * @returns A promise resolving to the payment checkout URL.
   */
  createPayment: async (
    amount: number,
    currency: string,
    description: string,
  ) => {
    Logger.log('Creating payment:', { amount, currency, description });
    // In a real implementation, this would make an HTTP request to Wayl API.
    return `https://checkout.wayl.com/pay/${Math.random().toString(36).substring(7)}`;
  },
};
