export interface Offer {
  merchantName: string;
  price: number;
  inStock: boolean;
  affiliateUrl: string;
}

export interface ListingProduct {
  id: string;
  slug: string;
  brand: string;
  name: string;
  description: string;
  category: string;
  image: string;
  createdAt: number;
  offers: Offer[];
}

// Generate some derived fields for UI display based on offers
export const deriveProductDisplayData = (product: ListingProduct) => {
  const inStockOffers = product.offers.filter(o => o.inStock);
  const shopCount = product.offers.length;
  
  let minPrice = 0;
  let maxPrice = 0;
  let inStock = false;

  if (inStockOffers.length > 0) {
    inStock = true;
    const prices = inStockOffers.map(o => o.price);
    minPrice = Math.min(...prices);
    maxPrice = Math.max(...prices);
  } else if (product.offers.length > 0) {
    // If all out of stock, still show price range of known offers
    const prices = product.offers.map(o => o.price);
    minPrice = Math.min(...prices);
    maxPrice = Math.max(...prices);
  }

  // Savings badge logic: if there is a gap between min and max > 20%
  let savingsBadge;
  if (minPrice > 0 && maxPrice > minPrice) {
    const savingsPercent = Math.round(((maxPrice - minPrice) / maxPrice) * 100);
    if (savingsPercent >= 15) {
      savingsBadge = `Save ${savingsPercent}%`;
    }
  }

  return {
    ...product,
    minPrice,
    maxPrice,
    shopCount,
    inStock,
    savingsBadge
  };
};

