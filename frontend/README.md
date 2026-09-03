# 1Fi Frontend — Next.js (App Router) + TypeScript + Tailwind

The client-facing product browser for the 1Fi take-home assignment. Displays a grid of smartphones, lets you pick a variant (storage/color), select an EMI plan, and proceed.

Deployed on Vercel. Connects to the backend API (Express + PostgreSQL) for all data — **zero hardcoded products, variants, or EMI plans**.

---

## Quick Start

### Prerequisites
- Node.js 18+
- Backend API running locally on `http://localhost:8383` (or a deployed URL)

### Install & Run

```bash
# From the frontend directory
npm install

# Create your environment file
cp .env.example .env.local  # or just create .env.local manually
# Add: NEXT_PUBLIC_API_URL=http://localhost:8383/api

# Start the dev server
npm run dev
```

Open `http://localhost:3000` — you should see 3 product cards. Click one to view variants and EMI plans.

---

## Environment Variables

| Variable | Required | Example |
|----------|----------|---------|
| `NEXT_PUBLIC_API_URL` | ✅ | `http://localhost:8383/api` |

The `NEXT_PUBLIC_` prefix is **required** — otherwise the variable won't be available to browser-side code (the interactive EMI picker runs in the client).

Create `.env.local` (gitignored) with:
```env
NEXT_PUBLIC_API_URL=http://localhost:8383/api
```

For production on Vercel, add the same variable in **Project Settings → Environment Variables** pointing at your deployed backend (e.g., `https://your-backend.onrender.com/api`).

---

## Routes

| Route | Description |
|-------|-------------|
| `/` | Product listing — server-rendered grid of all products |
| `/products/:slug` | Product detail — server-fetches full data, client-side interactivity for variant/EMI selection |

> The `:slug` segment is **plural** (`products`, not `product`) per the assignment spec.

---

## Project Structure

```
frontend/
├── app/
│   ├── page.tsx                    # "/" — Server Component, lists products
│   ├── layout.tsx                  # Root layout, fonts, metadata
│   ├── globals.css                 # Tailwind v4 import + CSS variables
│   └── products/[slug]/page.tsx    # "/products/:slug" — Server Component wrapper
│       └── (fetches data, 404 handling, delegates to client component)
├── components/
│   └── ProductDetails.tsx          # "use client" — variant picker, EMI cards, Proceed button
├── libs/
│   └── api.ts                      # Axios instance + typed fetch helpers
├── utils/
│   └── format.ts                   # Shared TS interfaces + toNumber(), formatINR()
├── public/                         # Static assets (favicon, etc.)
├── .env.local                      # Local env (gitignored)
├── .env.example                    # Template for env vars
├── package.json
├── tsconfig.json
├── next.config.ts
├── postcss.config.mjs
└── README.md
```

---

## Key Implementation Details

### Server vs Client Components

Next.js App Router splits components by default:

- **Server Components** (default): Run on the server, can `await` data fetching directly, send zero JS to the browser. Used for:
  - `app/page.tsx` — fetches product list, renders cards
  - `app/products/[slug]/page.tsx` — fetches single product, handles 404, passes data down

- **Client Components** (`"use client"`): Run in the browser, can use `useState`, `useEffect`, event handlers. Used for:
  - `components/ProductDetails.tsx` — variant buttons, EMI plan selection, Proceed button

This is the **only** client component in the codebase. Everything else is server-rendered.

### Data Flow

```
GET /api/products
       │
       ▼
app/page.tsx (Server Component)
       │
       ▼
<Link href="/products/:slug">  ← client-side navigation
       │
       ▼
GET /api/products/:slug
       │
       ▼
app/products/[slug]/page.tsx (Server Component)
       │
       ├── 404? → notFound()
       └── OK  → <ProductDetails product={data} />
                        │
                        ▼
         "use client" component
         useState(selectedVariant)
         useState(selectedEmiPlan)
         onClick handlers
         alert() on Proceed
```

### Handling Postgres NUMERIC (string numbers)

The backend returns **all numeric fields as strings** (`"127400.00"`, not `127400`). This is expected — `pg` serializes `NUMERIC` that way.

The frontend defines raw API types with `string` for every numeric field (see `utils/format.ts`), then converts at render time:

```ts
// utils/format.ts
export function toNumber(val: string): number {
  return Number(val);
}

export function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}
```

Usage in JSX:
```tsx
formatINR(toNumber(product.price))   // "₹1,27,400"
```

---

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 16 (App Router, Server Components by default) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS v4 (CSS-first config via `@import "tailwindcss"`) |
| HTTP Client | Axios (single instance with `baseURL` from env) |
| Fonts | Satoshi (via Fontshare CDN) + Geist (fallback) |
| Linting | ESLint 9 + `eslint-config-next` |
| Deployment | Vercel |

---

## Backend Contract (What the Frontend Expects)

### `GET /api/products` → `ProductSummaryRaw[]`

```ts
interface ProductSummaryRaw {
  id: number;
  slug: string;
  name: string;
  price: string;      // default variant price
  mrp: string;        // default variant MRP
  image_url: string;  // default variant image
}
```

### `GET /api/products/:slug` → `ProductRaw`

```ts
interface ProductRaw {
  id: number;
  slug: string;
  name: string;
  description: string;
  variants: VariantRaw[];
}

interface VariantRaw {
  id: number;
  product_id: number;
  storage: string;
  color: string;
  mrp: string;
  price: string;
  image_url: string;
  is_default: boolean;
  emi_plans: EmiPlanRaw[];
}

interface EmiPlanRaw {
  id: number;
  variant_id: number;
  monthly_amount: string;
  tenure_months: number;
  interest_rate: string;
  cashback: string;
}
```

All numeric fields are strings — convert with `toNumber()` before math or formatting.

---

## Deployment (Vercel)

1. Push this repo to GitHub
2. Import the **frontend/** folder as a new Vercel project
3. Framework preset: **Next.js** (auto-detected)
4. Add Environment Variable:
   - `NEXT_PUBLIC_API_URL` = your deployed backend URL + `/api` (e.g., `https://your-backend.onrender.com/api`)
5. Deploy — Vercel handles `npm run build` and `npm start` automatically

---

## Scripts

```bash
npm run dev      # Start dev server (Turbopack)
npm run build    # Production build
npm run start    # Run production server
npm run lint     # ESLint check
```

---

## License

ISC — submitted as part of the 1Fi SDE Internship take-home assignment.