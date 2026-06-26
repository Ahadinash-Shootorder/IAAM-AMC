import React from 'react';
import styles from './EventSDGs.module.css';

export default function EventSDGs({ data }) {
  if (!data) return null;

  const title = data.title || 'UNSDGs Commitments';
  const description = data.description || '';
  const reportText = data.reportText || 'Read Full Impact Report';
  const reportLink = data.reportLink || '#';
  const goals = data.goals || [];

  const renderIcon = (number, color) => {
    const num = String(number).toLowerCase();
    
    // Goal 17: Partnerships (Handshake) - Check 17 first to prevent matching 7
    if (num.includes('17')) {
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m11 17 2 2a1 1 0 0 0 1.4 0l4-4a1 1 0 0 0 0-1.4l-1.4-1.4a1 1 0 0 0-1.4 0l-1.4 1.4a1 1 0 0 0 0 1.4z" />
          <path d="m13 11-2-2a1 1 0 0 0-1.4 0l-4 4a1 1 0 0 0 0 1.4l1.4 1.4a1 1 0 0 0 1.4 0l1.4-1.4a1 1 0 0 0 0-1.4z" />
          <path d="m8.5 8.5 3-3a2.1 2.1 0 0 1 3 0l5 5a2.1 2.1 0 0 1 0 3l-1.5 1.5" />
          <path d="m15.5 15.5-3 3a2.1 2.1 0 0 1-3 0l-5-5a2.1 2.1 0 0 1 0-3l1.5-1.5" />
        </svg>
      );
    }

    // Goal 7: Clean Energy (Lightning bolt)
    if (num.includes('7')) {
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      );
    }
    
    // Goal 13: Climate Action (Globe)
    if (num.includes('13')) {
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
          <path d="M2 12h20" />
        </svg>
      );
    }
    
    // Goal 9: Innovation (Robotic/Mechanical Arm)
    if (num.includes('9')) {
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 20h7" />
          <path d="M6 20v-4" />
          <circle cx="6" cy="14" r="2" />
          <path d="M7.5 12.5L14 6" />
          <circle cx="15.5" cy="4.5" r="1.5" />
          <path d="M17 3.5L20 6.5" />
          <path d="M18.5 8l2-2" />
          <path d="M15.5 5l2-2" />
        </svg>
      );
    }
    
    // Fallback
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    );
  };

  return (
    <section className={styles.sdgSection}>
      <div className={styles.container}>
        <div className={styles.layout}>
          {/* Left Column: Heading and Info */}
          <div className={styles.leftCol}>
            <h2 className={styles.sectionTitle}>{title}</h2>
            {description && <p className={styles.sectionDesc}>{description}</p>}
            {reportLink && (
              <a href={reportLink} className={styles.reportLink}>
                <span>{reportText}</span>
                <svg 
                  className={styles.linkIcon} 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>
            )}
          </div>

          {/* Right Column: Goal Cards Stack */}
          {goals.length > 0 && (
            <div className={styles.rightCol}>
              {goals.map((goal, index) => (
                <div key={index} className={styles.card}>
                  <div 
                    className={styles.iconWrapper}
                    style={{ backgroundColor: goal.bgColor || '#EBF5FF' }}
                  >
                    {renderIcon(goal.number, goal.iconColor || '#2563EB')}
                  </div>
                  
                  <div className={styles.cardContent}>
                    <h3 className={styles.cardTitle}>
                      {goal.number}: {goal.title}
                    </h3>
                    <p className={styles.cardDesc}>{goal.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
