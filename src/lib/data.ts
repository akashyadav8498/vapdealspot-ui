import type { Product } from "./types";
import { generateSlug } from "./slug";

export const demoProducts: Product[] = [
  {
    id: "geekvape-aegis-legend-3",
    slug: generateSlug("GeekVape", "Aegis Legend 3 Kit"),
    name: "Aegis Legend 3 Kit",
    description: "Durable and powerful 200W box mod kit featuring industry-leading water and dust resistance. Perfect for outdoor enthusiasts.",
    rating: 4.8,
    brand: "GeekVape",
    category: "Devices",
    image: "https://images.unsplash.com/photo-1572097463595-5dbd8f51a447?q=80&w=600&auto=format&fit=crop",
    status: "active",
    offers: [
      {
        id: crypto.randomUUID(),
        merchant: "Element Vape",
        price: 59.95,
        originalPrice: 75.00,
        affiliateUrl: "#",
        availability: "in_stock"
      },
      {
        id: crypto.randomUUID(),
        merchant: "VaporFi",
        price: 64.99,
        originalPrice: 79.99,
        affiliateUrl: "#",
        availability: "in_stock"
      },
      {
        id: crypto.randomUUID(),
        merchant: "DirectVapor",
        price: 58.50,
        affiliateUrl: "#",
        availability: "out_of_stock"
      }
    ]
  },
  {
    id: "smok-tfv18-tank",
    slug: generateSlug("SMOK", "TFV18 Sub-Ohm Tank"),
    name: "TFV18 Sub-Ohm Tank",
    description: "High-capacity 7.5ml sub-ohm tank designed for massive vapor production and rich flavor. Compatible with TFV18 mesh coils.",
    rating: 4.6,
    brand: "SMOK",
    category: "Tanks",
    image: "https://images.unsplash.com/photo-1589417865961-397f39446d3e?q=80&w=600&auto=format&fit=crop",
    status: "active",
    offers: [
      {
        id: crypto.randomUUID(),
        merchant: "EightVape",
        price: 22.95,
        originalPrice: 29.99,
        affiliateUrl: "#",
        availability: "in_stock"
      },
      {
        id: crypto.randomUUID(),
        merchant: "Element Vape",
        price: 24.99,
        affiliateUrl: "#",
        availability: "in_stock"
      }
    ]
  },
  {
    id: "naked-100-lava-flow",
    slug: generateSlug("Naked 100", "Lava Flow E-Liquid 60ml"),
    name: "Lava Flow E-Liquid 60ml",
    description: "A tropical blend of fresh strawberries, creamy coconut, and tangy pineapple. Available in 0mg, 3mg, and 6mg nicotine strengths.",
    rating: 4.9,
    brand: "Naked 100",
    category: "E-Liquids",
    image: "https://images.unsplash.com/photo-1599839619722-39751411ea63?q=80&w=600&auto=format&fit=crop",
    status: "active",
    offers: [
      {
        id: crypto.randomUUID(),
        merchant: "VaporDNA",
        price: 14.99,
        affiliateUrl: "#",
        availability: "in_stock"
      }
    ]
  },
  {
    id: "cbdfx-gummies",
    slug: generateSlug("CBDfx", "Original Mixed Berry CBD Gummies"),
    name: "Original Mixed Berry CBD Gummies",
    description: "Broad spectrum CBD gummies offering 50mg of CBD per serving. Vegan, gluten-free, and delightfully sweet.",
    rating: 4.7,
    brand: "CBDfx",
    category: "CBD / THC",
    image: "https://images.unsplash.com/photo-1611079830811-865ff4428d17?q=80&w=600&auto=format&fit=crop",
    status: "active",
    offers: [
      {
        id: crypto.randomUUID(),
        merchant: "Direct CBD",
        price: 49.99,
        originalPrice: 54.99,
        affiliateUrl: "#",
        availability: "out_of_stock"
      },
      {
        id: crypto.randomUUID(),
        merchant: "CBDfx Official",
        price: 54.99,
        affiliateUrl: "#",
        availability: "out_of_stock"
      }
    ]
  },
  {
    id: "uwell-caliburn-g3",
    slug: generateSlug("Uwell", "Caliburn G3 Pod System"),
    name: "Caliburn G3 Pod System",
    description: "Sleek and portable 25W pod system featuring a 900mAh battery, OLED display, and top-fill cartridges.",
    rating: 4.8,
    brand: "Uwell",
    category: "Devices",
    image: "https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?q=80&w=600&auto=format&fit=crop",
    status: "active",
    offers: []
  }
];
