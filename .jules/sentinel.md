## 2025-02-14 - Information Leakage in Checkout API

**Vulnerability:** The Checkout API (`/api/checkout`) was catching errors from the `wayl` service and returning `error.message` directly to the client in the JSON response.
**Learning:** Returning raw error messages can expose internal system details, database connection strings, or third-party service errors to potential attackers. This information can be used to fingerprint the system or identify further attack vectors.
**Prevention:** Always catch exceptions at the API boundary and return a generic error message (e.g., "Payment creation failed") to the client. Log the specific error details internally for debugging purposes.
