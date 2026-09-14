import { Link } from 'react-router-dom';
import { categories } from '../../data/listingMockData';
import styles from '../../components/customer/home/CategorySection.module.css';

export const CategoriesIndexPage = () => {
  return (
    <div className="container" style={{ padding: 'var(--space-12) 0' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', marginBottom: 'var(--space-8)' }}>
        All Categories
      </h1>
      
      <div className={styles.pills} style={{ flexWrap: 'wrap', overflowX: 'visible' }}>
        {categories.map((cat) => (
          <Link key={cat.slug} to={`/category/${cat.slug}`} className={styles.pill} style={{ padding: '12px 24px' }}>
            <span className={styles.label} style={{ fontSize: 'var(--text-lg)' }}>{cat.title}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};
