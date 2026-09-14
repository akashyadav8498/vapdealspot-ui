import { FilterSidebar } from './FilterSidebar';
import { Button } from '../../common/Button';
import styles from './MobileFilterDrawer.module.css';
import { useEffect } from 'react';

interface MobileFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  availableBrands: string[];
}

export const MobileFilterDrawer = ({ isOpen, onClose, availableBrands }: MobileFilterDrawerProps) => {
  // Close the drawer if escape key is pressed
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  // Optionally, close drawer when filters change significantly, 
  // but usually users want to see the effect immediately or click a "View Results" button.
  // We'll leave it open so they can select multiple filters.

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.drawer} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Filters</h2>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close filters">
            ✕
          </button>
        </div>
        
        <div className={styles.content}>
          <FilterSidebar availableBrands={availableBrands} />
        </div>
        
        <div className={styles.footer}>
          <Button variant="primary" onClick={onClose} className={styles.viewBtn}>
            View Results
          </Button>
        </div>
      </div>
    </div>
  );
};
