import React from 'react';
import styles from './DealCard.module.css';
import { Card } from '../../common/Card';
import { Badge } from '../../common/Badge';
import { Button } from '../../common/Button';
import { type Deal } from '../../../data/listingMockData';

interface DealCardProps {
  deal: Deal;
}

export const DealCard: React.FC<DealCardProps> = ({ deal }) => {
  return (
    <Card className={styles.dealCard}>
      <div className={styles.header}>
        <div>
          <div className={styles.merchant}>{deal.merchantName}</div>
          <h3 className={styles.title}>{deal.title}</h3>
        </div>
        <div className={styles.badges}>
          {deal.verified && <Badge variant="success">Verified</Badge>}
          <Badge variant="warning">{deal.discountBadge}</Badge>
        </div>
      </div>

      <div className={styles.meta}>
        {deal.code && (
          <div className={styles.codeBox}>
            Code: <span className={styles.code}>{deal.code}</span>
          </div>
        )}
        
        <div className={styles.footer}>
          <div className={styles.expiry}>
            {deal.expiry ? deal.expiry : 'Ongoing Offer'}
          </div>
          <Button href={deal.affiliateUrl} target="_blank" rel="noopener noreferrer">
            Get Deal
          </Button>
        </div>
      </div>
    </Card>
  );
};
