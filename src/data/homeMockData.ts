export const categories = [
  { id: 'c1', label: 'Vape Juices', count: 549, icon: '💧', path: '/e-liquids' },
  { id: 'c2', label: 'Nic Salt Vape Juices', count: 367, icon: '🧂', path: '/e-liquids' },
  { id: 'c3', label: 'Portable Vaporizers', count: 245, icon: '💨', path: '/devices' },
  { id: 'c4', label: 'Dab Pens & Wax', count: 158, icon: '🖋️', path: '/devices' },
  { id: 'c5', label: 'Pod Vapes', count: 125, icon: '🔋', path: '/devices' },
  { id: 'c6', label: 'Disposable Vapes', count: 93, icon: '🗑️', path: '/devices' },
  { id: 'c7', label: 'CBD & THC', count: 42, icon: '🌿', path: '/cbd-thc' }
];

export const topSavingsProducts = [
  {
    id: 'p1',
    slug: 'smok-nord-5-80w-pod-kit',
    brand: 'SMOK',
    name: 'Nord 5 80W Pod Kit',
    image: '/demo-assets/demo_nord_5.jpg',
    minPrice: 24.99,
    maxPrice: 39.99,
    shopCount: 14,
    savingsBadge: 'Save 37%',
  },
  {
    id: 'p2',
    slug: 'geekvape-aegis-legend-2-l200-mod',
    brand: 'GeekVape',
    name: 'Aegis Legend 2 (L200) Mod',
    image: '/demo-assets/demo_rugged_mod.jpg',
    minPrice: 39.95,
    maxPrice: 65.00,
    shopCount: 22,
    savingsBadge: 'Save 38%',
  },
  {
    id: 'p3',
    slug: 'vaporesso-xros-3-mini-pod-system',
    brand: 'Vaporesso',
    name: 'XROS 3 Mini Pod System',
    image: '/demo-assets/demo_stick_pod.jpg',
    minPrice: 11.99,
    maxPrice: 19.99,
    shopCount: 18,
    savingsBadge: 'Save 40%',
  },
  {
    id: 'p4',
    slug: 'naked-100-hawaiian-pog-60ml',
    brand: 'Naked 100',
    name: 'Hawaiian POG 60ml E-Liquid',
    image: '/demo-assets/demo_fruit_eliquid.jpg',
    minPrice: 9.99,
    maxPrice: 15.99,
    shopCount: 12,
    savingsBadge: 'Save 37%',
  }
];

export const newArrivalProducts = [
  {
    id: 'n1',
    slug: 'uwell-caliburn-g3-pod-kit',
    brand: 'Uwell',
    name: 'Caliburn G3 Pod Kit',
    image: '/demo-assets/demo_stick_pod.jpg',
    minPrice: 22.95,
    maxPrice: 29.99,
    shopCount: 8,
  },
  {
    id: 'n2',
    slug: 'voopoo-drag-m100s-mod-kit',
    brand: 'Voopoo',
    name: 'Drag M100S Mod Kit',
    image: '/demo-assets/demo_box_mod.jpg',
    minPrice: 48.99,
    maxPrice: 65.99,
    shopCount: 6,
  },
  {
    id: 'n3',
    slug: 'lost-vape-centaurus-m200-box-mod',
    brand: 'Lost Vape',
    name: 'Centaurus M200 Box Mod',
    image: '/demo-assets/demo_sleek_mod.jpg',
    minPrice: 42.99,
    maxPrice: 55.00,
    shopCount: 9,
  },
  {
    id: 'n4',
    slug: 'puff-labs-circus-cookie-100ml',
    brand: 'Puff Labs',
    name: 'Circus Cookie 100ml',
    image: '/demo-assets/demo_eliquid.jpg',
    minPrice: 10.99,
    maxPrice: 14.99,
    shopCount: 15,
  }
];

export const coupons = [
  {
    id: 'c1',
    store: 'VaporDNA',
    offer: '15% Off Sitewide',
    code: 'DNA15',
    verified: true,
  },
  {
    id: 'c2',
    store: 'Element Vape',
    offer: '$10 Off Orders $50+',
    code: 'SAVE10',
    verified: true,
  },
  {
    id: 'c3',
    store: 'DirectVapor',
    offer: '20% Off E-Liquids',
    code: 'JUICE20',
    verified: true,
  },
  {
    id: 'c4',
    store: 'EightVape',
    offer: 'Free Shipping Over $65',
    code: 'FREESHIP',
    verified: false,
  }
];

export const editorialPromos = [
  {
    id: 'e1',
    title: 'Best Pod Systems of 2026',
    image: '/demo-assets/demo_editorial.jpg',
    path: '/best-of',
  },
  {
    id: 'e2',
    title: 'Top Nic Salt E-Liquids',
    image: '/demo-assets/demo_editorial.jpg',
    path: '/best-of',
  },
  {
    id: 'e3',
    title: 'Ultimate Mod Guide',
    image: '/demo-assets/demo_editorial.jpg',
    path: '/best-of',
  }
];

export const recentReads = [
  {
    id: 'r1',
    title: 'How to Extend Your Coil Life',
    excerpt: 'Simple maintenance tips to keep your coils tasting fresh longer.',
    date: 'Oct 12, 2026',
  },
  {
    id: 'r2',
    title: 'CBD vs THC Vape Cartridges',
    excerpt: 'Understanding the key differences and what to look for when buying.',
    date: 'Oct 10, 2026',
  },
  {
    id: 'r3',
    title: 'The Evolution of Disposable Vapes',
    excerpt: 'Why the market shifted and what the future holds for single-use devices.',
    date: 'Oct 05, 2026',
  },
  {
    id: 'r4',
    title: 'Top 5 Sub-Ohm Tanks This Year',
    excerpt: 'Cloud chasers unite: the definitive list of top-performing tanks.',
    date: 'Sep 28, 2026',
  }
];
