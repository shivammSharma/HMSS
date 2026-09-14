import React, { useEffect, useState } from 'react';
import API from '../services/api';
import Header from '../components/Header';
import Modal from '../components/Modal';
import { Plus, Phone, Droplet } from 'lucide-react';

const PatientsPage = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    bloodGroup: 'O+',
    age: 30,
    gender: 'Male',
    address: '',
    condition: 'Stable'
  });

  const fetchPatients = async () => {
    try {
      const res = await API.get('/patients');
      setPatients(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleCreatePatient = async (e) => {
    e.preventDefault();
    try {
      await API.post('/patients', formData);
      setIsModalOpen(false);
      setFormData({ name: '', email: '', phone: '', bloodGroup: 'O+', age: 30, gender: 'Male', address: '', condition: 'Stable' });
      fetchPatients();
    } catch (err) {
      alert(err.response?.data?.message || 'Error registering patient');
    }
  };

  return (
    <>
      <Header title="Patient Management" />

      <main style={{ padding: '24px 32px', flex: 1, display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text)' }}>Registered Patients</h2>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-3)' }}>{patients.length} active patient records</p>
          </div>

          <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">
            <Plus size={16} /> Register Patient
          </button>
        </div>

        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-3)' }}>Loading patient directory...</div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Patient Name</th>
                    <th>Contact</th>
                    <th>Age / Gender</th>
                    <th>Blood Group</th>
                    <th>Address</th>
                    <th>Condition</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.length > 0 ? (
                    patients.map((pat) => (
                      <tr key={pat._id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div style={{
                              width: 36, height: 36, borderRadius: 10, background: 'var(--primary-subtle)',
                              border: '1px solid var(--primary-border)', color: 'var(--primary)',
                              display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.85rem'
                            }}>
                              {pat.name.charAt(0)}
                            </div>
                            <div>
                              <div style={{ fontWeight: 700, color: 'var(--text)' }}>{pat.name}</div>
                              <div style={{ fontSize: '0.75rem', color: 'var(--text-3)' }}>{pat.email}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-2)' }}>
                            <Phone size={14} style={{ color: 'var(--text-4)' }} />
                            <span>{pat.phone}</span>
                          </div>
                        </td>
                        <td style={{ color: 'var(--text-2)', fontWeight: 500 }}>
                          {pat.age} yrs • {pat.gender}
                        </td>
                        <td>
                          <span className="badge badge-red" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                            <Droplet size={11} /> {pat.bloodGroup}
                          </span>
                        </td>
                        <td style={{ color: 'var(--text-3)', maxWidth: 220, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {pat.address || 'N/A'}
                        </td>
                        <td>
                          <span className={`badge ${
                            pat.condition?.includes('Critical') ? 'badge-red' :
                            pat.condition?.includes('Observation') ? 'badge-yellow' : 'badge-green'
                          }`}>
                            {pat.condition || 'Stable'}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-3)' }}>
                        No patients registered yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Register Patient Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Register New Patient">
        <form onSubmit={handleCreatePatient} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label className="label">Full Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input"
              placeholder="John Doe"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div>
              <label className="label">Email Address</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="input"
                placeholder="patient@hms.com"
              />
            </div>
            <div>
              <label className="label">Phone Number</label>
              <input
                type="text"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="input"
                placeholder="+1 555-0144"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
            <div>
              <label className="label">Age</label>
              <input
                type="number"
                required
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                className="input"
              />
            </div>
            <div>
              <label className="label">Gender</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="input"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="label">Blood Group</label>
              <select
                value={formData.bloodGroup}
                onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                className="input"
              >
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>
            </div>
          </div>

          <div>
            <label className="label">Condition Status</label>
            <input
              type="text"
              value={formData.condition}
              onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
              className="input"
              placeholder="e.g. Stable / Under Observation"
            />
          </div>

          <div>
            <label className="label">Residential Address</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="input"
              placeholder="Full Street Address"
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Patient Profile
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default PatientsPage;
