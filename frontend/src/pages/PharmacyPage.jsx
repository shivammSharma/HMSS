import React, { useEffect, useState } from 'react';
import API from '../services/api';
import Header from '../components/Header';
import Modal from '../components/Modal';
import { Pill, Plus } from 'lucide-react';

const PharmacyPage = () => {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    category: 'General',
    brand: 'Generic',
    price: 25,
    quantity: 150,
    expiryDate: '2027-12-31'
  });

  const fetchMedicines = async () => {
    try {
      const res = await API.get('/medicines');
      setMedicines(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedicines();
  }, []);

  const handleCreateMedicine = async (e) => {
    e.preventDefault();
    try {
      await API.post('/medicines', formData);
      setIsModalOpen(false);
      setFormData({ name: '', category: 'General', brand: 'Generic', price: 25, quantity: 150, expiryDate: '2027-12-31' });
      fetchMedicines();
    } catch (err) {
      alert('Error adding medicine');
    }
  };

  return (
    <>
      <Header title="Pharmacy Inventory" />

      <main style={{ padding: '24px 32px', flex: 1, display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text)' }}>Medicine Stock Catalog</h2>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-3)' }}>{medicines.length} pharmacy items in stock</p>
          </div>

          <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">
            <Plus size={16} /> Add Stock Item
          </button>
        </div>

        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-3)' }}>Loading pharmacy inventory...</div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Medicine Name</th>
                    <th>Category</th>
                    <th>Brand</th>
                    <th>Unit Price</th>
                    <th>Stock Available</th>
                    <th>Expiry Date</th>
                  </tr>
                </thead>
                <tbody>
                  {medicines.length > 0 ? (
                    medicines.map((med) => (
                      <tr key={med._id}>
                        <td style={{ fontFamily: 'monospace', color: 'var(--primary)', fontWeight: 700 }}>{med.medicineId}</td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{
                              width: 32, height: 32, borderRadius: 8, background: 'var(--yellow-bg)',
                              border: '1px solid var(--yellow-border)', color: 'var(--yellow)',
                              display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                              <Pill size={16} />
                            </div>
                            <span style={{ fontWeight: 700, color: 'var(--text)' }}>{med.name}</span>
                          </div>
                        </td>
                        <td style={{ color: 'var(--text-2)' }}>{med.category}</td>
                        <td style={{ color: 'var(--text-3)' }}>{med.brand}</td>
                        <td style={{ fontWeight: 800, color: 'var(--green)' }}>${med.price}</td>
                        <td>
                          <span className={`badge ${med.quantity < 50 ? 'badge-yellow' : 'badge-green'}`}>
                            {med.quantity} units {med.quantity < 50 && '(Low Stock)'}
                          </span>
                        </td>
                        <td style={{ color: 'var(--text-3)' }}>{med.expiryDate}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-3)' }}>
                        No pharmacy items registered yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Add Medicine Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Register Stock Item">
        <form onSubmit={handleCreateMedicine} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label className="label">Medicine Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input"
              placeholder="e.g. Paracetamol 650mg"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div>
              <label className="label">Category</label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="input"
                placeholder="Antibiotics, Analgesic, etc."
              />
            </div>
            <div>
              <label className="label">Brand / Manufacturer</label>
              <input
                type="text"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                className="input"
                placeholder="Pharma Brand"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
            <div>
              <label className="label">Price ($)</label>
              <input
                type="number"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="input"
              />
            </div>
            <div>
              <label className="label">Stock Quantity</label>
              <input
                type="number"
                required
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                className="input"
              />
            </div>
            <div>
              <label className="label">Expiry Date</label>
              <input
                type="date"
                required
                value={formData.expiryDate}
                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                className="input"
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Stock Item
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default PharmacyPage;
