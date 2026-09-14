import React from 'react';
import styles from './DealsPage.module.css';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { DealCard } from '../../components/customer/deals/DealCard';
import { deals } from '../../data/listingMockData';

export const DealsPage: React.FC = () => {
  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Deals' }
  ];

  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <Breadcrumbs items={breadcrumbItems} />
        <h1 className={styles.title}>Vape Deals & Coupons</h1>
        <p className={styles.description}>
          Discover the latest verified discounts and promo codes from top vape retailers.
        </p>
      </div>

      <div className={styles.dealsGrid}>
        {deals.map(deal => (
          <DealCard key={deal.id} deal={deal} />
        ))}
      </div>
    </div>
  );
};
