import { useState } from 'react';
import styles from './ProductMedia.module.css';

interface ProductMediaProps {
  imageSrc: string;
  altText: string;
}

export const ProductMedia = ({ imageSrc, altText }: ProductMediaProps) => {
  const [hasError, setHasError] = useState(false);

  return (
    <div className={styles.mediaContainer}>
      {!hasError ? (
        <img 
          src={imageSrc} 
          alt={altText} 
          className={styles.image}
          onError={() => setHasError(true)}
        />
      ) : (
        <div className={styles.fallback}>
          <span className={styles.fallbackIcon} aria-hidden="true">📦</span>
          <span className={styles.fallbackText}>Image not available</span>
        </div>
      )}
    </div>
  );
};
