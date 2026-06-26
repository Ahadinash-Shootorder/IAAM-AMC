import React from 'react';
import { FiDownload } from 'react-icons/fi';
import styles from './EventSymposia.module.css';

export default function EventSymposia({ data }) {
  if (!data) return null;

  const title = data.title || 'Conference Symposia';
  const description = data.description || '';
  const symposia = data.symposia || [];
  const flyerText = data.flyerText || 'Download Symposia Flyer';
  const flyerLink = data.flyerLink || '#';

  return (
    <section className={styles.symposiaSection}>
      <div className={styles.container}>
        {/* Section Header */}
        <div className={styles.header}>
          <h2 className={styles.sectionTitle}>{title}</h2>
          <div className={styles.divider} />
          {description && <p className={styles.sectionDesc}>{description}</p>}
        </div>

        {/* Symposia Cards Grid */}
        {symposia.length > 0 && (
          <div className={styles.grid}>
            {symposia.map((track, index) => (
              <div key={index} className={styles.card}>
                <div className={styles.iconContainer}>
                  {getTrackIcon(track.title)}
                </div>
                <h3 className={styles.cardTitle}>{track.title}</h3>
                <p className={styles.cardDesc}>{track.description}</p>
              </div>
            ))}
          </div>
        )}

        {/* Flyer Action Button */}
        {flyerLink && (
          <div className={styles.actions}>
            <a href={flyerLink} className={styles.downloadBtn}>
              <FiDownload className={styles.btnIcon} />
              <span>{flyerText}</span>
            </a>
          </div>
        )}
      </div>
    </section>
  );
}

function getTrackIcon(title) {
  const norm = (title || '').toLowerCase();
  if (norm.includes('renewable')) {
    return (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1C3E9C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 20A7 7 0 0 0 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 3.5 0 9.5a7 7 0 0 0-8 8.5z" />
        <path d="M19 2L11 10" />
      </svg>
    );
  }
  if (norm.includes('storage')) {
    return (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1C3E9C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="7" y="5" width="10" height="15" rx="2" ry="2" />
        <line x1="11" y1="2" x2="13" y2="2" />
        <path d="M11 9h2l-2 4h3" />
      </svg>
    );
  }
  if (norm.includes('photovoltaic') || norm.includes('solar')) {
    return (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1C3E9C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="6" r="2.5" />
        <line x1="12" y1="1.5" x2="12" y2="2.5" />
        <line x1="7.5" y1="3" x2="8.5" y2="4" />
        <line x1="16.5" y1="3" x2="15.5" y2="4" />
        <path d="M4 13h16" />
        <path d="M5 17h14" />
        <path d="M2 13l3 9h14l3-9" />
        <path d="M12 13v9" />
        <path d="M8 13l-1 9" />
        <path d="M16 13l1 9" />
      </svg>
    );
  }
  if (norm.includes('harvesting') || norm.includes('zap') || norm.includes('power')) {
    return (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1C3E9C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    );
  }
  if (norm.includes('hydrogen') || norm.includes('water') || norm.includes('waves') || norm.includes('tech')) {
    return (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1C3E9C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.5 0 2.5 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
        <path d="M2 12c.6.5 1.2 1 2.5 1C7 13 7 11 9.5 11c2.5 0 2.5 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
        <path d="M2 18c.6.5 1.2 1 2.5 1C7 19 7 17 9.5 17c2.5 0 2.5 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
      </svg>
    );
  }
  if (norm.includes('smart') || norm.includes('materials') || norm.includes('monitor') || norm.includes('screen')) {
    return (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1C3E9C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    );
  }
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1C3E9C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <line x1="9" y1="9" x2="9" y2="15" />
      <line x1="9" y1="15" x2="15" y2="15" />
      <line x1="15" y1="9" x2="15" y2="15" />
    </svg>
  );
}
