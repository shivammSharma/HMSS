import React, { useEffect, useState } from 'react';
import API from '../services/api';
import Header from '../components/Header';
import Modal from '../components/Modal';
import { Plus, Printer } from 'lucide-react';

const BillingPage = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewInvoice, setViewInvoice] = useState(null);

  const [formData, setFormData] = useState({
    patientName: 'John Doe',
    doctorName: 'Dr. Marcus Vance',
    items: [
      { description: 'OPD Consultation Fee', amount: 800 },
      { description: 'Diagnostic Test & Medication', amount: 450 }
    ],
    paidAmount: 1250
  });

  const fetchInvoices = async () => {
    try {
      const res = await API.get('/invoices');
      setInvoices(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const totalAmount = formData.items.reduce((sum, item) => sum + Number(item.amount || 0), 0);

  const handleCreateInvoice = async (e) => {
    e.preventDefault();
    try {
      await API.post('/invoices', {
        ...formData,
        totalAmount
      });
      setIsModalOpen(false);
      fetchInvoices();
    } catch (err) {
      alert('Error generating invoice');
    }
  };

  return (
    <>
      <div className="no-print">
        <Header title="Billing & Invoices" />
      </div>

      <main style={{ padding: '24px 32px', flex: 1, display: 'flex', flexDirection: 'column', gap: 24 }} className="no-print">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text)' }}>Invoices & Financial Statements</h2>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-3)' }}>{invoices.length} billing records</p>
          </div>

          <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">
            <Plus size={16} /> Generate Invoice
          </button>
        </div>

        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-3)' }}>Loading billing records...</div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Invoice #</th>
                    <th>Patient</th>
                    <th>Doctor / Staff</th>
                    <th>Total Billed</th>
                    <th>Paid Amount</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.length > 0 ? (
                    invoices.map((inv) => (
                      <tr key={inv._id}>
                        <td style={{ fontFamily: 'monospace', color: 'var(--primary)', fontWeight: 700 }}>{inv.invoiceId}</td>
                        <td style={{ fontWeight: 700, color: 'var(--text)' }}>{inv.patientName}</td>
                        <td style={{ color: 'var(--text-2)' }}>{inv.doctorName}</td>
                        <td style={{ fontWeight: 800, color: 'var(--text)' }}>${inv.totalAmount}</td>
                        <td style={{ fontWeight: 800, color: 'var(--green)' }}>${inv.paidAmount}</td>
                        <td>
                          <span className={`badge ${
                            inv.status === 'Paid' ? 'badge-green' :
                            inv.status === 'Partial' ? 'badge-yellow' : 'badge-red'
                          }`}>
                            {inv.status}
                          </span>
                        </td>
                        <td style={{ color: 'var(--text-3)' }}>{inv.date}</td>
                        <td style={{ textAlign: 'right' }}>
                          <button
                            onClick={() => setViewInvoice(inv)}
                            className="btn btn-secondary"
                            style={{ fontSize: '0.78rem', padding: '4px 10px' }}
                          >
                            Receipt
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-3)' }}>
                        No billing invoices created yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Generate Invoice Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Billing Invoice">
        <form onSubmit={handleCreateInvoice} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div>
              <label className="label">Patient Name</label>
              <input
                type="text"
                required
                value={formData.patientName}
                onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                className="input"
              />
            </div>
            <div>
              <label className="label">Doctor Name</label>
              <input
                type="text"
                required
                value={formData.doctorName}
                onChange={(e) => setFormData({ ...formData, doctorName: e.target.value })}
                className="input"
              />
            </div>
          </div>

          <div style={{ padding: 14, background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 8, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text)' }}>Itemized Charges</h4>
            {formData.items.map((item, idx) => (
              <div key={idx} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 8 }}>
                <input
                  type="text"
                  placeholder="Charge description"
                  value={item.description}
                  onChange={(e) => {
                    const updated = [...formData.items];
                    updated[idx].description = e.target.value;
                    setFormData({ ...formData, items: updated });
                  }}
                  className="input"
                  style={{ padding: '6px 10px', fontSize: '0.8rem' }}
                />
                <input
                  type="number"
                  placeholder="Amount ($)"
                  value={item.amount}
                  onChange={(e) => {
                    const updated = [...formData.items];
                    updated[idx].amount = e.target.value;
                    setFormData({ ...formData, items: updated });
                  }}
                  className="input"
                  style={{ padding: '6px 10px', fontSize: '0.8rem' }}
                />
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 8, borderTop: '1px solid var(--border)', fontWeight: 700, fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--text-2)' }}>Total Billable Amount:</span>
              <span style={{ color: 'var(--green)', fontSize: '1rem' }}>${totalAmount}</span>
            </div>
          </div>

          <div>
            <label className="label">Paid Amount ($)</label>
            <input
              type="number"
              required
              value={formData.paidAmount}
              onChange={(e) => setFormData({ ...formData, paidAmount: e.target.value })}
              className="input"
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Generate Bill
            </button>
          </div>
        </form>
      </Modal>

      {/* Printable Invoice Receipt Modal */}
      {viewInvoice && (
        <Modal isOpen={!!viewInvoice} onClose={() => setViewInvoice(null)} title="Invoice Statement">
          <div style={{ padding: 20, background: '#ffffff', color: '#0f172a', borderRadius: 8, fontFamily: 'sans-serif', fontSize: '0.85rem' }}>
            {/* Hospital Branding */}
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: 14, marginBottom: 16 }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1e1b4b' }}>CarePulse HMS Billing</h2>
                <p style={{ color: '#64748b', fontSize: '0.78rem' }}>Official Hospital Payment Statement</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontFamily: 'monospace', fontWeight: 700, color: '#0f172a', fontSize: '0.9rem' }}>{viewInvoice.invoiceId}</p>
                <p style={{ color: '#64748b', fontSize: '0.75rem' }}>Date: {viewInvoice.date}</p>
              </div>
            </div>

            {/* Customer info */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
              <div>
                <p style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 600 }}>Billed To:</p>
                <p style={{ fontWeight: 700, color: '#0f172a' }}>{viewInvoice.patientName}</p>
              </div>
              <div>
                <p style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 600 }}>Attending Physician:</p>
                <p style={{ fontWeight: 700, color: '#0f172a' }}>{viewInvoice.doctorName}</p>
              </div>
            </div>

            {/* Items */}
            <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', fontSize: '0.8rem', marginBottom: 16 }}>
              <thead>
                <tr style={{ background: '#f1f5f9', borderBottom: '1px solid #cbd5e1', color: '#475569' }}>
                  <th style={{ padding: '8px 10px' }}>Description</th>
                  <th style={{ padding: '8px 10px', textAlign: 'right' }}>Amount ($)</th>
                </tr>
              </thead>
              <tbody>
                {viewInvoice.items?.map((item, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '8px 10px' }}>{item.description}</td>
                    <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 700 }}>${item.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, textAlign: 'right', fontWeight: 700, fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #e2e8f0', paddingTop: 8 }}>
                <span>Total Amount Billed:</span>
                <span>${viewInvoice.totalAmount}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#16a34a' }}>
                <span>Paid Amount:</span>
                <span>${viewInvoice.paidAmount}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#4338ca', fontWeight: 800, fontSize: '0.95rem', borderTop: '1px solid #cbd5e1', paddingTop: 6 }}>
                <span>Payment Status:</span>
                <span>{viewInvoice.status}</span>
              </div>
            </div>

            <div className="no-print" style={{ paddingTop: 16, display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={() => window.print()}
                className="btn btn-primary"
              >
                <Printer size={16} /> Print Receipt
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default BillingPage;
