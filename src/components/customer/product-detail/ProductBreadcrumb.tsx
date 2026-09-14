import { Link } from 'react-router-dom';
import styles from './ProductBreadcrumb.module.css';
import { categories } from '../../../data/listingMockData';

interface ProductBreadcrumbProps {
  categorySlug: string;
  productName: string;
}

export const ProductBreadcrumb = ({ categorySlug, productName }: ProductBreadcrumbProps) => {
  const categoryTitle = categories.find(c => c.slug === categorySlug)?.title || 'Products';

  return (
    <nav className={styles.breadcrumb} aria-label="breadcrumb">
      <Link to="/" className={styles.link}>Home</Link>
      <span className={styles.separator} aria-hidden="true">/</span>
      <Link to={`/category/${categorySlug}`} className={styles.link}>{categoryTitle}</Link>
      <span className={styles.separator} aria-hidden="true">/</span>
      <span className={styles.current} aria-current="page">{productName}</span>
    </nav>
  );
};
