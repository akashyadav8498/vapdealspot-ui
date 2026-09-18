export type RetailerOffer = {
  id: string;
  merchant: string;
  merchantLogo?: string;
  price: number;
  originalPrice?: number;
  affiliateUrl: string;
  availability: "in_stock" | "out_of_stock" | "unknown";
  shippingInfo?: string;
};

export type ProductVariant = {
  id: string;
  sku: string;
  attributes: Record<string, string>; // e.g., { Color: 'Red', Size: 'Large' }
  price: number;
  stock: number;
  image?: string;
};

export type AdminProduct = {
  id: string;
  slug: string;
  name: string;
  shortDescription?: string;
  description: string;
  brand: string;
  category: string;
  tags: string[];
  
  // SEO
  seoMetaTitle?: string;
  seoMetaDescription?: string;
  
  // Settings
  status: "active" | "inactive";
  featured: boolean;
  trending: boolean;
  showOnHomepage: boolean;
  
  // Media
  featuredImage: string;
  galleryImages: string[];
  
  // Associated Data
  variants: ProductVariant[];
  offers: RetailerOffer[];
  relatedProductIds: string[];
  
  rating: number; // Retained from old model
  
  createdAt?: string;
  updatedAt?: string;
};
