TRUNCATE products, variants, emi_plans RESTART IDENTITY CASCADE; --only ot reset the db to default state 

INSERT INTO products (slug, name, description) VALUES
('iphone-17-pro', 'iPhone 17 Pro', 'Apple''s flagship phone with A19 Pro chip');

INSERT INTO variants (product_id, storage, color, mrp, price, image_url, is_default) VALUES
(1, '256GB', 'Orange', 134900, 127400,
 'https://m.media-amazon.com/images/I/714TxWv1JYL.jpg', true),
(1, '256GB', 'Silver', 134900, 127400,
 'https://m.media-amazon.com/images/I/619Pp4ERPNL.jpg', false);

INSERT INTO emi_plans (variant_id, monthly_amount, tenure_months, interest_rate, cashback) VALUES
(1, 44967, 3, 0, 7500),
(1, 22483, 6, 0, 7500),
(1, 11242, 12, 0, 7500),
(1, 5621, 24, 0, 7500),
(1, 4297, 36, 10.5, 7500),
(2, 44967, 3, 0, 7500),
(2, 22483, 6, 0, 7500);

INSERT INTO products (slug, name, description) VALUES
('samsung-s24-ultra', 'Samsung Galaxy S24 Ultra', 'Samsung''s flagship with S Pen');

INSERT INTO variants (product_id, storage, color, mrp, price, image_url, is_default) VALUES
(2, '256GB', 'Titanium Black', 129999, 119999,
 'https://m.media-amazon.com/images/I/71Nwtop9jtL._SX679_.jpg', true),
(2, '512GB', 'Titanium Gray', 144999, 134999,
 'https://m.media-amazon.com/images/I/614n7JyvTwL.jpg', false);

INSERT INTO emi_plans (variant_id, monthly_amount, tenure_months, interest_rate, cashback) VALUES
(3, 39999, 3, 0, 5000),
(3, 19999, 6, 0, 5000),
(3, 9999, 12, 0, 5000),
(4, 44999, 3, 0, 5000),
(4, 22499, 6, 0, 5000);

INSERT INTO products (slug, name, description) VALUES
('pixel-9-pro', 'Google Pixel 9 Pro', 'Best-in-class camera with Tensor G4');

INSERT INTO variants (product_id, storage, color, mrp, price, image_url, is_default) VALUES
(3, '128GB', 'Obsidian', 99999, 91999,
 'https://m.media-amazon.com/images/I/51KzFEigYtL.jpg', true),
(3, '256GB', 'Porcelain', 109999, 99999,
 'https://m.media-amazon.com/images/I/41kscmuHT8L.jpg', false);

INSERT INTO emi_plans (variant_id, monthly_amount, tenure_months, interest_rate, cashback) VALUES
(5, 30666, 3, 0, 4000),
(5, 15333, 6, 0, 4000),
(5, 7666, 12, 0, 4000),
(6, 33333, 3, 0, 4000),
(6, 16666, 6, 0, 4000);