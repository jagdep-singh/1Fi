# 1Fi Backend — Express + PostgreSQL API

A minimal Express server that serves product, variant, and EMI plan data for the 1Fi take-home assignment. Built with Node.js, Express, and PostgreSQL (hosted on Supabase).

---

## Quick Start

### Prerequisites
- Node.js 18+
- A PostgreSQL database (i m use Supabase — connection string in `.env`)

### Install & Run

```bash
# From the backend directory
npm install

# Create your environment file
cp .env.example .env
# Edit .env with your DATABASE_URL (Supabase connection string)

# Run database migrations (schema + seed)
psql "$DATABASE_URL" -f db/schema.sql
psql "$DATABASE_URL" -f db/seed.sql

# Start the server
npm run dev      # with nodemon for development
npm start        # production
```

The server starts on `http://localhost:8383` by default (configurable via `PORT` in `.env`).

---

## API Endpoints

All endpoints are prefixed with `/api`.

### `GET /api/health`
Health check — confirms the server is running.

**Response:**
```json
{ "message": "ok" }
```

---

### `GET /api/products`
Returns a list of all products with their **default variant's** price, MRP, and image. Useful for the listing page.

**Response:**
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
  },
  {
    "id": 3,
    "slug": "pixel-9-pro",
    "name": "Google Pixel 9 Pro",
    "price": "91999.00",
    "mrp": "99999.00",
    "image_url": "https://m.media-amazon.com/images/I/51KzFEigYtL.jpg"
  }
]
```

> **Note:** All numeric fields (`price`, `mrp`) are returned as **strings** because PostgreSQL `NUMERIC` types serialize as strings through the `pg` driver. The frontend should call `Number(value)` before formatting or arithmetic.

---

### `GET /api/products/:slug`
Returns the full product detail: description, all variants, and all EMI plans per variant. This is the data source for the product detail page.

**Response (truncated for brevity):**
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

**Error — 404 (bad slug):**
```json
{ "error": "Product with slug \"nonexistent\" not found" }
```

---

## Tech Stack

| Layer | Choice | Why |
|-------|--------|-----|
| Runtime | Node.js 18+ (ESM) | Modern, fast, native `fetch`/`import` |
| Framework | Express 4.x | Lightweight, well-understood, minimal abstraction |
| Database | PostgreSQL (Supabase) | Relational, ACID, free tier generous |
| Driver | `pg` (node-postgres) | Battle-tested, pool management built-in |
| Config | `dotenv` | 12-factor env management |
| Error handling | `express-async-errors` | Lets `async/await` throw to error middleware without try/catch wrappers |
| CORS | `cors` | Allows local frontend (`localhost:3000`) to call the API |

---

## Database Schema

Defined in `db/schema.sql`. Three tables with foreign keys and indexes:

```sql
-- Products: the phone models
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(150) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Variants: storage/color combinations for each product
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

-- EMI Plans: financing options per variant
CREATE TABLE emi_plans (
  id SERIAL PRIMARY KEY,
  variant_id INTEGER NOT NULL REFERENCES variants(id) ON DELETE CASCADE,
  monthly_amount NUMERIC(10,2) NOT NULL,
  tenure_months INTEGER NOT NULL,
  interest_rate NUMERIC(4,2) NOT NULL DEFAULT 0,
  cashback NUMERIC(10,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Helpful indexes
CREATE INDEX idx_variants_product_id ON variants(product_id);
CREATE INDEX idx_emi_plans_variant_id ON emi_plans(variant_id);
```

### Seeding

`db/seed.sql` creates exactly **3 products**, each with **2 variants**, and **2–5 EMI plans per variant** (17 plans total). The file starts with:

```sql
TRUNCATE products, variants, emi_plans RESTART IDENTITY CASCADE;
```

So it's safely re-runnable — running it twice won't duplicate rows.

---

## Environment Variables

| Variable | Required | Example |
|----------|----------|---------|
| `DATABASE_URL` | ✅ | `postgresql://user:pass@host:5432/db` |
| `PORT` | ❌ (default 8383) | `8383` |
| `CORS_ORIGIN` | ❌ | `http://localhost:3000` |

Copy `.env.example` to `.env` and fill in your values. **Never commit `.env`** — it's in `.gitignore`.

---

## Project Structure

```
backend/
├── db/
│   ├── schema.sql      # DDL — run once to create tables
│   └── seed.sql        # DML — run to populate 3 products + variants + EMI plans
├── src/
│   ├── app.js                 # Express app setup, middleware, route mounting
│   ├── config/db.js           # pg Pool export
│   ├── middleware/errorHandler.js  # Centralized error → JSON response
│   ├── routes/product.routes.js    # GET /products, GET /products/:slug
│   ├── services/product.service.js # Business logic: joins variants + EMI plans
│   ├── repository/
│   │   ├── product.repository.js   # Raw SQL for products
│   │   ├── variant.repository.js   # Raw SQL for variants (incl. default)
│   │   └── emiPlan.repository.js   # Raw SQL for EMI plans
│   └── utils/NotFoundError.js      # Custom 404 error class
├── server.js              # Entry point: loads .env, starts server
├── package.json
└── .env.example
```

---

## Deployment Notes (Render / similar)

1. Create a new **Web Service** pointing at this repo's `backend/` folder
2. Build command: `npm install`
3. Start command: `npm start`
4. Add environment variables in the dashboard:
   - `DATABASE_URL` → your Supabase connection string
   - `CORS_ORIGIN` → your Vercel frontend URL (e.g., `https://your-app.vercel.app`)
5. The service will be reachable at `https://your-backend.onrender.com/api/...`
6. Update the frontend's `NEXT_PUBLIC_API_URL` to point there.

---

## License

ISC — submitted as part of the 1Fi SDE Internship take-home assignment.
