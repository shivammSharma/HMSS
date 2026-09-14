import React, { useEffect, useState } from 'react';
import API from '../services/api';
import Header from '../components/Header';
import Modal from '../components/Modal';
import { Plus, Mail, Phone, Calendar, Stethoscope } from 'lucide-react';

const DoctorsPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterDept, setFilterDept] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: 'Cardiology',
    specialization: '',
    qualification: 'MD',
    fee: 700,
    phone: ''
  });

  const fetchDoctors = async () => {
    try {
      const res = await API.get('/doctors');
      setDoctors(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleCreateDoctor = async (e) => {
    e.preventDefault();
    try {
      await API.post('/doctors', formData);
      setIsModalOpen(false);
      setFormData({ name: '', email: '', department: 'Cardiology', specialization: '', qualification: 'MD', fee: 700, phone: '' });
      fetchDoctors();
    } catch (err) {
      alert(err.response?.data?.message || 'Error adding doctor');
    }
  };

  const departments = ['All', 'Cardiology', 'Neurology', 'Pediatrics', 'Orthopedics'];
  const filteredDoctors = filterDept === 'All' ? doctors : doctors.filter(d => d.department === filterDept);

  return (
    <>
      <Header title="Doctors & Medical Staff" />

      <main style={{ padding: '24px 32px', flex: 1, display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* Top Action & Filter Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {departments.map((dept) => (
              <button
                key={dept}
                onClick={() => setFilterDept(dept)}
                className={`btn ${filterDept === dept ? 'btn-primary' : 'btn-secondary'}`}
                style={{ fontSize: '0.8rem', padding: '6px 14px' }}
              >
                {dept}
              </button>
            ))}
          </div>

          <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">
            <Plus size={16} /> Add Doctor
          </button>
        </div>

        {/* Doctors Grid */}
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-3)' }}>Loading doctor directory...</div>
        ) : filteredDoctors.length === 0 ? (
          <div className="card" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-3)' }}>
            No doctors found for this department.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
            {filteredDoctors.map((doc) => (
              <div key={doc._id} className="card card-hover" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--primary-subtle)', border: '1px solid var(--primary-border)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Stethoscope size={22} />
                      </div>
                      <div>
                        <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text)' }}>{doc.name}</h3>
                        <p style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600 }}>{doc.specialization}</p>
                      </div>
                    </div>
                    <span className="badge badge-green">{doc.status || 'Active'}</span>
                  </div>

                  <div style={{ background: 'var(--bg)', padding: '12px 14px', borderRadius: 8, border: '1px solid var(--border)', marginBottom: 14, fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-2)' }}>
                      <Mail size={14} style={{ color: 'var(--text-4)' }} />
                      <span>{doc.email}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-2)' }}>
                      <Phone size={14} style={{ color: 'var(--text-4)' }} />
                      <span>{doc.phone || '+1 (555) 000-0000'}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-2)' }}>
                      <Calendar size={14} style={{ color: 'var(--text-4)' }} />
                      <span>{doc.availableDays?.join(', ') || 'Mon-Fri'}</span>
                    </div>
                  </div>
                </div>

                <div style={{ paddingTop: 12, borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-3)' }}>Consultation Fee</span>
                    <p style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--green)' }}>${doc.fee}</p>
                  </div>
                  <span className="badge badge-blue">{doc.department}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Add Doctor Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Register New Doctor">
        <form onSubmit={handleCreateDoctor} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label className="label">Full Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input"
              placeholder="Dr. John Smith"
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
                placeholder="doctor@hms.com"
              />
            </div>
            <div>
              <label className="label">Phone Number</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="input"
                placeholder="+1 555-0199"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div>
              <label className="label">Department</label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="input"
              >
                <option value="Cardiology">Cardiology</option>
                <option value="Neurology">Neurology</option>
                <option value="Pediatrics">Pediatrics</option>
                <option value="Orthopedics">Orthopedics</option>
              </select>
            </div>
            <div>
              <label className="label">Consultation Fee ($)</label>
              <input
                type="number"
                required
                value={formData.fee}
                onChange={(e) => setFormData({ ...formData, fee: e.target.value })}
                className="input"
              />
            </div>
          </div>

          <div>
            <label className="label">Specialization</label>
            <input
              type="text"
              required
              value={formData.specialization}
              onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
              className="input"
              placeholder="e.g. Interventional Cardiology"
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Doctor Profile
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default DoctorsPage;
