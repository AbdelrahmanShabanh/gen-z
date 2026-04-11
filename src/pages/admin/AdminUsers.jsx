export default function AdminUsers() {
  return (
    <div className="admin-page">
      <div className="admin-header">
        <div>
          <h1 className="section-title">Users</h1>
          <p className="admin-sub">Manage customer accounts and roles</p>
        </div>
      </div>
      <div className="admin-section">
        <p
          style={{
            textAlign: "center",
            padding: "3rem",
            color: "var(--text-muted)",
          }}
        >
          User management is coming soon...
        </p>
      </div>
      <style>{`
        .admin-page { padding-top: 1rem; padding-bottom: 2rem; }
        .admin-header { margin-bottom: 2rem; padding-bottom: 1rem; border-bottom: 1px solid var(--border); }
        .admin-section { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius); padding: 1.5rem; }
      `}</style>
    </div>
  );
}
