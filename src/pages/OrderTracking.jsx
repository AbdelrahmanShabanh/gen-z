import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

const STATUS_STEPS = ['pending', 'processing', 'shipped', 'delivered'];

export default function OrderTracking() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initId = searchParams.get('id') || '';
  
  const [orderId, setOrderId] = useState(initId);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initId) handleSearch(initId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initId]);

  const handleSearch = async (idToSearch) => {
    const id = typeof idToSearch === 'string' ? idToSearch : orderId;
    if (!id.trim()) return;
    
    setLoading(true);
    setError('');
    setOrder(null);
    setSearchParams({ id });

    try {
      const res = await fetch(`/api/orders/${id}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Order not found');
      setOrder(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIndex = (status) => STATUS_STEPS.indexOf(status);

  return (
    <div className="tracking-page container container-sm">
      <h1 className="section-title text-center mb-2">Track Your Order</h1>
      <p className="section-subtitle text-center mx-auto mb-8">Enter your order reference ID below to see the current status of your shipment.</p>

      <div className="search-box">
        <input 
          type="text" 
          className="search-input" 
          placeholder="e.g. 64fd3a2b1c9e..." 
          value={orderId}
          onChange={e => setOrderId(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSearch()}
        />
        <button className="btn btn-primary" onClick={handleSearch} disabled={loading || !orderId.trim()}>
          {loading ? 'Searching...' : 'Track'}
        </button>
      </div>

      {error && (
        <div className="alert alert-error text-center mt-6">{error}</div>
      )}

      {order && (
        <div className="tracking-result">
          <div className="result-header">
            <div>
              <h3 className="res-title">Order for {order.customerName}</h3>
              <p className="res-meta">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
            </div>
            <div className={`badge badge-${order.status}`}>{order.status}</div>
          </div>

          <div className="progress-container">
            <div className="progress-bar-bg" />
            <div 
              className="progress-bar-fill" 
              style={{ width: `${(getStatusIndex(order.status) / 3) * 100}%` }} 
            />
            
            <div className="steps-wrap">
              {STATUS_STEPS.map((step, i) => {
                const isActive = getStatusIndex(order.status) >= i;
                return (
                  <div key={step} className="step-item">
                    <div className={`step-dot ${isActive ? 'active' : ''}`}>
                      {isActive && (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      )}
                    </div>
                    <span className={`step-label ${isActive ? 'active' : ''}`}>{step}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="order-details-card">
            <h4 className="detail-heading">Items</h4>
            <div className="items-list">
              {order.items.map((item, i) => (
                <div key={i} className="item-row">
                  <div className="row-left">
                    <span className="item-qty">{item.qty}x</span>
                    <div>
                      <span className="item-name">{item.name}</span>
                      <span className="item-size">Size: {item.size}</span>
                    </div>
                  </div>
                  <span className="item-price">{item.price * item.qty} EGP</span>
                </div>
              ))}
            </div>
            
            <div className="totals-wrap">
              <div className="tot-row">
                <span>Total Paid (COD)</span>
                <span className="tot-val">{order.total} EGP</span>
              </div>
            </div>

            <h4 className="detail-heading mt-6">Shipping Address</h4>
            <p className="address-text">
              {order.address}<br/>
              {order.city}<br/>
              Phone: {order.phone}
            </p>
          </div>
        </div>
      )}

      <style>{`
        .tracking-page { padding-top: 4rem; padding-bottom: 6rem; max-width: 800px; }
        .text-center { text-align: center; justify-content: center; }
        .mx-auto { margin-left: auto; margin-right: auto; }
        .mb-2 { margin-bottom: 0.5rem; }
        .mb-8 { margin-bottom: 2.5rem; }
        .mt-6 { margin-top: 1.5rem; }
        
        .search-box {
          display: flex;
          gap: 0.5rem;
          background: var(--bg-card);
          padding: 0.5rem;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border);
          box-shadow: var(--shadow);
        }
        .search-input {
          flex: 1;
          background: transparent;
          border: none;
          padding: 0 1rem;
          color: var(--text);
          font-size: 1.05rem;
          outline: none;
        }
        .search-input::placeholder { color: var(--text-subtle); font-family: monospace; }
        .search-box .btn { padding-left: 2rem; padding-right: 2rem; }
        
        .tracking-result {
          margin-top: 3rem;
          animation: fadeIn 0.3s ease;
        }
        .result-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 2.5rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid var(--border);
        }
        .res-title { font-size: 1.4rem; font-weight: 800; margin-bottom: 0.2rem; }
        .res-meta { color: var(--text-muted); font-size: 0.9rem; }
        
        .progress-container {
          position: relative;
          margin-bottom: 3.5rem;
          padding: 0 1.5rem;
        }
        .progress-bar-bg {
          position: absolute;
          top: 15px; left: 2.5rem; right: 2.5rem;
          height: 4px;
          background: var(--border-light);
          border-radius: 2px;
          z-index: 1;
        }
        .progress-bar-fill {
          position: absolute;
          top: 15px; left: 2.5rem;
          height: 4px;
          background: var(--accent);
          border-radius: 2px;
          z-index: 2;
          transition: width 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
        }
        .steps-wrap {
          display: flex;
          justify-content: space-between;
          position: relative;
          z-index: 3;
        }
        .step-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
          width: 80px;
        }
        .step-dot {
          width: 34px; height: 34px;
          border-radius: 50%;
          background: var(--bg-elevated);
          border: 2px solid var(--border-light);
          display: flex; align-items: center; justify-content: center;
          color: var(--bg-elevated); /* hide check icon initially */
          transition: all 0.3s;
        }
        .step-dot.active {
          background: var(--accent);
          border-color: var(--accent);
          color: var(--primary); /* reveal check icon */
          box-shadow: 0 0 15px rgba(232,255,0,0.4);
        }
        .step-label {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .step-label.active { color: var(--text); font-weight: 800; }
        
        .order-details-card {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 2rem;
        }
        .detail-heading {
          font-size: 0.9rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--text-muted);
          margin-bottom: 1.25rem;
          border-bottom: 1px solid var(--border-light);
          padding-bottom: 0.5rem;
        }
        .items-list { display: flex; flex-direction: column; gap: 1rem; margin-bottom: 1.5rem; }
        .item-row { display: flex; justify-content: space-between; align-items: center; font-size: 0.95rem; }
        .row-left { display: flex; align-items: start; gap: 1rem; }
        .item-qty { font-weight: 800; color: var(--accent); width: 20px; }
        .item-name { display: block; font-weight: 600; margin-bottom: 0.15rem; }
        .item-size { font-size: 0.8rem; color: var(--text-subtle); }
        .item-price { font-weight: 700; color: var(--text); }
        
        .totals-wrap {
          border-top: 1px solid var(--border-light);
          padding-top: 1rem;
        }
        .tot-row { display: flex; justify-content: space-between; align-items: center; }
        .tot-val { font-size: 1.25rem; font-weight: 800; color: var(--accent); }
        
        .address-text { font-size: 0.95rem; color: var(--text-subtle); line-height: 1.6; }
        
        @media (max-width: 600px) {
          .progress-bar-bg { left: 1rem; right: 1rem; }
          .progress-bar-fill { left: 1rem; }
          .step-label { font-size: 0.65rem; }
          .step-item { width: 60px; }
        }
      `}</style>
    </div>
  );
}
