import React from 'react';
import styles from './Button.module.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'neutral';
  size?: 'normal' | 'compact';
  pill?: boolean;
  href?: string;
  target?: string;
  rel?: string;
}

export const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  size = 'normal', 
  pill = false,
  className = '', 
  children, 
  href,
  ...props 
}) => {
  const classNames = [
    styles.button,
    styles[variant],
    styles[size],
    pill ? styles.pill : '',
    className
  ].filter(Boolean).join(' ');

  if (href) {
    return (
      <a href={href} className={classNames} {...(props as any)}>
        {children}
      </a>
    );
  }

  return (
    <button className={classNames} {...props}>
      {children}
    </button>
  );
};
