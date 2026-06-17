import React from 'react';
import styles from './StatsSection.module.css';

export default function StatsSection({ data }) {
  const stats = data?.items || [];

  return (
    <section className={styles.section}>
      {stats.map((stat, index) => (
        <React.Fragment key={stat.label}>
          <div className={styles.stat}>
            <div className={styles.statNumber}>{stat.number}</div>
            <div className={styles.statLabel}>{stat.label}</div>
          </div>

          {/* Separator between stats */}
          {index < stats.length - 1 && (
            <div className={styles.separator} />
          )}
        </React.Fragment>
      ))}
    </section>
  );
}
