import React, { useEffect, useState } from 'react';
import API from '../services/api';
import Header from '../components/Header';
import Modal from '../components/Modal';
import { Plus, Clock } from 'lucide-react';

const AppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    patientName: '',
    doctorName: '',
    department: 'Cardiology',
    date: new Date().toISOString().split('T')[0],
    timeSlot: '10:00 AM',
    problem: 'Routine Cardiac Checkup',
    fee: 800
  });

  const fetchData = async () => {
    try {
      const [aptRes, docRes, patRes] = await Promise.all([
        API.get('/appointments'),
        API.get('/doctors'),
        API.get('/patients')
      ]);
      setAppointments(aptRes.data);
      setDoctors(docRes.data);
      setPatients(patRes.data);
      if (docRes.data.length > 0) {
        setFormData(prev => ({ ...prev, doctorName: docRes.data[0].name, department: docRes.data[0].department }));
      }
      if (patRes.data.length > 0) {
        setFormData(prev => ({ ...prev, patientName: patRes.data[0].name }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateAppointment = async (e) => {
    e.preventDefault();
    try {
      await API.post('/appointments', formData);
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error booking appointment');
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await API.patch(`/appointments/${id}/status`, { status: newStatus });
      fetchData();
    } catch (err) {
      alert('Error updating status');
    }
  };

  return (
    <>
      <Header title="Appointments Schedule" />

      <main style={{ padding: '24px 32px', flex: 1, display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text)' }}>Appointments Roster</h2>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-3)' }}>{appointments.length} total scheduled consultations</p>
          </div>

          <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">
            <Plus size={16} /> Book Appointment
          </button>
        </div>

        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-3)' }}>Loading appointments...</div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Appt ID</th>
                    <th>Patient</th>
                    <th>Assigned Doctor</th>
                    <th>Date & Time</th>
                    <th>Reason / Problem</th>
                    <th>Fee</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.length > 0 ? (
                    appointments.map((apt) => (
                      <tr key={apt._id}>
                        <td style={{ fontFamily: 'monospace', color: 'var(--primary)', fontWeight: 700 }}>{apt.appointmentId}</td>
                        <td style={{ fontWeight: 700, color: 'var(--text)' }}>{apt.patientName}</td>
                        <td>
                          <div style={{ fontWeight: 600, color: 'var(--text)' }}>{apt.doctorName}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-3)' }}>{apt.department}</div>
                        </td>
                        <td style={{ color: 'var(--text-2)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <Clock size={14} style={{ color: 'var(--text-4)' }} />
                            <span>{apt.date} • {apt.timeSlot}</span>
                          </div>
                        </td>
                        <td style={{ color: 'var(--text-3)', maxWidth: 200, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {apt.problem}
                        </td>
                        <td style={{ fontWeight: 800, color: 'var(--green)' }}>${apt.fee}</td>
                        <td>
                          <span className={`badge ${
                            apt.status === 'Confirmed' ? 'badge-green' :
                            apt.status === 'Completed' ? 'badge-blue' :
                            apt.status === 'Pending' ? 'badge-yellow' : 'badge-red'
                          }`}>
                            {apt.status}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: 6 }}>
                            {apt.status === 'Pending' && (
                              <button
                                onClick={() => handleStatusChange(apt._id, 'Confirmed')}
                                className="btn btn-secondary"
                                style={{ fontSize: '0.75rem', padding: '4px 10px', color: 'var(--green)', borderColor: 'var(--green-border)' }}
                              >
                                Confirm
                              </button>
                            )}
                            {apt.status !== 'Completed' && (
                              <button
                                onClick={() => handleStatusChange(apt._id, 'Completed')}
                                className="btn btn-secondary"
                                style={{ fontSize: '0.75rem', padding: '4px 10px' }}
                              >
                                Complete
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-3)' }}>
                        No appointments booked yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Book Appointment Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Book OPD Appointment">
        <form onSubmit={handleCreateAppointment} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label className="label">Patient Name</label>
            <input
              type="text"
              required
              value={formData.patientName}
              onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
              className="input"
              placeholder="Patient Name"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div>
              <label className="label">Select Doctor</label>
              <select
                value={formData.doctorName}
                onChange={(e) => {
                  const selectedDoc = doctors.find(d => d.name === e.target.value);
                  setFormData({
                    ...formData,
                    doctorName: e.target.value,
                    department: selectedDoc ? selectedDoc.department : formData.department,
                    fee: selectedDoc ? selectedDoc.fee : formData.fee
                  });
                }}
                className="input"
              >
                {doctors.map(d => (
                  <option key={d._id} value={d.name}>{d.name} ({d.department})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">Department</label>
              <input
                type="text"
                readOnly
                value={formData.department}
                className="input"
                style={{ background: 'var(--bg)', opacity: 0.8, cursor: 'not-allowed' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div>
              <label className="label">Appointment Date</label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="input"
              />
            </div>
            <div>
              <label className="label">Time Slot</label>
              <select
                value={formData.timeSlot}
                onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
                className="input"
              >
                <option value="09:00 AM">09:00 AM</option>
                <option value="10:30 AM">10:30 AM</option>
                <option value="11:45 AM">11:45 AM</option>
                <option value="02:00 PM">02:00 PM</option>
                <option value="04:15 PM">04:15 PM</option>
              </select>
            </div>
          </div>

          <div>
            <label className="label">Problem / Symptoms</label>
            <input
              type="text"
              required
              value={formData.problem}
              onChange={(e) => setFormData({ ...formData, problem: e.target.value })}
              className="input"
              placeholder="e.g. Fever, Cough, Regular Followup"
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Confirm Booking
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default AppointmentsPage;
