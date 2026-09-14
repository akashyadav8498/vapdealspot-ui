import React from 'react';
import styles from './BestOfPage.module.css';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { CuratedList } from '../../components/customer/best-of/CuratedList';
import { bestOfLists } from '../../data/listingMockData';

export const BestOfPage: React.FC = () => {
  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Best Of' }
  ];

  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <Breadcrumbs items={breadcrumbItems} />
        <h1 className={styles.title}>The Best Vapes of 2026</h1>
        <p className={styles.description}>
          Curated vape picks across devices, e-liquids, and more. 
          Discover standout products and compare prices across all trusted merchants.
        </p>
      </div>

      <div className={styles.listsContainer}>
        {bestOfLists.map(list => (
          <CuratedList key={list.id} list={list} />
        ))}
      </div>
    </div>
  );
};
