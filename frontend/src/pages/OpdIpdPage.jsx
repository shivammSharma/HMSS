import React, { useEffect, useState } from 'react';
import API from '../services/api';
import Header from '../components/Header';
import Modal from '../components/Modal';
import { Stethoscope, Bed, Plus } from 'lucide-react';

const OpdIpdPage = () => {
  const [opdList, setOpdList] = useState([]);
  const [ipdList, setIpdList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('opd');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    patientName: 'John Doe',
    doctorName: 'Dr. Marcus Vance',
    opdCharge: 800,
    paymentMode: 'Cash',
    notes: 'OPD General Checkup'
  });

  const fetchData = async () => {
    try {
      const [opdRes, ipdRes] = await Promise.all([
        API.get('/opd'),
        API.get('/ipd')
      ]);
      setOpdList(opdRes.data);
      setIpdList(ipdRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateOpd = async (e) => {
    e.preventDefault();
    try {
      await API.post('/opd', formData);
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      alert('Error registering OPD checkup');
    }
  };

  return (
    <>
      <Header title="OPD & IPD Departments" />

      <main style={{ padding: '24px 32px', flex: 1, display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => setActiveTab('opd')}
              className={`btn ${activeTab === 'opd' ? 'btn-primary' : 'btn-secondary'}`}
            >
              <Stethoscope size={16} /> OPD Outpatients ({opdList.length})
            </button>
            <button
              onClick={() => setActiveTab('ipd')}
              className={`btn ${activeTab === 'ipd' ? 'btn-primary' : 'btn-secondary'}`}
            >
              <Bed size={16} /> IPD Inpatients ({ipdList.length})
            </button>
          </div>

          {activeTab === 'opd' && (
            <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">
              <Plus size={16} /> Register OPD Checkup
            </button>
          )}
        </div>

        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-3)' }}>Loading records...</div>
          ) : activeTab === 'opd' ? (
            <div style={{ overflowX: 'auto' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>OPD #</th>
                    <th>Patient</th>
                    <th>Attending Doctor</th>
                    <th>Date</th>
                    <th>Case ID</th>
                    <th>Charge</th>
                    <th>Payment</th>
                  </tr>
                </thead>
                <tbody>
                  {opdList.map(opd => (
                    <tr key={opd._id}>
                      <td style={{ fontFamily: 'monospace', color: 'var(--primary)', fontWeight: 700 }}>{opd.opdNumber}</td>
                      <td style={{ fontWeight: 700 }}>{opd.patientName}</td>
                      <td style={{ color: 'var(--text-2)' }}>{opd.doctorName}</td>
                      <td style={{ color: 'var(--text-3)' }}>{opd.appointmentDate}</td>
                      <td style={{ fontFamily: 'monospace', color: 'var(--text-3)' }}>{opd.caseId}</td>
                      <td style={{ fontWeight: 800, color: 'var(--green)' }}>${opd.opdCharge}</td>
                      <td><span className="badge badge-blue">{opd.paymentMode}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>IPD #</th>
                    <th>Patient</th>
                    <th>Attending Doctor</th>
                    <th>Bed #</th>
                    <th>Admission Date</th>
                    <th>Vitals (BP / Weight)</th>
                    <th>Symptoms</th>
                  </tr>
                </thead>
                <tbody>
                  {ipdList.map(ipd => (
                    <tr key={ipd._id}>
                      <td style={{ fontFamily: 'monospace', color: 'var(--purple)', fontWeight: 700 }}>{ipd.ipdNumber}</td>
                      <td style={{ fontWeight: 700 }}>{ipd.patientName}</td>
                      <td style={{ color: 'var(--text-2)' }}>{ipd.doctorName}</td>
                      <td><span className="badge badge-purple">{ipd.bedNumber}</span></td>
                      <td style={{ color: 'var(--text-3)' }}>{ipd.admissionDate}</td>
                      <td style={{ fontSize: '0.8rem', color: 'var(--text-2)' }}>{ipd.bp} • {ipd.weight}</td>
                      <td style={{ color: 'var(--text-3)' }}>{ipd.symptoms}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* OPD Register Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Register OPD Outpatient Consultation">
        <form onSubmit={handleCreateOpd} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label className="label">Patient Name</label>
            <input type="text" required value={formData.patientName} onChange={e => setFormData({...formData, patientName: e.target.value})} className="input" />
          </div>
          <div>
            <label className="label">Attending Doctor</label>
            <input type="text" required value={formData.doctorName} onChange={e => setFormData({...formData, doctorName: e.target.value})} className="input" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div>
              <label className="label">OPD Fee ($)</label>
              <input type="number" required value={formData.opdCharge} onChange={e => setFormData({...formData, opdCharge: e.target.value})} className="input" />
            </div>
            <div>
              <label className="label">Payment Method</label>
              <select value={formData.paymentMode} onChange={e => setFormData({...formData, paymentMode: e.target.value})} className="input">
                <option value="Cash">Cash</option>
                <option value="Card">Card</option>
                <option value="Insurance">Insurance</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">Cancel</button>
            <button type="submit" className="btn btn-primary">Save Checkup</button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default OpdIpdPage;
