import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HeartPulse, Shield, UserCheck, User, Pill, UserPlus, LogIn } from 'lucide-react';

const DEMO = [
  { label: 'Admin',       email: 'admin@hms.com',      icon: Shield,    color: '#2563eb' },
  { label: 'Doctor',      email: 'doctor@hms.com',     icon: UserCheck, color: '#059669' },
  { label: 'Patient',     email: 'patient@hms.com',    icon: User,      color: '#7c3aed' },
  { label: 'Pharmacist',  email: 'pharmacist@hms.com', icon: Pill,      color: '#d97706' },
];

export default function Login() {
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const [isSignUp, setIsSignUp] = useState(false);
  
  // Login fields
  const [email, setEmail]       = useState('admin@hms.com');
  const [password, setPassword] = useState('admin123');

  // Register fields
  const [regName, setRegName]         = useState('');
  const [regEmail, setRegEmail]       = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole]         = useState('patient');
  const [regPhone, setRegPhone]       = useState('');

  const [error, setError]       = useState('');
  const [success, setSuccess]   = useState('');
  const [loading, setLoading]   = useState(false);

  const parseError = (e) => {
    const serverMsg = e.response?.data?.message;
    const isHtml = typeof e.response?.data === 'string' && e.response.data.includes('<!DOCTYPE');
    if (isHtml) {
      return 'Server routing issue: API returned HTML. Check backend settings.';
    }
    if (e.code === 'ECONNABORTED' || e.message?.includes('timeout')) {
      return '⏳ Server is waking up (free tier cold start). Please wait 30 seconds and try again.';
    }
    if (e.message === 'Network Error' || !e.response) {
      return '🔴 Cannot reach server. It may be starting up — wait 30 seconds and try again.';
    }
    return serverMsg || e.message || 'Authentication error. Please check your credentials.';
  };

  const doLogin = async (em, pw) => {
    setError(''); setSuccess(''); setLoading(true);
    try {
      await login(em, pw);
      navigate('/');
    } catch (e) {
      setError(parseError(e));
    } finally { setLoading(false); }
  };

  const doRegister = async (e) => {
    e.preventDefault();
    setError(''); setSuccess(''); setLoading(true);
    try {
      await register(regName, regEmail, regPassword, regRole, regPhone);
      setSuccess('Account created successfully! Redirecting...');
      setTimeout(() => navigate('/'), 1000);
    } catch (err) {
      setError(parseError(err));
    } finally { setLoading(false); }
  };

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
    }}>
      <div style={{ width: '100%', maxWidth: 440 }}>

        {/* Logo Branding */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16, background: 'var(--primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px', boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)'
          }}>
            <HeartPulse size={30} color="#ffffff" />
          </div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.03em' }}>CarePulse Portal</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-3)', marginTop: 4 }}>Next-Gen Enterprise Hospital Management System</p>
        </div>

        {/* Sign In / Sign Up Mode Switcher Tabs */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4,
          background: 'var(--border)', padding: 4, borderRadius: 12, marginBottom: 16
        }}>
          <button
            onClick={() => { setIsSignUp(false); setError(''); setSuccess(''); }}
            style={{
              padding: '10px 0', border: 'none', borderRadius: 8, fontSize: '0.875rem', fontWeight: 700,
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              background: !isSignUp ? 'var(--card-bg, #ffffff)' : 'transparent',
              color: !isSignUp ? 'var(--primary)' : 'var(--text-3)',
              boxShadow: !isSignUp ? '0 2px 6px rgba(0,0,0,0.08)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            <LogIn size={16} /> Sign In
          </button>
          <button
            onClick={() => { setIsSignUp(true); setError(''); setSuccess(''); }}
            style={{
              padding: '10px 0', border: 'none', borderRadius: 8, fontSize: '0.875rem', fontWeight: 700,
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              background: isSignUp ? 'var(--card-bg, #ffffff)' : 'transparent',
              color: isSignUp ? 'var(--primary)' : 'var(--text-3)',
              boxShadow: isSignUp ? '0 2px 6px rgba(0,0,0,0.08)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            <UserPlus size={16} /> Create Account
          </button>
        </div>

        {/* Form Card */}
        <div className="card" style={{ padding: '28px 32px', boxShadow: 'var(--shadow-md)' }}>

          {error && (
            <div style={{
              background: 'var(--red-bg)', border: '1px solid var(--red-border)',
              borderRadius: 8, padding: '10px 14px', marginBottom: 20,
              fontSize: '0.825rem', color: 'var(--red)', fontWeight: 500
            }}>
              {error}
            </div>
          )}

          {success && (
            <div style={{
              background: '#ecfdf5', border: '1px solid #a7f3d0',
              borderRadius: 8, padding: '10px 14px', marginBottom: 20,
              fontSize: '0.825rem', color: '#047857', fontWeight: 500
            }}>
              {success}
            </div>
          )}

          {/* SIGN IN FORM */}
          {!isSignUp ? (
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
                style={{ width: '100%', justifyContent: 'center', padding: '11px 0', fontSize: '0.9rem', marginTop: 4 }}
              >
                {loading ? 'Signing in…' : 'Sign In'}
              </button>
            </form>
          ) : (
            /* SIGN UP FORM */
            <form onSubmit={doRegister} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label className="label">Full Name *</label>
                <input className="input" type="text" value={regName} onChange={e => setRegName(e.target.value)} required placeholder="Dr. Alex Morgan" />
              </div>
              <div>
                <label className="label">Email Address *</label>
                <input className="input" type="email" value={regEmail} onChange={e => setRegEmail(e.target.value)} required placeholder="alex@hms.com" />
              </div>
              <div>
                <label className="label">Password *</label>
                <input className="input" type="password" value={regPassword} onChange={e => setRegPassword(e.target.value)} required placeholder="Create secure password" minLength={4} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label className="label">Role *</label>
                  <select className="input" value={regRole} onChange={e => setRegRole(e.target.value)}>
                    <option value="patient">Patient</option>
                    <option value="doctor">Doctor</option>
                    <option value="admin">Admin</option>
                    <option value="pharmacist">Pharmacist</option>
                    <option value="receptionist">Receptionist</option>
                    <option value="nurse">Nurse</option>
                  </select>
                </div>
                <div>
                  <label className="label">Phone Number</label>
                  <input className="input" type="text" value={regPhone} onChange={e => setRegPhone(e.target.value)} placeholder="+1 (555) 000-1122" />
                </div>
              </div>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
                style={{ width: '100%', justifyContent: 'center', padding: '11px 0', fontSize: '0.9rem', marginTop: 6 }}
              >
                {loading ? 'Creating Account…' : 'Create Account & Sign In'}
              </button>
            </form>
          )}

          {/* Quick Demo Logins (Only shown on Sign In tab) */}
          {!isSignUp && (
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
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
