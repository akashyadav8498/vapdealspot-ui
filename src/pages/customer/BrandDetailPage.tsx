import { useParams, useSearchParams, Link } from 'react-router-dom';
import { useMemo } from 'react';
import { ListingLayout } from '../../components/customer/listing/ListingLayout';
import { ProductGrid } from '../../components/customer/listing/ProductGrid';
import { EmptyState } from '../../components/customer/listing/EmptyState';
import { listingProducts, brands, deriveProductDisplayData } from '../../data/listingMockData';
import type { ProductData } from '../../components/customer/product/ProductCard';

export const BrandDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  
  const inStockFilter = searchParams.get('instock') === 'true';
  // Reusing the brand filter from the listing layout, though typically a brand page won't filter by *other* brands. 
  // It's technically possible, but we'll leave the support if the user somehow checks a brand filter.
  const brandFilters = searchParams.get('brand')?.split(',').filter(Boolean) || [];
  const sort = searchParams.get('sort') || 'default';

  const brand = brands.find(b => b.slug === slug);

  const { filteredProducts, availableBrands } = useMemo(() => {
    if (!brand) return { filteredProducts: [], availableBrands: [] };

    // Filter base by this brand
    const baseFiltered = listingProducts.filter(p => p.brand === brand.name);
    
    // We only have one brand, but we pass it so the filter panel can still show it (or be empty)
    const activeBrands = Array.from(new Set(baseFiltered.map(p => p.brand))).sort();

    // Map to display data (resolves prices, availability)
    let displayProducts = baseFiltered.map(deriveProductDisplayData);

    // Apply Filters
    if (inStockFilter) {
      displayProducts = displayProducts.filter(p => p.inStock);
    }
    if (brandFilters.length > 0) {
      displayProducts = displayProducts.filter(p => brandFilters.includes(p.brand));
    }

    // Apply Sorting
    switch (sort) {
      case 'price-asc':
        displayProducts.sort((a, b) => a.minPrice - b.minPrice);
        break;
      case 'price-desc':
        displayProducts.sort((a, b) => b.minPrice - a.minPrice);
        break;
      case 'name':
        displayProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'default':
      default:
        // default "Featured" sort by createdAt roughly
        displayProducts.sort((a, b) => b.createdAt - a.createdAt);
        break;
    }

    // Map to ProductCard expected props
    const finalProducts: ProductData[] = displayProducts.map(p => ({
      id: p.id,
      slug: p.slug,
      brand: p.brand,
      name: p.name,
      image: p.image,
      minPrice: p.minPrice,
      maxPrice: p.maxPrice,
      shopCount: p.shopCount,
      savingsBadge: p.savingsBadge
    }));

    return { filteredProducts: finalProducts, availableBrands: activeBrands };
  }, [brand, inStockFilter, brandFilters, sort]);

  if (!brand) {
    return (
      <div className="container" style={{ padding: 'var(--space-12) 0', textAlign: 'center' }}>
        <h1>Brand Not Found</h1>
        <Link to="/brands" style={{ color: 'var(--primary-color)' }}>Browse Brands</Link>
      </div>
    );
  }

  const breadcrumbs = (
    <span>
      <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>Home</Link> 
      <span style={{ margin: '0 8px' }}>›</span> 
      <Link to="/brands" style={{ color: 'inherit', textDecoration: 'none' }}>Brands</Link> 
      <span style={{ margin: '0 8px' }}>›</span> 
      <span style={{ color: 'var(--text-strong)' }}>{brand.name}</span>
    </span>
  );

  return (
    <ListingLayout 
      title={brand.name}
      description={brand.description || `Shop all products from ${brand.name}.`}
      breadcrumbs={breadcrumbs}
      totalResults={filteredProducts.length}
      availableBrands={availableBrands}
    >
      {filteredProducts.length > 0 ? (
        <ProductGrid products={filteredProducts} />
      ) : (
        <EmptyState />
      )}
    </ListingLayout>
  );
};
