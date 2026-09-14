export function generateSlug(brand: string, name: string): string {
  const combined = `${brand}-${name}`;
  return combined
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}
