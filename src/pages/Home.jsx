import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard.jsx';
import SkeletonCard from '../components/SkeletonCard.jsx';

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  const [errorObj, setErrorObj] = useState(null);

  useEffect(() => {
    fetch('/api/products?featured=true')
      .then(async res => {
        const data = await res.json();
        if (!res.ok || data.error) throw new Error(data.error || 'Failed to fetch products');
        return data;
      })
      .then(data => {
        setFeatured(data.slice(0, 8)); // max 8
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch featured products', err);
        setErrorObj(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="hero-accent">Dress</span> Different.<br/>
            Stay <span className="hero-accent">Gen Z.</span>
          </h1>
          <p className="hero-subtitle">Premium streetwear for the bold and unapologetic. Handpicked quality, unmatched aesthetic.</p>
          <div className="hero-cta">
            <Link to="/products" className="btn btn-primary btn-lg">Shop New Drops</Link>
            <Link to="/products?category=hoodies" className="btn btn-outline btn-lg">View Hoodies</Link>
          </div>
        </div>
        <div className="hero-bg">
          <div className="hero-gradient" />
          <img src="https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&q=80&w=2000" alt="Streetwear Hero" className="hero-img" />
        </div>
      </section>

      {/* Featured Section */}
      <section className="featured-section container">
        <div className="section-header">
          <div>
            <p className="section-label">Limited Stock</p>
            <h2 className="section-title">Featured Drops</h2>
          </div>
          <Link to="/products" className="btn btn-outline">View All</Link>
        </div>

        <div className="product-grid">
          {loading ? (
            Array(4).fill().map((_, i) => <SkeletonCard key={i} />)
          ) : errorObj ? (
            <div className="empty-state" style={{gridColumn: '1/-1', color: 'var(--error)'}}>
              <h3>API Connection Error</h3>
              <p>{errorObj}</p>
            </div>
          ) : featured.length > 0 ? (
            featured.map(p => <ProductCard key={p._id} product={p} />)
          ) : (
            <p className="empty-text">No featured products right now.</p>
          )}
        </div>
      </section>

      {/* Categories Quad */}
      <section className="categories-section container">
        <div className="section-header text-center">
          <p className="section-label">Shop by</p>
          <h2 className="section-title">Category</h2>
        </div>

        <div className="cat-quad">
          <Link to="/products?category=hoodies" className="cat-card">
            <img src="https://images.unsplash.com/photo-1509942774463-acf339cf87d5?auto=format&w=800" alt="Hoodies" className="cat-img"/>
            <div className="cat-overlay">
              <h3 className="cat-title">Hoodies</h3>
              <span className="cat-link">Shop Now →</span>
            </div>
          </Link>
          <Link to="/products?category=tshirts" className="cat-card">
            <img src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&w=800" alt="T-Shirts" className="cat-img"/>
            <div className="cat-overlay">
              <h3 className="cat-title">T-Shirts</h3>
              <span className="cat-link">Shop Now →</span>
            </div>
          </Link>
          <Link to="/products?category=pants" className="cat-card">
            <img src="https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&w=800" alt="Pants" className="cat-img"/>
            <div className="cat-overlay">
              <h3 className="cat-title">Pants</h3>
              <span className="cat-link">Shop Now →</span>
            </div>
          </Link>
          <Link to="/products?category=accessories" className="cat-card">
            <img src="https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&w=800" alt="Accessories" className="cat-img"/>
            <div className="cat-overlay">
              <h3 className="cat-title">Accessories</h3>
              <span className="cat-link">Shop Now →</span>
            </div>
          </Link>
        </div>
      </section>

      <style>{`
        .hero {
          position: relative;
          min-height: 85vh;
          display: flex;
          align-items: center;
          padding: 6rem 5%;
          overflow: hidden;
          margin-top: -64px; /* offset navbar */
        }
        .hero-content {
          position: relative;
          z-index: 2;
          max-width: 650px;
          animation: fadeInUp 0.8s ease-out forwards;
        }
        .hero-title {
          font-size: clamp(3rem, 7vw, 5.5rem);
          font-weight: 900;
          line-height: 1.05;
          letter-spacing: -0.02em;
          margin-bottom: 1.5rem;
          color: white;
        }
        .hero-accent {
          color: var(--accent);
          display: inline-block;
        }
        .hero-subtitle {
          font-size: clamp(1.1rem, 2vw, 1.4rem);
          color: rgba(255,255,255,0.85);
          margin-bottom: 2.5rem;
          line-height: 1.6;
          font-weight: 300;
        }
        .hero-cta {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }
        .hero-bg {
          position: absolute;
          inset: 0;
          z-index: 1;
        }
        .hero-gradient {
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, var(--bg) 10%, rgba(13,13,13,0.7) 50%, transparent 100%),
                      radial-gradient(circle at bottom left, rgba(232,255,0,0.15) 0%, transparent 50%);
          z-index: 2;
        }
        .hero-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: top center;
        }

        .featured-section {
          padding-top: 5rem;
          padding-bottom: 5rem;
        }
        .section-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 3rem;
        }
        .text-center {
          align-items: center;
          justify-content: center;
          flex-direction: column;
          text-align: center;
        }
        
        .categories-section {
          padding-bottom: 6rem;
        }
        .cat-quad {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
          aspect-ratio: 2/1;
          height: 600px;
        }
        .cat-card {
          position: relative;
          border-radius: var(--radius-lg);
          overflow: hidden;
          display: block;
        }
        .cat-card:nth-child(1) { grid-column: 1; grid-row: 1 / span 2; }
        .cat-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
        }
        .cat-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 50%, transparent 100%);
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 2rem;
          transition: background 0.3s;
        }
        .cat-card:hover .cat-img {
          transform: scale(1.05);
        }
        .cat-card:hover .cat-overlay {
          background: linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.3) 50%, transparent 100%);
        }
        .cat-title {
          font-size: 2rem;
          font-weight: 800;
          color: white;
          margin-bottom: 0.5rem;
        }
        .cat-link {
          font-size: 0.9rem;
          font-weight: 700;
          color: var(--accent);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          opacity: 0.8;
          transition: opacity 0.2s;
        }
        .cat-card:hover .cat-link {
          opacity: 1;
        }
        .empty-text {
          color: var(--text-muted);
          grid-column: 1 / -1;
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 768px) {
          .cat-quad {
            grid-template-columns: 1fr;
            height: auto;
            aspect-ratio: auto;
          }
          .cat-card {
            height: 250px;
          }
          .cat-card:nth-child(1) { grid-row: auto; height: 350px; }
          .hero-gradient {
            background: linear-gradient(to top, var(--bg) 10%, rgba(13,13,13,0.7) 70%, rgba(13,13,13,0.4) 100%);
          }
        }
      `}</style>
    </div>
  );
}
