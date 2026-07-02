import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './HeroSection.module.css';

export default function HeroSection({ data }) {
  const rawBgImage = data?.backgroundImage || 'HeroBanner.jpg';
  const bgImage = typeof rawBgImage === 'string' && (rawBgImage.startsWith('/') || rawBgImage.startsWith('http')) ? rawBgImage : `/${rawBgImage}`;
  
  const rawBgImageMobile = data?.backgroundImageMobile || data?.backgroundImage || 'HeroBanner.jpg';
  const bgImageMobile = typeof rawBgImageMobile === 'string' && (rawBgImageMobile.startsWith('/') || rawBgImageMobile.startsWith('http')) ? rawBgImageMobile : `/${rawBgImageMobile}`;

  const subtitle = data?.subtitle || '';
  const title = data?.title || '';
  const tagline = data?.tagline || '';
  const description = data?.description || '';
  const buttons = data?.buttons || [];
  const bottomStats = data?.bottomStats || [];

  const isInternal = (url) => typeof url === 'string' && url.startsWith('/') && !url.startsWith('//');

  return (
    <section className={styles.hero}>
      {/* Background Image and Gradient */}
      <div className={styles.bgWrapper}>
        <div className={styles.desktopBg}>
          <Image src={bgImage} fill priority sizes="100vw" style={{ objectFit: 'cover', objectPosition: 'center' }} alt="Hero Background" />
        </div>
        <div className={styles.mobileBg}>
          <Image src={bgImageMobile} fill priority sizes="100vw" style={{ objectFit: 'cover', objectPosition: 'center' }} alt="Hero Background Mobile" />
        </div>
        <div className={styles.bgOverlay} />
      </div>

      {/* Content */}
      <div className={styles.content}>
        <div className={styles.titleGroup}>
          <h3 className={styles.subtitle}>{subtitle}</h3>
          <h1 className={styles.title}>{title}</h1>
          <h2 className={styles.tagline}>{tagline}</h2>
          <p className={styles.description}>{description}</p>
        </div>

        <div className={styles.buttons}>
          {buttons.map((btn, index) => {
            let link = btn.link || '#';
            if (btn.text === 'Register Now' && (link === '#' || link === '#register')) {
              link = '/register';
            }
            const isBtnInternal = isInternal(link);
            const btnClass = `btn ${btn.style === 'primary' ? 'btn-primary' : 'btn-outline'}`;
            return isBtnInternal ? (
              <Link key={index} href={link} className={btnClass}>
                {btn.text}
              </Link>
            ) : (
              <a
                key={index}
                href={link}
                className={btnClass}
              >
                {btn.text}
              </a>
            );
          })}
        </div>
      </div>

      {/* Stats at bottom of hero */}
      <div className={styles.bottomStats}>
        {bottomStats.map((stat, index) => (
          <React.Fragment key={index}>
            <span className={styles.statText}>{stat.text}</span>
            {index < bottomStats.length - 1 && (
              <div className={styles.statSeparator} />
            )}
          </React.Fragment>
        ))}
      </div>
    </section>
  );
}
