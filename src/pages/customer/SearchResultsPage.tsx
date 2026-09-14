import { useSearchParams } from 'react-router-dom';
import { useMemo } from 'react';
import { ListingLayout } from '../../components/customer/listing/ListingLayout';
import { ProductGrid } from '../../components/customer/listing/ProductGrid';
import { EmptyState } from '../../components/customer/listing/EmptyState';
import { listingProducts, deriveProductDisplayData } from '../../data/listingMockData';
import type { ProductData } from '../../components/customer/product/ProductCard';

export const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const inStockFilter = searchParams.get('instock') === 'true';
  const brandFilters = searchParams.get('brand')?.split(',').filter(Boolean) || [];
  const sort = searchParams.get('sort') || 'default';

  const { filteredProducts, availableBrands } = useMemo(() => {
    // Determine available brands globally based on query to populate sidebar accurately
    let baseFiltered = listingProducts;
    if (query) {
      const lowerQuery = query.toLowerCase();
      baseFiltered = baseFiltered.filter(p => 
        p.name.toLowerCase().includes(lowerQuery) || 
        p.brand.toLowerCase().includes(lowerQuery) ||
        p.category.toLowerCase().includes(lowerQuery)
      );
    }
    
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
        // By default, just sort by name or keep original order
        // Relevance sorting in a real app would be handled by backend.
        displayProducts.sort((a, b) => a.name.localeCompare(b.name));
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
  }, [query, inStockFilter, brandFilters, sort]);

  return (
    <ListingLayout 
      title={`Search Results for "${query}"`}
      totalResults={filteredProducts.length}
      availableBrands={availableBrands}
    >
      {filteredProducts.length > 0 ? (
        <ProductGrid products={filteredProducts} />
      ) : (
        <EmptyState query={query} />
      )}
    </ListingLayout>
  );
};
