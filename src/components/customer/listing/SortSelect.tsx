import { useSearchParams } from 'react-router-dom';
import styles from './SortSelect.module.css';

export const SortSelect = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const sort = searchParams.get('sort') || 'default';

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSort = e.target.value;
    const params = new URLSearchParams(searchParams);
    
    if (newSort === 'default') {
      params.delete('sort');
    } else {
      params.set('sort', newSort);
    }
    
    setSearchParams(params);
  };

  return (
    <div className={styles.wrapper}>
      <label htmlFor="sort-select" className={styles.label}>Sort by:</label>
      <select 
        id="sort-select" 
        className={styles.select} 
        value={sort} 
        onChange={handleChange}
      >
        <option value="default">Relevance</option>
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
        <option value="name">Name A–Z</option>
      </select>
    </div>
  );
};
