import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [mainImage, setMainImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [sizeError, setSizeError] = useState(false);

  // Reviews Data
  const [reviews, setReviews] = useState([
    {
      id: 1,
      name: "أحمد محمود",
      rating: 5,
      text: "خامة ممتازة جدا وتوصيل سريع، المقاس مظبوط بالظبط.",
      date: "2 days ago",
    },
    {
      id: 2,
      name: "مصطفى كمال",
      rating: 4,
      text: "التيشيرت شكله جامد بس يفضل تطلب مقاس أكبر من مقاسك.",
      date: "1 week ago",
    },
    {
      id: 3,
      name: "عمر طارق",
      rating: 5,
      text: "أحسن كواليتي شوفتها للسعر ده، شكراً Gen Z!",
      date: "2 weeks ago",
    },
  ]);
  const [newReview, setNewReview] = useState("");
  const [newRating, setNewRating] = useState(5);

  // Wishlist Logic
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    // Check wishlist
    const savedWishlist = JSON.parse(
      localStorage.getItem("genzfront_wishlist") || "[]",
    );
    setIsWishlisted(savedWishlist.includes(id));

    setLoading(true);
    fetch(`/api/products/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Product not found");
        return res.json();
      })
      .then((data) => {
        setProduct(data);
        if (data.sizes?.length) setSelectedSize(data.sizes[0]);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  const handleAdd = () => {
    if (!selectedSize) {
      setSizeError(true);
      return;
    }
    setSizeError(false);
    addToCart(product, selectedSize);

    // Show quick toast
    const btn = document.getElementById("add-btn");
    const originalText = btn.innerText;
    btn.innerText = "Added to Cart! ✓";
    btn.style.backgroundColor = "var(--success)";
    btn.style.color = "#fff";
    setTimeout(() => {
      if (btn) {
        btn.innerText = originalText;
        btn.style.backgroundColor = "";
        btn.style.color = "";
      }
    }, 2000);
  };

  const toggleWishlist = () => {
    const list = JSON.parse(localStorage.getItem("genzfront_wishlist") || "[]");
    let newList;
    if (isWishlisted) {
      newList = list.filter((item) => item !== id);
    } else {
      newList = [...list, id];
    }
    localStorage.setItem("genzfront_wishlist", JSON.stringify(newList));
    setIsWishlisted(!isWishlisted);
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!newReview.trim()) return;

    const submittedReview = {
      id: Date.now(),
      name: "ضيف (أنت)",
      rating: newRating,
      text: newReview,
      date: "Just now",
    };

    setReviews([submittedReview, ...reviews]);
    setNewReview("");
  };

  if (loading)
    return (
      <div className="page-loader">
        <div className="spinner" />
      </div>
    );
  if (error)
    return (
      <div className="container" style={{ padding: "5rem 0" }}>
        <div className="alert alert-error">{error}</div>
        <Link
          to="/products"
          className="btn btn-primary"
          style={{ marginTop: "1rem" }}
        >
          Back to Shop
        </Link>
      </div>
    );
  if (!product) return null;

  const inStock = product.stock > 0;

  return (
    <div className="product-detail-page container">
      <div className="breadcrumb">
        <Link to="/">Home</Link> <span className="sep">/</span>
        <Link to="/products">Shop</Link> <span className="sep">/</span>
        <Link
          to={`/products?category=${product.category}`}
          style={{ textTransform: "capitalize" }}
        >
          {product.category}
        </Link>{" "}
        <span className="sep">/</span>
        <span className="current">{product.name}</span>
      </div>

      <div className="detail-grid">
        {/* Images */}
        <div className="detail-gallery">
          <div className="main-image-wrap">
            <img
              src={product.images?.[mainImage] || ""}
              alt={product.name}
              className="main-image"
            />
            {!inStock && <div className="sold-out-badge">SOLD OUT</div>}
            {product.featured && <div className="featured-badge">FEATURED</div>}
          </div>
          {product.images?.length > 1 && (
            <div className="thumb-strip">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  className={`thumb-btn ${mainImage === i ? "active" : ""}`}
                  onClick={() => setMainImage(i)}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${i + 1}`}
                    className="thumb-img"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="detail-info">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <h1 className="detail-title">{product.name}</h1>
            <button
              onClick={toggleWishlist}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: "1.5rem",
                color: isWishlisted ? "red" : "currentColor",
              }}
            >
              {isWishlisted ? "❤️" : "♡"}
            </button>
          </div>
          <p className="detail-price">{product.price} EGP</p>

          <p className="detail-desc">{product.description}</p>

          <div className="detail-stock">
            <span
              className={`status-dot ${inStock ? "in-stock" : "out-stock"}`}
            />
            {inStock
              ? `${product.stock} items available`
              : "Currently out of stock"}
          </div>

          <div className="detail-section">
            <div className="section-head">
              <span className="section-label">Select Size</span>
              <button className="size-guide-btn">Size Guide</button>
            </div>
            <div className="size-selector">
              {product.sizes?.map((size) => (
                <button
                  key={size}
                  className={`size-btn-lg ${selectedSize === size ? "active" : ""}`}
                  onClick={() => {
                    setSelectedSize(size);
                    setSizeError(false);
                  }}
                  disabled={!inStock}
                >
                  {size}
                </button>
              ))}
            </div>
            {sizeError && (
              <p className="error-text">
                Please select a size before adding to cart.
              </p>
            )}
          </div>

          <div className="detail-actions">
            <button
              id="add-btn"
              className="btn btn-primary btn-lg full-width"
              onClick={handleAdd}
              disabled={!inStock}
            >
              {inStock ? "Add to Cart" : "Out of Stock"}
            </button>
            <button
              className="btn btn-dark btn-lg full-width"
              onClick={() => {
                if (inStock) {
                  handleAdd();
                  navigate("/checkout");
                }
              }}
              disabled={!inStock}
            >
              Buy it Now
            </button>
          </div>

          <div className="detail-meta">
            {product.material && (
              <div className="meta-item">
                <span className="meta-label">Material</span>
                <span className="meta-value">{product.material}</span>
              </div>
            )}
            <div className="meta-item">
              <span className="meta-label">Category</span>
              <span
                className="meta-value"
                style={{ textTransform: "capitalize" }}
              >
                {product.category}
              </span>
            </div>
          </div>

          <div className="shipping-banner">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M5 18H3c-.6 0-1-.4-1-1V7c0-.6.4-1 1-1h10c.6 0 1 .4 1 1v11" />
              <path d="M14 9h4l4 4v5c0 .6-.4 1-1 1h-2" />
              <circle cx="7" cy="18" r="2" />
              <circle cx="17" cy="18" r="2" />
            </svg>
            <div>
              <strong>Fast Delivery</strong>
              <p>2-3 days in Cairo, 3-4 days in Alex.</p>
            </div>
          </div>
        </div>
      </div>

      <div
        className="reviews-section"
        style={{
          marginTop: "4rem",
          padding: "2rem",
          background: "var(--bg-card)",
          borderRadius: "12px",
          border: "1px solid var(--border)",
        }}
      >
        <h2 style={{ marginBottom: "1.5rem", fontSize: "1.5rem" }}>
          Customer Reviews
        </h2>

        <form onSubmit={handleReviewSubmit} style={{ marginBottom: "2rem" }}>
          <div
            style={{
              display: "flex",
              gap: "1rem",
              alignItems: "center",
              marginBottom: "1rem",
            }}
          >
            <label>Rating:</label>
            <select
              value={newRating}
              onChange={(e) => setNewRating(Number(e.target.value))}
              style={{ padding: "0.5rem", borderRadius: "4px" }}
            >
              <option value={5}>5 Stars ★★★★★</option>
              <option value={4}>4 Stars ★★★★☆</option>
              <option value={3}>3 Stars ★★★☆☆</option>
              <option value={2}>2 Stars ★★☆☆☆</option>
              <option value={1}>1 Star ★☆☆☆☆</option>
            </select>
          </div>
          <textarea
            value={newReview}
            onChange={(e) => setNewReview(e.target.value)}
            placeholder="Write your review here (Arabic supported)..."
            style={{
              width: "100%",
              padding: "1rem",
              minHeight: "100px",
              borderRadius: "8px",
              border: "1px solid var(--border)",
              marginBottom: "1rem",
              fontFamily: "inherit",
            }}
          />
          <button
            type="submit"
            className="btn btn-primary"
            style={{ padding: "0.75rem 2rem" }}
          >
            Post Review
          </button>
        </form>

        <div
          className="reviews-list"
          style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
        >
          {reviews.map((review) => (
            <div
              key={review.id}
              className="review-card"
              style={{
                padding: "1.5rem",
                background: "var(--bg)",
                borderRadius: "8px",
                border: "1px solid var(--border)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "0.5rem",
                }}
              >
                <strong>{review.name}</strong>
                <span
                  style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}
                >
                  {review.date}
                </span>
              </div>
              <div
                style={{
                  color: "gold",
                  marginBottom: "0.5rem",
                  fontSize: "1.2rem",
                }}
              >
                {"★".repeat(review.rating)}
                {"☆".repeat(5 - review.rating)}
              </div>
              <p style={{ lineHeight: "1.6", fontSize: "1rem" }} dir="auto">
                {review.text}
              </p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .product-detail-page {
          padding-top: 2rem;
          padding-bottom: 6rem;
        }
        .breadcrumb {
          font-size: 0.85rem;
          color: var(--text-muted);
          margin-bottom: 2rem;
          display: flex;
          gap: 0.5rem;
        }
        .breadcrumb a:hover { color: var(--accent); }
        .sep { color: var(--border-light); }
        .current { color: var(--text); font-weight: 500; }
        
        .detail-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: start;
        }
        .main-image-wrap {
          position: relative;
          aspect-ratio: 4/5;
          background: #111;
          border-radius: var(--radius);
          overflow: hidden;
          margin-bottom: 1rem;
        }
        .main-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .sold-out-badge, .featured-badge {
          position: absolute;
          padding: 0.4rem 1rem;
          font-weight: 800;
          letter-spacing: 0.15em;
          font-size: 0.8rem;
          border-radius: var(--radius-sm);
        }
        .sold-out-badge { bottom: 1.5rem; left: 1.5rem; background: var(--error); color: white; }
        .featured-badge { top: 1.5rem; left: 1.5rem; background: var(--accent); color: var(--primary); }
        
        .thumb-strip {
          display: flex;
          gap: 1rem;
          overflow-x: auto;
          padding-bottom: 0.5rem;
        }
        .thumb-btn {
          width: 80px;
          height: 80px;
          border-radius: var(--radius-sm);
          overflow: hidden;
          border: 2px solid transparent;
          cursor: pointer;
          flex-shrink: 0;
          padding: 0;
          transition: border-color 0.2s;
        }
        .thumb-btn.active { border-color: var(--accent); }
        .thumb-img { width: 100%; height: 100%; object-fit: cover; }
        
        .detail-info {
          display: flex;
          flex-direction: column;
        }
        .detail-title {
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 900;
          line-height: 1.1;
          margin-bottom: 0.5rem;
        }
        .detail-price {
          font-size: 1.75rem;
          font-weight: 800;
          color: var(--accent);
          margin-bottom: 1.5rem;
        }
        .detail-desc {
          font-size: 1.05rem;
          color: var(--text-subtle);
          line-height: 1.6;
          margin-bottom: 1.5rem;
        }
        .detail-stock {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text);
          margin-bottom: 2rem;
          padding: 0.75rem 1rem;
          background: var(--bg-elevated);
          border-radius: var(--radius-sm);
        }
        .status-dot {
          width: 8px; height: 8px; border-radius: 50%;
        }
        .status-dot.in-stock { background: var(--success); box-shadow: 0 0 10px var(--success); }
        .status-dot.out-stock { background: var(--error); box-shadow: 0 0 10px var(--error); }
        
        .detail-section { margin-bottom: 2.5rem; }
        .section-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }
        .size-guide-btn {
          background: none;
          color: var(--text-muted);
          font-size: 0.8rem;
          font-weight: 600;
          text-decoration: underline;
        }
        .size-guide-btn:hover { color: var(--text); }
        .size-selector {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));
          gap: 0.75rem;
        }
        .size-btn-lg {
          padding: 0.75rem;
          border-radius: var(--radius-sm);
          border: 1.5px solid var(--border-light);
          background: var(--bg-card);
          color: var(--text);
          font-weight: 700;
          font-size: 1rem;
          transition: var(--transition);
        }
        .size-btn-lg:hover:not(:disabled) { border-color: #555; }
        .size-btn-lg.active {
          border-color: var(--accent);
          background: var(--accent);
          color: var(--primary);
        }
        .size-btn-lg:disabled { opacity: 0.3; cursor: not-allowed; text-decoration: line-through; }
        .error-text { color: var(--error); font-size: 0.85rem; margin-top: 0.5rem; font-weight: 500; }
        
        .detail-actions {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 3rem;
        }
        .full-width { width: 100%; }
        
        .detail-meta {
          border-top: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
          padding: 1.5rem 0;
          margin-bottom: 2rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .meta-item { display: flex; gap: 1rem; font-size: 0.9rem; }
        .meta-label { width: 100px; color: var(--text-muted); font-weight: 600; }
        .meta-value { color: var(--text); font-weight: 500; }
        
        .shipping-banner {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          padding: 1.25rem;
          background: rgba(59,130,246,0.1);
          border: 1px solid rgba(59,130,246,0.2);
          border-radius: var(--radius-sm);
          color: #60a5fa;
        }
        .shipping-banner strong { display: block; margin-bottom: 0.2rem; color: #93c5fd; }
        .shipping-banner p { font-size: 0.85rem; margin: 0; }
        
        @media (max-width: 900px) {
          .detail-grid { grid-template-columns: 1fr 1fr; gap: 2rem; }
        }
        @media (max-width: 768px) {
          .detail-grid { grid-template-columns: 1fr; }
          .main-image-wrap { aspect-ratio: 1; }
        }
      `}</style>
    </div>
  );
}
