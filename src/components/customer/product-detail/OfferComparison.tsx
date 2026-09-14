import type { Offer } from '../../../data/listingMockData';
import { OfferRow } from './OfferRow';
import styles from './OfferComparison.module.css';

interface OfferComparisonProps {
  offers: Offer[];
}

export const OfferComparison = ({ offers }: OfferComparisonProps) => {
  // Sort logic: 
  // 1. inStock first
  // 2. then lowest price
  const sortedOffers = [...offers].sort((a, b) => {
    if (a.inStock && !b.inStock) return -1;
    if (!a.inStock && b.inStock) return 1;
    return a.price - b.price;
  });

  if (offers.length === 0) return null;

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Compare Prices</h3>
      <div className={styles.list}>
        {sortedOffers.map((offer, index) => (
          <OfferRow 
            key={`${offer.merchantName}-${index}`} 
            offer={offer} 
            isBest={index === 0 && offer.inStock} 
          />
        ))}
      </div>
    </div>
  );
};
