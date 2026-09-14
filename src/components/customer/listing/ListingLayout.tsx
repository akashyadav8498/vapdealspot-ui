import styles from './ListingLayout.module.css';
import { FilterSidebar } from './FilterSidebar';
import { MobileFilterDrawer } from './MobileFilterDrawer';
import { SortSelect } from './SortSelect';
import { ResultCount } from './ResultCount';
import { useState } from 'react';
import { Button } from '../../common/Button';

interface ListingLayoutProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  breadcrumbs?: React.ReactNode;
  children: React.ReactNode;
  totalResults: number;
  availableBrands: string[];
}

export const ListingLayout = ({ 
  title, 
  description, 
  breadcrumbs, 
  children,
  totalResults,
  availableBrands
}: ListingLayoutProps) => {
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  return (
    <div className={`container ${styles.layout}`}>
      {breadcrumbs && <div className={styles.breadcrumbs}>{breadcrumbs}</div>}
      
      <div className={styles.header}>
        <h1 className={styles.title}>{title}</h1>
        {description && <p className={styles.description}>{description}</p>}
      </div>
      
      <div className={styles.toolbar}>
        <div className={styles.mobileFilterToggle}>
          <Button variant="secondary" onClick={() => setIsMobileDrawerOpen(true)}>
            <span aria-hidden="true" style={{ marginRight: '8px' }}>⚡</span> Filters
          </Button>
        </div>
        
        <div className={styles.countWrapper}>
          <ResultCount count={totalResults} />
        </div>
        
        <div className={styles.sortWrapper}>
          <SortSelect />
        </div>
      </div>

      <div className={styles.body}>
        <aside className={styles.sidebar}>
          <FilterSidebar availableBrands={availableBrands} />
        </aside>
        
        <main className={styles.main}>
          {children}
        </main>
      </div>

      <MobileFilterDrawer 
        isOpen={isMobileDrawerOpen} 
        onClose={() => setIsMobileDrawerOpen(false)} 
        availableBrands={availableBrands} 
      />
    </div>
  );
};
