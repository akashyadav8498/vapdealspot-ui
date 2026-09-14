import { Button } from '../../common/Button';
import { Badge } from '../../common/Badge';
import type { Offer } from '../../../data/listingMockData';
import styles from './BestPriceBlock.module.css';

interface BestPriceBlockProps {
  minPrice: number;
  maxPrice: number;
  inStock: boolean;
  shopCount: number;
  savingsBadge?: string;
  bestOffer?: Offer;
}

export const BestPriceBlock = ({ 
  minPrice, 
  maxPrice, 
  inStock, 
  shopCount, 
  savingsBadge,
  bestOffer 
}: BestPriceBlockProps) => {
  const hasMultiplePrices = minPrice > 0 && maxPrice > minPrice;

  return (
    <div className={styles.container}>
      <div className={styles.priceRow}>
        <div className={styles.priceInfo}>
          {inStock && minPrice > 0 ? (
            <>
              <span className={styles.priceLabel}>Best Price</span>
              <div className={styles.priceWrapper}>
                <span className={styles.priceValue}>${minPrice.toFixed(2)}</span>
                {savingsBadge && <Badge variant="success">{savingsBadge}</Badge>}
              </div>
            </>
          ) : (
            <span className={styles.outOfStock}>Currently Unavailable</span>
          )}
        </div>
        
        {inStock && bestOffer && (
          <Button 
            variant="primary" 
            size="normal"
            className={styles.cta}
            href={bestOffer.affiliateUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Go to Shop <span aria-hidden="true" className={styles.ctaIcon}>→</span>
          </Button>
        )}
      </div>
      
      {shopCount > 0 && (
        <div className={styles.rangeInfo}>
          <span className={styles.shopIcon} aria-hidden="true">🏪</span>
          {shopCount} {shopCount === 1 ? 'shop' : 'shops'}
          {hasMultiplePrices && ` from $${minPrice.toFixed(2)} to $${maxPrice.toFixed(2)}`}
        </div>
      )}
    </div>
  );
};
