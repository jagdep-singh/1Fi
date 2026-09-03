import { pool } from "../config/db.js";

export async function findAll() {
  const result = await pool.query(
    "SELECT id, slug, name FROM products ORDER BY id"
  );
  return result.rows;
}

export async function findBySlug(slug) {
  const result = await pool.query(
    "SELECT * FROM products WHERE slug = $1",
    [slug]
  );
  return result.rows[0] || null;
}