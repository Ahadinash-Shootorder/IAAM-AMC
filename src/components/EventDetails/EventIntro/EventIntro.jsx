import React from 'react';
import Image from 'next/image';
import styles from './EventIntro.module.css';

export default function EventIntro({ data }) {
  if (!data) return null;

  const title = data.title || 'Decade of Excellence';
  const paragraphs = data.paragraphs || [];
  const stats = data.stats || [];
  const image = data.image || '';

  return (
    <section className={styles.introSection}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Left Column: Text & Stats */}
          <div className={styles.textContent}>
            <h2 className={styles.sectionTitle}>{title}</h2>
            
            {paragraphs.map((p, index) => (
              <p key={index} className={styles.paragraph}>
                {p}
              </p>
            ))}

            {/* Stats Row */}
            {stats.length > 0 && (
              <div className={styles.statsRow}>
                {stats.map((stat, index) => (
                  <div key={index} className={styles.statCard}>
                    <div className={styles.statValue}>{stat.value}</div>
                    <div className={styles.statLabel}>{stat.label}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Dynamic Image */}
          {image && (
            <div className={styles.imageWrapper}>
              <div className={styles.imageContainer}>
                <Image
                  src={image.startsWith('/') || image.startsWith('http') ? image : `/${image}`}
                  alt="Decade of Excellence Banner"
                  fill
                  sizes="(max-width: 768px) 100vw, 544px"
                  style={{ objectFit: 'cover' }}
                  priority
                />
                <div className={styles.imageOverlay} />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
