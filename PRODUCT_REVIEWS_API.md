# Product reviews API

The product details modal reads and submits reviews through `VITE_PRODUCT_REVIEWS_ENDPOINT`. No review server is configured in this project yet, so the modal shows an honest empty state and keeps review submission disabled until this URL is provided.

Configure a product reviews base path in `.env`:

```env
VITE_PRODUCT_REVIEWS_ENDPOINT=/api/products
```

For product ID `3`, the UI calls `GET /api/products/3/reviews` with `sort` (`all`, `newest`, or `highest`), `limit`, and `offset` query parameters. The response should contain actual persisted data:

```json
{
  "reviews": [
    {
      "id": "review-id",
      "name": "Customer name",
      "rating": 5,
      "comment": "Review text",
      "createdAt": "2026-10-31T10:00:00Z",
      "photoUrls": []
    }
  ],
  "summary": {
    "average": 4.7,
    "count": 24,
    "distribution": { "5": 18, "4": 4, "3": 1, "2": 1, "1": 0 }
  },
  "total": 24,
  "hasMore": true
}
```

Review submission uses `POST /api/products/3/reviews`. Without a photo, the body is JSON `{ "name", "rating", "comment" }`; when a photo is attached, the same fields and the image as `photo` are sent as `multipart/form-data`. The request includes an `Idempotency-Key` header. Return a 2xx response only after the review is saved, preferably with `{ "review": { ... }, "summary": { ... } }`. Non-2xx responses are shown as errors; a success message is never shown before a successful response.

The endpoint can also be a product-specific path template, for example `VITE_PRODUCT_REVIEWS_ENDPOINT=/api/products/:productId/reviews`.
