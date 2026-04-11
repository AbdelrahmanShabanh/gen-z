import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ products: 0, orders: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("genzfront_admin_token");

    Promise.all([
      fetch("/api/products").then((res) => res.json()),
      fetch("/api/admin/orders", {
        headers: { Authorization: `Bearer ${token}` },
      }).then((res) => {
        if (res.status === 401) {
          localStorage.removeItem("genzfront_admin_token");
          navigate("/admin/login");
          throw new Error("Unauthorized");
        }
        return res.json();
      }),
    ])
      .then(([productsData, ordersData]) => {
        setStats({
          products: productsData.length,
          orders: ordersData.length,
        });
        setRecentOrders(ordersData.slice(0, 5));
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("genzfront_admin_token");
    window.location.href = "/";
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
        <div>
          <h1 className="section-title">Overview</h1>
          <p className="admin-sub">Store overview and recent activity</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3 className="stat-title">Total Products</h3>
          <p className="stat-value">{stats.products}</p>
          <Link to="/admin/products" className="stat-link">
            Manage Products →
          </Link>
        </div>
        <div className="stat-card">
          <h3 className="stat-title">Total Orders</h3>
          <p className="stat-value">{stats.orders}</p>
          <Link to="/admin/orders" className="stat-link">
            Manage Orders →
          </Link>
        </div>
      </div>

      <div className="admin-section">
        <div className="section-head">
          <h2
            className="section-label"
            style={{ fontSize: "1rem", color: "var(--text)" }}
          >
            Recent Orders
          </h2>
          <Link
            to="/admin/orders"
            className="nav-link"
            style={{ fontSize: "0.85rem" }}
          >
            View All
          </Link>
        </div>

        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>City</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order._id}>
                  <td>
                    <span className="mono-id">{order._id.substring(0, 8)}</span>
                  </td>
                  <td>{order.customerName}</td>
                  <td>{order.city}</td>
                  <td>
                    <strong>{order.total} EGP</strong>
                  </td>
                  <td>
                    <span className={`badge badge-${order.status}`}>
                      {order.status}
                    </span>
                  </td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
              {recentOrders.length === 0 && (
                <tr>
                  <td
                    colSpan="6"
                    style={{ textAlign: "center", padding: "2rem" }}
                  >
                    No orders yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`
        .admin-page { padding-top: 1rem; padding-bottom: 2rem; }
        .admin-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 3rem; border-bottom: 1px solid var(--border); padding-bottom: 1.5rem; }
        .admin-sub { color: var(--text-muted); margin-top: 0.25rem; }
        
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem; margin-bottom: 3rem; }
        .stat-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius); padding: 1.5rem; display: flex; flex-direction: column; }
        .stat-title { font-size: 0.85rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-muted); margin-bottom: 0.5rem; }
        .stat-value { font-size: 3.5rem; font-weight: 900; color: var(--accent); line-height: 1; margin-bottom: 1rem; }
        .stat-link { font-size: 0.85rem; font-weight: 600; color: var(--text); align-self: flex-start; margin-top: auto; padding-top: 1rem; border-top: 1px solid var(--border-light); width: 100%; transition: color 0.2s; }
        .stat-link:hover { color: var(--accent); }
        
        .admin-section { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius); padding: 1.5rem; }
        .section-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
        .table-responsive { overflow-x: auto; }
        .mono-id { font-family: monospace; font-size: 0.85rem; color: var(--text-subtle); }
      `}</style>
    </div>
  );
}
