import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('genzfront_admin_token');
    window.location.href = '/';
  };

  const menuItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: 'M4 6h16M4 12h16M4 18h16' },
    { path: '/admin/products', label: 'Products', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
    { path: '/admin/orders', label: 'Orders', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
    { path: '/admin/users', label: 'Users', icon: 'M12 4a4 4 0 110 8 4 4 0 010-8zm-6 16v-2a4 4 0 014-4h4a4 4 0 014 4v2' },
  ];

  return (
    <div className="admin-layout" style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-main)' }}>
      {/* Sidebar */}
      <aside className="admin-sidebar" style={{ 
        width: '260px', 
        background: 'var(--bg-card)', 
        borderRight: '1px solid var(--border)',
        padding: '2rem 0',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div className="admin-sidebar-head" style={{ padding: '0 2rem', marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '900', letterSpacing: '0.05em', color: 'var(--text)' }}>
            GEN Z <span style={{ color: 'var(--accent)' }}>ADMIN</span>
          </h2>
        </div>

        <nav className="admin-sidebar-nav">
          {menuItems.map(item => {
            const isActive = location.pathname === item.path;
            return (
              <Link 
                key={item.path} 
                to={item.path}
                style={{
                  display: 'flex', alignItems: 'center', gap: '1rem',
                  padding: '1rem 1.5rem',
                  borderRadius: 'var(--radius)',
                  color: isActive ? '#000' : 'var(--accent)',
                  background: isActive ? 'var(--accent)' : 'transparent',
                  fontWeight: isActive ? '700' : '600',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d={item.icon} />
                </svg>
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="admin-bottom-actions">
          <Link 
            to="/" 
            style={{
              display: 'flex', alignItems: 'center', gap: '1rem',
              padding: '1rem 1.5rem',
              borderRadius: 'var(--radius)',
              color: 'var(--accent)',
              textDecoration: 'none',
              fontWeight: '600',
              border: '1px solid var(--border)'
            }}
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Site
          </Link>
          <button 
            onClick={handleLogout}
            style={{
              display: 'flex', alignItems: 'center', gap: '1rem',
              padding: '1rem 1.5rem',
              borderRadius: 'var(--radius)',
              color: '#ef4444',
              background: 'transparent',
              border: '1px solid var(--border)',
              fontWeight: '600',
              cursor: 'pointer',
              textAlign: 'left'
            }}
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="admin-content" style={{ flex: '1', padding: '2rem 3rem', overflowY: 'auto' }}>
        <Outlet />
      </main>
      
      <style>{`
        .admin-sidebar-nav { flex: 1; display: flex; flex-direction: column; gap: 0.5rem; padding: 0 1rem; }
        .admin-bottom-actions { padding: 0 1rem; margin-top: auto; display: flex; flex-direction: column; gap: 0.5rem; }
        
        @media (max-width: 768px) {
          .admin-layout { flex-direction: column !important; }
          .admin-sidebar { width: 100% !important; border-right: none !important; border-bottom: 1px solid var(--border) !important; padding: 1.5rem !important; }
          .admin-sidebar-head { margin-bottom: 1.5rem !important; text-align: center; display: flex; justify-content: center; }
          .admin-sidebar-nav { flex-direction: row !important; flex-wrap: wrap; justify-content: center; gap: 0.5rem; padding: 0 !important; margin-bottom: 1.5rem !important; flex: none; }
          .admin-sidebar-nav a { padding: 0.5rem 1rem !important; font-size: 0.85rem; border: 1px solid var(--accent); }
          .admin-bottom-actions { flex-direction: row !important; justify-content: center; padding: 0 !important; margin-top: 0 !important; flex-wrap: wrap; gap: 0.5rem; }
          .admin-bottom-actions a, .admin-bottom-actions button { padding: 0.5rem 1rem !important; font-size: 0.85rem; width: auto; justify-content: center; }
          .admin-content { padding: 1rem !important; }
        }
      `}</style>
    </div>
  );
}