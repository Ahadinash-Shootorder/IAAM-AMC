'use client';

import React, { useRef, useEffect } from 'react';
import Image from 'next/image';
import styles from './SponsorsSection.module.css';

export default function SponsorsSection({ data }) {
  const title = data?.title || 'Sponsors';
  const logos = data?.logos || [];
  const scrollRef = useRef(null);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    
    let interval;
    const startScroll = () => {
      // Only auto-scroll on mobile where it's scrollable
      if (window.innerWidth <= 768) {
        interval = setInterval(() => {
          if (container) {
            const maxScroll = container.scrollWidth - container.clientWidth;
            if (container.scrollLeft >= maxScroll - 10) {
              container.scrollTo({ left: 0, behavior: 'smooth' });
            } else {
              container.scrollBy({ left: 200, behavior: 'smooth' });
            }
          }
        }, 3000);
      }
    };

    startScroll();

    // Pause on touch/interaction
    const stopScroll = () => clearInterval(interval);
    container.addEventListener('touchstart', stopScroll);
    container.addEventListener('touchend', startScroll);
    
    return () => {
      clearInterval(interval);
      container.removeEventListener('touchstart', stopScroll);
      container.removeEventListener('touchend', startScroll);
    };
  }, []);

  return (
    <section id="sponsors" className={styles.section}>
      <h2 className={styles.title}>{title}</h2>

      <div className={styles.grid} ref={scrollRef}>
        {logos.map((sponsor, index) => {
          const rawImg = sponsor.image || '';
          const imgSrc = rawImg && !rawImg.startsWith('/') && !rawImg.startsWith('http') ? `/${rawImg}` : rawImg;
          
          return (
            <div key={index} className={styles.card}>
              {imgSrc ? (
                <Image
                  src={imgSrc}
                  alt={sponsor.alt || `Sponsor ${index + 1}`}
                  className={styles.sponsorImage}
                  width={200}
                  height={80}
                  loading="lazy"
                  style={{ objectFit: 'contain' }}
                />
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}