export const listingProducts: ListingProduct[] = [
  {
    id: 'p1',
    slug: 'smok-nord-5-80w-pod-kit',
    brand: 'SMOK',
    name: 'Nord 5 80W Pod Kit',
    description: 'The SMOK Nord 5 features a 2000mAh built-in battery, 80W max output, and is compatible with the RPM 3 coil series for intense flavor and massive clouds.',
    category: 'pod-vapes',
    image: '/demo-assets/demo_nord_5.jpg',
    createdAt: 1789030305000,
    offers: [
      { merchantName: 'Element Vape', price: 24.99, inStock: true, affiliateUrl: '#deal-ev' },
      { merchantName: 'VaporDNA', price: 29.99, inStock: true, affiliateUrl: '#deal-vdna' },
      { merchantName: 'DirectVapor', price: 39.99, inStock: true, affiliateUrl: '#deal-dv' },
      { merchantName: 'EightVape', price: 25.99, inStock: false, affiliateUrl: '#deal-8v' },
    ]
  },
  {
    id: 'p2',
    slug: 'geekvape-aegis-legend-2-l200-mod',
    brand: 'GeekVape',
    name: 'Aegis Legend 2 (L200) Mod',
    description: 'The Aegis Legend 2 (L200) is a durable dual 18650 box mod featuring an IP68 rating, 200W output, and a sleek, compact design compared to its predecessor.',
    category: 'mods',
    image: '/demo-assets/demo_rugged_mod.jpg',
    createdAt: 1789030304000,
    offers: [
      { merchantName: 'Element Vape', price: 39.95, inStock: true, affiliateUrl: '#deal-ev' },
      { merchantName: 'VaporDNA', price: 45.00, inStock: true, affiliateUrl: '#deal-vdna' },
      { merchantName: 'DirectVapor', price: 65.00, inStock: true, affiliateUrl: '#deal-dv' },
    ]
  },
  {
    id: 'p3',
    slug: 'vaporesso-xros-3-mini-pod-system',
    brand: 'Vaporesso',
    name: 'XROS 3 Mini Pod System',
    description: 'The Vaporesso XROS 3 Mini is an ultra-compact pod system with a 1000mAh battery, utilizing AXON chip technology for a consistently smooth MTL vaping experience.',
    category: 'pod-vapes',
    image: '/demo-assets/demo_pod_system.jpg',
    createdAt: 1789030303000,
    offers: [
      { merchantName: 'VaporDNA', price: 11.99, inStock: true, affiliateUrl: '#deal-vdna' },
      { merchantName: 'EightVape', price: 14.99, inStock: true, affiliateUrl: '#deal-8v' },
      { merchantName: 'DirectVapor', price: 19.99, inStock: true, affiliateUrl: '#deal-dv' },
    ]
  },
  {
    id: 'p4',
    slug: 'naked-100-hawaiian-pog-60ml',
    brand: 'Naked 100',
    name: 'Hawaiian POG 60ml E-Liquid',
    description: 'Hawaiian POG by Naked 100 delivers an exotic blend of passion fruit, orange, and guava in a perfect tropical 60ml mix.',
    category: 'e-liquids',
    image: '/demo-assets/demo_fruit_eliquid.jpg',
    createdAt: 1789030302000,
    offers: [
      { merchantName: 'Element Vape', price: 9.99, inStock: true, affiliateUrl: '#deal-ev' },
      { merchantName: 'EightVape', price: 12.99, inStock: true, affiliateUrl: '#deal-8v' },
      { merchantName: 'DirectVapor', price: 15.99, inStock: false, affiliateUrl: '#deal-dv' },
    ]
  },
  {
    id: 'p5',
    slug: 'uwell-caliburn-g3-pod-kit',
    brand: 'Uwell',
    name: 'Caliburn G3 Pod Kit',
    description: 'The Uwell Caliburn G3 features an integrated 900mAh battery, 25W max output, and utilizes the new G3 pod cartridges for enhanced flavor and longevity.',
    category: 'pod-vapes',
    image: '/demo-assets/demo_stick_pod.jpg',
    createdAt: 1789030301000,
    offers: [
      { merchantName: 'VaporDNA', price: 22.95, inStock: true, affiliateUrl: '#deal-vdna' },
      { merchantName: 'DirectVapor', price: 29.99, inStock: true, affiliateUrl: '#deal-dv' },
    ]
  },
  {
    id: 'p6',
    slug: 'voopoo-drag-m100s-mod-kit',
    brand: 'Voopoo',
    name: 'Drag M100S Mod Kit',
    description: 'Powered by a single 18650 or 21700 battery, the Drag M100S Mod Kit delivers up to 100W of power, paired with the UFORCE-L tank for smooth, dense vapor.',
    category: 'mods',
    image: '/demo-assets/demo_box_mod.jpg',
    createdAt: 1789030300000,
    offers: [
      { merchantName: 'Element Vape', price: 48.99, inStock: true, affiliateUrl: '#deal-ev' },
      { merchantName: 'EightVape', price: 55.99, inStock: true, affiliateUrl: '#deal-8v' },
      { merchantName: 'VaporDNA', price: 65.99, inStock: true, affiliateUrl: '#deal-vdna' },
    ]
  },
  {
    id: 'p7',
    slug: 'lost-vape-centaurus-m200-box-mod',
    brand: 'Lost Vape',
    name: 'Centaurus M200 Box Mod',
    description: 'The Centaurus M200 by Lost Vape is a high-end dual 18650 box mod capable of 200W, featuring a unique jog dial and seamless aluminum alloy chassis.',
    category: 'mods',
    image: '/demo-assets/demo_sleek_mod.jpg',
    createdAt: 1789030299000,
    offers: [
      { merchantName: 'DirectVapor', price: 42.99, inStock: true, affiliateUrl: '#deal-dv' },
      { merchantName: 'VaporDNA', price: 49.99, inStock: true, affiliateUrl: '#deal-vdna' },
      { merchantName: 'Element Vape', price: 55.00, inStock: false, affiliateUrl: '#deal-ev' },
    ]
  },
  {
    id: 'p8',
    slug: 'puff-labs-circus-cookie-100ml',
    brand: 'Puff Labs',
    name: 'Circus Cookie 100ml',
    description: 'Circus Cookie by Puff Labs is a decadent blend of circus animal cookies covered in pink and white frosting, delivering a nostalgic sweet treat.',
    category: 'e-liquids',
    image: '/demo-assets/demo_eliquid.jpg',
    createdAt: 1789030298000,
    offers: [
      { merchantName: 'EightVape', price: 10.99, inStock: true, affiliateUrl: '#deal-8v' },
      { merchantName: 'Element Vape', price: 14.99, inStock: true, affiliateUrl: '#deal-ev' },
    ]
  },
  {
    id: 'p9',
    slug: 'smok-novo-4-pod-system',
    brand: 'SMOK',
    name: 'Novo 4 Pod System',
    description: 'The Novo 4 features an adjustable airflow ring, a 0.49-inch OLED display, and an 800mAh battery, delivering a customizable pod experience.',
    category: 'pod-vapes',
    image: '/demo-assets/demo_novo_4.jpg',
    createdAt: 1789030297000,
    offers: [
      { merchantName: 'VaporDNA', price: 19.99, inStock: true, affiliateUrl: '#deal-vdna' },
    ]
  },
  {
    id: 'p10',
    slug: 'geekvape-sonder-u-pod-kit',
    brand: 'GeekVape',
    name: 'Sonder U Pod Kit',
    description: 'The GeekVape Sonder U is an easy-to-use, draw-activated pod kit featuring a 1000mAh battery and a 2ml refillable pod for all-day MTL vaping.',
    category: 'pod-vapes',
    image: '/demo-assets/demo_sonder_u.jpg',
    createdAt: 1789030296000,
    offers: [
      { merchantName: 'Element Vape', price: 9.99, inStock: false, affiliateUrl: '#deal-ev' },
      { merchantName: 'VaporDNA', price: 12.99, inStock: false, affiliateUrl: '#deal-vdna' },
    ]
  },
  {
    id: 'p11',
    slug: 'vaporesso-target-200-mod',
    brand: 'Vaporesso',
    name: 'Target 200 Mod',
    description: 'The Vaporesso Target 200 is a dual 18650 mod packed into an incredibly compact frame, featuring a water-resistant braid and AXON chip performance.',
    category: 'mods',
    image: '/demo-assets/demo_rugged_mod.jpg',
    createdAt: 1789030295000,
    offers: [
      { merchantName: 'Element Vape', price: 45.99, inStock: true, affiliateUrl: '#deal-ev' },
      { merchantName: 'EightVape', price: 49.99, inStock: true, affiliateUrl: '#deal-8v' },
    ]
  },
  {
    id: 'p12',
    slug: 'juice-head-peach-pear-100ml',
    brand: 'Juice Head',
    name: 'Peach Pear 100ml',
    description: 'A refreshing combination of sweet, juicy peaches and crisp pears for a perfectly balanced fruit vape.',
    category: 'e-liquids',
    image: '/demo-assets/demo_fruit_eliquid.jpg',
    createdAt: 1789030294000,
    offers: [
      { merchantName: 'DirectVapor', price: 11.99, inStock: true, affiliateUrl: '#deal-dv' },
      { merchantName: 'VaporDNA', price: 14.99, inStock: true, affiliateUrl: '#deal-vdna' },
    ]
  },
  {
    id: 'p13',
    slug: 'cbdfx-blue-raspberry-cbd-vape-juice-500mg',
    brand: 'CBDfx',
    name: 'Blue Raspberry CBD Vape Juice 500mg',
    description: 'Experience a blast of sweet and tart blue raspberry flavor combined with 500mg of broad-spectrum CBD.',
    category: 'cbd-thc',
    image: '/demo-assets/demo_fruit_eliquid.jpg',
    createdAt: 1789030293000,
    offers: [
      { merchantName: 'DirectVapor', price: 29.99, inStock: true, affiliateUrl: '#deal-dv' },
      { merchantName: 'Element Vape', price: 34.99, inStock: true, affiliateUrl: '#deal-ev' },
    ]
  }
];

