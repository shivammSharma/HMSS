import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, UserCheck, Users, Calendar, Bed,
  FileText, Pill, CreditCard, HeartPulse, LogOut,
  Stethoscope, Activity, TestTube, Droplet, Truck,
  FileSpreadsheet, DollarSign, PhoneCall, BellRing
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { name: 'Dashboard',         path: '/',              icon: LayoutDashboard, roles: ['admin','doctor','patient','pharmacist','receptionist','nurse','labtechnician','accountant'] },
  { name: 'Appointments',      path: '/appointments',  icon: Calendar,        roles: ['admin','doctor','patient','receptionist'] },
  { name: 'Doctors & Staff',   path: '/doctors',       icon: UserCheck,       roles: ['admin','doctor','patient','receptionist'] },
  { name: 'Patients',          path: '/patients',      icon: Users,           roles: ['admin','doctor','receptionist','nurse'] },
  { name: 'OPD / IPD Wards',   path: '/opd-ipd',       icon: Stethoscope,     roles: ['admin','doctor','nurse','receptionist'] },
  { name: 'Bed Management',    path: '/beds',          icon: Bed,             roles: ['admin','doctor','receptionist','nurse'] },
  { name: 'Prescriptions',     path: '/prescriptions', icon: FileText,        roles: ['admin','doctor','patient','pharmacist'] },
  { name: 'Pharmacy',          path: '/pharmacy',      icon: Pill,            roles: ['admin','pharmacist','doctor'] },
  { name: 'Pathology & Labs',  path: '/labs',          icon: TestTube,        roles: ['admin','doctor','labtechnician'] },
  { name: 'Blood Bank',        path: '/blood-bank',    icon: Droplet,         roles: ['admin','doctor','labtechnician'] },
  { name: 'Ambulance Dispatch', path: '/ambulances',   icon: Truck,           roles: ['admin','receptionist','doctor'] },
  { name: 'Birth & Death Reg.', path: '/reports',      icon: FileSpreadsheet, roles: ['admin','doctor','receptionist'] },
  { name: 'HR & Payroll',      path: '/payroll',       icon: DollarSign,      roles: ['admin','accountant'] },
  { name: 'Billing & Invoices', path: '/billing',      icon: CreditCard,      roles: ['admin','patient','receptionist','pharmacist','accountant'] },
  { name: 'Front Reception',   path: '/reception',     icon: PhoneCall,       roles: ['admin','receptionist'] },
  { name: 'Notice Board',      path: '/notices',       icon: BellRing,        roles: ['admin','doctor','patient','pharmacist','receptionist','nurse','labtechnician','accountant'] },
];

const roleBadges = {
  admin: 'badge-blue', doctor: 'badge-purple',
  patient: 'badge-green', pharmacist: 'badge-yellow', receptionist: 'badge-gray',
  nurse: 'badge-blue', labtechnician: 'badge-purple', accountant: 'badge-green'
};

const Sidebar = () => {
  const { user, logout } = useAuth();
  const allowed = navItems.filter(i => i.roles.includes(user?.role || 'admin'));

  return (
    <aside style={{
      position: 'fixed', left: 0, top: 0, bottom: 0, width: 250,
      background: 'var(--sidebar-bg)', borderRight: '1px solid var(--sidebar-border)',
      display: 'flex', flexDirection: 'column', zIndex: 40
    }}>
      {/* Brand Header */}
      <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid var(--sidebar-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: 38, height: 38, borderRadius: 10, background: 'var(--primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 2px 4px rgba(37, 99, 235, 0.3)'
          }}>
            <HeartPulse size={20} color="#ffffff" />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#ffffff', letterSpacing: '-0.02em', lineHeight: 1.2 }}>CarePulse</div>
            <div style={{ fontSize: '0.725rem', color: 'var(--sidebar-text)', marginTop: 2 }}>MERN HMS Portal</div>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav style={{ flex: 1, padding: '14px 10px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 3 }}>
        <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--sidebar-text)', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '0 10px 4px', opacity: 0.7 }}>
          Hospital Modules ({allowed.length})
        </div>
        {allowed.map(item => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) => `sidebar-nav-link${isActive ? ' active' : ''}`}
              style={{ padding: '8px 12px', fontSize: '0.825rem' }}
            >
              <Icon size={16} style={{ flexShrink: 0 }} />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* User Footer Profile */}
      <div style={{ padding: '14px 16px', borderTop: '1px solid var(--sidebar-border)', display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(0, 0, 0, 0.15)' }}>
        <div style={{
          width: 34, height: 34, borderRadius: '50%', background: 'var(--primary)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 700, color: '#ffffff', fontSize: '0.85rem', flexShrink: 0
        }}>
          {user?.name?.charAt(0) || 'U'}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '0.825rem', fontWeight: 600, color: '#ffffff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {user?.name || 'User'}
          </div>
          <span className={`badge ${roleBadges[user?.role] || 'badge-gray'}`} style={{ fontSize: '0.65rem', padding: '1px 6px', marginTop: 2, textTransform: 'capitalize' }}>
            {user?.role || 'Guest'}
          </span>
        </div>
        <button
          onClick={logout}
          title="Sign out"
          style={{
            padding: 6, borderRadius: 6, background: 'transparent', border: 'none',
            color: 'var(--sidebar-text)', cursor: 'pointer', display: 'flex', alignItems: 'center'
          }}
          onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--sidebar-text)'}
        >
          <LogOut size={16} />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
