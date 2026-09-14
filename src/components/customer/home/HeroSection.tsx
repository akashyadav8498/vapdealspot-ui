import { GlobalSearch } from '../GlobalSearch';
import styles from './HeroSection.module.css';

export const HeroSection = () => {
  return (
    <section className={styles.hero}>
      <div className={`container ${styles.inner}`}>
        <span className={styles.pill}>
          <span className={styles.icon} aria-hidden="true">🏷️</span> Prices from 25+ vape shops
        </span>
        
        <h1 className={styles.title}>
          Compare vape prices.<br />
          <span className={styles.titleHighlight}>Never overpay again.</span>
        </h1>
        
        <p className={styles.lede}>
          Search pods, mods, e-liquids and CBD. We check the shops ourselves — no merchant feeds, no copied listings.
        </p>
        
        <div className={styles.searchWrapper}>
          <GlobalSearch hero />
        </div>
        
        <div className={styles.stats}>
          <span className={styles.statItem}>
            <span className={styles.statIcon} aria-hidden="true">📦</span> 1,475 products with a live price
          </span>
          <span className={styles.statItem}>
            <span className={styles.statIcon} aria-hidden="true">🏪</span> 25 shops compared
          </span>
          <span className={styles.statItem}>
            <span className={styles.statIcon} aria-hidden="true">⚖️</span> 1,016 with two or more shops
          </span>
        </div>
      </div>
    </section>
  );
};
