import { pool } from "../config/db.js";

export async function findByVariantId(variantId) {
  const result = await pool.query(
    "SELECT * FROM emi_plans WHERE variant_id = $1 ORDER BY tenure_months",
    [variantId]
  );
  return result.rows;
}

export async function findByVariantIds(variantIds) {
  const result = await pool.query(
    "SELECT * FROM emi_plans WHERE variant_id = ANY($1) ORDER BY variant_id, tenure_months",
    [variantIds]
  );
  return result.rows;
}