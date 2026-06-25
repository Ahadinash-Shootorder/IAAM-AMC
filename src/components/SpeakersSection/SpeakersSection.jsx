'use client';

import React, { useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './SpeakersSection.module.css';

export default function SpeakersSection({ data }) {
  const title = data?.title || "They've spoken at our events";
  const speakers = data?.speakers || [];
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
              container.scrollBy({ left: 280, behavior: 'smooth' });
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

  const midpoint = Math.ceil(speakers.length / 2);
  const group1 = speakers.slice(0, midpoint);
  const group2 = speakers.slice(midpoint);

  return (
    <section id="speakers" className={styles.theyveSpokenAtOurEventsParent}>
      <h2 className={styles.theyveSpokenAt}>{title}</h2>

      <div className={styles.frameParent} ref={scrollRef}>
        <div className={styles.frameGroup}>
          {group1.map((speaker, index) => (
            <Link
              key={`group1-${index}`}
              href={`/speakers/${speaker.slug || speaker.name.toLowerCase().replace(/\s+/g, '-')}`}
              className={styles.frameContainer}
            >
              <div className={styles.imageWrapper}>
                {(() => {
                  const rawImg = speaker.image || '';
                  const imgSrc = rawImg && !rawImg.startsWith('/') && !rawImg.startsWith('http') ? `/${rawImg}` : rawImg;
                  return imgSrc ? (
                    <Image
                      className={styles.frameChild}
                      src={imgSrc}
                      alt={speaker.name}
                      fill
                      sizes="(max-width: 768px) 50vw, 20vw"
                      priority
                    />
                  ) : null;
                })()}
              </div>
              <div className={styles.jennyWilson}>
                {speaker.name}
              </div>
              <div className={styles.ceoGenetech}>
                {speaker.designation}
              </div>
            </Link>
          ))}
        </div>

        <div className={styles.frameParent5}>
          {group2.map((speaker, index) => (
            <Link
              key={`group2-${index}`}
              href={`/speakers/${speaker.slug || speaker.name.toLowerCase().replace(/\s+/g, '-')}`}
              className={styles.frameContainer}
            >
              <div className={styles.imageWrapper}>
                {(() => {
                  const rawImg = speaker.image || '';
                  const imgSrc = rawImg && !rawImg.startsWith('/') && !rawImg.startsWith('http') ? `/${rawImg}` : rawImg;
                  return imgSrc ? (
                    <Image
                      className={styles.frameChild}
                      src={imgSrc}
                      alt={speaker.name}
                      fill
                      sizes="(max-width: 768px) 50vw, 20vw"
                      loading="lazy"
                    />
                  ) : null;
                })()}
              </div>
              <div className={styles.jennyWilson}>
                {speaker.name}
              </div>
              <div className={styles.ceoGenetech}>
                {speaker.designation}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
