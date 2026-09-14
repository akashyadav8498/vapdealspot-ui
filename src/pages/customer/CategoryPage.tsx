import { useParams, useSearchParams, Link } from 'react-router-dom';
import { useMemo } from 'react';
import { ListingLayout } from '../../components/customer/listing/ListingLayout';
import { ProductGrid } from '../../components/customer/listing/ProductGrid';
import { EmptyState } from '../../components/customer/listing/EmptyState';
import { listingProducts, categories, deriveProductDisplayData } from '../../data/listingMockData';
import type { ProductData } from '../../components/customer/product/ProductCard';

export const CategoryPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  
  const inStockFilter = searchParams.get('instock') === 'true';
  const brandFilters = searchParams.get('brand')?.split(',').filter(Boolean) || [];
  const sort = searchParams.get('sort') || 'default';

  const category = categories.find(c => c.slug === slug);

  const { filteredProducts, availableBrands } = useMemo(() => {
    // Filter base by category
    const baseFiltered = listingProducts.filter(p => p.category === slug);
    const brands = Array.from(new Set(baseFiltered.map(p => p.brand))).sort();

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

    return { filteredProducts: finalProducts, availableBrands: brands };
  }, [slug, inStockFilter, brandFilters, sort]);

  if (!category) {
    return (
      <div className="container" style={{ padding: 'var(--space-12) 0', textAlign: 'center' }}>
        <h1>Category Not Found</h1>
        <Link to="/categories" style={{ color: 'var(--brand)' }}>Browse Categories</Link>
      </div>
    );
  }

  const breadcrumbs = (
    <span>
      <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>Home</Link> 
      <span style={{ margin: '0 8px' }}>›</span> 
      <Link to="/categories" style={{ color: 'inherit', textDecoration: 'none' }}>Categories</Link> 
      <span style={{ margin: '0 8px' }}>›</span> 
      <span style={{ color: 'var(--text-strong)' }}>{category.title}</span>
    </span>
  );

  return (
    <ListingLayout 
      title={category.title}
      description={category.description}
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
