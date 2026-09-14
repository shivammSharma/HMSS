import React, { useEffect, useState } from 'react';
import API from '../services/api';
import Header from '../components/Header';
import StatCard from '../components/StatCard';
import { Users, UserCheck, Calendar, Bed, DollarSign, Activity, AlertTriangle, Plus, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API.get('/dashboard/stats');
        setStats(res.data);
      } catch (err) {
        console.error('Failed to load stats', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const totalBeds = stats?.totalBeds || 1;
  const occupiedBeds = stats?.occupiedBeds || 0;
  const availableBeds = stats?.availableBeds || 0;
  const occPercent = Math.round((occupiedBeds / totalBeds) * 100);

  return (
    <>
      <Header title="Hospital Overview" />

      <main style={{ padding: '24px 32px', flex: 1, display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* KPI Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
          <StatCard
            title="Total Patients"
            value={loading ? '...' : stats?.totalPatients}
            subtext="Registered patients"
            trend="+12% this month"
            icon={Users}
            color="blue"
          />
          <StatCard
            title="Active Doctors"
            value={loading ? '...' : stats?.totalDoctors}
            subtext="On-duty medical staff"
            trend="100% Active"
            icon={UserCheck}
            color="purple"
          />
          <StatCard
            title="Appointments"
            value={loading ? '...' : stats?.totalAppointments}
            subtext={`${stats?.pendingAppointments || 0} pending confirmation`}
            trend="+8 Today"
            icon={Calendar}
            color="green"
          />
          <StatCard
            title="Hospital Revenue"
            value={loading ? '...' : `$${(stats?.totalRevenue || 0).toLocaleString()}`}
            subtext="Total billed revenue"
            trend="+18.4%"
            icon={DollarSign}
            color="yellow"
          />
        </div>

        {/* Middle Section: Bed Occupancy & Quick Actions */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 20 }}>
          
          {/* Bed Occupancy Card */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--purple-bg)', border: '1px solid var(--purple-border)', color: 'var(--purple)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Bed size={20} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text)' }}>Bed Occupancy</h3>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-3)' }}>Live IPD Wards Status</p>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/beds')}
                  className="btn btn-ghost"
                  style={{ fontSize: '0.8rem', color: 'var(--primary)', padding: '4px 8px' }}
                >
                  View Grid <ArrowRight size={14} />
                </button>
              </div>

              <div style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem', marginBottom: 8 }}>
                  <span style={{ color: 'var(--text-2)' }}>Occupied: <strong style={{ color: 'var(--text)' }}>{occupiedBeds}</strong></span>
                  <span style={{ color: 'var(--green)', fontWeight: 600 }}>Available: {availableBeds}</span>
                </div>
                {/* Progress bar */}
                <div style={{ height: 8, background: 'var(--border)', borderRadius: 4, overflow: 'hidden', display: 'flex' }}>
                  <div style={{ width: `${occPercent}%`, background: 'var(--purple)', transition: 'width 0.3s' }} />
                  <div style={{ width: `${100 - occPercent}%`, background: 'var(--green)', transition: 'width 0.3s' }} />
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, paddingTop: 14, borderTop: '1px solid var(--border)' }}>
              <div style={{ padding: '10px 12px', background: 'var(--bg)', borderRadius: 8, textAlign: 'center', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-3)', fontWeight: 600 }}>ICU Free</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--purple)', marginTop: 2 }}>1 / 2</div>
              </div>
              <div style={{ padding: '10px 12px', background: 'var(--bg)', borderRadius: 8, textAlign: 'center', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-3)', fontWeight: 600 }}>General Free</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--green)', marginTop: 2 }}>2 / 2</div>
              </div>
            </div>
          </div>

          {/* Quick Actions Panel */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Activity size={18} color="var(--primary)" />
                  Clinical Shortcuts
                </h3>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-3)' }}>Fast actions</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <button
                  onClick={() => navigate('/appointments')}
                  className="card card-hover"
                  style={{ padding: '14px', textAlign: 'left', background: 'var(--bg)', cursor: 'pointer', border: '1px solid var(--border)' }}
                >
                  <Calendar size={20} color="var(--primary)" style={{ marginBottom: 6 }} />
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text)' }}>Book Appointment</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-3)' }}>OPD consultation</div>
                </button>

                <button
                  onClick={() => navigate('/patients')}
                  className="card card-hover"
                  style={{ padding: '14px', textAlign: 'left', background: 'var(--bg)', cursor: 'pointer', border: '1px solid var(--border)' }}
                >
                  <Users size={20} color="var(--green)" style={{ marginBottom: 6 }} />
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text)' }}>Register Patient</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-3)' }}>Add profile</div>
                </button>

                <button
                  onClick={() => navigate('/prescriptions')}
                  className="card card-hover"
                  style={{ padding: '14px', textAlign: 'left', background: 'var(--bg)', cursor: 'pointer', border: '1px solid var(--border)' }}
                >
                  <Plus size={20} color="var(--purple)" style={{ marginBottom: 6 }} />
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text)' }}>New Prescription</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-3)' }}>Generate Rx</div>
                </button>

                <button
                  onClick={() => navigate('/billing')}
                  className="card card-hover"
                  style={{ padding: '14px', textAlign: 'left', background: 'var(--bg)', cursor: 'pointer', border: '1px solid var(--border)' }}
                >
                  <DollarSign size={20} color="var(--yellow)" style={{ marginBottom: 6 }} />
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text)' }}>Create Invoice</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-3)' }}>Patient billing</div>
                </button>
              </div>
            </div>

            {stats?.lowStockMedicines > 0 && (
              <div style={{ marginTop: 16, padding: '10px 14px', background: 'var(--yellow-bg)', border: '1px solid var(--yellow-border)', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.8rem', color: 'var(--yellow)' }}>
                <AlertTriangle size={16} style={{ flexShrink: 0 }} />
                <span style={{ flex: 1 }}>
                  <strong>Pharmacy Alert:</strong> {stats.lowStockMedicines} medicine item(s) running low on stock.
                </span>
                <button
                  onClick={() => navigate('/pharmacy')}
                  style={{ background: 'none', border: 'none', color: 'var(--yellow)', textDecoration: 'underline', cursor: 'pointer', fontWeight: 700 }}
                >
                  Check Stock
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Recent Appointments Card */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border)' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text)' }}>Recent Appointments</h3>
            <button
              onClick={() => navigate('/appointments')}
              className="btn btn-ghost"
              style={{ fontSize: '0.8rem', color: 'var(--primary)', padding: '4px 8px' }}
            >
              View All <ArrowRight size={14} />
            </button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Patient</th>
                  <th>Doctor</th>
                  <th>Department</th>
                  <th>Time Slot</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {stats?.recentAppointments?.length ? (
                  stats.recentAppointments.map((apt) => (
                    <tr key={apt._id}>
                      <td style={{ fontFamily: 'monospace', color: 'var(--primary)', fontWeight: 600 }}>{apt.appointmentId}</td>
                      <td style={{ fontWeight: 600, color: 'var(--text)' }}>{apt.patientName}</td>
                      <td style={{ color: 'var(--text-2)' }}>{apt.doctorName}</td>
                      <td style={{ color: 'var(--text-3)' }}>{apt.department}</td>
                      <td style={{ color: 'var(--text-3)' }}>{apt.timeSlot}</td>
                      <td>
                        <span className={`badge ${
                          apt.status === 'Confirmed' ? 'badge-green' :
                          apt.status === 'Pending' ? 'badge-yellow' : 'badge-gray'
                        }`}>
                          {apt.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-3)' }}>
                      No recent appointments found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </>
  );
};

export default Dashboard;
