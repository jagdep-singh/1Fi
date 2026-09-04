# Backend — 1Fi

Express + PostgreSQL API serving product, variant, and EMI plan data. This is the `backend/` package of the [1Fi monorepo](../README.md) — see the root README for deployment links and overall project structure.

## Tech Stack

Node.js (Express) for the API, PostgreSQL (hosted on Supabase) for the database, `pg` for queries, `dotenv` for config, and `express-async-errors` with a small error middleware so I don't have to wrap every route in try/catch.

## Setup

1. Install dependencies

   ```bash
   npm install
   ```

2. Copy the env file and add your database URL

   ```bash
   cp .env.example .env
   ```

3. Create the schema and load the seed data

   ```bash
   psql "$DATABASE_URL" -f db/schema.sql
   psql "$DATABASE_URL" -f db/seed.sql
   ```

4. Run it

   ```bash
   npm run dev     # dev, with nodemon
   npm start       # production
   ```

Runs on `http://localhost:8383` by default.

### Env variables

- `DATABASE_URL` — Postgres connection string (required)
- `PORT` — defaults to 8383
- `CORS_ORIGIN` — frontend origin to allow

---

## Schema

Three tables — `products` → `variants` → `emi_plans`, one-to-many down the chain.

```sql
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(150) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE variants (
  id SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  storage VARCHAR(20),
  color VARCHAR(50),
  mrp NUMERIC(10,2) NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  image_url TEXT,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE emi_plans (
  id SERIAL PRIMARY KEY,
  variant_id INTEGER NOT NULL REFERENCES variants(id) ON DELETE CASCADE,
  monthly_amount NUMERIC(10,2) NOT NULL,
  tenure_months INTEGER NOT NULL,
  interest_rate NUMERIC(4,2) NOT NULL DEFAULT 0,
  cashback NUMERIC(10,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_variants_product_id ON variants(product_id);
CREATE INDEX idx_emi_plans_variant_id ON emi_plans(variant_id);
```

Each product (e.g. iPhone 17 Pro) has multiple variants (storage|color combos), each with its own price, MRP, and image. Each variant has its own set of EMI plans, so tenure and interest can differ between variants of the same product. `is_default` on `variants` decides which one shows up on the listing page.

`db/seed.sql` loads 3 products, 2 variants each, and 2–5 EMI plans per variant (17 plans total). It starts with `TRUNCATE ... RESTART IDENTITY CASCADE`, so it's safe to re-run.

---

## API

All routes are prefixed with `/api`.

### `GET /api/health`

```json
{ "message": "ok" }
```

### `GET /api/products`
Returns all products with their default variant's price, MRP, and image — enough for a listing page.

```json
[
  {
    "id": 1,
    "slug": "iphone-17-pro",
    "name": "iPhone 17 Pro",
    "price": "127400.00",
    "mrp": "134900.00",
    "image_url": "https://m.media-amazon.com/images/I/714TxWv1JYL.jpg"
  },
  {
    "id": 2,
    "slug": "samsung-s24-ultra",
    "name": "Samsung Galaxy S24 Ultra",
    "price": "119999.00",
    "mrp": "129999.00",
    "image_url": "https://m.media-amazon.com/images/I/71Nwtop9jtL._SX679_.jpg"
  }
]
```

### `GET /api/products/:slug`
Full product detail — description, variants, and EMI plans per variant. Powers the product page.

`GET /api/products/iphone-17-pro`

```json
{
  "id": 1,
  "slug": "iphone-17-pro",
  "name": "iPhone 17 Pro",
  "description": "Apple's flagship phone with A19 Pro chip",
  "variants": [
    {
      "id": 1,
      "product_id": 1,
      "storage": "256GB",
      "color": "Orange",
      "mrp": "134900.00",
      "price": "127400.00",
      "image_url": "https://m.media-amazon.com/images/I/714TxWv1JYL.jpg",
      "is_default": true,
      "emi_plans": [
        { "id": 1, "variant_id": 1, "monthly_amount": "44967.00", "tenure_months": 3, "interest_rate": "0.00", "cashback": "7500.00" },
        { "id": 2, "variant_id": 1, "monthly_amount": "22483.00", "tenure_months": 6, "interest_rate": "0.00", "cashback": "7500.00" },
        { "id": 3, "variant_id": 1, "monthly_amount": "11242.00", "tenure_months": 12, "interest_rate": "0.00", "cashback": "7500.00" },
        { "id": 4, "variant_id": 1, "monthly_amount": "5621.00", "tenure_months": 24, "interest_rate": "0.00", "cashback": "7500.00" },
        { "id": 5, "variant_id": 1, "monthly_amount": "4297.00", "tenure_months": 36, "interest_rate": "10.50", "cashback": "7500.00" }
      ]
    },
    {
      "id": 2,
      "product_id": 1,
      "storage": "256GB",
      "color": "Silver",
      "mrp": "134900.00",
      "price": "127400.00",
      "image_url": "https://m.media-amazon.com/images/I/619Pp4ERPNL.jpg",
      "is_default": false,
      "emi_plans": [
        { "id": 6, "variant_id": 2, "monthly_amount": "44967.00", "tenure_months": 3, "interest_rate": "0.00", "cashback": "7500.00" },
        { "id": 7, "variant_id": 2, "monthly_amount": "22483.00", "tenure_months": 6, "interest_rate": "0.00", "cashback": "7500.00" }
      ]
    }
  ]
}
```

404 for an unknown slug:

```json
{ "error": "Product with slug \"nonexistent\" not found" }
```

One thing to watch for: `price`, `mrp`, `monthly_amount`, `interest_rate`, and `cashback` all come back as strings, since that's how the `pg` driver serializes Postgres `NUMERIC` columns. Wrap them in `Number()` on the frontend before formatting or doing math.

---

## Project Structure

```
backend/
├── db/
│   ├── schema.sql
│   └── seed.sql
├── src/
│   ├── app.js
│   ├── config/db.js
│   ├── middleware/errorHandler.js
│   ├── routes/product.routes.js
│   ├── services/product.service.js
│   ├── repository/
│   │   ├── product.repository.js
│   │   ├── variant.repository.js
│   │   └── emiPlan.repository.js
│   └── utils/NotFoundError.js
├── server.js
├── package.json
└── .env.example
```

Routes call services, services join data from the repositories, repositories run the raw SQL. Keeps the query logic out of the route handlers.