export const categories = [
  { slug: 'pod-vapes', title: 'Pod Vapes', description: 'Compact, easy-to-use pod systems perfect for nic salts and beginners.' },
  { slug: 'mods', title: 'Box Mods', description: 'High-power devices for sub-ohm vaping and massive cloud production.' },
  { slug: 'e-liquids', title: 'E-Liquids', description: 'Browse thousands of flavors, from sweet desserts to classic tobacco.' },
  { slug: 'cbd-thc', title: 'CBD & THC', description: 'Find the best prices on premium CBD vape juices and hardware.' },
  { slug: 'tanks', title: 'Tanks', description: 'Sub-ohm tanks, RTAs, and RDAs for all your vaping needs.' }
];

export interface Brand {
  slug: string;
  name: string;
  description?: string;
  logo?: string;
}

export const brands: Brand[] = [
  { slug: 'smok', name: 'SMOK', description: 'Leading manufacturer of pod systems, tanks, and powerful box mods.' },
  { slug: 'geekvape', name: 'GeekVape', description: 'Known for rugged, durable mods and exceptional coil performance.' },
  { slug: 'vaporesso', name: 'Vaporesso', description: 'Innovative vape technology offering smooth hits and compact designs.' },
  { slug: 'naked-100', name: 'Naked 100', description: 'Premium e-liquid manufacturer focused on fruit and natural flavors.' },
  { slug: 'uwell', name: 'Uwell', description: 'Creators of the legendary Caliburn pod system series.' },
  { slug: 'voopoo', name: 'Voopoo', description: 'Combining fast-firing chips with elegant, ergonomic designs.' },
  { slug: 'lost-vape', name: 'Lost Vape', description: 'High-end vape manufacturer known for DNA chips and premium build quality.' },
  { slug: 'puff-labs', name: 'Puff Labs', description: 'Creators of sweet, dessert, and candy-inspired vape juices.' },
  { slug: 'juice-head', name: 'Juice Head', description: 'Specializing in refreshing, clean fruit pairings.' },
  { slug: 'cbdfx', name: 'CBDfx', description: 'Premium broad-spectrum CBD vape juices and disposables.' }
];

