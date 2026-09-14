import { useSearchParams } from 'react-router-dom';
import styles from './FilterSidebar.module.css';

interface FilterSidebarProps {
  availableBrands: string[];
}

export const FilterSidebar = ({ availableBrands }: FilterSidebarProps) => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Parse current state from URL
  const inStock = searchParams.get('instock') === 'true';
  const selectedBrands = searchParams.get('brand')?.split(',').filter(Boolean) || [];

  // Toggle inStock filter
  const toggleInStock = () => {
    const params = new URLSearchParams(searchParams);
    if (inStock) {
      params.delete('instock');
    } else {
      params.set('instock', 'true');
    }
    setSearchParams(params);
  };

  // Toggle brand filter
  const toggleBrand = (brand: string) => {
    const params = new URLSearchParams(searchParams);
    let brands = [...selectedBrands];
    
    if (brands.includes(brand)) {
      brands = brands.filter(b => b !== brand);
    } else {
      brands.push(brand);
    }

    if (brands.length > 0) {
      params.set('brand', brands.join(','));
    } else {
      params.delete('brand');
    }
    
    setSearchParams(params);
  };

  const clearAll = () => {
    const params = new URLSearchParams(searchParams);
    params.delete('instock');
    params.delete('brand');
    setSearchParams(params);
  };

  const hasFilters = inStock || selectedBrands.length > 0;

  return (
    <div className={styles.sidebar}>
      <div className={styles.header}>
        <h3 className={styles.title}>
          <span aria-hidden="true" className={styles.icon}>⚡</span> Filters
        </h3>
        {hasFilters && (
          <button onClick={clearAll} className={styles.clearBtn}>Clear all</button>
        )}
      </div>

      <div className={styles.group}>
        <h4 className={styles.groupTitle}>Availability</h4>
        <label className={styles.checkLabel}>
          <input 
            type="checkbox" 
            checked={inStock} 
            onChange={toggleInStock} 
            className={styles.checkbox} 
          />
          <span className={styles.checkText}>In stock</span>
        </label>
      </div>

      <div className={styles.group}>
        <h4 className={styles.groupTitle}>Brand</h4>
        {availableBrands.map((brand) => (
          <label key={brand} className={styles.checkLabel}>
            <input 
              type="checkbox" 
              checked={selectedBrands.includes(brand)} 
              onChange={() => toggleBrand(brand)} 
              className={styles.checkbox} 
            />
            <span className={styles.checkText}>{brand}</span>
          </label>
        ))}
      </div>
    </div>
  );
};
