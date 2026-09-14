import { HeroSection } from '../components/customer/home/HeroSection';
import { CategorySection } from '../components/customer/home/CategorySection';
import { ProductSection } from '../components/customer/home/ProductSection';
import { CouponSection } from '../components/customer/home/CouponSection';
import { EditorialSection } from '../components/customer/home/EditorialSection';
import { RecentReadsSection } from '../components/customer/home/RecentReadsSection';

import {
  topSavingsProducts,
  newArrivalProducts,
  coupons,
  editorialPromos,
  recentReads
} from '../data/homeMockData';

export const HomePage = () => {
  return (
    <>
      <HeroSection />
      <CategorySection />
      
      <ProductSection 
        title="Where you save the most" 
        eyebrow="Biggest gaps between shops" 
        products={topSavingsProducts} 
      />
      
      <ProductSection 
        title="New arrivals" 
        eyebrow="First time on Vape Deal Spot" 
        products={newArrivalProducts} 
      />
      
      <CouponSection coupons={coupons} />
      
      <EditorialSection promos={editorialPromos} />
      
      <RecentReadsSection reads={recentReads} />
    </>
  );
};
