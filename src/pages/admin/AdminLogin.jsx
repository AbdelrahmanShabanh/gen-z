import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Login failed');

      localStorage.setItem('genzfront_admin_token', data.token);
      window.location.href = '/admin/dashboard'; // use window.location to force full reload so Navbar detects token
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="login-card">
        <h1 className="login-title">Admin Access</h1>
        <p className="login-sub">Sign in to manage Gen Z Front</p>

        {error && <div className="alert alert-error mb-4">{error}</div>}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input 
              type="email" 
              className="form-input" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              required 
            />
          </div>
          <div className="form-group mb-6">
            <label className="form-label">Password</label>
            <input 
              type="password" 
              className="form-input" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required 
            />
          </div>
          <button type="submit" className="btn btn-primary btn-lg full-width" disabled={loading}>
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
      </div>

      <style>{`
        .admin-login-page {
          min-height: 80vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          background: var(--bg);
        }
        .login-card {
          width: 100%;
          max-width: 420px;
          background: var(--bg-card);
          padding: 3rem 2.5rem;
          border-radius: var(--radius-lg);
          border: 1px solid var(--border);
          box-shadow: var(--shadow-lg);
        }
        .login-title {
          font-size: 1.8rem;
          font-weight: 900;
          color: var(--accent);
          margin-bottom: 0.25rem;
          text-align: center;
        }
        .login-sub {
          color: var(--text-muted);
          text-align: center;
          margin-bottom: 2rem;
          font-size: 0.9rem;
        }
        .mb-4 { margin-bottom: 1.5rem; }
        .mb-6 { margin-bottom: 2.5rem; }
        .full-width { width: 100%; }
      `}</style>
    </div>
  );
}
