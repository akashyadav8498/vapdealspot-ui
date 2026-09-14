import { Link } from 'react-router-dom';
import styles from './RecentReadsSection.module.css';

interface ReadData {
  id: string;
  title: string;
  excerpt: string;
  date: string;
}

interface RecentReadsSectionProps {
  reads: ReadData[];
}

export const RecentReadsSection = ({ reads }: RecentReadsSectionProps) => {
  if (!reads || reads.length === 0) return null;

  return (
    <section className={styles.section}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.header}>
          <div className={styles.eyebrow}>
            <span aria-hidden="true" className={styles.icon}>📰</span> From the blog
          </div>
          <h2 className={styles.title}>Recent reads</h2>
        </div>
        
        <div className={styles.grid}>
          {reads.map((read) => (
            <Link key={read.id} to="/blog" className={styles.card}>
              <div className={styles.date}>{read.date}</div>
              <h3 className={styles.readTitle}>{read.title}</h3>
              <p className={styles.excerpt}>{read.excerpt}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
