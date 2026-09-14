import type { Product, Offer } from "@/admin/lib/types";
import type { ImportRow } from "./types";
import { generateSlug } from "@/admin/lib/slug";

const generateId = () => {
  return "prod_" + Math.random().toString(36).substr(2, 9);
};

export const mapImportRowsToProducts = (rows: ImportRow[]): Product[] => {
  // Group valid rows by productKey
  const groups = new Map<string, ImportRow[]>();

  rows.forEach(row => {
    if (!row.productKey) return;
    const normalizedKey = row.productKey.trim().toLowerCase();
    if (!groups.has(normalizedKey)) {
      groups.set(normalizedKey, []);
    }
    groups.get(normalizedKey)!.push(row);
  });

  const products: Product[] = [];

  groups.forEach((groupRows) => {
    if (groupRows.length === 0) return;

    const refRow = groupRows[0];
    
    const offers: Offer[] = groupRows.map(row => ({
      id: crypto.randomUUID(),
      merchant: row.merchant!,
      price: Number(row.price),
      originalPrice: row.originalPrice ? Number(row.originalPrice) : undefined,
      affiliateUrl: row.affiliateUrl!,
      availability: (row.availability as "in_stock" | "out_of_stock" | "unknown") || "in_stock",
    }));

    products.push({
      id: generateId(),
      slug: generateSlug(refRow.brand || "", refRow.name || ""),
      name: refRow.name!,
      brand: refRow.brand!,
      category: refRow.category!,
      description: refRow.description!,
      image: refRow.image!,
      status: (refRow.status === "active" ? "active" : "inactive") as "active" | "inactive",
      rating: 0,
      offers,
    });
  });

  return products;
};
