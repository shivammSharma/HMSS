import React from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 60,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
      background: 'rgba(15, 23, 42, 0.45)', backdropFilter: 'blur(3px)',
      animation: 'fadeIn 0.15s ease-out'
    }}>
      <div style={{
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: 16, width: '100%', maxWidth: 540, maxHeight: '90vh',
        display: 'flex', flexDirection: 'column', boxShadow: 'var(--shadow-lg)'
      }}>
        {/* Header */}
        <div style={{
          padding: '18px 24px', borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0
        }}>
          <h3 style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text)' }}>{title}</h3>
          <button
            onClick={onClose}
            className="btn btn-ghost"
            style={{ padding: 6, borderRadius: 6, color: 'var(--text-3)' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
