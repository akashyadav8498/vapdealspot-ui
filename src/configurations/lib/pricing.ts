import type { Product, Offer } from "./types";

export function getActiveOffers(product: Product): Offer[] {
  if (!product || !product.offers) return [];
  return product.offers.filter((offer) => offer.availability === "in_stock");
}

export function getLowestPrice(product: Product): number | null {
  const activeOffers = getActiveOffers(product);
  if (activeOffers.length === 0) return null;

  return activeOffers.reduce(
    (min, offer) => (offer.price < min ? offer.price : min),
    activeOffers[0].price
  );
}

export function getPriceRange(product: Product): { min: number; max: number } | null {
  const activeOffers = getActiveOffers(product);
  if (activeOffers.length === 0) return null;

  let min = activeOffers[0].price;
  let max = activeOffers[0].price;

  for (const offer of activeOffers) {
    if (offer.price < min) min = offer.price;
    if (offer.price > max) max = offer.price;
  }

  return { min, max };
}
