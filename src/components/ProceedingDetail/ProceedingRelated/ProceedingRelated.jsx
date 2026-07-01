import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './ProceedingRelated.module.css';

export default function ProceedingRelated({ data, allProceedings = {}, currentId }) {
  if (!data) return null;

  // Get 3 proceedings excluding the current one
  const relatedList = Object.entries(allProceedings)
    .filter(([id]) => id !== currentId)
    .map(([id, p]) => ({ id, ...p.meta }))
    .slice(0, 3);

  if (relatedList.length === 0) return null;

  return (
    <section className={styles.relatedSection}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>{data.title || 'RELATED PROCEEDINGS'}</h2>
          {data.exploreLink && (
            <Link href={data.exploreLink} className={styles.exploreLink}>
              {data.exploreText || 'Explore All'}
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          )}
        </div>

        <div className={styles.grid}>
          {relatedList.map((item, index) => {
            const slug = item.slug || item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
            return (
              <Link href={`/congress-proceedings/${slug}`} key={index} className={styles.card} style={{ textDecoration: 'none' }}>
                <div className={styles.imageWrapper}>
                  {(() => {
                    const defaultImg = '/uploads/about/globalEvents/1782885225827-European.jpg';
                    const rawImg = item.coverImage || defaultImg;
                    const imgSrc = rawImg.startsWith('/') || rawImg.startsWith('http') ? rawImg : `/${rawImg}`;
                    return <Image src={imgSrc} alt={item.title} className={styles.image} fill sizes="(max-width: 768px) 100vw, 33vw" loading="lazy" />;
                  })()}
                </div>
                <div className={styles.cardContent}>
                  <div className={styles.textBlock}>
                    <div className={styles.categoryAndTitle}>
                      <span className={styles.category}>{item.category}</span>
                      <h3 className={styles.cardTitle}>{item.title}</h3>
                    </div>
                  </div>
                  <p className={styles.authorDate}>{item.authors} - {item.date}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
