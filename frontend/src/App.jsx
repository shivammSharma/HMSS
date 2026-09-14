import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import DoctorsPage from './pages/DoctorsPage';
import PatientsPage from './pages/PatientsPage';
import OpdIpdPage from './pages/OpdIpdPage';
import AppointmentsPage from './pages/AppointmentsPage';
import BedsPage from './pages/BedsPage';
import PrescriptionsPage from './pages/PrescriptionsPage';
import PharmacyPage from './pages/PharmacyPage';
import LabsPage from './pages/LabsPage';
import BloodBankPage from './pages/BloodBankPage';
import AmbulancesPage from './pages/AmbulancesPage';
import ReportsPage from './pages/ReportsPage';
import PayrollPage from './pages/PayrollPage';
import BillingPage from './pages/BillingPage';
import ReceptionPage from './pages/ReceptionPage';
import NoticeBoardPage from './pages/NoticeBoardPage';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.9rem', color: 'var(--text-3)' }}>
          <div style={{ width: '22px', height: '22px', border: '2.5px solid var(--border)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          <span style={{ fontWeight: 500 }}>Loading CarePulse Portal...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      <Sidebar />
      <div style={{ marginLeft: 250, flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        {children}
      </div>
    </div>
  );
};

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/doctors" element={<ProtectedRoute><DoctorsPage /></ProtectedRoute>} />
      <Route path="/patients" element={<ProtectedRoute><PatientsPage /></ProtectedRoute>} />
      <Route path="/opd-ipd" element={<ProtectedRoute><OpdIpdPage /></ProtectedRoute>} />
      <Route path="/appointments" element={<ProtectedRoute><AppointmentsPage /></ProtectedRoute>} />
      <Route path="/beds" element={<ProtectedRoute><BedsPage /></ProtectedRoute>} />
      <Route path="/prescriptions" element={<ProtectedRoute><PrescriptionsPage /></ProtectedRoute>} />
      <Route path="/pharmacy" element={<ProtectedRoute><PharmacyPage /></ProtectedRoute>} />
      <Route path="/labs" element={<ProtectedRoute><LabsPage /></ProtectedRoute>} />
      <Route path="/blood-bank" element={<ProtectedRoute><BloodBankPage /></ProtectedRoute>} />
      <Route path="/ambulances" element={<ProtectedRoute><AmbulancesPage /></ProtectedRoute>} />
      <Route path="/reports" element={<ProtectedRoute><ReportsPage /></ProtectedRoute>} />
      <Route path="/payroll" element={<ProtectedRoute><PayrollPage /></ProtectedRoute>} />
      <Route path="/billing" element={<ProtectedRoute><BillingPage /></ProtectedRoute>} />
      <Route path="/reception" element={<ProtectedRoute><ReceptionPage /></ProtectedRoute>} />
      <Route path="/notices" element={<ProtectedRoute><NoticeBoardPage /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
