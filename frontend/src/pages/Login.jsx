import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HeartPulse, Shield, UserCheck, User, Pill } from 'lucide-react';

const DEMO = [
  { label: 'Admin',       email: 'admin@hms.com',      icon: Shield,    color: '#2563eb' },
  { label: 'Doctor',      email: 'doctor@hms.com',     icon: UserCheck, color: '#059669' },
  { label: 'Patient',     email: 'patient@hms.com',    icon: User,      color: '#7c3aed' },
  { label: 'Pharmacist',  email: 'pharmacist@hms.com', icon: Pill,      color: '#d97706' },
];

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail]       = useState('admin@hms.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  const doLogin = async (em, pw) => {
    setError(''); setLoading(true);
    try {
      await login(em, pw);
      navigate('/');
    } catch (e) {
      setError(e.response?.data?.message || 'Invalid credentials.');
    } finally { setLoading(false); }
  };

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
    }}>
      <div style={{ width: '100%', maxWidth: 420 }}>

        {/* Logo Branding */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16, background: 'var(--primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px', boxShadow: '0 4px 10px rgba(37, 99, 235, 0.3)'
          }}>
            <HeartPulse size={30} color="#ffffff" />
          </div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.03em' }}>CarePulse Portal</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-3)', marginTop: 4 }}>Next-Gen Enterprise Hospital Management System</p>
        </div>

        {/* Login Form Card */}
        <div className="card" style={{ padding: '32px', boxShadow: 'var(--shadow-md)' }}>

          {error && (
            <div style={{
              background: 'var(--red-bg)', border: '1px solid var(--red-border)',
              borderRadius: 8, padding: '10px 14px', marginBottom: 20,
              fontSize: '0.825rem', color: 'var(--red)', fontWeight: 500
            }}>
              {error}
            </div>
          )}

          <form onSubmit={e => { e.preventDefault(); doLogin(email, password); }} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label className="label">Email Address</label>
              <input className="input" type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="user@hms.com" />
            </div>
            <div>
              <label className="label">Password</label>
              <input className="input" type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" />
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ width: '100%', justifyContent: 'center', padding: '10px 0', fontSize: '0.9rem', marginTop: 4 }}
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          {/* Quick Demo Logins */}
          <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid var(--border)' }}>
            <p style={{ fontSize: '0.725rem', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12, textAlign: 'center' }}>
              Quick Demo Role Access
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {DEMO.map(({ label, email: em, icon: Icon, color }) => (
                <button
                  key={label}
                  onClick={() => { setEmail(em); setPassword('admin123'); doLogin(em, 'admin123'); }}
                  className="btn btn-secondary"
                  style={{ justifyContent: 'flex-start', padding: '8px 12px', gap: 8 }}
                >
                  <Icon size={16} style={{ color }} />
                  <span style={{ fontSize: '0.825rem', color: 'var(--text)' }}>{label}</span>
                </button>
              ))}
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-3)', textAlign: 'center', marginTop: 12 }}>
              Default demo password: <strong style={{ color: 'var(--text-2)' }}>admin123</strong>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
