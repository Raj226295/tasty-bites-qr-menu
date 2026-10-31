# Checkout API configuration

The app is a frontend-only demo, so no checkout endpoints are configured yet. Add these variables to a local `.env` file when the restaurant API is available:

```env
VITE_ORDER_CREATE_ENDPOINT=
VITE_PAYMENT_CREATE_ENDPOINT=
VITE_PAYMENT_VERIFY_ENDPOINT=
```

All endpoints receive JSON and the app sends an `Idempotency-Key` header so retries can be deduplicated by the server.

## Counter order

`VITE_ORDER_CREATE_ENDPOINT` receives a dine-in order with `paymentMethod: "pay_at_counter"`, `paymentStatus: "pending"`, and `orderStatus: "placed"`. The JSON includes the table number, item IDs/names/quantities/prices, subtotal, tax, total, and special instructions.

Return a successful 2xx JSON response containing an `orderId`. The UI only shows order confirmation after this response.

## Home delivery demo

Home delivery currently opens the confirmation page directly after the guest submits the address form. It generates a demo order ID and keeps the order in in-memory page state. Connect this flow to `VITE_ORDER_CREATE_ENDPOINT` when the restaurant order API is ready. Payment is not initiated here.

## Online payment

`VITE_PAYMENT_CREATE_ENDPOINT` receives the same order snapshot with `paymentMethod: "upi"` and `orderStatus: "pending_payment"`. Return a successful 2xx JSON response containing `orderId` and either `qrCodeUrl` or `paymentUrl`. `paymentReference` and `amount` may also be returned; if amount is returned, it must match the checkout total.

`VITE_PAYMENT_VERIFY_ENDPOINT` receives `{ orderId, paymentReference, tableNumber }`. It must verify against the payment provider and return `verified: true` and `paymentStatus: "paid"` only after confirmed payment. If it returns `amount`, that amount must match the checkout total. The UI never treats opening a payment URL or scanning a QR as payment confirmation.