export interface Deal {
  id: string;
  merchantName: string;
  title: string;
  discountBadge: string;
  code?: string;
  verified: boolean;
  expiry?: string;
  affiliateUrl: string;
}

export const deals: Deal[] = [
  {
    id: 'd1',
    merchantName: 'Element Vape',
    title: '20% Off All SMOK Devices',
    discountBadge: '20% OFF',
    code: 'SMOK20',
    verified: true,
    expiry: 'Expires in 2 days',
    affiliateUrl: '#deal-ev-smok'
  },
  {
    id: 'd2',
    merchantName: 'VaporDNA',
    title: 'Buy 2 Get 1 Free E-Liquids',
    discountBadge: 'B2G1 FREE',
    verified: true,
    affiliateUrl: '#deal-vdna-b2g1'
  },
  {
    id: 'd3',
    merchantName: 'DirectVapor',
    title: '15% Off Sitewide',
    discountBadge: '15% OFF',
    code: 'DV15',
    verified: false,
    affiliateUrl: '#deal-dv-15'
  },
  {
    id: 'd4',
    merchantName: 'EightVape',
    title: '$10 Off Orders Over $50',
    discountBadge: '$10 OFF',
    code: 'SAVE10',
    verified: true,
    expiry: 'Ends Today',
    affiliateUrl: '#deal-8v-10'
  }
];

export interface BestOfList {
  id: string;
  title: string;
  description: string;
  productIds: string[];
}

export const bestOfLists: BestOfList[] = [
  {
    id: 'b1',
    title: 'Best Pod Vapes',
    description: 'Our top picks for compact, flavor-packed pod systems perfect for nic salts.',
    productIds: ['p1', 'p3', 'p5', 'p9']
  },
  {
    id: 'b2',
    title: 'Best Vape Kits for Clouds',
    description: 'High-power devices and sub-ohm tanks designed for massive cloud production.',
    productIds: ['p2', 'p6', 'p7', 'p11']
  },
  {
    id: 'b3',
    title: 'Best Fruit E-Liquids',
    description: 'The most refreshing and authentic fruit blends on the market right now.',
    productIds: ['p4', 'p12', 'p13'] // p13 is CBD but fruit flavor
  }
];
