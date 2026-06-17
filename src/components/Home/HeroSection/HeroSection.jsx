import React from 'react';
import Image from 'next/image';
import styles from './HeroSection.module.css';

export default function HeroSection({ data }) {
  const rawBgImage = data?.backgroundImage || 'HeroBanner.jpg';
  const bgImage = rawBgImage.startsWith('/') || rawBgImage.startsWith('http') ? rawBgImage : `/${rawBgImage}`;
  const subtitle = data?.subtitle || '';
  const title = data?.title || '';
  const tagline = data?.tagline || '';
  const description = data?.description || '';
  const buttons = data?.buttons || [];
  const bottomStats = data?.bottomStats || [];

  return (
    <section className={styles.hero}>
      {/* Background Image and Gradient */}
      <div className={styles.bgWrapper}>
        <Image
          className={styles.bgImage}
          src={bgImage}
          alt="Hero Background"
          fill
          sizes="100vw"
          priority
        />
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
          {buttons.map((btn, index) => (
            <a
              key={index}
              href={btn.link || '#'}
              className={`btn ${btn.style === 'primary' ? 'btn-primary' : 'btn-outline'}`}
            >
              {btn.text}
            </a>
          ))}
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
