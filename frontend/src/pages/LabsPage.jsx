import React, { useEffect, useState } from 'react';
import API from '../services/api';
import Header from '../components/Header';
import Modal from '../components/Modal';
import { TestTube, Activity, Plus } from 'lucide-react';

const LabsPage = () => {
  const [pathology, setPathology] = useState([]);
  const [radiology, setRadiology] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pathology');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    testName: 'Complete Blood Count (CBC)',
    shortName: 'CBC',
    testType: 'Blood Test',
    charge: 1200
  });

  const fetchLabs = async () => {
    try {
      const res = await API.get('/labs');
      setPathology(res.data.pathology || []);
      setRadiology(res.data.radiology || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLabs();
  }, []);

  const handleCreateTest = async (e) => {
    e.preventDefault();
    try {
      await API.post('/pathology', formData);
      setIsModalOpen(false);
      fetchLabs();
    } catch (err) {
      alert('Error creating lab test');
    }
  };

  return (
    <>
      <Header title="Pathology & Radiology Diagnostic Labs" />

      <main style={{ padding: '24px 32px', flex: 1, display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => setActiveTab('pathology')}
              className={`btn ${activeTab === 'pathology' ? 'btn-primary' : 'btn-secondary'}`}
            >
              <TestTube size={16} /> Pathology Tests ({pathology.length})
            </button>
            <button
              onClick={() => setActiveTab('radiology')}
              className={`btn ${activeTab === 'radiology' ? 'btn-primary' : 'btn-secondary'}`}
            >
              <Activity size={16} /> Radiology Imaging ({radiology.length})
            </button>
          </div>

          <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">
            <Plus size={16} /> Add Test Catalog Item
          </button>
        </div>

        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-3)' }}>Loading lab catalogs...</div>
          ) : activeTab === 'pathology' ? (
            <div style={{ overflowX: 'auto' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Test Name</th>
                    <th>Short Code</th>
                    <th>Test Type</th>
                    <th>Category</th>
                    <th>Standard Charge</th>
                  </tr>
                </thead>
                <tbody>
                  {pathology.map(t => (
                    <tr key={t._id}>
                      <td style={{ fontWeight: 700 }}>{t.testName}</td>
                      <td><span className="badge badge-purple">{t.shortName}</span></td>
                      <td style={{ color: 'var(--text-2)' }}>{t.testType}</td>
                      <td style={{ color: 'var(--text-3)' }}>{t.categoryName}</td>
                      <td style={{ fontWeight: 800, color: 'var(--green)' }}>${t.charge}</td>
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
                    <th>Imaging Test</th>
                    <th>Code</th>
                    <th>Modality</th>
                    <th>Category</th>
                    <th>Standard Charge</th>
                  </tr>
                </thead>
                <tbody>
                  {radiology.map(r => (
                    <tr key={r._id}>
                      <td style={{ fontWeight: 700 }}>{r.testName}</td>
                      <td><span className="badge badge-blue">{r.shortName}</span></td>
                      <td style={{ color: 'var(--text-2)' }}>{r.testType}</td>
                      <td style={{ color: 'var(--text-3)' }}>{r.categoryName}</td>
                      <td style={{ fontWeight: 800, color: 'var(--green)' }}>${r.charge}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Add Test Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Diagnostic Test Catalog Item">
        <form onSubmit={handleCreateTest} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label className="label">Test Full Name</label>
            <input type="text" required value={formData.testName} onChange={e => setFormData({...formData, testName: e.target.value})} className="input" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div>
              <label className="label">Short Name / Code</label>
              <input type="text" required value={formData.shortName} onChange={e => setFormData({...formData, shortName: e.target.value})} className="input" />
            </div>
            <div>
              <label className="label">Test Charge ($)</label>
              <input type="number" required value={formData.charge} onChange={e => setFormData({...formData, charge: e.target.value})} className="input" />
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">Cancel</button>
            <button type="submit" className="btn btn-primary">Save Test</button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default LabsPage;
