'use client';

import { useState } from 'react';
import { FiLock, FiSave, FiAlertCircle } from 'react-icons/fi';
import styles from './page.module.css';

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

    if (newPassword.length < 8) {
      setStatus({ type: 'error', message: 'New password must be at least 8 characters' });
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
      setStatus(prev => {
        setLoading(false);
        return prev;
      });
    }
  };

  return (
    <div className={styles.settingsWrapper}>
      <div className={styles.header}>
        <h2 className={styles.title}>Admin Settings</h2>
        <p className={styles.subtitle}>Update your admin account credentials</p>
      </div>

      <div className={styles.panel}>
        <div className={styles.panelHeader}>
          <h2 className={styles.panelTitle}>
            <FiLock /> Change Password
          </h2>
        </div>

        {status.message && (
          <div className={`${styles.alert} ${status.type === 'error' ? styles.errorAlert : styles.successAlert}`}>
            <FiAlertCircle /> {status.message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>Current Password</label>
            <input 
              type="password" 
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              className={styles.textInput}
            />
          </div>
          <div className={styles.formGroup}>
            <label>New Password</label>
            <input 
              type="password" 
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className={styles.textInput}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Confirm New Password</label>
            <input 
              type="password" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className={styles.textInput}
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className={styles.submitBtn}
          >
            <FiSave /> {loading ? 'Saving...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
}
