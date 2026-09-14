import React, { useEffect, useState } from 'react';
import API from '../services/api';
import Header from '../components/Header';
import Modal from '../components/Modal';
import { Truck, Plus, Phone } from 'lucide-react';

const AmbulancesPage = () => {
  const [ambulances, setAmbulances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    vehicleNumber: 'AMB-903',
    vehicleModel: 'Ford Transit ACLS',
    driverName: 'Robert Johnson',
    driverContact: '+1 (555) 019-7700',
    vehicleType: 'Advanced Life Support'
  });

  const fetchAmbulances = async () => {
    try {
      const res = await API.get('/ambulances');
      setAmbulances(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAmbulances();
  }, []);

  const handleCreateAmbulance = async (e) => {
    e.preventDefault();
    try {
      await API.post('/ambulances', formData);
      setIsModalOpen(false);
      fetchAmbulances();
    } catch (err) {
      alert('Error creating ambulance vehicle');
    }
  };

  return (
    <>
      <Header title="Ambulance Fleet & Emergency Dispatch" />

      <main style={{ padding: '24px 32px', flex: 1, display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text)' }}>Ambulance Fleet Roster</h2>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-3)' }}>{ambulances.length} vehicles registered in fleet</p>
          </div>

          <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">
            <Plus size={16} /> Add Vehicle
          </button>
        </div>

        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-3)' }}>Loading fleet status...</div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Vehicle #</th>
                    <th>Model</th>
                    <th>Support Category</th>
                    <th>Assigned Driver</th>
                    <th>Driver Contact</th>
                    <th>Dispatch Status</th>
                  </tr>
                </thead>
                <tbody>
                  {ambulances.map(a => (
                    <tr key={a._id}>
                      <td style={{ fontFamily: 'monospace', color: 'var(--primary)', fontWeight: 700 }}>{a.vehicleNumber}</td>
                      <td style={{ fontWeight: 700 }}>{a.vehicleModel}</td>
                      <td style={{ color: 'var(--text-2)' }}>{a.vehicleType}</td>
                      <td style={{ color: 'var(--text-2)' }}>{a.driverName}</td>
                      <td style={{ color: 'var(--text-3)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <Phone size={14} style={{ color: 'var(--text-4)' }} />
                          <span>{a.driverContact}</span>
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${a.status === 'Available' ? 'badge-green' : 'badge-yellow'}`}>
                          {a.status}
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

      {/* Add Ambulance Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Register Emergency Ambulance">
        <form onSubmit={handleCreateAmbulance} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div>
              <label className="label">Vehicle Number</label>
              <input type="text" required value={formData.vehicleNumber} onChange={e => setFormData({...formData, vehicleNumber: e.target.value})} className="input" />
            </div>
            <div>
              <label className="label">Vehicle Model</label>
              <input type="text" required value={formData.vehicleModel} onChange={e => setFormData({...formData, vehicleModel: e.target.value})} className="input" />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div>
              <label className="label">Driver Name</label>
              <input type="text" required value={formData.driverName} onChange={e => setFormData({...formData, driverName: e.target.value})} className="input" />
            </div>
            <div>
              <label className="label">Driver Contact</label>
              <input type="text" required value={formData.driverContact} onChange={e => setFormData({...formData, driverContact: e.target.value})} className="input" />
            </div>
          </div>
          <div>
            <label className="label">Support Type</label>
            <select value={formData.vehicleType} onChange={e => setFormData({...formData, vehicleType: e.target.value})} className="input">
              <option value="Advanced Life Support">Advanced Life Support (ACLS)</option>
              <option value="Basic Life Support">Basic Life Support (BLS)</option>
              <option value="Patient Transport">Patient Transport Service</option>
            </select>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">Cancel</button>
            <button type="submit" className="btn btn-primary">Save Vehicle</button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default AmbulancesPage;
