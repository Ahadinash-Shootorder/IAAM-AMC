import React from 'react';
import Image from 'next/image';
import { FiGlobe, FiRadio, FiStar, FiCalendar, FiMapPin, FiCompass, FiCheck } from 'react-icons/fi';
import styles from './AssembliesHero.module.css';

const iconMap = {
  globe: <FiGlobe size={18} color="#B8C4FF" />,
  radio: <FiRadio size={18} color="#B8C4FF" />,
  star: <FiStar size={18} color="#B8C4FF" />,
  calendar: <FiCalendar size={18} color="#B8C4FF" />,
  map: <FiMapPin size={18} color="#B8C4FF" />,
  compass: <FiCompass size={18} color="#B8C4FF" />,
  check: <FiCheck size={18} color="#B8C4FF" />,
};

export default function AssembliesHero({ data }) {
  if (!data) return null;

  const { backgroundImage, subtitle, title, description, badges = [] } = data;

  return (
    <section className={styles.heroSection}>
      <div className={styles.heroBg}>
        {backgroundImage && (
          <Image
            src={backgroundImage}
            className={styles.heroImg}
            alt="Hero Background"
            fill
            sizes="100vw"
            priority
          />
        )}
        <div className={styles.heroOverlay} />
      </div>
      <div className={styles.heroContainer}>
        <div className={styles.heroContent}>
          {subtitle && <span className={styles.heroSubtitle}>{subtitle}</span>}
          {title && <h1 className={styles.heroTitle}>{title}</h1>}
          {description && <p className={styles.heroDescription}>{description}</p>}
          
          {badges.length > 0 && (
            <div className={styles.heroBadges}>
              {badges.map((badge, idx) => (
                <div key={idx} className={styles.heroBadge}>
                  <div className={styles.badgeIconWrap}>
                    {iconMap[badge.icon] || <FiCheck size={18} color="#B8C4FF" />}
                  </div>
                  <span className={styles.badgeText}>{badge.text}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
