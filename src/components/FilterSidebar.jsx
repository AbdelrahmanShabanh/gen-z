import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

const CATEGORIES = ['hoodies', 'tshirts', 'pants', 'accessories'];
const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

export default function FilterSidebar({ filters, onChange }) {
  const [searchParams, setSearchParams] = useSearchParams();

  const handleCategory = (cat) => {
    onChange({ ...filters, category: filters.category === cat ? '' : cat });
  };

  const handleSize = (size) => {
    const sizes = filters.sizes || [];
    const newSizes = sizes.includes(size)
      ? sizes.filter(s => s !== size)
      : [...sizes, size];
    onChange({ ...filters, sizes: newSizes });
  };

  const handlePrice = (e) => {
    onChange({ ...filters, maxPrice: Number(e.target.value) });
  };

  const clearAll = () => onChange({ category: '', sizes: [], maxPrice: 600 });

  const hasFilters = filters.category || filters.sizes?.length > 0 || filters.maxPrice < 600;

  return (
    <aside className="filter-sidebar">
      <div className="filter-header">
        <h3 className="filter-title">Filters</h3>
        {hasFilters && (
          <button className="filter-clear-btn" onClick={clearAll}>Clear all</button>
        )}
      </div>

      <div className="filter-section">
        <p className="filter-section-label">Category</p>
        <div className="category-pills">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`cat-pill ${filters.category === cat ? 'active' : ''}`}
              onClick={() => handleCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-section">
        <p className="filter-section-label">Size</p>
        <div className="size-grid">
          {SIZES.map(size => (
            <button
              key={size}
              className={`size-btn ${filters.sizes?.includes(size) ? 'active' : ''}`}
              onClick={() => handleSize(size)}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-section">
        <p className="filter-section-label">Max Price: <span className="price-val">{filters.maxPrice || 600} EGP</span></p>
        <input
          type="range"
          min="50"
          max="600"
          step="25"
          value={filters.maxPrice || 600}
          onChange={handlePrice}
          className="price-slider"
        />
        <div className="price-range-labels">
          <span>50 EGP</span>
          <span>600 EGP</span>
        </div>
      </div>

      <style>{`
        .filter-sidebar {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 1.25rem;
          position: sticky;
          top: 80px;
          height: fit-content;
        }
        .filter-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.25rem;
        }
        .filter-title {
          font-size: 0.95rem;
          font-weight: 800;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: var(--text);
        }
        .filter-clear-btn {
          background: none;
          border: none;
          font-size: 0.78rem;
          color: var(--accent);
          cursor: pointer;
          font-weight: 600;
          padding: 0;
        }
        .filter-clear-btn:hover { text-decoration: underline; }
        .filter-section {
          margin-bottom: 1.5rem;
        }
        .filter-section:last-child { margin-bottom: 0; }
        .filter-section-label {
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--text-muted);
          margin-bottom: 0.75rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .price-val {
          color: var(--accent);
          font-size: 0.8rem;
          text-transform: none;
          letter-spacing: 0;
        }
        .category-pills {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }
        .cat-pill {
          padding: 0.55rem 0.9rem;
          border-radius: var(--radius-sm);
          background: var(--bg-elevated);
          border: 1px solid var(--border-light);
          color: var(--text-muted);
          font-size: 0.84rem;
          font-weight: 600;
          text-align: left;
          text-transform: capitalize;
          cursor: pointer;
          transition: var(--transition);
        }
        .cat-pill:hover { color: var(--text); border-color: #444; }
        .cat-pill.active {
          background: var(--accent);
          color: var(--primary);
          border-color: var(--accent);
        }
        .size-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.4rem;
        }
        .size-btn {
          padding: 0.45rem;
          border-radius: var(--radius-sm);
          background: var(--bg-elevated);
          border: 1px solid var(--border-light);
          color: var(--text-muted);
          font-size: 0.8rem;
          font-weight: 700;
          cursor: pointer;
          transition: var(--transition);
          text-align: center;
        }
        .size-btn:hover { color: var(--text); border-color: #444; }
        .size-btn.active {
          background: var(--accent);
          color: var(--primary);
          border-color: var(--accent);
        }
        .price-slider {
          width: 100%;
          appearance: none;
          height: 4px;
          border-radius: 2px;
          background: linear-gradient(to right, var(--accent) 0%, var(--bg-elevated) 100%);
          outline: none;
          margin-bottom: 0.4rem;
        }
        .price-slider::-webkit-slider-thumb {
          appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: var(--accent);
          cursor: pointer;
          border: 3px solid var(--bg-card);
          box-shadow: 0 0 0 2px var(--accent);
        }
        .price-range-labels {
          display: flex;
          justify-content: space-between;
          font-size: 0.72rem;
          color: var(--text-subtle);
        }
      `}</style>
    </aside>
  );
}
