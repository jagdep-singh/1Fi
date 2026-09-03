import { pool } from "../config/db.js";

export async function findByProductId(productId) {
  const result = await pool.query(
    "SELECT * FROM variants WHERE product_id = $1 ORDER BY id",
    [productId]
  );
  return result.rows;
}

export async function findDefaultByProductId(productId) {
  const result = await pool.query(
    `SELECT * FROM variants 
     WHERE product_id = $1 
     ORDER BY is_default DESC, id ASC 
     LIMIT 1`,
    [productId]
  );
  return result.rows[0] || null;
}