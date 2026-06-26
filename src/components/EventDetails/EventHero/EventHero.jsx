import React from 'react';
import { FiCalendar, FiMapPin } from 'react-icons/fi';
import styles from './EventHero.module.css';

export default function EventHero({ data }) {
  if (!data) return null;

  const edition = data.edition || '';
  const editionSuffix = data.editionSuffix || '';
  const title = data.title || '';
  const tagline = data.tagline || '';
  const date = data.date || '';
  const location = data.location || '';
  const registerText = data.registerText || 'Register Now';
  const registerLink = data.registerLink || '#';
  const programText = data.programText || 'View Program';
  const programLink = data.programLink || '#';
  const backgroundImage = data.backgroundImage || '';

  return (
    <section 
      className={styles.heroSection}
      style={{ backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none' }}
    >
      <div className={styles.overlay} />
      
      <div className={styles.container}>
        <div className={styles.content}>
          {/* Anniversary Glassmorphic Badge */}
          {(edition || editionSuffix) && (
            <div className={styles.badge}>
              <span className={styles.badgeHighlight}>{edition}</span>
              <span className={styles.badgeText}>{editionSuffix}</span>
            </div>
          )}

          {/* Title */}
          <h1 className={styles.title}>{title}</h1>

          {/* Tagline */}
          {tagline && <p className={styles.tagline}>{tagline}</p>}

          {/* Meta Info: Date and Location */}
          <div className={styles.meta}>
            {date && (
              <div className={styles.metaItem}>
                <FiCalendar className={styles.metaIcon} />
                <span className={styles.metaText}>{date}</span>
              </div>
            )}
            {location && (
              <div className={styles.metaItem}>
                <FiMapPin className={styles.metaIcon} />
                <span className={styles.metaText}>{location}</span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className={styles.actions}>
            {registerLink && (
              <a href={registerLink} className={styles.registerBtn}>
                {registerText}
              </a>
            )}
            {programLink && (
              <a href={programLink} className={styles.programBtn}>
                {programText}
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
