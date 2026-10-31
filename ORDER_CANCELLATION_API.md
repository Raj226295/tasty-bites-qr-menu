# Order cancellation API

The project currently contains frontend demo orders and no order service or live admin synchronization. Configure `VITE_ORDER_CANCEL_ENDPOINT` when the restaurant API is available:

```env
VITE_ORDER_CANCEL_ENDPOINT=https://api.example.com/orders/:orderId/cancel
```

The client sends a same-origin guest/customer session cookie, an `Idempotency-Key`, and:

```json
{ "reason": "Customer requested cancellation" }
```

The API must authenticate/authorize that the current customer or guest session owns the order, read the latest status on the server, and atomically allow the change only when the current status is `preparing`. It must persist `cancelledAt` and `cancellationReason` and publish an `order.cancelled` event (or the app's equivalent) so the admin dashboard removes the order from active preparation and updates its counts while keeping the order in history. The frontend does not issue refunds.

On success, return a 2xx JSON response with the updated order and its cancelled status:

```json
{
  "order": {
    "orderId": "TB1253",
    "orderStatus": "cancelled",
    "cancelledAt": "2026-10-31T10:00:00.000Z",
    "cancellationReason": "Customer requested cancellation"
  }
}
```

Return `409 Conflict` with a useful message and the latest status if the order is no longer preparing. Return `401` or `403` when the customer/guest session cannot be authorized. The client treats any success response that does not confirm `orderStatus: "cancelled"` as an error and does not update the order locally.

The order details UI shows **Cancel Order** only when its current status is `Preparing`. The server-side status and ownership checks remain mandatory because UI state can be stale or modified.
