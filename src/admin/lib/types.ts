export type Offer = {
  id: string;
  merchant: string;
  price: number;
  affiliateUrl: string;
  availability: "in_stock" | "out_of_stock" | "unknown";
  originalPrice?: number;
};

export type Product = {
  id: string;
  slug: string;
  brand: string;
  name: string;
  description: string;
  rating: number;
  category: string;
  image: string;
  status: "active" | "inactive";
  offers: Offer[];
};
