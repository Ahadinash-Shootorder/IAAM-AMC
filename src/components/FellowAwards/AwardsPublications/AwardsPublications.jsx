import React from 'react';
import Link from 'next/link';
import styles from './AwardsPublications.module.css';

export default function AwardsPublications({ data }) {
  const title = data?.title || 'Indexed Publications';
  const description = data?.description || 'Disseminating groundbreaking research through globally recognized and indexed academic channels.';
  const items = data?.items || [
    {
      title: 'Congress Proceedings',
      description: 'All accepted abstracts and papers are published with ISBN and DOI indexing, and submitted for Scopus evaluation.',
      linkText: 'View Guidelines',
      linkUrl: '/congress-proceedings'
    },
    {
      title: 'Advanced Materials Letters',
      description: 'The official open-access journal of IAAM, providing a high-impact platform with no subscription fees for researchers.',
      linkText: 'Learn More',
      linkUrl: '#'
    },
    {
      title: 'Video Proceedings',
      description: 'An innovative open-access video journal dedicated to documented lectures and visual scientific presentations.',
      linkText: 'Watch Now',
      linkUrl: '#'
    }
  ];

  // Helper to render inline icon based on column index
  const renderIcon = (idx) => {
    const iconColor = '#00287E';
    if (idx === 0) { // Open Book for Congress Proceedings
      return (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
        </svg>
      );
    } else if (idx === 1) { // Folded Document with Stripes for Advanced Materials Letters
      return (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1A6966" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <line x1="10" y1="9" x2="8" y2="9" />
        </svg>
      );
    } else { // Play Square for Video Proceedings
      return (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#F4A261" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="m10 8 6 4-6 4V8z" />
        </svg>
      );
    }
  };

  return (
    <section className={styles.publicationsSection}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.description}>{description}</p>
        </div>

        {/* Three Columns Grid */}
        <div className={styles.grid}>
          {items.map((item, idx) => {
            const isInternalLink = item.linkUrl?.startsWith('/') && !item.linkUrl?.startsWith('//');
            return (
              <div key={idx} className={styles.card}>
                <div className={styles.iconWrapper}>
                  {renderIcon(idx)}
                </div>
                
                <div className={styles.cardContent}>
                  <h3 className={styles.cardTitle}>{item.title}</h3>
                  <p className={styles.cardDesc}>{item.description}</p>
                </div>

                <div className={styles.cardFooter}>
                  {isInternalLink ? (
                    <Link href={item.linkUrl} className={styles.link}>
                      <span>{item.linkText}</span>
                      <svg className={styles.arrow} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </Link>
                  ) : (
                    <a href={item.linkUrl || '#'} className={styles.link}>
                      <span>{item.linkText}</span>
                      <svg className={styles.arrow} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
