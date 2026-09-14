import { Link } from 'react-router-dom';
import styles from './EditorialSection.module.css';

interface PromoData {
  id: string;
  title: string;
  image: string;
  path: string;
}

interface EditorialSectionProps {
  promos: PromoData[];
}

export const EditorialSection = ({ promos }: EditorialSectionProps) => {
  if (!promos || promos.length === 0) return null;

  return (
    <section className={styles.section}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.grid}>
          {promos.map((promo) => (
            <Link key={promo.id} to={promo.path} className={styles.promoCard}>
              <div className={styles.imageWrapper}>
                <img src={promo.image} alt={promo.title} className={styles.image} loading="lazy" />
              </div>
              <div className={styles.content}>
                <h3 className={styles.title}>{promo.title}</h3>
                <span className={styles.cta}>Shop now <span aria-hidden="true">→</span></span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
