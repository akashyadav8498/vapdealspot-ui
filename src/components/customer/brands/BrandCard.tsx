import React from 'react';
import { Link } from 'react-router-dom';
import styles from './BrandCard.module.css';
import { Card } from '../../common/Card';
import { type Brand } from '../../../data/listingMockData';

interface BrandCardProps {
  brand: Brand;
  productCount?: number;
}

export const BrandCard: React.FC<BrandCardProps> = ({ brand, productCount = 0 }) => {
  return (
    <Card className={styles.brandCard}>
      <Link to={`/brand/${brand.slug}`} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', height: '100%' }}>
        <h3 className={styles.name}>{brand.name}</h3>
        {brand.description && (
          <p className={styles.description}>{brand.description}</p>
        )}
        <div className={styles.meta}>
          {productCount} Product{productCount !== 1 ? 's' : ''}
        </div>
      </Link>
    </Card>
  );
};
