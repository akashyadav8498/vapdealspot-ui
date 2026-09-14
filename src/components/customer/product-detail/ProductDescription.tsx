import styles from './ProductDescription.module.css';

interface ProductDescriptionProps {
  description: string;
}

export const ProductDescription = ({ description }: ProductDescriptionProps) => {
  if (!description) return null;

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Product Details</h3>
      <div className={styles.content}>
        <p>{description}</p>
      </div>
    </div>
  );
};
