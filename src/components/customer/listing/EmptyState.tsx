import { Button } from '../../common/Button';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styles from './EmptyState.module.css';

interface EmptyStateProps {
  query?: string;
}

export const EmptyState = ({ query }: EmptyStateProps) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const hasFilters = searchParams.get('instock') || searchParams.get('brand');

  const clearFilters = () => {
    const params = new URLSearchParams(searchParams);
    params.delete('instock');
    params.delete('brand');
    setSearchParams(params);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.icon} aria-hidden="true">🔍</div>
      <h2 className={styles.title}>
        {query ? `No results found for "${query}"` : 'No results found'}
      </h2>
      <p className={styles.desc}>
        {hasFilters 
          ? "We couldn't find any products matching your selected filters." 
          : "Try checking your spelling or using more general terms."}
      </p>
      
      <div className={styles.actions}>
        {hasFilters && (
          <Button variant="secondary" onClick={clearFilters}>
            Clear all filters
          </Button>
        )}
        <Button variant="primary" onClick={() => navigate('/categories')}>
          Browse categories
        </Button>
      </div>
    </div>
  );
};
