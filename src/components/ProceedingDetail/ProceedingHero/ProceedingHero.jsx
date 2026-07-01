import React from 'react';
import Image from 'next/image';
import styles from './ProceedingHero.module.css';

export default function ProceedingHero({ data, coverImage }) {
  if (!data) return null;

  const defaultImg = '/uploads/about/globalEvents/1782885225827-European.jpg';
  const imgSrc = coverImage
    ? (coverImage.startsWith('/') || coverImage.startsWith('http') ? coverImage : `/${coverImage}`)
    : defaultImg;

  return (
    <div className={styles.heroWrapper}>
      {/* Blue Header Section */}
      <section className={styles.blueHeader}>
        <div className={styles.container}>
          <div className={styles.tag}>
            {data.category || 'FASHION DESIGN'}
          </div>
          <h1 className={styles.title}>
            {data.title}
          </h1>
          
          <div className={styles.meta}>
            <div className={styles.metaItem}>
              <span className={styles.iconPink}></span>
              <span className={styles.metaText}>{data.author}</span>
            </div>
            <div className={styles.divider}></div>
            <div className={styles.metaItem}>
              <span className={styles.iconPink}></span>
              <span className={styles.metaText}>{data.date}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Cover Image Section */}
      {imgSrc && (
        <section className={styles.imageSection}>
          <div className={styles.imageContainer}>
            <div className={styles.imageWrapper}>
              <Image 
                src={imgSrc} 
                alt={data.title} 
                fill 
                className={styles.heroImage} 
                priority
              />
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
