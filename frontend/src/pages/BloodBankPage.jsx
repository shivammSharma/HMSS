import React, { useEffect, useState } from 'react';
import API from '../services/api';
import Header from '../components/Header';
import Modal from '../components/Modal';
import { Droplet, Plus } from 'lucide-react';

const BloodBankPage = () => {
  const [bank, setBank] = useState([]);
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    donorName: 'Michael Brown',
    age: 29,
    gender: 'Male',
    bloodGroup: 'O+',
    phone: '+1 (555) 019-4400'
  });

  const fetchData = async () => {
    try {
      const res = await API.get('/blood-bank');
      setBank(res.data.bank || []);
      setDonors(res.data.donors || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateDonor = async (e) => {
    e.preventDefault();
    try {
      await API.post('/blood-donors', formData);
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      alert('Error registering blood donor');
    }
  };

  return (
    <>
      <Header title="Blood Bank & Donor Registry" />

      <main style={{ padding: '24px 32px', flex: 1, display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* Blood Stock Cards Grid */}
        <div>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-2)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Droplet size={18} color="var(--red)" />
            Available Blood Stock Units
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 14 }}>
            {bank.map(b => (
              <div key={b._id} className="card card-hover" style={{ textAlign: 'center', padding: '16px 12px' }}>
                <span className="badge badge-red" style={{ fontSize: '1.1rem', fontWeight: 800, padding: '4px 12px' }}>
                  {b.bloodGroup}
                </span>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text)', marginTop: 8 }}>
                  {b.remBags} <span style={{ fontSize: '0.8rem', color: 'var(--text-3)', fontWeight: 600 }}>Bags</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Donors Table */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border)' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text)' }}>Registered Blood Donors</h3>
            <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">
              <Plus size={16} /> Register Donor
            </button>
          </div>

          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-3)' }}>Loading donor database...</div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Donor Name</th>
                    <th>Age / Gender</th>
                    <th>Blood Group</th>
                    <th>Contact Phone</th>
                    <th>Last Donation Date</th>
                  </tr>
                </thead>
                <tbody>
                  {donors.map(d => (
                    <tr key={d._id}>
                      <td style={{ fontWeight: 700 }}>{d.donorName}</td>
                      <td style={{ color: 'var(--text-2)' }}>{d.age} yrs • {d.gender}</td>
                      <td><span className="badge badge-red">{d.bloodGroup}</span></td>
                      <td style={{ color: 'var(--text-2)' }}>{d.phone}</td>
                      <td style={{ color: 'var(--text-3)' }}>{d.lastDonationDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Add Donor Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Register Blood Donor">
        <form onSubmit={handleCreateDonor} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label className="label">Donor Full Name</label>
            <input type="text" required value={formData.donorName} onChange={e => setFormData({...formData, donorName: e.target.value})} className="input" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
            <div>
              <label className="label">Age</label>
              <input type="number" required value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} className="input" />
            </div>
            <div>
              <label className="label">Gender</label>
              <select value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})} className="input">
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div>
              <label className="label">Blood Group</label>
              <select value={formData.bloodGroup} onChange={e => setFormData({...formData, bloodGroup: e.target.value})} className="input">
                <option value="A+">A+</option>
                <option value="O+">O+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
              </select>
            </div>
          </div>
          <div>
            <label className="label">Phone Number</label>
            <input type="text" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="input" />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">Cancel</button>
            <button type="submit" className="btn btn-primary">Save Donor</button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default BloodBankPage;
