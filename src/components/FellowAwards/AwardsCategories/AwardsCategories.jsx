import React from 'react';
import styles from './AwardsCategories.module.css';

export default function AwardsCategories({ data }) {
  const title = data?.title || 'IAAM Awards Categories';
  const description = data?.description || 'Diverse categories designed to recognize excellence at every stage of the scientific journey.';
  const categories = data?.categories || [
    {
      badge: 'PREMIUM DISTINCTION',
      title: 'Advanced Materials Laureate',
      description: "IAAM's highest honor awarded to individuals for their seminal and lasting contributions to the advancement of materials science and technology globally.",
      theme: 'dark-blue'
    },
    {
      badge: 'RESEARCHER AWARD',
      title: 'Researcher of the Year',
      description: 'Celebrating outstanding researchers who have published high-impact work within the last 3 calendar years.',
      theme: 'purple'
    },
    {
      badge: 'SCIENTIST AWARD',
      title: 'Scientist Award',
      description: 'For mid-career scientists demonstrating exceptional research leadership and innovation.',
      theme: 'white'
    },
    {
      badge: 'YOUNG SCIENTIST MEDAL',
      title: 'Young Scientist Medal',
      description: 'Encouraging early-career researchers under the age of 35 for their promising initial work.',
      theme: 'white-2'
    },
    {
      badge: 'INNOVATION AWARD',
      title: 'Innovation Award',
      description: 'Focusing on researchers who bridge the gap between academic discovery and industrial application.',
      theme: 'light-orange'
    }
  ];

  // Helper to map themes to CSS classes
  const getThemeClass = (theme) => {
    switch (theme) {
      case 'dark-blue': return styles.themeDarkBlue;
      case 'purple': return styles.themePurple;
      case 'light-orange': return styles.themeLightOrange;
      case 'white-2':
      case 'white': 
      default:
        return styles.themeWhite;
    }
  };

  // Helper to render appropriate SVG based on award index or badge
  const renderIcon = (theme, idx) => {
    const isDarkBlue = theme === 'dark-blue';
    const isLightOrange = theme === 'light-orange';
    const iconColor = isDarkBlue ? '#F4A261' : isLightOrange ? '#F4A261' : '#00287E';

    if (idx === 0) { // Laureate
      return (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="8" r="7" />
          <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
        </svg>
      );
    } else if (idx === 1) { // Researcher
      return (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="M12 8v4" />
          <path d="M12 16h.01" />
        </svg>
      );
    } else if (idx === 2) { // Scientist
      return (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10 2v7.31L3.75 20a1 1 0 0 0 .85 1.5h14.8a1 1 0 0 0 .85-1.5L14 9.31V2" />
          <line x1="8.5" y1="2" x2="15.5" y2="2" />
          <line x1="14" y1="9.3" x2="10" y2="9.3" />
        </svg>
      );
    } else if (idx === 3) { // Young Scientist
      return (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
          <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
        </svg>
      );
    } else { // Innovation
      return (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .6 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
          <line x1="9" y1="18" x2="15" y2="18" />
          <line x1="10" y1="22" x2="14" y2="22" />
        </svg>
      );
    }
  };

  return (
    <section className={styles.categoriesSection}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.description}>{description}</p>
        </div>

        {/* Grid Layout */}
        <div className={styles.grid}>
          {categories.map((cat, idx) => {
            const isLaureate = cat.theme === 'dark-blue';
            return (
              <div
                key={idx}
                className={`${styles.card} ${getThemeClass(cat.theme)} ${isLaureate ? styles.laureateCard : ''}`}
              >
                {isLaureate && (
                  <div className={styles.watermark}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                      <circle cx="12" cy="8" r="7" />
                      <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
                    </svg>
                  </div>
                )}
                <div className={styles.iconContainer}>
                  {renderIcon(cat.theme, idx)}
                </div>
                
                <div className={styles.cardContent}>
                  <span className={styles.cardBadge}>{cat.badge}</span>
                  <h3 className={styles.cardTitle}>{cat.title}</h3>
                  <p className={styles.cardDesc}>{cat.description}</p>
                </div>

                {isLaureate && (
                  <div className={styles.laureateAction}>
                    <span className={styles.actionText}>Premium Distinction</span>
                    <svg className={styles.actionArrow} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
