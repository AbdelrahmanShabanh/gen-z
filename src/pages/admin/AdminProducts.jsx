import { useState, useEffect } from "react";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState(getInitialForm());
  const [editId, setEditId] = useState(null);

  function getInitialForm() {
    return {
      name: "",
      description: "",
      price: "",
      category: "hoodies",
      sizes: [],
      stock: 0,
      material: "",
      images: [],
      featured: false,
    };
  }

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox" && name === "featured") {
      setFormData((prev) => ({ ...prev, featured: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSizeChange = (size) => {
    setFormData((prev) => {
      const sizes = prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size];
      return { ...prev, sizes };
    });
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setUploading(true);
    const newImages = [...formData.images];
    const token = localStorage.getItem("genzfront_admin_token");

    for (const file of files) {
      if (newImages.length >= 5) break; // max 5

      const reader = new FileReader();
      reader.readAsDataURL(file);
      await new Promise((res) => (reader.onload = res));

      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ image: reader.result }),
        });
        const data = await res.json();
        if (data.url) newImages.push(data.url);
      } catch (err) {
        console.error("Upload failed", err);
      }
    }

    setFormData((prev) => ({ ...prev, images: newImages }));
    setUploading(false);
  };

  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const openEdit = (product) => {
    setEditId(product._id);
    setFormData({
      ...product,
      sizes: product.sizes || [],
      images: product.images || [],
    });
    setShowModal(true);
  };

  const openNew = () => {
    setEditId(null);
    setFormData(getInitialForm());
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;
    const token = localStorage.getItem("genzfront_admin_token");
    try {
      await fetch(`/api/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const token = localStorage.getItem("genzfront_admin_token");

    const url = editId ? `/api/products/${editId}` : "/api/products";
    const method = editId ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          price: Number(formData.price),
          stock: Number(formData.stock),
        }),
      });
      if (res.ok) {
        setShowModal(false);
        fetchProducts();
      }
    } catch (err) {
      console.error(err);
    }
    setSaving(false);
  };

  if (loading)
    return (
      <div className="page-loader">
        <div className="spinner" />
      </div>
    );

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1 className="section-title">Products</h1>
        <button className="btn btn-primary" onClick={openNew}>
          + Add Product
        </button>
      </div>

      <div className="table-responsive">
        <table className="admin-table">
          <thead>
            <tr>
              <th style={{ width: "60px" }}>Img</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id}>
                <td>
                  <img
                    src={p.images?.[0] || "placeholder"}
                    alt=""
                    style={{
                      width: "40px",
                      height: "40px",
                      objectFit: "cover",
                      borderRadius: "4px",
                      background: "#111",
                    }}
                  />
                </td>
                <td>
                  <strong>{p.name}</strong>
                  {p.featured && (
                    <span
                      className="badge badge-accent ms-2"
                      style={{ marginLeft: "8px" }}
                    >
                      Featured
                    </span>
                  )}
                </td>
                <td style={{ textTransform: "capitalize" }}>{p.category}</td>
                <td>{p.price} EGP</td>
                <td>
                  <span
                    className={`badge ${p.stock > 0 ? "badge-success" : "badge-error"}`}
                  >
                    {p.stock > 0 ? `${p.stock} in stock` : "Out of stock"}
                  </span>
                </td>
                <td>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button
                      className="icon-btn edt"
                      onClick={() => openEdit(p)}
                    >
                      ✎ Edit
                    </button>
                    <button
                      className="icon-btn del"
                      onClick={() => handleDelete(p._id)}
                    >
                      🗑 Del
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="section-title mb-4" style={{ fontSize: "1.5rem" }}>
              {editId ? "Edit Product" : "Add New Product"}
            </h2>

            <form onSubmit={handleSubmit} className="admin-form">
              <div className="form-group">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  name="name"
                  className="form-input"
                  required
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div className="form-row">
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Price (EGP)</label>
                  <input
                    type="number"
                    name="price"
                    className="form-input"
                    required
                    min="1"
                    value={formData.price}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Category</label>
                  <select
                    name="category"
                    className="form-input form-select"
                    value={formData.category}
                    onChange={handleChange}
                  >
                    <option value="hoodies">Hoodies</option>
                    <option value="tshirts">T-Shirts</option>
                    <option value="pants">Pants</option>
                    <option value="accessories">Accessories</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Sizes</label>
                <div className="size-checkboxes">
                  {["XS", "S", "M", "L", "XL", "XXL"].map((sz) => (
                    <label key={sz} className="size-cb">
                      <input
                        type="checkbox"
                        checked={formData.sizes.includes(sz)}
                        onChange={() => handleSizeChange(sz)}
                      />
                      <span>{sz}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Stock Quantity</label>
                  <input
                    type="number"
                    name="stock"
                    className="form-input"
                    min="0"
                    value={formData.stock}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Material (Optional)</label>
                  <input
                    type="text"
                    name="material"
                    className="form-input"
                    placeholder="e.g. 100% Cotton"
                    value={formData.material}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-group custom-checkbox">
                <label>
                  <input
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleChange}
                  />
                  <span>Feature on Homepage</span>
                </label>
              </div>

              <div className="form-group">
                <label className="form-label">Images (Max 5)</label>
                <div className="img-upload-grid">
                  {formData.images.map((img, i) => (
                    <div key={i} className="img-preview">
                      <img src={img} alt="" />
                      <button type="button" onClick={() => removeImage(i)}>
                        ✕
                      </button>
                    </div>
                  ))}
                  {formData.images.length < 5 && (
                    <label className="img-upload-btn">
                      {uploading ? (
                        <div className="spinner sm"></div>
                      ) : (
                        <span>+ Upload</span>
                      )}
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploading}
                        hidden
                      />
                    </label>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  name="description"
                  className="form-input"
                  rows="3"
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>

              <div className="modal-actions mt-4">
                <button
                  type="button"
                  className="btn btn-dark"
                  onClick={() => setShowModal(false)}
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={saving || uploading}
                >
                  {saving ? "Saving..." : "Save Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .admin-page { padding-top: 1rem; padding-bottom: 2rem; }
        .admin-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; padding-bottom: 1rem; border-bottom: 1px solid var(--border); }
        .icon-btn { background: none; border: none; font-size: 0.75rem; font-weight: 700; cursor: pointer; padding: 0.2rem 0.5rem; border-radius: 4px; transition: var(--transition); }
        .icon-btn.edt { color: var(--info); }
        .icon-btn.edt:hover { background: rgba(59,130,246,0.1); }
        .icon-btn.del { color: var(--error); }
        .icon-btn.del:hover { background: rgba(239,68,68,0.1); }
        
        .admin-form .form-row { display: flex; gap: 1rem; }
        .size-checkboxes { display: flex; flex-wrap: wrap; gap: 0.6rem; }
        .size-cb { display: flex; align-items: center; gap: 0.4rem; cursor: pointer; font-size: 0.85rem; background: var(--bg-elevated); padding: 0.35rem 0.75rem; border-radius: var(--radius-sm); border: 1px solid var(--border-light); transition: border-color 0.2s; }
        .size-cb:hover { border-color: var(--text-muted); }
        .size-cb input { accent-color: var(--accent); }
        
        .custom-checkbox label { display: flex; align-items: center; gap: 0.6rem; cursor: pointer; font-weight: 600; font-size: 0.9rem; }
        .custom-checkbox input { width: 18px; height: 18px; accent-color: var(--accent); }
        
        .img-upload-grid { display: grid; grid-template-columns: repeat(auto-fill, 70px); gap: 0.75rem; }
        .img-preview { width: 70px; height: 70px; position: relative; border-radius: var(--radius-sm); overflow: hidden; border: 1px solid var(--border-light); }
        .img-preview img { width: 100%; height: 100%; object-fit: cover; }
        .img-preview button { position: absolute; top: 2px; right: 2px; background: rgba(239,68,68,0.9); color: white; border: none; width: 20px; height: 20px; border-radius: 50%; font-size: 0.65rem; cursor: pointer; display: flex; align-items: center; justify-content: center; }
        .img-upload-btn { width: 70px; height: 70px; border: 1px dashed var(--border-light); border-radius: var(--radius-sm); display: flex; align-items: center; justify-content: center; color: var(--text-muted); font-size: 0.75rem; font-weight: 600; cursor: pointer; background: var(--bg-elevated); transition: border-color 0.2s, color 0.2s; }
        .img-upload-btn:hover { border-color: var(--accent); color: var(--accent); }
        
        .modal-actions { display: flex; justify-content: flex-end; gap: 1rem; padding-top: 1.5rem; border-top: 1px solid var(--border); }
        .spinner.sm { width: 16px; height: 16px; border-width: 2px; }
      `}</style>
    </div>
  );
}
