import type { Product } from "@/types";

export function getWeightPrice(product: Pick<Product, "price" | "weightPrices">, weight: string) {
  const weightPrice = product.weightPrices?.[weight];
  return Number(weightPrice && weightPrice > 0 ? weightPrice : product.price || 0);
}

export function getWeightComparePrice(
  product: Pick<Product, "comparePrice" | "weightComparePrices">,
  weight: string,
) {
  const weightComparePrice = product.weightComparePrices?.[weight];
  return Number(weightComparePrice && weightComparePrice > 0 ? weightComparePrice : product.comparePrice || 0);
}

export function getLowestProductPrice(product: Pick<Product, "price" | "weights" | "weightPrices">) {
  const prices = product.weights
    .map((weight) => getWeightPrice(product, weight))
    .filter((price) => price > 0);

  return prices.length ? Math.min(...prices) : Number(product.price || 0);
}
