import React, { useEffect, useState } from 'react';
import API from '../services/api';
import Header from '../components/Header';
import Modal from '../components/Modal';
import { DollarSign, Plus, TrendingUp } from 'lucide-react';

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const ROLES  = ['Doctor','Nurse','Pharmacist','Receptionist','Lab Technician','Accountant','Administrator','Security','Housekeeping'];

const PayrollPage = () => {
  const [payroll, setPayroll]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm]           = useState({
    staffName: '', role: 'Nurse', month: 'September',
    year: new Date().getFullYear(), netSalary: '', status: 'Paid'
  });
  const [saving, setSaving] = useState(false);

  const fetchPayroll = async () => {
    try { const res = await API.get('/payroll'); setPayroll(res.data); }
    catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchPayroll(); }, []);

  const handleSubmit = async e => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await API.post('/payroll', form);
      setPayroll(prev => [res.data, ...prev]);
      setShowModal(false);
      setForm({ staffName: '', role: 'Nurse', month: 'September', year: new Date().getFullYear(), netSalary: '', status: 'Paid' });
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  const totalPaid   = payroll.filter(p => p.status === 'Paid').reduce((s, p) => s + (p.netSalary || 0), 0);
  const totalUnpaid = payroll.filter(p => p.status === 'Unpaid').reduce((s, p) => s + (p.netSalary || 0), 0);

  return (
    <>
      <Header title="HR & Payroll Management" subtitle="Staff salary records and monthly payroll processing" />

      <main style={{ padding: '24px 32px', flex: 1, display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* Stats Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {[
            { label: 'Total Employees', value: payroll.length, color: 'var(--primary)', bg: 'var(--primary-subtle)' },
            { label: 'Total Paid', value: `₹${totalPaid.toLocaleString()}`, color: 'var(--green)', bg: 'var(--green-bg)' },
            { label: 'Pending Dues', value: `₹${totalUnpaid.toLocaleString()}`, color: 'var(--yellow)', bg: 'var(--yellow-bg)' },
          ].map(s => (
            <div key={s.label} className="card" style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px' }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <DollarSign size={20} color={s.color} />
              </div>
              <div>
                <div style={{ fontSize: '1.35rem', fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-3)', marginTop: 4 }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Action Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text)' }}>Monthly Payroll Records</h2>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-3)' }}>{payroll.length} salary records</p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={16} /> Add Payroll Entry
          </button>
        </div>

        {/* Table */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          {loading ? (
            <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-3)' }}>Loading payroll records...</div>
          ) : payroll.length === 0 ? (
            <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-3)' }}>
              <TrendingUp size={36} style={{ marginBottom: 12, opacity: 0.3 }} />
              <p style={{ fontWeight: 600 }}>No payroll records yet.</p>
              <p style={{ fontSize: '0.82rem', marginTop: 4 }}>Click "Add Payroll Entry" to get started.</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Payroll ID</th>
                    <th>Staff Name</th>
                    <th>Role</th>
                    <th>Period</th>
                    <th>Net Salary</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {payroll.map(p => (
                    <tr key={p._id}>
                      <td style={{ fontFamily: 'monospace', color: 'var(--primary)', fontWeight: 700 }}>{p.payrollId}</td>
                      <td style={{ fontWeight: 600, color: 'var(--text)' }}>{p.staffName}</td>
                      <td><span className="badge badge-purple">{p.role}</span></td>
                      <td style={{ color: 'var(--text-2)' }}>{p.month} {p.year}</td>
                      <td style={{ fontWeight: 800, color: 'var(--green)' }}>₹{(p.netSalary || 0).toLocaleString()}</td>
                      <td>
                        <span className={`badge ${p.status === 'Paid' ? 'badge-green' : 'badge-yellow'}`}>
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Add Payroll Modal */}
      <Modal open={showModal} onClose={() => setShowModal(false)} title="Add Payroll Entry">
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div>
              <label className="label">Staff Name *</label>
              <input className="input" placeholder="Full name" required value={form.staffName}
                onChange={e => setForm(p => ({ ...p, staffName: e.target.value }))} />
            </div>
            <div>
              <label className="label">Role *</label>
              <select className="input" value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))}>
                {ROLES.map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Month</label>
              <select className="input" value={form.month} onChange={e => setForm(p => ({ ...p, month: e.target.value }))}>
                {MONTHS.map(m => <option key={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Year</label>
              <input className="input" type="number" min="2020" max="2030" value={form.year}
                onChange={e => setForm(p => ({ ...p, year: e.target.value }))} />
            </div>
            <div>
              <label className="label">Net Salary (₹) *</label>
              <input className="input" type="number" placeholder="e.g. 45000" required value={form.netSalary}
                onChange={e => setForm(p => ({ ...p, netSalary: e.target.value }))} />
            </div>
            <div>
              <label className="label">Payment Status</label>
              <select className="input" value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}>
                <option>Paid</option>
                <option>Unpaid</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, paddingTop: 8 }}>
            <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving...' : 'Add Entry'}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default PayrollPage;
