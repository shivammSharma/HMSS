import React, { useEffect, useState } from 'react';
import API from '../services/api';
import Header from '../components/Header';
import Modal from '../components/Modal';
import { FileText, Plus, Trash2, Printer, Pill } from 'lucide-react';

const PrescriptionsPage = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewPrescription, setViewPrescription] = useState(null);

  const [formData, setFormData] = useState({
    patientName: 'John Doe',
    doctorName: 'Dr. Marcus Vance',
    diagnosis: 'Hypertension',
    advice: 'Drink 3L of water daily and limit salt intake.',
    medicines: [
      { name: 'Atorvastatin 20mg', dosage: '1 Tablet', frequency: 'Once daily (Night)', days: 30 }
    ]
  });

  const fetchPrescriptions = async () => {
    try {
      const res = await API.get('/prescriptions');
      setPrescriptions(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const handleAddMedicineRow = () => {
    setFormData(prev => ({
      ...prev,
      medicines: [...prev.medicines, { name: '', dosage: '1 Tablet', frequency: 'Twice daily', days: 7 }]
    }));
  };

  const handleRemoveMedicineRow = (index) => {
    setFormData(prev => ({
      ...prev,
      medicines: prev.medicines.filter((_, i) => i !== index)
    }));
  };

  const handleMedicineChange = (index, field, value) => {
    const updated = [...formData.medicines];
    updated[index][field] = value;
    setFormData({ ...formData, medicines: updated });
  };

  const handleCreatePrescription = async (e) => {
    e.preventDefault();
    try {
      await API.post('/prescriptions', formData);
      setIsModalOpen(false);
      fetchPrescriptions();
    } catch (err) {
      alert('Error saving prescription');
    }
  };

  return (
    <>
      <div className="no-print">
        <Header title="Prescriptions" />
      </div>

      <main style={{ padding: '24px 32px', flex: 1, display: 'flex', flexDirection: 'column', gap: 24 }} className="no-print">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text)' }}>Digital Prescriptions</h2>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-3)' }}>{prescriptions.length} prescriptions issued</p>
          </div>

          <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">
            <Plus size={16} /> Create Prescription
          </button>
        </div>

        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-3)' }}>Loading prescriptions...</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
            {prescriptions.map((rx) => (
              <div key={rx._id} className="card card-hover" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                  <div>
                    <span style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 700 }}>{rx.prescriptionId}</span>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text)', marginTop: 2 }}>{rx.patientName}</h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-3)' }}>{rx.doctorName}</p>
                  </div>
                  <button
                    onClick={() => setViewPrescription(rx)}
                    className="btn btn-secondary"
                    style={{ fontSize: '0.78rem', padding: '5px 10px' }}
                  >
                    <FileText size={14} /> View & Print
                  </button>
                </div>

                <div style={{ padding: '10px 12px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 8, fontSize: '0.825rem' }}>
                  <span style={{ color: 'var(--text-3)', fontSize: '0.75rem', fontWeight: 600 }}>Diagnosis:</span>
                  <p style={{ fontWeight: 700, color: 'var(--text)', marginTop: 2 }}>{rx.diagnosis}</p>
                </div>

                <div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-3)', marginBottom: 8, fontWeight: 700 }}>
                    Prescribed Medicines ({rx.medicines?.length || 0})
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {rx.medicines?.map((m, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem', padding: '8px 12px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 6 }}>
                        <span style={{ fontWeight: 700, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: 6 }}>
                          <Pill size={14} color="var(--purple)" />
                          {m.name}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-3)' }}>{m.dosage} • {m.frequency} ({m.days}d)</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Generate Prescription Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Clinical Prescription Builder (Rx)">
        <form onSubmit={handleCreatePrescription} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
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
              <label className="label">Attending Doctor</label>
              <input
                type="text"
                required
                value={formData.doctorName}
                onChange={(e) => setFormData({ ...formData, doctorName: e.target.value })}
                className="input"
              />
            </div>
          </div>

          <div>
            <label className="label">Clinical Diagnosis</label>
            <input
              type="text"
              required
              value={formData.diagnosis}
              onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
              className="input"
              placeholder="Primary Diagnosis"
            />
          </div>

          {/* Dynamic Medicines Rows */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <label className="label" style={{ marginBottom: 0 }}>Medicines & Dosage</label>
              <button
                type="button"
                onClick={handleAddMedicineRow}
                className="btn btn-secondary"
                style={{ fontSize: '0.75rem', padding: '4px 8px', color: 'var(--primary)' }}
              >
                <Plus size={14} /> Add Line
              </button>
            </div>

            {formData.medicines.map((med, idx) => (
              <div key={idx} style={{ display: 'grid', gridTemplateColumns: '3fr 2fr 2fr 1fr auto', gap: 8, alignItems: 'center', padding: 8, background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 8 }}>
                <input
                  type="text"
                  required
                  placeholder="Medicine Name"
                  value={med.name}
                  onChange={(e) => handleMedicineChange(idx, 'name', e.target.value)}
                  className="input"
                  style={{ padding: '6px 10px', fontSize: '0.8rem' }}
                />
                <input
                  type="text"
                  placeholder="Dosage"
                  value={med.dosage}
                  onChange={(e) => handleMedicineChange(idx, 'dosage', e.target.value)}
                  className="input"
                  style={{ padding: '6px 10px', fontSize: '0.8rem' }}
                />
                <input
                  type="text"
                  placeholder="Frequency"
                  value={med.frequency}
                  onChange={(e) => handleMedicineChange(idx, 'frequency', e.target.value)}
                  className="input"
                  style={{ padding: '6px 10px', fontSize: '0.8rem' }}
                />
                <input
                  type="number"
                  placeholder="Days"
                  value={med.days}
                  onChange={(e) => handleMedicineChange(idx, 'days', e.target.value)}
                  className="input"
                  style={{ padding: '6px 10px', fontSize: '0.8rem' }}
                />
                {formData.medicines.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveMedicineRow(idx)}
                    className="btn btn-ghost"
                    style={{ padding: 6, color: 'var(--red)' }}
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>

          <div>
            <label className="label">Dietary & Health Advice</label>
            <textarea
              rows={2}
              value={formData.advice}
              onChange={(e) => setFormData({ ...formData, advice: e.target.value })}
              className="input"
              style={{ fontFamily: 'inherit' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Issue Prescription
            </button>
          </div>
        </form>
      </Modal>

      {/* Printable Prescription Modal */}
      {viewPrescription && (
        <Modal isOpen={!!viewPrescription} onClose={() => setViewPrescription(null)} title="Prescription Receipt">
          <div style={{ padding: 20, background: '#ffffff', color: '#0f172a', borderRadius: 8, fontFamily: 'sans-serif', fontSize: '0.85rem' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: 14, marginBottom: 16 }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1e3a8a' }}>CarePulse Hospital</h2>
                <p style={{ color: '#64748b', fontSize: '0.78rem' }}>100 Healthcare Blvd, Medical District</p>
                <p style={{ color: '#64748b', fontSize: '0.78rem' }}>Ph: +1 (555) 019-2834</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '1.6rem', fontWeight: 800, color: '#1e3a8a', fontFamily: 'serif' }}>Rx</span>
                <p style={{ fontFamily: 'monospace', fontWeight: 700, color: '#334155', fontSize: '0.85rem' }}>{viewPrescription.prescriptionId}</p>
                <p style={{ color: '#64748b', fontSize: '0.75rem' }}>Date: {viewPrescription.date}</p>
              </div>
            </div>

            {/* Patient & Doctor details */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, padding: 12, background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, marginBottom: 16 }}>
              <div>
                <p style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 600 }}>Patient Name:</p>
                <p style={{ fontWeight: 700, color: '#0f172a' }}>{viewPrescription.patientName}</p>
              </div>
              <div>
                <p style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 600 }}>Attending Doctor:</p>
                <p style={{ fontWeight: 700, color: '#0f172a' }}>{viewPrescription.doctorName}</p>
              </div>
            </div>

            {/* Diagnosis */}
            <div style={{ marginBottom: 16 }}>
              <p style={{ fontWeight: 700, color: '#334155', fontSize: '0.8rem' }}>Diagnosis:</p>
              <p style={{ color: '#0f172a', fontWeight: 500 }}>{viewPrescription.diagnosis}</p>
            </div>

            {/* Medicines */}
            <div style={{ marginBottom: 16 }}>
              <p style={{ fontWeight: 700, color: '#334155', fontSize: '0.8rem', marginBottom: 8 }}>Rx Prescribed Medication:</p>
              <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                <thead>
                  <tr style={{ background: '#f1f5f9', borderBottom: '1px solid #cbd5e1', color: '#475569' }}>
                    <th style={{ padding: '8px 10px' }}>Medicine</th>
                    <th style={{ padding: '8px 10px' }}>Dosage</th>
                    <th style={{ padding: '8px 10px' }}>Frequency</th>
                    <th style={{ padding: '8px 10px' }}>Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {viewPrescription.medicines?.map((m, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '8px 10px', fontWeight: 700 }}>{m.name}</td>
                      <td style={{ padding: '8px 10px' }}>{m.dosage}</td>
                      <td style={{ padding: '8px 10px' }}>{m.frequency}</td>
                      <td style={{ padding: '8px 10px' }}>{m.days} days</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Doctor Signature */}
            <div style={{ paddingTop: 20, borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <div>
                <p style={{ fontWeight: 700, color: '#334155', fontSize: '0.8rem' }}>Doctor Advice:</p>
                <p style={{ color: '#475569', fontSize: '0.8rem' }}>{viewPrescription.advice}</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ width: 130, borderBottom: '1px solid #94a3b8', marginBottom: 6 }} />
                <p style={{ fontWeight: 700, color: '#334155', fontSize: '0.75rem' }}>Physician Signature</p>
              </div>
            </div>

            {/* Print Button */}
            <div className="no-print" style={{ paddingTop: 16, display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={() => window.print()}
                className="btn btn-primary"
              >
                <Printer size={16} /> Print Rx Statement
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default PrescriptionsPage;
