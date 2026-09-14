import React, { useEffect, useState } from 'react';
import API from '../services/api';
import Header from '../components/Header';
import Modal from '../components/Modal';
import { Bed, Plus } from 'lucide-react';

const BedsPage = () => {
  const [beds, setBeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBed, setSelectedBed] = useState(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isAddBedModalOpen, setIsAddBedModalOpen] = useState(false);

  const [patientNameInput, setPatientNameInput] = useState('');
  const [newBedForm, setNewBedForm] = useState({
    bedNumber: '',
    bedType: 'ICU',
    charge: 3500
  });

  const fetchBeds = async () => {
    try {
      const res = await API.get('/beds');
      setBeds(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBeds();
  }, []);

  const handleOpenAssignModal = (bed) => {
    setSelectedBed(bed);
    setPatientNameInput(bed.assignedPatient || '');
    setIsAssignModalOpen(true);
  };

  const handleSaveBedAssignment = async (e) => {
    e.preventDefault();
    try {
      await API.post('/beds/assign', {
        bedId: selectedBed._id,
        patientName: patientNameInput
      });
      setIsAssignModalOpen(false);
      fetchBeds();
    } catch (err) {
      alert('Error updating bed assignment');
    }
  };

  const handleCreateBed = async (e) => {
    e.preventDefault();
    try {
      await API.post('/beds', newBedForm);
      setIsAddBedModalOpen(false);
      setNewBedForm({ bedNumber: '', bedType: 'ICU', charge: 3500 });
      fetchBeds();
    } catch (err) {
      alert(err.response?.data?.message || 'Error creating bed');
    }
  };

  const bedTypes = ['ICU', 'VIP', 'General', 'Pediatric'];

  return (
    <>
      <Header title="Bed & Ward Management" />

      <main style={{ padding: '24px 32px', flex: 1, display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', color: 'var(--text-2)', fontWeight: 600 }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--green)' }} /> Available
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', color: 'var(--text-2)', fontWeight: 600 }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--purple)' }} /> Occupied
            </span>
          </div>

          <button onClick={() => setIsAddBedModalOpen(true)} className="btn btn-primary">
            <Plus size={16} /> Add New Bed
          </button>
        </div>

        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-3)' }}>Loading bed inventory...</div>
        ) : (
          bedTypes.map((type) => {
            const categoryBeds = beds.filter(b => b.bedType === type);
            if (categoryBeds.length === 0) return null;

            return (
              <div key={type} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-2)', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Bed size={18} color="var(--primary)" />
                  {type} Wards & Rooms
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
                  {categoryBeds.map((b) => (
                    <div
                      key={b._id}
                      onClick={() => handleOpenAssignModal(b)}
                      className="card card-hover"
                      style={{
                        cursor: 'pointer',
                        borderColor: b.isAvailable ? 'var(--border)' : 'var(--purple-border)',
                        background: b.isAvailable ? 'var(--surface)' : 'var(--purple-bg)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
                          <div>
                            <span style={{ fontFamily: 'monospace', fontSize: '0.78rem', color: 'var(--text-3)', fontWeight: 700 }}>#{b.bedNumber}</span>
                            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text)' }}>{b.bedType} Bed</h4>
                          </div>
                          <span className={`badge ${b.isAvailable ? 'badge-green' : 'badge-purple'}`}>
                            {b.isAvailable ? 'AVAILABLE' : 'OCCUPIED'}
                          </span>
                        </div>

                        <div style={{ margin: '12px 0', fontSize: '0.825rem' }}>
                          {b.isAvailable ? (
                            <p style={{ color: 'var(--text-3)', fontStyle: 'italic' }}>Ready for patient assignment</p>
                          ) : (
                            <div>
                              <p style={{ color: 'var(--text-3)', fontSize: '0.75rem' }}>Assigned Patient:</p>
                              <p style={{ fontWeight: 700, color: 'var(--text)', fontSize: '0.9rem' }}>{b.assignedPatient}</p>
                              {b.assignedDate && <p style={{ fontSize: '0.75rem', color: 'var(--text-3)', marginTop: 2 }}>Admitted: {b.assignedDate}</p>}
                            </div>
                          )}
                        </div>
                      </div>

                      <div style={{ paddingTop: 10, borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                        <span style={{ color: 'var(--text-3)' }}>Daily Charge:</span>
                        <span style={{ fontWeight: 800, color: 'var(--green)' }}>${b.charge}/day</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </main>

      {/* Assign / Discharge Bed Modal */}
      <Modal isOpen={isAssignModalOpen} onClose={() => setIsAssignModalOpen(false)} title={`Manage Bed #${selectedBed?.bedNumber}`}>
        <form onSubmit={handleSaveBedAssignment} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ padding: '12px 14px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-3)' }}>Bed Details</p>
              <p style={{ fontWeight: 700, color: 'var(--text)', fontSize: '0.85rem' }}>{selectedBed?.bedType} Ward • ${selectedBed?.charge}/day</p>
            </div>
            <span className={`badge ${selectedBed?.isAvailable ? 'badge-green' : 'badge-purple'}`}>
              {selectedBed?.isAvailable ? 'Vacant' : 'Occupied'}
            </span>
          </div>

          <div>
            <label className="label">Assigned Patient Name</label>
            <input
              type="text"
              value={patientNameInput}
              onChange={(e) => setPatientNameInput(e.target.value)}
              className="input"
              placeholder="Leave blank to Discharge patient & vacate bed"
            />
            <p style={{ fontSize: '0.75rem', color: 'var(--text-3)', marginTop: 4 }}>
              Clear patient name to discharge and make bed available.
            </p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
            <button type="button" onClick={() => setIsAssignModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Update Status
            </button>
          </div>
        </form>
      </Modal>

      {/* Add Bed Modal */}
      <Modal isOpen={isAddBedModalOpen} onClose={() => setIsAddBedModalOpen(false)} title="Add Hospital Bed">
        <form onSubmit={handleCreateBed} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label className="label">Bed / Room Number</label>
            <input
              type="text"
              required
              value={newBedForm.bedNumber}
              onChange={(e) => setNewBedForm({ ...newBedForm, bedNumber: e.target.value })}
              className="input"
              placeholder="e.g. ICU-05 or VIP-204"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div>
              <label className="label">Ward Category</label>
              <select
                value={newBedForm.bedType}
                onChange={(e) => setNewBedForm({ ...newBedForm, bedType: e.target.value })}
                className="input"
              >
                <option value="ICU">ICU Ward</option>
                <option value="VIP">VIP Suite</option>
                <option value="General">General Ward</option>
                <option value="Pediatric">Pediatric Ward</option>
              </select>
            </div>
            <div>
              <label className="label">Daily Charge ($)</label>
              <input
                type="number"
                required
                value={newBedForm.charge}
                onChange={(e) => setNewBedForm({ ...newBedForm, charge: e.target.value })}
                className="input"
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
            <button type="button" onClick={() => setIsAddBedModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Add Bed
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default BedsPage;
