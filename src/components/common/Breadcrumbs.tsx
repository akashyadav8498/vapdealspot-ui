import React from 'react';
import { Link } from 'react-router-dom';

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  return (
    <div style={{ marginBottom: '1rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        
        return (
          <span key={item.label}>
            {item.path && !isLast ? (
              <Link to={item.path} style={{ color: 'inherit', textDecoration: 'none' }}>
                {item.label}
              </Link>
            ) : (
              <span style={{ color: isLast ? 'var(--text-strong)' : 'inherit' }}>
                {item.label}
              </span>
            )}
            {!isLast && <span style={{ margin: '0 8px' }}>›</span>}
          </span>
        );
      })}
    </div>
  );
};
