'use client';

import React from 'react';
import styles from './AwardsIntro.module.css';

export default function AwardsIntro({ data }) {
  const title = data?.title || 'Fellow of IAAM (FIAAM)';
  const description = data?.description || "The title 'Fellow of IAAM' is a prestigious honor conferred upon eminent researchers who have demonstrated significant impact in the field of materials science. Those honored are entitled to use the designatory letters 'FIAAM'.";
  const image = data?.image || '/uploads/fellow-awards/trophy.jpg';
  const quoteText = data?.quoteText || '"Being a FIAAM is a testament to a lifelong commitment to scientific excellence and global innovation."';
  const criteriaList = data?.criteriaList || [
    {
      title: 'Eligibility Criteria',
      description: 'Open to world-class scientists with a minimum of 15 years of professional experience in advanced materials research.'
    },
    {
      title: 'Impact & Leadership',
      description: 'Candidates must demonstrate sustained scientific leadership, innovation, and global outreach in sustainable energy solutions.'
    }
  ];

  return (
    <section className={styles.introSection}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Left Content */}
          <div className={styles.leftCol}>
            <h2 className={styles.sectionTitle}>{title}</h2>
            <p className={styles.sectionDesc}>{description}</p>
            
            <div className={styles.criteriaContainer}>
              {criteriaList.map((item, idx) => (
                <div key={idx} className={styles.criteriaCard}>
                  <div className={styles.iconWrapper}>
                    {idx === 0 ? (
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                      </svg>
                    ) : (
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    )}
                  </div>
                  <div className={styles.criteriaInfo}>
                    <h4 className={styles.criteriaTitle}>{item.title}</h4>
                    <p className={styles.criteriaDesc}>{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Image with Floating Quote Card */}
          <div className={styles.rightCol}>
            <div className={styles.imageOutlineWrapper}>
              <div className={styles.imageContainer}>
                {/* Use native img to gracefully handle missing files */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image}
                  alt="FIAAM Trophy"
                  className={styles.trophyImage}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentNode.querySelector('[data-placeholder]').style.display = 'flex';
                  }}
                />
                <div className={styles.placeholderImage} data-placeholder="" style={{ display: 'none' }}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21 15 16 10 5 21"/>
                  </svg>
                  <span>Upload image via admin</span>
                </div>
              </div>
            </div>

            {/* Floating Quote Card */}
            <div className={styles.floatingQuoteCard}>
              <span className={styles.quoteBadge}>RECOGNITION</span>
              <p className={styles.quoteText}>{quoteText}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
