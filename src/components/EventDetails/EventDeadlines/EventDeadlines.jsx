import React from 'react';
import styles from './EventDeadlines.module.css';

export default function EventDeadlines({ data }) {
  if (!data) return null;

  const title = data.title || 'Critical Deadlines';
  const description = data.description || 'Mark your calendars for key submission and registration dates.';
  const deadlines = data.deadlines || [];

  return (
    <section className={styles.deadlinesSection}>
      {/* Background Grid Lines Overlay */}
      <div className={styles.gridOverlay}>
        <div className={styles.gridCol} />
        <div className={styles.gridCol} />
        <div className={styles.gridCol} />
        <div className={styles.gridCol} />
        <div className={styles.gridCol} />
        <div className={styles.gridCol} />
        <div className={styles.gridCol} />
        <div className={styles.gridCol} />
        <div className={styles.gridCol} />
        <div className={styles.gridCol} />
        <div className={styles.gridCol} />
      </div>

      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
          {description && <p className={styles.description}>{description}</p>}
        </div>

        <div className={styles.grid}>
          {deadlines.map((item, index) => (
            <div key={index} className={styles.card}>
              <div className={styles.cardLabel}>{item.label}</div>
              <div className={styles.cardDate}>{item.date}</div>
              <div className={styles.cardDesc}>{item.description}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
