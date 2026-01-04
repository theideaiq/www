// lib/wayl.ts

const WAYL_API_URL = "https://api.thewayl.com/api/v1"; 
const WAYL_MERCHANT_TOKEN = process.env.WAYL_MERCHANT_TOKEN;

if (!process.env.WAYL_WEBHOOK_SECRET) {
  console.warn("WARNING: WAYL_WEBHOOK_SECRET is not set. Payment webhooks may be insecure.");
}

// Helper to generate a unique ID (Required by Wayl)
const generateRefId = () => `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

export const wayl = {
  /**
   * Creates a payment link compatible with ZainCash, FIB, and Cards.
   * Based on Wayl API v1 Documentation (Page 6).
   */
  createPayment: async (amount: number, currency: string = "IQD", description: string) => {
    
    // Wayl requires a unique Reference ID for every transaction
    const refId = generateRefId();

    try {
      const response = await fetch(`${WAYL_API_URL}/Links`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // The PDF (Page 4) specifies this exact header name:
          "X-WAYL-AUTHENTICATION": WAYL_MERCHANT_TOKEN || ""
        },
        body: JSON.stringify({
          referenceId: refId,
          total: amount,
          currency: currency,
          // Wayl requires items to be listed in an array
          lineItem: [
            {
              label: description,
              amount: amount,
              type: "increase"
            }
          ],
          // These URLs tell Wayl where to send the user after they pay
          // You will need to create these pages next!
          redirectionUrl: "https://theideaiq.com/checkout/success",
          webhookUrl: "https://theideaiq.com/api/webhooks/wayl",
          webhookSecret: process.env.WAYL_WEBHOOK_SECRET
        })
      });

      const result = await response.json();

      if (!response.ok) {
        console.error("Wayl API Error:", result);
        throw new Error(result.message || "Payment creation failed");
      }

      // The PDF (Page 7) shows the payment URL is inside 'data.url'
      return result.data.url; 

    } catch (error) {
      console.error("Wayl Connection Error:", error);
      throw error;
    }
  }
};
