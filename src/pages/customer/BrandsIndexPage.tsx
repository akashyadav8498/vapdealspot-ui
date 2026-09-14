import React, { useMemo } from 'react';
import styles from './BrandsIndexPage.module.css';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { BrandCard } from '../../components/customer/brands/BrandCard';
import { brands, listingProducts } from '../../data/listingMockData';

export const BrandsIndexPage: React.FC = () => {
  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Brands' }
  ];

  // Derive product count per brand
  const brandProductCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    listingProducts.forEach(product => {
      counts[product.brand] = (counts[product.brand] || 0) + 1;
    });
    return counts;
  }, []);

  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <Breadcrumbs items={breadcrumbItems} />
        <h1 className={styles.title}>Vape Brands Directory</h1>
        <p className={styles.description}>
          Discover the top vape hardware and e-liquid brands on the market. Compare prices across top retailers.
        </p>
      </div>

      <div className={styles.brandsGrid}>
        {brands.map(brand => (
          <BrandCard 
            key={brand.slug} 
            brand={brand} 
            productCount={brandProductCounts[brand.name] || 0} 
          />
        ))}
      </div>
    </div>
  );
};
