# Frontend — 1Fi

Next.js app that lists products, lets you pick a variant and an EMI plan, and hit Proceed. This is the `frontend/` package of the [1Fi monorepo](../README.md) — see the root README for deployment links and overall project structure.

## Tech Stack

Next.js 16 (App Router, Server Components by default), TypeScript, Tailwind CSS v4, and Axios for API calls. Fonts are Satoshi via Fontshare, with Geist as a fallback.

## Setup

1. Install dependencies

   ```bash
   npm install
   ```

2. Point it at the backend

   ```bash
   # .env.local
   NEXT_PUBLIC_API_URL=http://localhost:8383/api
   ```

   Has to be prefixed with `NEXT_PUBLIC_` since the EMI picker runs client-side and needs the value in the browser bundle.

3. Run it

   ```bash
   npm run dev
   ```

Open `http://localhost:3000` — you should see the product grid. Click a card to get to the detail page.

## Routes

- `/` — product listing, server-rendered
- `/products/:slug` — product detail, server-fetches the data and hands it to a client component for the interactive bits

## How it's put together

Everything is a Server Component except `components/ProductDetails.tsx`. That's the one place that needs `useState` — variant selection, EMI plan selection, the Proceed button — so it's the only file marked `"use client"`.

```
app/page.tsx                 → fetches /api/products, renders the grid
app/products/[slug]/page.tsx → fetches /api/products/:slug, handles 404, renders <ProductDetails />
components/ProductDetails.tsx → "use client" — variant picker, EMI plan cards, Proceed
libs/api.ts                  → axios instance + typed fetch functions
utils/format.ts              → shared types + toNumber() / formatINR()
```

`app/products/[slug]/page.tsx` catches a 404 from the API and calls Next's `notFound()`, so an unknown slug lands on the custom not-found page instead of a raw error.

## Numbers from the backend are strings

Postgres `NUMERIC` columns come back through `pg` as strings (`"127400.00"`, not `127400`). The API types in `utils/format.ts` reflect that — every price, MRP, monthly amount, interest rate, and cashback field is typed `string` — and `toNumber()` converts before `formatINR()` formats it for display.

```ts
formatINR(toNumber(product.price)) // "₹1,27,400"
```

## Project Structure

```
frontend/
├── app/
│   ├── page.tsx
│   ├── layout.tsx
│   ├── not-found.tsx
│   ├── globals.css
│   └── products/[slug]/page.tsx
├── components/
│   └── ProductDetails.tsx
├── libs/
│   └── api.ts
├── utils/
│   └── format.ts
├── public/
├── package.json
├── tsconfig.json
└── next.config.ts
```

## Scripts

```bash
npm run dev      # dev server
npm run build    # production build
npm run start    # run the production build
npm run lint     # eslint
```