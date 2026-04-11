import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard.jsx';
import SkeletonCard from '../components/SkeletonCard.jsx';
import FilterSidebar from '../components/FilterSidebar.jsx';

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorObj, setErrorObj] = useState(null);

  // Parse filters from URL
  const filters = {
    category: searchParams.get('category') || '',
    sizes: searchParams.get('sizes') ? searchParams.get('sizes').split(',') : [],
    maxPrice: Number(searchParams.get('maxPrice')) || 600,
    search: searchParams.get('search') || ''
  };

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    let url = '/api/products';
    const params = new URLSearchParams();
    if (filters.category) params.append('category', filters.category);
    if (filters.search) params.append('search', filters.search);
    
    if (params.toString()) url += `?${params.toString()}`;

    try {
      const res = await fetch(url);
      let data = await res.json();
      
      if (!res.ok || data.error) throw new Error(data.error || 'Failed to fetch products');
      
      // Client-side filtering for size and price (since our simple API doesn't support it)
      if (filters.sizes.length > 0) {
        data = data.filter(p => p.sizes.some(s => filters.sizes.includes(s)));
      }
      if (filters.maxPrice < 600) {
        data = data.filter(p => p.price <= filters.maxPrice);
      }
      
      setProducts(data);
      setErrorObj(null);
    } catch (err) {
      console.error('Failed to fetch products', err);
      setErrorObj(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters.category, filters.search, filters.sizes.join(','), filters.maxPrice]);

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchProducts]);

  const handleFilterChange = (newFilters) => {
    const params = new URLSearchParams();
    if (newFilters.category) params.set('category', newFilters.category);
    if (newFilters.sizes?.length) params.set('sizes', newFilters.sizes.join(','));
    if (newFilters.maxPrice < 600) params.set('maxPrice', newFilters.maxPrice);
    if (newFilters.search) params.set('search', newFilters.search);
    setSearchParams(params);
  };

  return (
    <div className="products-page container">
      <div className="page-header">
        <h1 className="section-title">Shop All</h1>
        <p className="page-subtitle">Showing {loading ? '...' : products.length} results</p>
      </div>

      <div className="products-layout">
        <FilterSidebar filters={filters} onChange={handleFilterChange} />
        
        <div className="products-main">
          {filters.search && (
            <div className="search-banner">
              Search results for: <strong>"{filters.search}"</strong>
              <button onClick={() => handleFilterChange({...filters, search: ''})} className="clear-search-btn">✕</button>
            </div>
          )}
          
          <div className="product-grid">
            {loading ? (
              Array(8).fill().map((_, i) => <SkeletonCard key={i} />)
            ) : errorObj ? (
              <div className="empty-state" style={{gridColumn: '1/-1', color: 'var(--error)'}}>
                <h3>API Connection Error</h3>
                <p>{errorObj}</p>
              </div>
            ) : products.length > 0 ? (
              products.map(p => <ProductCard key={p._id} product={p} />)
            ) : (
              <div className="empty-state" style={{gridColumn: '1/-1'}}>
                <div className="empty-state-icon">😕</div>
                <h3>No products found</h3>
                <p>Try adjusting your filters or search terms.</p>
                <button className="btn btn-outline" onClick={() => handleFilterChange({category:'', sizes:[], maxPrice:600})}>
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .products-page {
          padding-top: 3rem;
          padding-bottom: 6rem;
        }
        .page-header {
          margin-bottom: 3rem;
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          border-bottom: 1px solid var(--border);
          padding-bottom: 1.5rem;
        }
        .page-subtitle {
          color: var(--text-muted);
          font-size: 0.9rem;
          font-weight: 500;
        }
        .products-layout {
          display: grid;
          grid-template-columns: 260px 1fr;
          gap: 3rem;
          align-items: start;
        }
        .search-banner {
          background: var(--bg-elevated);
          padding: 1rem 1.5rem;
          border-radius: var(--radius-sm);
          margin-bottom: 2rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-left: 3px solid var(--accent);
          font-size: 0.95rem;
        }
        .clear-search-btn {
          background: none;
          color: var(--text-muted);
          transition: color 0.2s;
        }
        .clear-search-btn:hover { color: var(--text); }
        
        @media (max-width: 900px) {
          .products-layout { grid-template-columns: 220px 1fr; gap: 2rem; }
        }
        @media (max-width: 768px) {
          .products-layout { grid-template-columns: 1fr; gap: 2rem; }
          .page-header { flex-direction: column; gap: 0.5rem; }
        }
      `}</style>
    </div>
  );
}
