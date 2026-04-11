import { useEffect, useState } from 'react';
import { useSearchParams, Link, Navigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';

export default function OrderSuccess() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const { clearCart } = useCart();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      clearCart(); // clear cart on successful order
      fetch(`/api/orders/${orderId}`)
        .then(res => res.json())
        .then(data => {
          setOrder(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [orderId, clearCart]);

  if (!orderId) return <Navigate to="/" replace />;
  if (loading) return <div className="page-loader"><div className="spinner" /></div>;

  return (
    <div className="success-page container">
      <div className="success-card">
        <div className="success-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        
        <h1 className="success-title">Order Confirmed!</h1>
        <p className="success-subtitle">Thank you for your purchase, {order?.customerName || 'fam'}.</p>
        
        <div className="order-box">
          <p className="order-id-label">Order Reference ID</p>
          <p className="order-id-val">{orderId}</p>
        </div>

        <p className="shipping-text">
          We're preparing your order for shipping to <strong>{order?.city || 'your city'}</strong>.<br/>
          Estimated delivery: {order?.city === 'Cairo' ? '2-3' : order?.city === 'Alexandria' ? '3-4' : '4-5'} business days.
        </p>

        <div className="success-actions">
          <Link to={`/track-order?id=${orderId}`} className="btn btn-primary btn-lg">Track Order</Link>
          <Link to="/products" className="btn btn-outline btn-lg">Continue Shopping</Link>
        </div>
      </div>

      <style>{`
        .success-page {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 70vh;
          padding: 4rem 1.5rem;
        }
        .success-card {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: 4rem 2rem;
          max-width: 540px;
          text-align: center;
          box-shadow: var(--shadow-lg);
          animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .success-icon {
          width: 80px;
          height: 80px;
          background: var(--accent);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 2rem;
          box-shadow: 0 0 40px rgba(232,255,0,0.3);
        }
        .success-title {
          font-size: 2.2rem;
          font-weight: 900;
          color: var(--text);
          margin-bottom: 0.5rem;
        }
        .success-subtitle {
          font-size: 1.1rem;
          color: var(--text-subtle);
          margin-bottom: 2rem;
        }
        .order-box {
          background: var(--bg-elevated);
          border: 1px dashed var(--border-light);
          padding: 1.5rem;
          border-radius: var(--radius-sm);
          margin-bottom: 2rem;
        }
        .order-id-label {
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--text-muted);
          margin-bottom: 0.25rem;
        }
        .order-id-val {
          font-family: monospace;
          font-size: 1.4rem;
          font-weight: 800;
          color: var(--accent);
          letter-spacing: 0.05em;
        }
        .shipping-text {
          font-size: 0.95rem;
          color: var(--text-muted);
          line-height: 1.6;
          margin-bottom: 2.5rem;
        }
        .shipping-text strong {
          color: var(--text);
        }
        .success-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
        }
        @media (max-width: 500px) {
          .success-actions { flex-direction: column; }
        }
      `}</style>
    </div>
  );
}
