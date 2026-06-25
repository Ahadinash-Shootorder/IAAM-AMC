import React from 'react';
import styles from './AwardsHero.module.css';

export default function AwardsHero({ data }) {
  const subtitle = data?.subtitle || 'HONORING EXCELLENCE';
  const title = data?.title || 'Fellows & Awards';
  const description = data?.description || 'Celebrating the luminaries of global research. Our fellowship program recognizes outstanding contributions to science, humanities, and technology, fostering a community of unparalleled intellectual leadership.';

  return (
    <section className={styles.heroSection}>
      {/* Blurred background visual element */}
      <div className={styles.pinkGlow} />

      <div className={styles.container}>
        <div className={styles.content}>
          <span className={styles.subtitle}>{subtitle}</span>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.description}>{description}</p>
        </div>
      </div>
    </section>
  );
}
