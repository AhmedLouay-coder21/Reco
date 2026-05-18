# Reco Backend API Documentation

**Stack:** Spring Boot 4.0.6 · Java 21 · PostgreSQL · JWT Auth  
**Base URL:** `http://localhost:8080/api/v1`

---

## Global Security Rules

| Pattern | HTTP Method | Access |
|---|---|---|
| `/api/v1/auth/**` | ALL | ✅ Public |
| `/api/v1/products/**` | GET | ✅ Public |
| `/api/v1/categories/**` | GET | ✅ Public |
| `/api/v1/reviews/product/**` | GET | ✅ Public |
| `/api/v1/recommendations/popular` | GET | ✅ Public |
| `/api/v1/recommendations/products/**` | GET | ✅ Public |
| Everything else | ALL | 🔒 Authenticated (valid JWT) |

**CORS:** All origins, methods `GET POST PUT DELETE PATCH OPTIONS`, all headers, no credentials  
**Session:** Stateless (JWT)  
**CSRF:** Disabled

### Auth Header Format
```
Authorization: Bearer <accessToken>
```

---

## Auth Module

**Base:** `/api/v1/auth`

### POST `/api/v1/auth/register`
Create a new customer account.

**Controller:** `AuthController.java`

**Public**

**Request:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securepassword"
}
```

**Response** `201 Created`:
```json
{
  "accessToken": "eyJhbGciOiJIUzI1...",
  "expiresIn": 900000,
  "email": "john@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "role": "CUSTOMER"
}
```

---

### POST `/api/v1/auth/login`
Authenticate and receive a JWT.

**Controller:** `AuthController.java`

**Public**

**Request:**
```json
{
  "email": "john@example.com",
  "password": "securepassword"
}
```

**Response** `200 OK` — same as register.

---

### POST `/api/v1/auth/register-admin`
Create a new admin account.

**Controller:** `AuthController.java`

**🔒 ADMIN only**

**Request:** Same structure as register.

**Response:** `201 Created` with `"role": "ADMIN"`.

---

## Product Module

**Base:** `/api/v1/products`

### GET `/api/v1/products`
List/paginate/search products.

**Controller:** `ProductController.java`

**✅ Public (GET)**

**Query Params:**

| Param | Type | Default | Description |
|---|---|---|---|
| `page` | int | `0` | Page number (zero-indexed) |
| `limit` | int | `20` | Items per page |
| `categoryId` | Long | — | Filter by category |
| `q` | String | — | Search term (matches name and description) |
| `sort` | String | `name` | Sort field: `name`, `price`, `createdAt`, `popularityScore`, `avgRating`, `toprated` |
| `order` | String | `asc` | Sort direction (`asc` / `desc`) |

**Response** `200 OK`:
```json
{
  "content": [
    {
      "id": 1,
      "categoryId": 1,
      "name": "Wireless Mouse",
      "description": "Ergonomic wireless mouse",
      "price": 29.99,
      "stockQuantity": 100,
      "tags": "electronics,mouse,wireless",
      "avgRating": 4.2,
      "totalClicks": 150,
      "totalCartAdds": 45,
      "popularityScore": 85.5,
      "createdAt": "2026-05-17T00:00:00Z"
    }
  ],
  "totalElements": 1,
  "totalPages": 1,
  "number": 0,
  "size": 20
}
```

---

### GET `/api/v1/products/{productId}`
Get a single product by ID.

**Controller:** `ProductController.java`

**✅ Public (GET)**

**Response** `200 OK` — single `ProductResponse` object.

---

### POST `/api/v1/products`
Create a new product.

**Controller:** `ProductController.java`

**🔒 ADMIN only**

**Request:**
```json
{
  "categoryId": 1,
  "name": "Wireless Mouse",
  "description": "Ergonomic wireless mouse",
  "price": 29.99,
  "stockQuantity": 100,
  "tags": "electronics,mouse,wireless"
}
```

**Response** `201 Created` — `ProductResponse`.

---

### PUT `/api/v1/products/{productId}`
Fully update a product.

**Controller:** `ProductController.java`

**🔒 ADMIN only**

**Request:** Same as POST.

**Response** `200 OK` — updated `ProductResponse`.

---

### DELETE `/api/v1/products/{productId}`
Delete a product.

**Controller:** `ProductController.java`

**🔒 ADMIN only**

**Response** `204 No Content`.

---

## Category Module

**Base:** `/api/v1/categories`

### GET `/api/v1/categories`
List all categories.

**Controller:** `CategoryController.java`

**✅ Public (GET)**

**Response** `200 OK`:
```json
[
  {
    "id": 1,
    "name": "Electronics",
    "description": "Electronic devices and accessories"
  }
]
```

---

### GET `/api/v1/categories/{categoryId}`
Get a single category.

**Controller:** `CategoryController.java`

**✅ Public (GET)**

---

### POST `/api/v1/categories`
Create a category.

**Controller:** `CategoryController.java`

**🔒 ADMIN only**

**Request:**
```json
{
  "name": "Electronics",
  "description": "Electronic devices and accessories"
}
```

**Response** `201 Created`.

---

### PUT `/api/v1/categories/{categoryId}`
Update a category.

**Controller:** `CategoryController.java`

**🔒 ADMIN only**

**Request:**
```json
{
  "name": "Electronics",
  "description": "Updated description"
}
```

**Response** `200 OK`.

---

### DELETE `/api/v1/categories/{categoryId}`
Delete a category.

**Controller:** `CategoryController.java`

**🔒 ADMIN only**

**Response** `204 No Content`.

---

## User Module

**Base:** `/api/v1/users`

### GET `/api/v1/users/me`
Get the currently authenticated user's profile.

**Controller:** `UserController.java`

**🔒 Authenticated**

**Response** `200 OK`:
```json
{
  "id": 1,
  "firstName": "John",
  "lastName": "Doe",
  "username": "johndoe",
  "email": "john@example.com",
  "role": "CUSTOMER",
  "createdAt": "2026-05-17T00:00:00Z"
}
```

---

### GET `/api/v1/users/{userId}`
Get a user by ID.

**Controller:** `UserController.java`

**🔒 Authenticated**

**Response** `200 OK`.

---

### GET `/api/v1/users`
List all users.

**Controller:** `UserController.java`

**🔒 ADMIN only**

**Response** `200 OK` — array of `UserResponse`.

---

### PUT `/api/v1/users/{userId}`
Update user profile.

**Controller:** `UserController.java`

**🔒 Authenticated** (owner or admin)

**Request:**
```json
{
  "firstName": "John",
  "lastName": "Smith",
  "username": "johnsmith",
  "email": "john@example.com",
  "passwordHash": "current_password_hash"
}
```

**Response** `200 OK`.

---

### PATCH `/api/v1/users/{userId}/password`
Update user password.

**Controller:** `UserController.java`

**🔒 Authenticated** (owner)

**Request:**
```json
{
  "oldPassword": "currentpassword",
  "newPassword": "newpassword",
  "confirmPassword": "newpassword"
}
```

**Response** `200 OK`.

---

### DELETE `/api/v1/users/{userId}`
Delete a user account.

**Controller:** `UserController.java`

**🔒 Authenticated** (owner or admin)

**Response** `204 No Content`.

---

## Cart Module

**Base:** `/api/v1/cart`

### GET `/api/v1/cart`
Get the current user's cart.

**Controller:** `CartController.java`

**🔒 CUSTOMER only**

**Response** `200 OK`:
```json
{
  "cartId": 1,
  "updatedAt": "2026-05-17T00:00:00Z",
  "items": [
    {
      "productId": 1,
      "productName": "Wireless Mouse",
      "unitPrice": 29.99,
      "quantity": 2,
      "lineTotal": 59.98
    }
  ],
  "totalQuantity": 2,
  "subtotal": 59.98
}
```

---

### POST `/api/v1/cart/items`
Add a product to cart.

**Controller:** `CartController.java`

**🔒 CUSTOMER only**

**Request:**
```json
{
  "productId": 1,
  "quantity": 2
}
```

**Response** `201 Created` — `CartResponse`.

---

### PUT `/api/v1/cart/items/{productId}`
Update item quantity.

**Controller:** `CartController.java`

**🔒 CUSTOMER only**

**Request:**
```json
{
  "quantity": 3
}
```

**Response** `200 OK` — `CartResponse`.

---

### DELETE `/api/v1/cart/items/{productId}`
Remove an item from cart.

**Controller:** `CartController.java`

**🔒 CUSTOMER only**

**Response** `204 No Content`.

---

### DELETE `/api/v1/cart/clear`
Clear the entire cart.

**Controller:** `CartController.java`

**🔒 CUSTOMER only**

**Response** `204 No Content`.

---

## Order Module

**Base:** `/api/v1/orders`

### POST `/api/v1/orders`
Create an order from the current user's cart.

**Controller:** `OrderController.java`

**🔒 CUSTOMER only**

**Response** `201 Created`:
```json
{
  "id": 1,
  "userId": 1,
  "totalAmount": 59.98,
  "status": "PENDING",
  "createdAt": "2026-05-17T00:00:00Z",
  "items": [
    {
      "productId": 1,
      "productName": "Wireless Mouse",
      "quantity": 2,
      "priceAtPurchase": 29.99,
      "lineTotal": 59.98
    }
  ]
}
```

---

### GET `/api/v1/orders`
List current user's orders.

**Controller:** `OrderController.java`

**🔒 CUSTOMER only**

**Query Params:**

| Param | Type | Description |
|---|---|---|
| `status` | OrderStatus | Optional filter: `PENDING`, `COMPLETED`, `CANCELLED` |

**Response** `200 OK` — array of `OrderResponse`.

---

### GET `/api/v1/orders/{orderId}`
Get a specific order.

**Controller:** `OrderController.java`

**🔒 Authenticated** (owner or admin)

**Response** `200 OK`.

---

### GET `/api/v1/orders/{orderId}/items`
Get line items for an order.

**Controller:** `OrderController.java`

**🔒 Authenticated** (owner or admin)

**Response** `200 OK` — array of `OrderItemResponse`.

---

### PUT `/api/v1/orders/{orderId}/status`
Update order status.

**Controller:** `OrderController.java`

**🔒 ADMIN only**

**Request:**
```json
{
  "status": "COMPLETED"
}
```

**Response** `200 OK`.

---

### DELETE `/api/v1/orders/{orderId}`
Delete an order.

**Controller:** `OrderController.java`

**🔒 ADMIN only**

**Response** `204 No Content`.

---

## Payment Module

**Base:** `/api/v1`

### POST `/api/v1/orders/{orderId}/payment`
Process payment for an order.

**Controller:** `PaymentController.java`

**🔒 CUSTOMER only**

**Request:**
```json
{
  "amount": 59.98,
  "paymentMethod": "MOCK_GATEWAY",
  "paymentMethodDetails": "optional details"
}
```

**Response** `201 Created`:
```json
{
  "id": 1,
  "orderId": 1,
  "amount": 59.98,
  "status": "SUCCESS",
  "paymentMethod": "MOCK_GATEWAY",
  "transactionDate": "2026-05-17T00:00:00Z"
}
```

---

### GET `/api/v1/orders/{orderId}/payment`
Get payment for an order.

**Controller:** `PaymentController.java`

**🔒 Authenticated** (owner or admin)

**Response** `200 OK`.

---

### GET `/api/v1/payments/{paymentId}`
Get a payment by its ID.

**Controller:** `PaymentController.java`

**🔒 Authenticated** (owner or admin)

**Response** `200 OK`.

---

## Review Module

**Base:** `/api/v1/reviews`

### POST `/api/v1/reviews`
Create a product review.

**Controller:** `ReviewController.java`

**🔒 CUSTOMER only** (one review per product per user)

**Request:**
```json
{
  "productId": 1,
  "rating": 4,
  "comment": "Great product!"
}
```

**Response** `201 Created`:
```json
{
  "id": 1,
  "rating": 4,
  "comment": "Great product!",
  "createdAt": "2026-05-17T00:00:00Z",
  "updatedAt": "2026-05-17T00:00:00Z",
  "userId": 1,
  "username": "johndoe",
  "productId": 1
}
```

---

### GET `/api/v1/reviews/product/{productId}`
Get paginated reviews for a product.

**Controller:** `ReviewController.java`

**✅ Public (GET)**

**Query Params:**

| Param | Type | Default | Description |
|---|---|---|---|
| `page` | int | `0` | Page number (zero-indexed) |
| `limit` | int | `20` | Items per page |
| `sort` | String | `createdAt` | Sort field (`createdAt`, `rating`) |
| `order` | String | `desc` | Sort direction (`asc` / `desc`) |

**Response** `200 OK` — paginated `Page<ReviewResponse>`.

---

### GET `/api/v1/reviews/product/{productId}/average`
Get average rating for a product.

**Controller:** `ReviewController.java`

**✅ Public (GET)**

**Response** `200 OK`:
```json
{
  "productId": 1,
  "averageRating": 4.2,
  "totalReviews": 15,
  "ratingDistribution": {
    "1": 1,
    "2": 0,
    "3": 2,
    "4": 5,
    "5": 7
  }
}
```

---

### GET `/api/v1/reviews/user/{userId}`
Get reviews by a specific user.

**Controller:** `ReviewController.java`

**🔒 Authenticated**

**Response** `200 OK`.

---

### PUT `/api/v1/reviews/{reviewId}`
Update own review.

**Controller:** `ReviewController.java`

**🔒 CUSTOMER only** (owner check in service)

**Request:**
```json
{
  "rating": 5,
  "comment": "Updated review"
}
```

**Response** `200 OK`.

---

### DELETE `/api/v1/reviews/{reviewId}`
Delete own review.

**Controller:** `ReviewController.java`

**🔒 CUSTOMER only** (owner check in service)

**Response** `204 No Content`.

---

## Recommendation Module

**Base:** `/api/v1/recommendations`

### GET `/api/v1/recommendations/popular`
Get trending/popular products (top 10 by popularity score).

**Controller:** `RecommendationController.java`

**✅ Public (GET)**

**Response** `200 OK`:
```json
{
  "trendingProducts": [
    {
      "productId": 1,
      "name": "Wireless Mouse",
      "price": 29.99,
      "avgRating": 4.2,
      "recommendationScore": 85.5
    }
  ],
  "totalCount": 10
}
```

---

### GET `/api/v1/recommendations/products/{productId}/frequently-bought-together`
Get products frequently bought together with the given product.

**Controller:** `RecommendationController.java`

**✅ Public (GET)**

**Query Params:**

| Param | Type | Default | Description |
|---|---|---|---|
| `limit` | int | `5` | Max results to return |

**Response** `200 OK`:
```json
{
  "productId": 1,
  "frequentlyBoughtTogether": [
    {
      "productId": 2,
      "name": "Keyboard",
      "price": 49.99,
      "frequency": 42,
      "purchaseCount": 100,
      "avgRating": 4.5
    }
  ]
}
```

---

### GET `/api/v1/recommendations/cache`
List all cached recommendation entries.

**Controller:** `RecommendationController.java`

**🔒 ADMIN only**

**Response** `200 OK`:
```json
{
  "cacheEntries": [
    {
      "id": 1,
      "userId": 1,
      "productId": 1,
      "recommendationScore": 85.5,
      "expiresAt": "2026-05-18T01:00:00Z"
    }
  ],
  "totalCount": 50
}
```

---

### POST `/api/v1/recommendations/refresh`
Refresh the entire recommendation cache.

**Controller:** `RecommendationController.java`

**🔒 ADMIN only**

**Response** `200 OK`:
```json
{
  "usersRefreshed": 10,
  "cacheEntriesCreated": 100
}
```

---

### DELETE `/api/v1/recommendations/cache/{cacheId}`
Delete a single cache entry.

**Controller:** `RecommendationController.java`

**🔒 ADMIN only**

**Response** `204 No Content`.

---

### POST `/api/v1/users/{userId}/interactions`
Track a user interaction (click or cart-add).

**Controller:** `UserController.java`

**🔒 Authenticated**

**Request:**
```json
{
  "productId": 1,
  "actionType": "CLICK"
}
```

`actionType` values: `CLICK`, `CART_ADD`

**Response** `200 OK`.

---

### GET `/api/v1/users/{userId}/recommendations`
Get personalized recommendations for a user.

**Controller:** `UserController.java`

**🔒 Authenticated**

Uses Strategy pattern:
- No signals → ColdStartStrategy (top popular)
- Reviews only → ContentBasedStrategy (similarity from high-rated reviews)
- Interactions only → CollaborativeStrategy (similar users' products)
- Both reviews and interactions → merge (0.6 content-based + 0.4 collaborative)
- Falls back to ColdStart if selected strategy returns empty

**Response** `200 OK`:
```json
{
  "recommendations": [
    {
      "productId": 1,
      "name": "Wireless Mouse",
      "price": 29.99,
      "avgRating": 4.2,
      "recommendationScore": 85.5
    }
  ],
  "totalCount": 10
}
```

---

## Seed Data

A default admin account is seeded on startup:

| Email | Password | Role |
|---|---|---|
| `admin@admin.com` | `123456789` | ADMIN |

---

## Error Responses

All errors follow this format:

```json
{
  "timestamp": "2026-05-17T00:00:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Descriptive error message",
  "path": "/api/v1/products"
}
```

| Status | Meaning |
|---|---|
| `400 BAD_REQUEST` | Validation failure, duplicate, insufficient stock, etc. |
| `401 UNAUTHORIZED` | Invalid credentials |
| `403 FORBIDDEN` | Insufficient role / access denied |
| `404 NOT_FOUND` | Entity not found |
| `500 INTERNAL_SERVER_ERROR` | Unhandled exception |
