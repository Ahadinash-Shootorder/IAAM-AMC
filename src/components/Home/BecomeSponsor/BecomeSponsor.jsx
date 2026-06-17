import React from 'react';
import Image from 'next/image';
import styles from './BecomeSponsor.module.css';

export default function BecomeSponsor({ data }) {
  const titlePrefix = data?.titlePrefix || 'Become';
  const type = data?.type || 'Sponsor';
  const description = data?.description || '';
  const subDescription = data?.subDescription || '';
  const buttonText = data?.buttonText || 'Become a Sponsor';
  const buttonLink = data?.buttonLink || '#';
  const rawBgImage = data?.backgroundImage || 'sponsor_cta_bg.png';
  const backgroundImage = rawBgImage.startsWith('/') || rawBgImage.startsWith('http') ? rawBgImage : `/${rawBgImage}`;

  return (
    <div className={styles.wrapper}>
      <div className={styles.left}>
        <div className={styles.titleGroup}>
          <h3 className={styles.become}>{titlePrefix}</h3>
          <h2 className={styles.type}>{type}</h2>
        </div>

        <p className={styles.description}>{description}</p>
        <p className={styles.subDescription}>{subDescription}</p>

        <a href={buttonLink} className={`btn btn-primary ${styles.ctaButton}`}>
          {buttonText}
        </a>
      </div>

      <div className={styles.right}>
        <div className={styles.imageOverlay}>
          <Image
            src={backgroundImage}
            alt={`${titlePrefix} ${type}`}
            className={styles.ctaImage}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
}
