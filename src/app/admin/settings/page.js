'use client';

import { useState } from 'react';
import { FiLock, FiSave, FiAlertCircle } from 'react-icons/fi';
import styles from '../page.module.css';

export default function SettingsPage() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: '', message: '' });

    if (newPassword !== confirmPassword) {
      setStatus({ type: 'error', message: 'New passwords do not match' });
      return;
    }

    if (newPassword.length < 6) {
      setStatus({ type: 'error', message: 'New password must be at least 6 characters' });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword })
      });

      const data = await res.json();

      if (res.ok) {
        setStatus({ type: 'success', message: 'Password updated successfully!' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setStatus({ type: 'error', message: data.error || 'Failed to update password' });
      }
    } catch (err) {
      setStatus({ type: 'error', message: 'An unexpected error occurred' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Admin Settings</h2>
          <p className={styles.subtitle}>Update your admin account credentials</p>
        </div>
      </div>

      <div className={styles.bentoLeft} style={{ maxWidth: '600px' }}>
        <div className={styles.sectionPanel}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              <FiLock /> Change Password
            </h2>
          </div>

          {status.message && (
            <div style={{
              padding: '12px 16px',
              borderRadius: '8px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '14px',
              fontWeight: '500',
              backgroundColor: status.type === 'error' ? '#fef2f2' : '#f0fdf4',
              color: status.type === 'error' ? '#ef4444' : '#16a34a',
              border: `1px solid ${status.type === 'error' ? '#fecaca' : '#bbf7d0'}`
            }}>
              <FiAlertCircle /> {status.message}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>Current Password</label>
              <input 
                type="password" 
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none' }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>New Password</label>
              <input 
                type="password" 
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none' }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>Confirm New Password</label>
              <input 
                type="password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none' }}
              />
            </div>
            
            <button 
              type="submit" 
              disabled={loading}
              style={{
                marginTop: '8px',
                padding: '12px',
                borderRadius: '8px',
                backgroundColor: '#240E8B',
                color: 'white',
                fontWeight: '600',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                opacity: loading ? 0.7 : 1
              }}
            >
              <FiSave /> {loading ? 'Saving...' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
