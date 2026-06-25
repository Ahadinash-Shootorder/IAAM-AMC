import React from 'react';
import styles from './AssembliesCta.module.css';

const iconMap = {
  sparkles: (
    <svg width="44" height="44" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2Q12 12 22 12Q12 12 12 22Q12 12 2 12Q12 12 12 2Z" fill="#B8C4FF" />
      <path d="M19 5Q19 9 23 9Q19 9 19 13Q19 9 15 9Q19 9 19 5Z" fill="#B8C4FF" opacity="0.7" />
      <path d="M6 14Q6 17 9 17Q6 17 6 20Q6 17 3 17Q6 17 6 14Z" fill="#B8C4FF" opacity="0.7" />
    </svg>
  ),
  publish: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#FA2E6E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 10V6h16v4" />
      <path d="M12 20V8" />
      <path d="M7 13l5-5 5 5" />
    </svg>
  )
};

export default function AssembliesCta({ data }) {
  if (!data) return null;

  const { title, description, buttons = [], features = [] } = data;

  return (
    <section className={styles.ctaSection}>
      <div className={styles.ctaOuterContainer}>
        <div className={styles.ctaCard}>
          <div className={styles.ctaCardBg} />

          <div className={styles.ctaLeftColumn}>
            {title && <h2 className={styles.ctaTitle}>{title}</h2>}
            {description && <p className={styles.ctaText}>{description}</p>}
            
            {buttons.length > 0 && (
              <div className={styles.ctaActions}>
                {buttons.map((btn, idx) => {
                  const isOutline = idx > 0;
                  return (
                    <a
                      key={idx}
                      href={btn.link || '#'}
                      className={isOutline ? styles.btnCtaOutline : styles.btnCtaPrimary}
                    >
                      {btn.text}
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          {features.length > 0 && (
            <div className={styles.ctaRightColumn}>
              <div className={styles.gridBoxContainer}>
                {features.map((item, idx) => {
                  const isShifted = idx === 1; // second card is shifted down
                  const boxClass = `${styles.gridBox} ${isShifted ? styles.gridBoxShifted : ''}`;
                  return (
                    <div key={idx} className={boxClass}>
                      <div className={styles.gridBoxIconWrap}>
                        {iconMap[item.iconType] || iconMap.sparkles}
                      </div>
                      <span className={styles.gridBoxTitle}>{item.title}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
