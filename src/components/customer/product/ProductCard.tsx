import { Link } from 'react-router-dom';
import { Card } from '../../common/Card';
import { Badge } from '../../common/Badge';
import styles from './ProductCard.module.css';

export interface ProductData {
  id: string;
  slug: string;
  brand: string;
  name: string;
  image: string;
  minPrice: number;
  maxPrice: number;
  shopCount: number;
  savingsBadge?: string;
}

interface ProductCardProps {
  product: ProductData;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <Card className={styles.card}>
      <Link to={`/product/${product.slug}`} className={styles.link} aria-label={`View details for ${product.name}`}>
        
        {/* Image Area */}
        <div className={styles.imageWrapper}>
          {product.savingsBadge && (
            <div className={styles.badgeWrapper}>
              <Badge variant="success">{product.savingsBadge}</Badge>
            </div>
          )}
          <img src={product.image} alt={product.name} className={styles.image} loading="lazy" />
        </div>

        {/* Content Area */}
        <div className={styles.content}>
          <div className={styles.brand}>{product.brand}</div>
          <h3 className={styles.name}>{product.name}</h3>
          
          <div className={styles.metaRow}>
            <div className={styles.priceContainer}>
              <span className={styles.priceLabel}>From</span>
              <span className={styles.priceValue}>${product.minPrice.toFixed(2)}</span>
            </div>
            
            <div className={styles.shopCount}>
              <span className={styles.shopIcon} aria-hidden="true">🏪</span>
              {product.shopCount} {product.shopCount === 1 ? 'shop' : 'shops'}
            </div>
          </div>
        </div>
      </Link>
    </Card>
  );
};
