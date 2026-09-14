import { Outlet } from 'react-router-dom';
import { CustomerHeader } from '../components/customer/CustomerHeader';
import styles from './CustomerLayout.module.css';

export const CustomerLayout = () => {
  return (
    <div className={styles.layout}>
      <CustomerHeader />
      
      {/* 
        The main content area.
        Padding top accounts for the fixed header. 
        On mobile, the header might be taller, so we use a responsive class.
      */}
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
};
