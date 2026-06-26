import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './SpeakerDetail.module.css';

/* SVG icons matching the Figma design (deep indigo #240E8B) */
const StatIcons = {
  papers: (
    <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="4" width="30" height="38" rx="3" stroke="#240E8B" strokeWidth="2.5" fill="none" />
      <line x1="17" y1="14" x2="33" y2="14" stroke="#240E8B" strokeWidth="2" strokeLinecap="round" />
      <line x1="17" y1="20" x2="33" y2="20" stroke="#240E8B" strokeWidth="2" strokeLinecap="round" />
      <line x1="17" y1="26" x2="28" y2="26" stroke="#240E8B" strokeWidth="2" strokeLinecap="round" />
      <line x1="17" y1="32" x2="25" y2="32" stroke="#240E8B" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  keynotes: (
    <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="25" cy="16" r="8" stroke="#240E8B" strokeWidth="2.5" fill="none" />
      <path d="M25 24V38" stroke="#240E8B" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M20 42H30" stroke="#240E8B" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M22 38L25 42L28 38" stroke="#240E8B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  experience: (
    <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="12" width="34" height="26" rx="3" stroke="#240E8B" strokeWidth="2.5" fill="none" />
      <path d="M18 12V8H32V12" stroke="#240E8B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="8" y1="24" x2="42" y2="24" stroke="#240E8B" strokeWidth="2" />
      <circle cx="25" cy="24" r="3" fill="#240E8B" />
    </svg>
  ),
};

/* Location pin icon */
const LocationIcon = () => (
  <svg width="20" height="24" viewBox="0 0 20 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 0C4.477 0 0 4.477 0 10c0 7.5 10 14 10 14s10-6.5 10-14c0-5.523-4.477-10-10-10Zm0 13a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z" fill="#F04393" />
  </svg>
);

/* Briefcase/role icon */
const RoleIcon = () => (
  <svg width="24" height="20" viewBox="0 0 24 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="1" y="4" width="22" height="15" rx="2" stroke="#240E8B" strokeWidth="2" fill="none" />
    <path d="M8 4V2a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="#240E8B" strokeWidth="2" />
    <line x1="1" y1="11" x2="23" y2="11" stroke="#240E8B" strokeWidth="1.5" />
  </svg>
);

export default function SpeakerDetail({ speaker }) {
  const {
    name = '',
    title: role = '',
    company = '',
    bannerImage = '',
    bannerImageMobile = '',
    image = '',
    location = '',
    shortBio = '',
    fullBio = '',
    expertise = [],
    stats = [],
    ctaText = 'Register Now',
    ctaLink = '#register',
  } = speaker;

  // Use bannerImage if available, otherwise fallback to image
  const displayImage = bannerImage || image;
  const displayImageMobile = bannerImageMobile || displayImage;
  
  // Normalize image paths: handle both relative and absolute paths
  const imgSrc = displayImage && !displayImage.startsWith('/') && !displayImage.startsWith('http')
    ? `/${displayImage}`
    : displayImage;

  const imgSrcMobile = displayImageMobile && !displayImageMobile.startsWith('/') && !displayImageMobile.startsWith('http')
    ? `/${displayImageMobile}`
    : displayImageMobile;

  return (
    <div className={styles.speakerDetailPage}>
      {/* ── Hero Banner ── */}
      <section className={styles.heroBanner}>
        <div className={styles.desktopBg}>
          <Image
            className={styles.heroImage}
            src={imgSrc}
            alt={name}
            fill
            sizes="100vw"
            priority
          />
        </div>
        <div className={styles.mobileBg}>
          <Image
            className={styles.heroImage}
            src={imgSrcMobile}
            alt={name}
            fill
            sizes="100vw"
            priority
          />
        </div>
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <span className={styles.heroLabel}>SPEAKER PROFILE</span>
          <h1 className={styles.heroName}>{name}</h1>
          <p className={styles.heroDescription}>{shortBio}</p>
          <div className={styles.heroCta}>
            {(() => {
              let link = ctaLink || '#';
              if (ctaText === 'Register Now' && (link === '#' || link === '#register')) {
                link = '/register';
              }
              const isInternal = link.startsWith('/') && !link.startsWith('//');
              return isInternal ? (
                <Link href={link} className={styles.ctaButton}>
                  {ctaText}
                </Link>
              ) : (
                <a href={link} className={styles.ctaButton}>
                  {ctaText}
                </a>
              );
            })()}
          </div>
        </div>
      </section>

      {/* ── Body: Sidebar + Main Content ── */}
      <section className={styles.bodySection}>
        {/* Left Sidebar — At a Glance */}
        <aside className={styles.glanceSidebar}>
          <h3 className={styles.glanceTitle}>At a Glance</h3>

          <div className={styles.glanceItems}>
            {/* Role */}
            <div className={styles.glanceItem}>
              <div className={styles.glanceIconWrap}>
                <RoleIcon />
              </div>
              <div className={styles.glanceInfo}>
                <span className={styles.glanceInfoBold}>{role}</span>
                <span className={styles.glanceInfoSub}>{company}</span>
              </div>
            </div>

            {/* Location */}
            <div className={styles.glanceItem}>
              <div className={styles.glanceIconWrap}>
                <LocationIcon />
              </div>
              <div className={styles.glanceInfo}>
                <span className={styles.glanceInfoBold}>{location}</span>
                <span className={styles.glanceInfoSub}>Location</span>
              </div>
            </div>
          </div>

          <div className={styles.glanceDivider} />

          {/* Expertise */}
          <div className={styles.expertiseBlock}>
            <h3 className={styles.expertiseTitle}>Expertise</h3>
            <div className={styles.expertiseTags}>
              {expertise.map((tag, i) => (
                <span key={i} className={styles.expertiseTag}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </aside>

        {/* Right — About + Stats */}
        <div className={styles.mainContent}>
          <div className={styles.aboutBlock}>
            <h2 className={styles.aboutTitle}>About {name}</h2>
            <p className={styles.aboutText}>{fullBio}</p>
          </div>

          {/* Stats Card */}
          {stats.length > 0 && (
            <div className={styles.statsCard}>
              {stats.map((stat, i) => (
                <div key={i} className={styles.statItem}>
                  <div className={styles.statIcon}>
                    {StatIcons[stat.icon] || StatIcons.papers}
                  </div>
                  <div className={styles.statInfo}>
                    <span className={styles.statNumber}>{stat.number}</span>
                    <span className={styles.statLabel}>{stat.label}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
