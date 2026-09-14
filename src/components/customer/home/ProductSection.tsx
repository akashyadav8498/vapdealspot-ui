import { ProductCard } from '../product/ProductCard';
import type { ProductData } from '../product/ProductCard';
import styles from './ProductSection.module.css';

interface ProductSectionProps {
  title: string;
  eyebrow?: string;
  products: ProductData[];
}

export const ProductSection = ({ title, eyebrow, products }: ProductSectionProps) => {
  if (!products || products.length === 0) return null;

  return (
    <section className={styles.section}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.header}>
          {eyebrow && <div className={styles.eyebrow}>{eyebrow}</div>}
          <h2 className={styles.title}>{title}</h2>
        </div>
        
        <div className={styles.grid}>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};
