import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';

const SHIPPING_FEES = {
  'Cairo': 50,
  'Alexandria': 60,
  'Other': 70
};

export default function Checkout() {
  const { items, cartTotal } = useCart();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    address: '',
    city: 'Cairo', // default
    notes: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Protect route
  useEffect(() => {
    if (items.length === 0) navigate('/cart', { replace: true });
  }, [items, navigate]);

  if (items.length === 0) return null;

  const shippingFee = SHIPPING_FEES[formData.city];
  const grandTotal = cartTotal + shippingFee;

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const orderData = {
        ...formData,
        items: items.map(i => ({
          productId: i.product._id,
          name: i.product.name,
          size: i.size,
          qty: i.qty,
          price: i.product.price,
          image: i.product.images?.[0]
        })),
        total: grandTotal
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to place order');

      // WhatsApp Message Generation
      const itemsList = items.map(i => `- ${i.qty}x ${i.product.name} (Size: ${i.size})`).join('%0a');
      const waMessage = `*New Order Request*%0a%0a*Name:* ${formData.customerName}%0a*Phone:* ${formData.phone}%0a*Address:* ${formData.address}, ${formData.city}%0a%0a*Items:*%0a${itemsList}%0a%0a*Total:* ${grandTotal} EGP%0a*Order ID:* ${data._id}`;
      window.open(`https://wa.me/201556207709?text=${waMessage}`, '_blank');

      // Navigate to success page with order ID
      navigate(`/order-success?orderId=${data._id}`, { replace: true });
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="checkout-page container">
      <h1 className="section-title mb-6">Checkout</h1>

      <div className="checkout-grid">
        <form className="checkout-form" onSubmit={handleSubmit}>
          
          <div className="form-section">
            <h2 className="form-section-title">Shipping Information</h2>
            
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input type="text" name="customerName" required className="form-input" value={formData.customerName} onChange={handleChange} placeholder="John Doe" />
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input type="tel" name="phone" required className="form-input" value={formData.phone} onChange={handleChange} placeholder="01X XXXX XXXX" />
            </div>

            <div className="form-row">
              <div className="form-group" style={{flex: 2}}>
                <label className="form-label">Detailed Address</label>
                <input type="text" name="address" required className="form-input" value={formData.address} onChange={handleChange} placeholder="Street name, building, apt" />
              </div>

              <div className="form-group" style={{flex: 1}}>
                <label className="form-label">City</label>
                <select name="city" className="form-input form-select" value={formData.city} onChange={handleChange}>
                  <option value="Cairo">Cairo</option>
                  <option value="Alexandria">Alexandria</option>
                  <option value="Other">Other City</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Order Notes (Optional)</label>
              <textarea name="notes" className="form-input" value={formData.notes} onChange={handleChange} placeholder="Any special instructions for delivery" rows="3" />
            </div>
          </div>

          <div className="form-section">
            <h2 className="form-section-title">Payment Method</h2>
            <div className="payment-box">
              <div className="payment-radio custom-radio">
                <input type="radio" checked readOnly id="cod" />
                <label htmlFor="cod">Cash on Delivery (COD)</label>
              </div>
              <p className="payment-desc">Pay with cash upon delivery. Easy and secure.</p>
            </div>
          </div>

          {error && <div className="alert alert-error mb-4">{error}</div>}

          <button type="submit" className="btn btn-primary btn-lg full-width submit-btn" disabled={loading}>
            {loading ? 'Processing...' : 'Place Order'}
          </button>
        </form>

        <div className="checkout-sidebar">
          <div className="order-summary-box">
            <h3 className="summary-title">Order Summary</h3>
            
            <div className="summary-items">
              {items.map(item => (
                <div key={`${item.product._id}-${item.size}`} className="sum-item">
                  <div className="sum-img-wrap">
                    <img src={item.product.images?.[0]} alt={item.product.name} />
                    <span className="sum-qty">{item.qty}</span>
                  </div>
                  <div className="sum-info">
                    <p className="sum-name">{item.product.name}</p>
                    <p className="sum-size">Size: {item.size}</p>
                  </div>
                  <div className="sum-price">{item.product.price * item.qty} EGP</div>
                </div>
              ))}
            </div>

            <div className="summary-totals">
              <div className="tot-row">
                <span>Subtotal</span>
                <span>{cartTotal} EGP</span>
              </div>
              <div className="tot-row">
                <span>Shipping ({formData.city})</span>
                <span>{shippingFee} EGP</span>
              </div>
              <div className="tot-row grand-tot">
                <span>Grand Total</span>
                <span className="accent-text">{grandTotal} EGP</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .checkout-page { padding-top: 3rem; padding-bottom: 6rem; }
        .mb-6 { margin-bottom: 2.5rem; }
        .mb-4 { margin-bottom: 1.5rem; }
        .full-width { width: 100%; }
        
        .checkout-grid { display: grid; grid-template-columns: 1.5fr 1fr; gap: 4rem; align-items: start; }
        
        .form-section { margin-bottom: 3rem; }
        .form-section-title { font-size: 1.25rem; font-weight: 800; margin-bottom: 1.5rem; padding-bottom: 0.5rem; border-bottom: 1px solid var(--border); }
        .form-row { display: flex; gap: 1rem; }
        
        .payment-box { background: var(--bg-elevated); border: 2px solid var(--accent); border-radius: var(--radius-sm); padding: 1.25rem; }
        .payment-radio { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.5rem; font-weight: 700; font-size: 1rem; }
        .payment-radio input[type="radio"] { accent-color: var(--accent); width: 18px; height: 18px; cursor: pointer; }
        .payment-desc { font-size: 0.85rem; color: var(--text-subtle); margin-left: 1.9rem; }
        
        .submit-btn { font-size: 1.1rem; letter-spacing: 0.05em; margin-top: 1rem; }
        
        .order-summary-box { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius); padding: 1.5rem; position: sticky; top: 100px; }
        .summary-title { font-size: 1.1rem; font-weight: 800; margin-bottom: 1.5rem; text-transform: uppercase; letter-spacing: 0.05em; }
        
        .summary-items { display: flex; flex-direction: column; gap: 1rem; border-bottom: 1px solid var(--border-light); padding-bottom: 1.5rem; margin-bottom: 1.5rem; max-height: 40vh; overflow-y: auto; padding-right: 0.5rem; }
        .sum-item { display: flex; align-items: center; gap: 1rem; }
        
        .sum-img-wrap { position: relative; width: 64px; height: 64px; background: #111; border-radius: 8px; flex-shrink: 0; }
        .sum-img-wrap img { width: 100%; height: 100%; object-fit: cover; border-radius: 8px; }
        .sum-qty { position: absolute; top: -8px; right: -8px; background: var(--accent); color: var(--primary); width: 22px; height: 22px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.7rem; font-weight: 800; }
        
        .sum-info { flex: 1; }
        .sum-name { font-weight: 700; font-size: 0.9rem; line-height: 1.2; margin-bottom: 0.2rem; }
        .sum-size { font-size: 0.75rem; color: var(--text-muted); }
        .sum-price { font-weight: 800; font-size: 0.9rem; }
        
        .tot-row { display: flex; justify-content: space-between; margin-bottom: 0.75rem; font-size: 0.9rem; color: var(--text-muted); }
        .grand-tot { margin-top: 1rem; font-size: 1.2rem; font-weight: 800; color: var(--text); border-top: 1px solid var(--border-light); padding-top: 1rem; align-items: center; }
        .accent-text { color: var(--accent); font-size: 1.35rem; }
        
        @media (max-width: 900px) {
          .checkout-grid { grid-template-columns: 1fr; flex-direction: column-reverse; display: flex; gap: 3rem; }
          .checkout-sidebar { position: static; width: 100%; }
          .form-row { flex-direction: column; gap: 0; }
        }
      `}</style>
    </div>
  );
}
