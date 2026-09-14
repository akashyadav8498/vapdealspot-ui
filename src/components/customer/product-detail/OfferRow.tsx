import type { Offer } from '../../../data/listingMockData';
import { Button } from '../../common/Button';
import { Badge } from '../../common/Badge';
import { Card } from '../../common/Card';
import styles from './OfferRow.module.css';

interface OfferRowProps {
  offer: Offer;
  isBest?: boolean;
}

export const OfferRow = ({ offer, isBest }: OfferRowProps) => {
  return (
    <Card className={`${styles.row} ${!offer.inStock ? styles.outOfStock : ''} ${isBest ? styles.bestOffer : ''}`}>
      <div className={styles.merchantInfo}>
        <span className={styles.merchantIcon} aria-hidden="true">🏪</span>
        <span className={styles.merchantName}>{offer.merchantName}</span>
        {isBest && <Badge variant="success">Best Price</Badge>}
      </div>

      <div className={styles.priceInfo}>
        <span className={styles.price}>${offer.price.toFixed(2)}</span>
      </div>

      <div className={styles.actionInfo}>
        {!offer.inStock ? (
          <Button variant="neutral" size="normal" disabled className={styles.cta}>
            Out of Stock
          </Button>
        ) : (
          <Button 
            variant="primary" 
            size="normal" 
            href={offer.affiliateUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className={styles.cta}
          >
            Get Deal
          </Button>
        )}
      </div>
    </Card>
  );
};
