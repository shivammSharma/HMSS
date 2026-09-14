import React, { useEffect, useState } from 'react';
import API from '../services/api';
import Header from '../components/Header';
import Modal from '../components/Modal';
import { PhoneCall, PhoneIncoming, PhoneOutgoing, Plus } from 'lucide-react';

const ReceptionPage = () => {
  const [calls, setCalls]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm]           = useState({ callType: 'Incoming', name: '', phone: '', notes: '' });
  const [saving, setSaving]       = useState(false);
  const [filter, setFilter]       = useState('All');

  const fetchCalls = async () => {
    try { const res = await API.get('/reception-calls'); setCalls(res.data); }
    catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchCalls(); }, []);

  const handleSubmit = async e => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await API.post('/reception-calls', form);
      setCalls(prev => [res.data, ...prev]);
      setShowModal(false);
      setForm({ callType: 'Incoming', name: '', phone: '', notes: '' });
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  const filtered = filter === 'All' ? calls : calls.filter(c => c.callType === filter);
  const incoming = calls.filter(c => c.callType === 'Incoming').length;
  const outgoing = calls.filter(c => c.callType === 'Outgoing').length;

  return (
    <>
      <Header title="Front Office & Reception" subtitle="Manage reception calls, enquiries, and visitor logs" />

      <main style={{ padding: '24px 32px', flex: 1, display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* Stat Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {[
            { label: 'Total Calls Logged', value: calls.length, icon: PhoneCall, color: 'var(--primary)', bg: 'var(--primary-subtle)' },
            { label: 'Incoming Calls', value: incoming, icon: PhoneIncoming, color: 'var(--green)', bg: 'var(--green-bg)' },
            { label: 'Outgoing Calls', value: outgoing, icon: PhoneOutgoing, color: 'var(--purple)', bg: 'var(--purple-bg)' },
          ].map(s => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="card" style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px' }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={20} color={s.color} />
                </div>
                <div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-3)', marginTop: 4 }}>{s.label}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: 8 }}>
            {['All', 'Incoming', 'Outgoing'].map(f => (
              <button
                key={f}
                className={`btn ${filter === f ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '6px 14px', fontSize: '0.82rem' }}
                onClick={() => setFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={16} /> Log Call
          </button>
        </div>

        {/* Table */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          {loading ? (
            <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-3)' }}>Loading call logs...</div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-3)' }}>
              <PhoneCall size={36} style={{ marginBottom: 12, opacity: 0.3 }} />
              <p style={{ fontWeight: 600 }}>No calls logged yet.</p>
              <p style={{ fontSize: '0.82rem', marginTop: 4 }}>Click "Log Call" to add a reception entry.</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Call Type</th>
                    <th>Caller Name</th>
                    <th>Phone Number</th>
                    <th>Date</th>
                    <th>Notes / Enquiry</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(c => (
                    <tr key={c._id}>
                      <td>
                        <span className={`badge ${c.callType === 'Incoming' ? 'badge-blue' : 'badge-green'}`}>
                          {c.callType === 'Incoming' ? '↙ ' : '↗ '}{c.callType}
                        </span>
                      </td>
                      <td style={{ fontWeight: 600, color: 'var(--text)' }}>{c.name}</td>
                      <td style={{ color: 'var(--text-2)', fontFamily: 'monospace' }}>{c.phone}</td>
                      <td style={{ color: 'var(--text-3)', fontSize: '0.82rem' }}>{c.date}</td>
                      <td style={{ color: 'var(--text-2)', maxWidth: 260 }}>{c.notes || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Log Call Modal */}
      <Modal open={showModal} onClose={() => setShowModal(false)} title="Log Reception Call">
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div>
              <label className="label">Call Type</label>
              <select className="input" value={form.callType} onChange={e => setForm(p => ({ ...p, callType: e.target.value }))}>
                <option>Incoming</option>
                <option>Outgoing</option>
              </select>
            </div>
            <div>
              <label className="label">Caller / Contact Name *</label>
              <input className="input" placeholder="Full name" required value={form.name}
                onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
            </div>
            <div>
              <label className="label">Phone Number *</label>
              <input className="input" placeholder="+1 (555) 000-0000" required value={form.phone}
                onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} />
            </div>
          </div>
          <div>
            <label className="label">Notes / Enquiry Purpose</label>
            <textarea className="input" rows={3} placeholder="Brief description of call purpose..."
              value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
              style={{ resize: 'vertical' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, paddingTop: 8 }}>
            <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving...' : 'Log Call'}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default ReceptionPage;
