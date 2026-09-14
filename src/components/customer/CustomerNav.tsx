import { NavLink } from 'react-router-dom';
import styles from './CustomerNav.module.css';

interface CustomerNavProps {
  isMobileOpen?: boolean;
}

const NAV_LINKS = [
  { label: 'Best Of', path: '/best-of' },
  { label: 'Devices', path: '/devices' },
  { label: 'Tanks', path: '/tanks' },
  { label: 'E-Liquids', path: '/e-liquids' },
  { label: 'CBD / THC', path: '/cbd-thc' },
  { label: 'Deals', path: '/deals' },
  { label: 'Brands', path: '/brands' }
];

export const CustomerNav = ({ isMobileOpen = false }: CustomerNavProps) => {
  return (
    <nav id="mobile-nav" className={`${styles.nav} ${isMobileOpen ? styles.mobileOpen : ''}`} aria-label="Primary Navigation">
      <ul className={styles.navList}>
        {NAV_LINKS.map(link => (
          <li key={link.label} className={styles.navItem}>
            <NavLink 
              to={link.path}
              className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
            >
              {link.label}
            </NavLink>
          </li>
        ))}
      </ul>
      
      {/* Account / Login Affordance */}
      <div className={styles.accountAction}>
        <NavLink to="/login" className={styles.loginLink}>
          Sign In
        </NavLink>
      </div>
    </nav>
  );
};
