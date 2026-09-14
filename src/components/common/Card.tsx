import React from 'react';
import styles from './Card.module.css';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  sunken?: boolean;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '',
  sunken = false
}) => {
  const classNames = [
    styles.card,
    sunken ? styles.sunken : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={classNames}>
      {children}
    </div>
  );
};
