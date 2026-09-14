import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../common/Button';
import styles from './GlobalSearch.module.css';

interface GlobalSearchProps {
  hero?: boolean;
}

export const GlobalSearch = ({ hero = false }: GlobalSearchProps) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form className={`${styles.searchForm} ${hero ? styles.heroForm : ''}`} onSubmit={handleSearch} role="search">
      <div className={`${styles.inputWrapper} ${hero ? styles.heroWrapper : ''}`}>
        <span className={styles.icon} aria-hidden="true">
          <svg width={hero ? "24" : "20"} height={hero ? "24" : "20"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </span>
        <input 
          type="search" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search vapes, juices, CBD..." 
          aria-label="Search products"
          className={`${styles.input} ${hero ? styles.heroInput : ''}`}
        />
        <Button type="submit" pill size={hero ? "normal" : "compact"} className={`${styles.button} ${hero ? styles.heroButton : ''}`}>
          Search
        </Button>
      </div>
    </form>
  );
};

