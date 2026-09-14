import { Card } from '../../common/Card';
import { Button } from '../../common/Button';
import styles from './CouponSection.module.css';

interface CouponData {
  id: string;
  store: string;
  offer: string;
  code: string;
  verified: boolean;
}

interface CouponSectionProps {
  coupons: CouponData[];
}

export const CouponSection = ({ coupons }: CouponSectionProps) => {
  if (!coupons || coupons.length === 0) return null;

  return (
    <section className={styles.section}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.header}>
          <div className={styles.eyebrow}>
            <span aria-hidden="true" className={styles.icon}>✅</span> Verified today
          </div>
          <h2 className={styles.title}>Coupons &amp; discount codes</h2>
        </div>
        
        <div className={styles.grid}>
          {coupons.map((coupon) => (
            <Card key={coupon.id} className={styles.card}>
              <div className={styles.store}>{coupon.store}</div>
              <h3 className={styles.offer}>{coupon.offer}</h3>
              <div className={styles.bottomRow}>
                <div className={styles.codeWrapper}>
                  <span className={styles.codeLabel}>Code:</span>
                  <span className={styles.code}>{coupon.code}</span>
                </div>
                <Button variant="primary" size="compact" pill>Get Deal</Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
