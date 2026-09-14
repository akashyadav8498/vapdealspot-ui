import React from 'react';
import styles from './Input.module.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  search?: boolean;
}

export const Input: React.FC<InputProps> = ({ 
  search = false,
  className = '', 
  ...props 
}) => {
  const classNames = [
    styles.input,
    search ? styles.search : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <input className={classNames} {...props} />
  );
};
