import { Link } from 'react-router-dom';
import styles from './CategorySection.module.css';
import { categories } from '../../../data/homeMockData';

export const CategorySection = () => {
  return (
    <section className={styles.section}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.header}>
          <div className={styles.eyebrow}>Browse</div>
          <h2 className={styles.title}>Shop by category</h2>
        </div>
        
        <div className={styles.pills}>
          {categories.map((cat) => (
            <Link key={cat.id} to={cat.path} className={styles.pill}>
              <span className={styles.icon} aria-hidden="true">{cat.icon}</span>
              <span className={styles.label}>{cat.label}</span>
              {cat.count > 0 && <span className={styles.count}>{cat.count}</span>}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
