import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { GlobalSearch } from './GlobalSearch';
import { CustomerNav } from './CustomerNav';
import { ThemeToggle } from './ThemeToggle';
import styles from './CustomerHeader.module.css';

export const CustomerHeader = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent body scroll when mobile menu is open, and handle Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <header className={`${styles.header} ${isScrolled ? styles.isScrolled : ''}`}>
        <div className={`container ${styles.inner}`}>
          
          {/* Mobile Menu Toggle */}
          <button 
            className={styles.burger}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-expanded={isMobileMenuOpen}
            aria-label="Toggle navigation menu"
            aria-controls="mobile-nav"
          >
            {isMobileMenuOpen ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            )}
          </button>

          {/* Logo */}
          <Link to="/" className={styles.logoWrapper} aria-label="Vape Deal Spot Home">
            <img 
              src="/logo-light.png" 
              alt="Vape Deal Spot" 
              className={`${styles.logo} ${styles.logoLight}`} 
            />
            <img 
              src="/logo-dark.png" 
              alt="Vape Deal Spot" 
              className={`${styles.logo} ${styles.logoDark}`} 
            />
          </Link>

          {/* Search */}
          <div className={styles.searchContainer}>
            <GlobalSearch />
          </div>

          {/* Desktop Nav Container */}
          <div className={styles.desktopNav}>
            <CustomerNav />
          </div>

          {/* Theme Toggle */}
          <div className={styles.themeToggleContainer}>
            <ThemeToggle />
          </div>
        </div>
      </header>
      
      {/* Mobile Nav Overlay Wrapper */}
      {isMobileMenuOpen && (
        <div className={styles.mobileNavOverlay}>
          <CustomerNav isMobileOpen={isMobileMenuOpen} />
        </div>
      )}
    </>
  );
};
