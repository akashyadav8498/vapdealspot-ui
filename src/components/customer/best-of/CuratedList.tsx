import React, { useMemo } from 'react';
import styles from './CuratedList.module.css';
import { type BestOfList, listingProducts, deriveProductDisplayData } from '../../../data/listingMockData';
import { ProductGrid } from '../listing/ProductGrid';
import type { ProductData } from '../product/ProductCard';

interface CuratedListProps {
  list: BestOfList;
}

export const CuratedList: React.FC<CuratedListProps> = ({ list }) => {
  const displayProducts = useMemo(() => {
    // Find products by ID and derive their pricing/availability data
    const matchedProducts = list.productIds
      .map(id => listingProducts.find(p => p.id === id))
      .filter(Boolean) as typeof listingProducts;
      
    return matchedProducts.map(deriveProductDisplayData).map(p => ({
      id: p.id,
      slug: p.slug,
      brand: p.brand,
      name: p.name,
      image: p.image,
      minPrice: p.minPrice,
      maxPrice: p.maxPrice,
      shopCount: p.shopCount,
      savingsBadge: p.savingsBadge
    })) as ProductData[];
  }, [list]);

  if (displayProducts.length === 0) {
    return null; // Don't render empty lists
  }

  return (
    <section className={styles.curatedList} id={list.id}>
      <div className={styles.header}>
        <h2 className={styles.title}>{list.title}</h2>
        <p className={styles.description}>{list.description}</p>
      </div>
      <ProductGrid products={displayProducts} />
    </section>
  );
};
