import { useParams } from 'react-router-dom';
import { listingProducts, deriveProductDisplayData } from '../../data/listingMockData';
import { ProductBreadcrumb } from '../../components/customer/product-detail/ProductBreadcrumb';
import { ProductMedia } from '../../components/customer/product-detail/ProductMedia';
import { BestPriceBlock } from '../../components/customer/product-detail/BestPriceBlock';
import { OfferComparison } from '../../components/customer/product-detail/OfferComparison';
import { ProductDescription } from '../../components/customer/product-detail/ProductDescription';
import { Button } from '../../components/common/Button';
import styles from './ProductPage.module.css';

export const ProductPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const product = listingProducts.find(p => p.slug === slug);

  if (!product) {
    return (
      <div className={styles.notFoundContainer}>
        <div className={styles.notFoundContent}>
          <h1 className={styles.notFoundTitle}>Product Not Found</h1>
          <p className={styles.notFoundMessage}>We couldn't find the product you're looking for.</p>
          <Button variant="primary" size="normal" href="/">
            Return to Homepage
          </Button>
        </div>
      </div>
    );
  }

  const displayData = deriveProductDisplayData(product);

  // Determine best offer for CTA (lowest price, in stock)
  const inStockOffers = [...product.offers].filter(o => o.inStock).sort((a, b) => a.price - b.price);
  const bestOffer = inStockOffers.length > 0 ? inStockOffers[0] : undefined;

  return (
    <div className={styles.pageContainer}>
      <ProductBreadcrumb categorySlug={product.category} productName={product.name} />
      
      <div className={styles.heroSection}>
        <div className={styles.mediaColumn}>
          <ProductMedia imageSrc={product.image} altText={product.name} />
        </div>
        
        <div className={styles.infoColumn}>
          <div className={styles.productIdentity}>
            <span className={styles.brand}>{product.brand}</span>
            <h1 className={styles.title}>{product.name}</h1>
          </div>
          
          <BestPriceBlock 
            minPrice={displayData.minPrice}
            maxPrice={displayData.maxPrice}
            inStock={displayData.inStock}
            shopCount={displayData.shopCount}
            savingsBadge={displayData.savingsBadge}
            bestOffer={bestOffer}
          />
        </div>
      </div>

      <OfferComparison offers={product.offers} />
      
      <ProductDescription description={product.description} />
    </div>
  );
};
