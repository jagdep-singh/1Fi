import * as productRepo from "../repository/product.repository.js";
import * as variantRepo from "../repository/variant.repository.js";
import * as emiPlanRepo from "../repository/emiPlan.repository.js";
import { NotFoundError } from "../utils/NotFoundError.js";

export async function getAllProducts() {
  const products = await productRepo.findAll();

  const withDefaults = await Promise.all(
    products.map(async (product) => {
      const defaultVariant = await variantRepo.findDefaultByProductId(product.id);
      return {
        id: product.id,
        slug: product.slug,
        name: product.name,
        price: defaultVariant?.price ?? null,
        mrp: defaultVariant?.mrp ?? null,
        image_url: defaultVariant?.image_url ?? null,
      };
    })
  );

  return withDefaults;
}

export async function getProductBySlug(slug) {
  const product = await productRepo.findBySlug(slug);
  if (!product) {
    throw new NotFoundError(`Product with slug "${slug}" not found`);
  }

  const variants = await variantRepo.findByProductId(product.id);
  const variantIds = variants.map((v) => v.id);
  const emiPlans = await emiPlanRepo.findByVariantIds(variantIds);

  const variantsWithPlans = variants.map((variant) => ({
    ...variant,
    emi_plans: emiPlans.filter((plan) => plan.variant_id === variant.id),
  }));

  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    description: product.description,
    variants: variantsWithPlans,
  };
}