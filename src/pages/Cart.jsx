import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';

export default function Cart() {
  const { items, updateQty, removeFromCart, cartTotal, cartCount } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="container" style={{padding: '6rem 0'}}>
        <div className="empty-state">
          <div className="empty-state-icon">🛒</div>
          <h2 className="section-title">Your Cart is Empty</h2>
          <p className="section-subtitle">Looks like you haven't added anything to your cart yet.</p>
          <Link to="/products" className="btn btn-primary btn-lg mt-4">Start Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page container">
      <h1 className="section-title mb-8">Shopping Cart <span className="cart-count">({cartCount} items)</span></h1>

      <div className="cart-grid">
        <div className="cart-items">
          <div className="cart-header hide-mobile">
            <span className="col-product">Product</span>
            <span className="col-qty">Quantity</span>
            <span className="col-total">Total</span>
          </div>

          <div className="cart-list">
            {items.map(item => (
              <div key={`${item.product._id}-${item.size}`} className="cart-item">
                <div className="item-product">
                  <div className="item-img-wrap">
                    <img src={item.product.images?.[0]} alt={item.product.name} />
                  </div>
                  <div className="item-info">
                    <Link to={`/products/${item.product._id}`} className="item-name">{item.product.name}</Link>
                    <div className="item-meta">
                      <span className="item-size">Size: {item.size}</span>
                      <span className="item-price">{item.product.price} EGP</span>
                    </div>
                    <button 
                      className="item-remove"
                      onClick={() => removeFromCart(item.product._id, item.size)}
                    >
                      Remove
                    </button>
                  </div>
                </div>

                <div className="item-qty-col">
                  <div className="qty-stepper">
                    <button onClick={() => updateQty(item.product._id, item.size, item.qty - 1)}>-</button>
                    <span>{item.qty}</span>
                    <button onClick={() => updateQty(item.product._id, item.size, item.qty + 1)}>+</button>
                  </div>
                </div>

                <div className="item-total-col">
                  <span className="item-subtotal">{item.product.price * item.qty} EGP</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="cart-summary">
          <h3 className="summary-title">Order Summary</h3>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>{cartTotal} EGP</span>
          </div>
          <div className="summary-row text-muted">
            <span>Shipping</span>
            <span>Calculated at checkout</span>
          </div>
          <div className="summary-row text-muted" style={{borderBottom: '1px solid var(--border)', paddingBottom: '1rem', marginBottom: '1rem'}}>
            <span>Taxes</span>
            <span>Included</span>
          </div>
          <div className="summary-row summary-grand">
            <span>Estimated Total</span>
            <span className="accent-text">{cartTotal} EGP</span>
          </div>
          
          <button 
            className="btn btn-primary btn-lg checkout-btn"
            onClick={() => navigate('/checkout')}
          >
            Proceed to Checkout
          </button>
          
          <div className="secure-checkout">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0110 0v4"/>
            </svg>
            Secure Checkout
          </div>
        </div>
      </div>

      <style>{`
        .cart-page { padding-top: 3rem; padding-bottom: 6rem; }
        .mb-8 { margin-bottom: 2rem; }
        .mt-4 { margin-top: 1rem; }
        .cart-count { font-size: 1.2rem; color: var(--text-muted); font-weight: 500; }
        
        .cart-grid {
          display: grid;
          grid-template-columns: 1fr 350px;
          gap: 3rem;
          align-items: start;
        }
        
        .cart-header {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr;
          padding-bottom: 1rem;
          margin-bottom: 1rem;
          border-bottom: 1px solid var(--border);
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--text-muted);
        }
        
        .cart-list { display: flex; flex-direction: column; gap: 1.5rem; }
        
        .cart-item {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr;
          align-items: center;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid var(--border);
        }
        .cart-item:last-child { border-bottom: none; padding-bottom: 0; }
        
        .item-product { display: flex; gap: 1rem; }
        .item-img-wrap { width: 90px; height: 110px; background: #111; border-radius: var(--radius-sm); overflow: hidden; flex-shrink: 0; }
        .item-img-wrap img { width: 100%; height: 100%; object-fit: cover; }
        
        .item-info { display: flex; flex-direction: column; justify-content: space-between; padding: 0.25rem 0; }
        .item-name { font-weight: 700; font-size: 1.05rem; }
        .item-name:hover { color: var(--accent); }
        .item-meta { display: flex; flex-direction: column; gap: 0.2rem; margin-top: 0.5rem; font-size: 0.85rem; color: var(--text-muted); }
        
        .item-remove {
          background: none; border: none; padding: 0; color: var(--text-subtle);
          font-size: 0.75rem; font-weight: 600; text-decoration: underline; margin-top: auto;
          cursor: pointer; transition: color 0.2s; text-align: left; width: max-content;
        }
        .item-remove:hover { color: var(--error); }
        
        .qty-stepper {
          display: flex; align-items: center; border: 1px solid var(--border-light);
          border-radius: var(--radius-sm); width: max-content; background: var(--bg-card);
        }
        .qty-stepper button {
          width: 32px; height: 32px; background: none; border: none; color: var(--text);
          font-size: 1.2rem; cursor: pointer; transition: background 0.2s;
        }
        .qty-stepper button:hover { background: var(--bg-elevated); color: var(--accent); }
        .qty-stepper span { width: 32px; text-align: center; font-weight: 600; font-size: 0.9rem; }
        
        .item-total-col { text-align: right; }
        .item-subtotal { font-weight: 800; font-size: 1.1rem; }
        
        .cart-summary {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 2rem;
          position: sticky;
          top: 100px;
        }
        .summary-title { font-size: 1.25rem; font-weight: 800; margin-bottom: 1.5rem; }
        .summary-row { display: flex; justify-content: space-between; margin-bottom: 0.75rem; font-size: 0.95rem; }
        .text-muted { color: var(--text-muted); }
        
        .summary-grand { margin-top: 1rem; font-size: 1.15rem; font-weight: 800; margin-bottom: 2rem; }
        .accent-text { color: var(--accent); font-size: 1.35rem; }
        
        .checkout-btn { width: 100%; margin-bottom: 1.25rem; }
        
        .secure-checkout {
          display: flex; align-items: center; justify-content: center; gap: 0.5rem;
          color: var(--text-subtle); font-size: 0.8rem; font-weight: 500;
        }
        
        @media (max-width: 900px) {
          .cart-grid { grid-template-columns: 1fr; gap: 3rem; }
          .hide-mobile { display: none; }
          .cart-item {
            grid-template-columns: 1fr;
            grid-template-areas: "img info" "img qty-price";
            gap: 1rem;
            align-items: start;
          }
          .item-product { grid-area: info; }
          .item-qty-col { grid-area: qty-price; display: flex; justify-content: flex-start; margin-left: 106px; /* align with info */ }
          .item-total-col { display: none; /* hide per item total on mobile to save space */ }
        }
      `}</style>
    </div>
  );
}
