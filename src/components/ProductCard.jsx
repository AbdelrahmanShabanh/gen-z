import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const mainImg = product.images?.[0];
  const inStock = product.stock > 0;

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!inStock || !product.sizes?.length) return;
    addToCart(product, product.sizes[0]);
  };

  return (
    <Link to={`/products/${product._id}`} className="product-card">
      <div className="product-img-wrap">
        {mainImg ? (
          <img src={mainImg} alt={product.name} className="product-img" loading="lazy" />
        ) : (
          <div className="product-img-placeholder">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <path d="m9 9 6 6m0-6-6 6"/>
            </svg>
          </div>
        )}
        {!inStock && <div className="sold-out-overlay">SOLD OUT</div>}
        {product.featured && <span className="featured-tag">Featured</span>}
        <button className="quick-add-btn" onClick={handleQuickAdd} disabled={!inStock} title="Quick Add">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 5v14M5 12h14"/>
          </svg>
        </button>
      </div>

      <div className="product-info">
        <div className="product-cat">{product.category}</div>
        <h3 className="product-name">{product.name}</h3>
        <div className="product-footer">
          <span className="product-price">{product.price} EGP</span>
          <div className="size-chips">
            {product.sizes?.slice(0,3).map(s => (
              <span key={s} className="size-chip">{s}</span>
            ))}
            {product.sizes?.length > 3 && <span className="size-chip-more">+{product.sizes.length - 3}</span>}
          </div>
        </div>
      </div>

      <style>{`
        .product-card {
          display: flex;
          flex-direction: column;
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          overflow: hidden;
          text-decoration: none;
          color: inherit;
          transition: var(--transition);
          position: relative;
        }
        .product-card:hover {
          border-color: var(--border-light);
          transform: translateY(-4px);
          box-shadow: 0 12px 40px rgba(0,0,0,0.5);
        }
        .product-card:hover .quick-add-btn {
          opacity: 1;
          transform: translateY(0);
        }
        .product-img-wrap {
          position: relative;
          aspect-ratio: 1;
          overflow: hidden;
          background: #111;
        }
        .product-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }
        .product-card:hover .product-img {
          transform: scale(1.06);
        }
        .product-img-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #333;
          background: #111;
        }
        .sold-out-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.65);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: 800;
          letter-spacing: 0.15em;
          color: #888;
        }
        .featured-tag {
          position: absolute;
          top: 10px;
          left: 10px;
          background: var(--accent);
          color: var(--primary);
          font-size: 0.65rem;
          font-weight: 800;
          letter-spacing: 0.1em;
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
          text-transform: uppercase;
        }
        .quick-add-btn {
          position: absolute;
          bottom: 10px;
          right: 10px;
          width: 36px;
          height: 36px;
          background: var(--accent);
          color: var(--primary);
          border: none;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transform: translateY(8px);
          transition: var(--transition);
          cursor: pointer;
        }
        .quick-add-btn:disabled {
          background: #333;
          color: #666;
          cursor: not-allowed;
        }
        .product-info {
          padding: 1rem;
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
        }
        .product-cat {
          font-size: 0.68rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--text-muted);
        }
        .product-name {
          font-size: 0.92rem;
          font-weight: 700;
          color: var(--text);
          line-height: 1.3;
        }
        .product-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 0.4rem;
          gap: 0.5rem;
          flex-wrap: wrap;
        }
        .product-price {
          font-size: 1rem;
          font-weight: 800;
          color: var(--accent);
        }
        .size-chips {
          display: flex;
          gap: 0.25rem;
          flex-wrap: wrap;
        }
        .size-chip {
          background: var(--bg-elevated);
          border: 1px solid var(--border-light);
          color: var(--text-muted);
          font-size: 0.62rem;
          font-weight: 700;
          padding: 0.15rem 0.4rem;
          border-radius: 4px;
          letter-spacing: 0.05em;
        }
        .size-chip-more {
          color: var(--text-subtle);
          font-size: 0.62rem;
          font-weight: 600;
          align-self: center;
        }
      `}</style>
    </Link>
  );
}
