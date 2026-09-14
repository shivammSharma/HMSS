import React, { useEffect, useState } from 'react';
import API from '../services/api';
import Header from '../components/Header';
import Modal from '../components/Modal';
import { BellRing, Calendar, Plus, Trash2, Users } from 'lucide-react';

const TARGET_ROLES = ['All Staff','Doctor','Nurse','Pharmacist','Receptionist','Lab Technician','Accountant','Administrator'];

const NoticeBoardPage = () => {
  const [notices, setNotices]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm]           = useState({ title: '', description: '', targetRole: 'All Staff' });
  const [saving, setSaving]       = useState(false);

  const fetchNotices = async () => {
    try { const res = await API.get('/notices'); setNotices(res.data); }
    catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchNotices(); }, []);

  const handleSubmit = async e => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await API.post('/notices', form);
      setNotices(prev => [res.data, ...prev]);
      setShowModal(false);
      setForm({ title: '', description: '', targetRole: 'All Staff' });
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  const handleDelete = async id => {
    if (!window.confirm('Delete this notice?')) return;
    try {
      await API.delete(`/notices/${id}`);
      setNotices(prev => prev.filter(n => n._id !== id));
    } catch (err) { console.error(err); }
  };

  const roleColors = {
    'All Staff': 'badge-blue', 'Doctor': 'badge-purple', 'Nurse': 'badge-blue',
    'Pharmacist': 'badge-yellow', 'Receptionist': 'badge-gray',
    'Lab Technician': 'badge-purple', 'Accountant': 'badge-green', 'Administrator': 'badge-red'
  };

  return (
    <>
      <Header title="Hospital Notice Board" subtitle="Official announcements, circulars, and administrative bulletins" />

      <main style={{ padding: '24px 32px', flex: 1, display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* Action Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text)' }}>System Announcements & Bulletins</h2>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-3)' }}>{notices.length} active notice{notices.length !== 1 ? 's' : ''}</p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={16} /> Post Notice
          </button>
        </div>

        {/* Notices Grid */}
        {loading ? (
          <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-3)' }}>Loading announcements...</div>
        ) : notices.length === 0 ? (
          <div style={{ padding: '64px', textAlign: 'center', color: 'var(--text-3)' }}>
            <BellRing size={40} style={{ marginBottom: 12, opacity: 0.3 }} />
            <p style={{ fontWeight: 600 }}>No notices posted yet.</p>
            <p style={{ fontSize: '0.82rem', marginTop: 4 }}>Click "Post Notice" to create your first announcement.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
            {notices.map(n => (
              <div key={n._id} className="card card-hover" style={{ display: 'flex', flexDirection: 'column', gap: 12, position: 'relative' }}>
                {/* Header row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span className={`badge ${roleColors[n.targetRole] || 'badge-blue'}`} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Users size={10} /> {n.targetRole}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-3)', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Calendar size={11} /> {n.date}
                    </span>
                    <button
                      onClick={() => handleDelete(n._id)}
                      style={{ padding: 4, background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-4)', borderRadius: 4, lineHeight: 0 }}
                      onMouseEnter={e => e.currentTarget.style.color = 'var(--red)'}
                      onMouseLeave={e => e.currentTarget.style.color = 'var(--text-4)'}
                      title="Delete notice"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
                {/* Notice icon accent */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--primary-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                    <BellRing size={16} color="var(--primary)" />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text)', marginBottom: 6, lineHeight: 1.3 }}>{n.title}</h3>
                    <p style={{ fontSize: '0.845rem', color: 'var(--text-2)', lineHeight: 1.55 }}>{n.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Post Notice Modal */}
      <Modal open={showModal} onClose={() => setShowModal(false)} title="Post New Notice">
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label className="label">Notice Title *</label>
            <input className="input" placeholder="e.g. Staff Meeting on Friday" required value={form.title}
              onChange={e => setForm(p => ({ ...p, title: e.target.value }))} />
          </div>
          <div>
            <label className="label">Target Audience</label>
            <select className="input" value={form.targetRole} onChange={e => setForm(p => ({ ...p, targetRole: e.target.value }))}>
              {TARGET_ROLES.map(r => <option key={r}>{r}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Description / Content *</label>
            <textarea className="input" rows={4} placeholder="Write the full announcement here..." required
              value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
              style={{ resize: 'vertical' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, paddingTop: 8 }}>
            <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Posting...' : 'Post Notice'}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default NoticeBoardPage;
