-- Active: 1788365393141@@db.olvrrfphhabnmxahqoeb.supabase.co@5432@postgres@public
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