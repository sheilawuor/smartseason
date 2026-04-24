import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await API.post('/auth/login', { email, password });
      login(res.data.user, res.data.token);
      if (res.data.user.role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate('/agent/dashboard');
      }
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#1B5E20', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', fontFamily: 'sans-serif' }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: '#F57C00', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px' }}>🌿</div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ color: 'white', fontSize: '22px', fontWeight: '700', lineHeight: 1 }}>Shamba Records</div>
              <div style={{ color: '#A5D6A7', fontSize: '12px', marginTop: '3px' }}>SmartSeason Field Monitor</div>
            </div>
          </div>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.2)', padding: '2.5rem' }}>
          <h2 style={{ color: 'white', fontSize: '20px', fontWeight: '600', marginBottom: '0.25rem', marginTop: 0 }}>Welcome back</h2>
          <p style={{ color: '#A5D6A7', fontSize: '14px', marginBottom: '1.75rem', marginTop: 0 }}>Sign in to your account to continue</p>
          {error && (
            <div style={{ background: 'rgba(229,57,53,0.2)', border: '1px solid rgba(229,57,53,0.4)', color: '#FFCDD2', borderRadius: '10px', padding: '0.75rem 1rem', marginBottom: '1rem', fontSize: '14px' }}>
              {error}
            </div>
          )}
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', color: '#C8E6C9', fontSize: '13px', fontWeight: '500', marginBottom: '6px' }}>Email Address</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@shambarecords.com" required style={{ width: '100%', boxSizing: 'border-box', background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)', borderRadius: '10px', padding: '0.75rem 1rem', color: 'white', fontSize: '14px', outline: 'none' }} />
            </div>
            <div style={{ marginBottom: '1.75rem' }}>
              <label style={{ display: 'block', color: '#C8E6C9', fontSize: '13px', fontWeight: '500', marginBottom: '6px' }}>Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required style={{ width: '100%', boxSizing: 'border-box', background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)', borderRadius: '10px', padding: '0.75rem 1rem', color: 'white', fontSize: '14px', outline: 'none' }} />
            </div>
            <button type="submit" disabled={loading} style={{ width: '100%', padding: '0.85rem', background: '#F57C00', color: 'white', fontWeight: '600', fontSize: '15px', border: 'none', borderRadius: '10px', cursor: 'pointer' }}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          <div style={{ marginTop: '1.75rem', background: 'rgba(0,0,0,0.2)', borderRadius: '10px', padding: '1rem', border: '1px solid rgba(255,255,255,0.1)' }}>
            <p style={{ color: '#A5D6A7', fontSize: '12px', fontWeight: '600', marginBottom: '6px', marginTop: 0 }}>DEMO CREDENTIALS</p>
            <p style={{ color: '#C8E6C9', fontSize: '13px', margin: '3px 0' }}>Admin: admin@smartseason.com / admin123</p>
            <p style={{ color: '#C8E6C9', fontSize: '13px', margin: '3px 0' }}>Agent: agent1@smartseason.com / agent123</p>
          </div>
        </div>
        <p style={{ textAlign: 'center', color: '#81C784', fontSize: '12px', marginTop: '1.5rem' }}>© 2026 Shamba Records · Digitizing Agriculture in Africa</p>
      </div>
    </div>
  );
}