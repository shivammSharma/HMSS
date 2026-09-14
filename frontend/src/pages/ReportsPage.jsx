import React, { useEffect, useState } from 'react';
import API from '../services/api';
import Header from '../components/Header';
import Modal from '../components/Modal';
import { FileSpreadsheet, Plus } from 'lucide-react';

const ReportsPage = () => {
  const [births, setBirths] = useState([]);
  const [deaths, setDeaths] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('birth');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    childName: 'Baby Boy Smith',
    gender: 'Male',
    weight: '3.4 kg',
    motherName: 'Alice Smith',
    doctorName: 'Dr. Sophia Martinez'
  });

  const fetchReports = async () => {
    try {
      const res = await API.get('/reports');
      setBirths(res.data.birth || []);
      setDeaths(res.data.death || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleCreateBirth = async (e) => {
    e.preventDefault();
    try {
      await API.post('/reports/birth', formData);
      setIsModalOpen(false);
      fetchReports();
    } catch (err) {
      alert('Error registering birth certificate');
    }
  };

  return (
    <>
      <Header title="Birth & Death Registers" />

      <main style={{ padding: '24px 32px', flex: 1, display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => setActiveTab('birth')}
              className={`btn ${activeTab === 'birth' ? 'btn-primary' : 'btn-secondary'}`}
            >
              👶 Birth Certificates ({births.length})
            </button>
            <button
              onClick={() => setActiveTab('death')}
              className={`btn ${activeTab === 'death' ? 'btn-primary' : 'btn-secondary'}`}
            >
              📄 Death Certificates ({deaths.length})
            </button>
          </div>

          {activeTab === 'birth' && (
            <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">
              <Plus size={16} /> Issue Birth Certificate
            </button>
          )}
        </div>

        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-3)' }}>Loading registers...</div>
          ) : activeTab === 'birth' ? (
            <div style={{ overflowX: 'auto' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Case #</th>
                    <th>Child Name</th>
                    <th>Gender</th>
                    <th>Birth Weight</th>
                    <th>Date of Birth</th>
                    <th>Mother Name</th>
                    <th>Attending Doctor</th>
                  </tr>
                </thead>
                <tbody>
                  {births.map(b => (
                    <tr key={b._id}>
                      <td style={{ fontFamily: 'monospace', color: 'var(--primary)', fontWeight: 700 }}>{b.caseId}</td>
                      <td style={{ fontWeight: 700 }}>{b.childName}</td>
                      <td><span className="badge badge-blue">{b.gender}</span></td>
                      <td style={{ color: 'var(--text-2)' }}>{b.weight}</td>
                      <td style={{ color: 'var(--text-3)' }}>{b.date}</td>
                      <td style={{ color: 'var(--text-2)' }}>{b.motherName}</td>
                      <td style={{ color: 'var(--text-3)' }}>{b.doctorName}</td>
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
                    <th>Case #</th>
                    <th>Deceased Patient</th>
                    <th>Attending Doctor</th>
                    <th>Date of Death</th>
                    <th>Primary Cause of Death</th>
                  </tr>
                </thead>
                <tbody>
                  {deaths.map(d => (
                    <tr key={d._id}>
                      <td style={{ fontFamily: 'monospace', color: 'var(--text-3)', fontWeight: 700 }}>{d.caseId}</td>
                      <td style={{ fontWeight: 700 }}>{d.patientName}</td>
                      <td style={{ color: 'var(--text-2)' }}>{d.doctorName}</td>
                      <td style={{ color: 'var(--text-3)' }}>{d.date}</td>
                      <td style={{ color: 'var(--red)', fontWeight: 600 }}>{d.causeOfDeath}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Issue Birth Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Issue Birth Certificate">
        <form onSubmit={handleCreateBirth} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label className="label">Child Full Name</label>
            <input type="text" required value={formData.childName} onChange={e => setFormData({...formData, childName: e.target.value})} className="input" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div>
              <label className="label">Gender</label>
              <select value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})} className="input">
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div>
              <label className="label">Birth Weight</label>
              <input type="text" required value={formData.weight} onChange={e => setFormData({...formData, weight: e.target.value})} className="input" />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div>
              <label className="label">Mother Name</label>
              <input type="text" required value={formData.motherName} onChange={e => setFormData({...formData, motherName: e.target.value})} className="input" />
            </div>
            <div>
              <label className="label">Doctor Name</label>
              <input type="text" required value={formData.doctorName} onChange={e => setFormData({...formData, doctorName: e.target.value})} className="input" />
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">Cancel</button>
            <button type="submit" className="btn btn-primary">Issue Record</button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default ReportsPage;
