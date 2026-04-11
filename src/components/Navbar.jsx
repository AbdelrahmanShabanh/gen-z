import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';

export default function Navbar() {
  const { cartCount } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isAdmin = !!localStorage.getItem('genzfront_admin_token');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [location]);

  return (
    <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="container navbar-inner">
        <Link to="/" className="navbar-logo">
          <span className="logo-genz">GEN Z</span>
          <span className="logo-front">FRONT</span>
        </Link>

        <div className="navbar-links">
          <Link to="/" className={location.pathname === '/' ? 'nav-link active' : 'nav-link'}>Home</Link>
          <Link to="/products" className={location.pathname === '/products' ? 'nav-link active' : 'nav-link'}>Shop</Link>
          <Link to="/track-order" className="nav-link">Track Order</Link>
          {isAdmin && <Link to="/admin/dashboard" className="nav-link nav-admin">Admin</Link>}
        </div>

        <div className="navbar-actions">
          <Link to="/cart" className="cart-btn" aria-label="Cart">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>

          <button
            className={`hamburger ${menuOpen ? 'open' : ''}`}
            onClick={() => setMenuOpen(v => !v)}
            aria-label="Toggle menu"
          >
            <span/><span/><span/>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="mobile-menu">
          <Link to="/" className="mobile-link">Home</Link>
          <Link to="/products" className="mobile-link">Shop</Link>
          <Link to="/track-order" className="mobile-link">Track Order</Link>
          <Link to="/cart" className="mobile-link">Cart {cartCount > 0 && `(${cartCount})`}</Link>
          {isAdmin && <Link to="/admin/dashboard" className="mobile-link mobile-admin">Admin</Link>}
        </div>
      )}

      <style>{`
        .navbar {
          position: sticky;
          top: 0;
          z-index: 100;
          background: rgba(13,13,13,0.7);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid transparent;
          transition: all 0.3s ease;
        }
        .navbar-scrolled {
          background: rgba(13,13,13,0.95);
          border-bottom-color: #2a2a2a;
          box-shadow: 0 4px 24px rgba(0,0,0,0.4);
        }
        .navbar-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 64px;
          gap: 1.5rem;
        }
        .navbar-logo {
          display: flex;
          align-items: baseline;
          gap: 0.25rem;
          font-size: 1.2rem;
          font-weight: 900;
          letter-spacing: 0.05em;
          text-decoration: none;
          flex-shrink: 0;
        }
        .logo-genz {
          color: var(--accent);
        }
        .logo-front {
          color: var(--text);
          font-weight: 400;
        }
        .navbar-links {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }
        .nav-link {
          padding: 0.45rem 0.85rem;
          font-size: 0.88rem;
          font-weight: 500;
          color: var(--text-muted);
          border-radius: var(--radius-sm);
          transition: var(--transition);
          text-decoration: none;
        }
        .nav-link:hover, .nav-link.active {
          color: var(--text);
          background: var(--bg-elevated);
        }
        .nav-link.active {
          color: var(--accent);
        }
        .nav-admin {
          color: var(--accent) !important;
          border: 1px solid var(--accent);
        }
        .navbar-actions {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .cart-btn {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: var(--radius-sm);
          color: var(--text);
          transition: var(--transition);
        }
        .cart-btn:hover {
          background: var(--bg-elevated);
          color: var(--accent);
        }
        .cart-badge {
          position: absolute;
          top: 2px;
          right: 2px;
          background: var(--accent);
          color: var(--primary);
          width: 18px;
          height: 18px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.65rem;
          font-weight: 800;
          line-height: 1;
        }
        .hamburger {
          display: none;
          flex-direction: column;
          gap: 5px;
          width: 40px;
          height: 40px;
          align-items: center;
          justify-content: center;
          background: none;
          border-radius: var(--radius-sm);
          transition: var(--transition);
        }
        .hamburger:hover { background: var(--bg-elevated); }
        .hamburger span {
          display: block;
          width: 22px;
          height: 2px;
          background: var(--text);
          border-radius: 2px;
          transition: var(--transition);
        }
        .hamburger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
        .hamburger.open span:nth-child(2) { opacity: 0; }
        .hamburger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }
        .mobile-menu {
          display: flex;
          flex-direction: column;
          padding: 0.5rem 1.5rem 1rem;
          border-top: 1px solid var(--border);
          animation: slideDown 0.2s ease;
        }
        @keyframes slideDown {
          from { opacity:0; transform: translateY(-8px); }
          to   { opacity:1; transform: translateY(0); }
        }
        .mobile-link {
          padding: 0.75rem 0.5rem;
          font-size: 0.95rem;
          font-weight: 500;
          color: var(--text-muted);
          border-bottom: 1px solid var(--border);
          transition: color 0.2s;
        }
        .mobile-link:last-child { border-bottom: none; }
        .mobile-link:hover { color: var(--accent); }
        .mobile-admin { color: var(--accent) !important; }

        @media (max-width: 768px) {
          .navbar-links { display: none; }
          .hamburger { display: flex; }
        }
        @media (min-width: 769px) {
          .mobile-menu { display: none !important; }
        }
      `}</style>
    </nav>
  );
}
