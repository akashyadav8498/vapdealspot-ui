import { ProductCard } from '../product/ProductCard';
import type { ProductData } from '../product/ProductCard';
import styles from './ProductGrid.module.css';

interface ProductGridProps {
  products: ProductData[];
}

export const ProductGrid = ({ products }: ProductGridProps) => {
  return (
    <div className={styles.grid}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};
