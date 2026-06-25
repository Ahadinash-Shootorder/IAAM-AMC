import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './ExploreSection.module.css';

export default function ExploreSection({ data }) {
  const title = data?.title || 'Explore More';
  const cards = data?.cards || [];

  // Split cards by position: left (top/bottom) and right
  const leftCards = cards.filter((c) => c.position === 'left-top' || c.position === 'left-bottom');
  const rightCard = cards.find((c) => c.position === 'right');

  const overlayMap = {
    red: styles.blurRed,
    purple: styles.blurPurple,
  };

  const isInternal = (url) => typeof url === 'string' && url.startsWith('/') && !url.startsWith('//');

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>{title}</h2>

      <div className={styles.content}>
        {/* Left Column - Two Stacked Cards */}
        <div className={styles.leftColumn}>
          {leftCards.map((card, index) => (
            <div key={index} className={`${styles.card} ${styles.smallCard}`}>
              {(() => {
                const rawImg = card.image || '';
                const imgSrc = typeof rawImg === 'string' && rawImg && !rawImg.startsWith('/') && !rawImg.startsWith('http') ? `/${rawImg}` : rawImg;
                return imgSrc ? (
                  <Image
                    src={imgSrc}
                    alt={card.heading}
                    className={styles.cardImage}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    loading="lazy"
                  />
                ) : null;
              })()}
              {card.overlayColor && card.overlayColor !== 'none' && (
                <div className={`${styles.blurOverlay} ${overlayMap[card.overlayColor] || ''}`} />
              )}
              <div className={styles.smallCardContent}>
                <h3 className={styles.cardHeading}>{card.heading}</h3>
                {isInternal(card.buttonLink) ? (
                  <Link href={card.buttonLink} className={styles.findOutMoreBtn}>
                    {card.buttonText}
                  </Link>
                ) : (
                  <a href={card.buttonLink || '#'} className={styles.findOutMoreBtn}>
                    {card.buttonText}
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Right Column - Large Card */}
        {rightCard && (
          <div className={styles.rightColumn}>
            <div className={`${styles.card} ${styles.largeCard}`}>
              {(() => {
                const rawImg = rightCard.image || '';
                const imgSrc = typeof rawImg === 'string' && rawImg && !rawImg.startsWith('/') && !rawImg.startsWith('http') ? `/${rawImg}` : rawImg;
                return imgSrc ? (
                  <Image
                    src={imgSrc}
                    alt={rightCard.heading}
                    className={styles.cardImage}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    loading="lazy"
                  />
                ) : null;
              })()}
              <div className={styles.largeCardInner}>
                <div className={styles.largeCardTop}>
                  <h3 className={styles.cardHeading}>{rightCard.heading}</h3>
                </div>
                <div className={styles.largeCardBottom}>
                  {rightCard.subHeading && (
                    <h3 className={styles.largeCardBottomHeading}>
                      {rightCard.subHeading}
                    </h3>
                  )}
                  {isInternal(rightCard.buttonLink) ? (
                    <Link href={rightCard.buttonLink} className={styles.findOutMoreBtn}>
                      {rightCard.buttonText}
                    </Link>
                  ) : (
                    <a href={rightCard.buttonLink || '#'} className={styles.findOutMoreBtn}>
                      {rightCard.buttonText}
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
