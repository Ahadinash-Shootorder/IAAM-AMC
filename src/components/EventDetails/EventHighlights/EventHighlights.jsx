'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import styles from './EventHighlights.module.css';

export default function EventHighlights({ data }) {
  const scrollContainerRef = useRef(null);

  if (!data) return null;

  const title = data.title || 'Conference Highlights';
  const description = data.description || '';
  const highlights = data.highlights || [];

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className={styles.highlightsSection}>
      <div className={styles.container}>
        {/* Section Header with Chevron Navigation */}
        <div className={styles.header}>
          <div className={styles.titleArea}>
            <h2 className={styles.sectionTitle}>{title}</h2>
            {description && <p className={styles.sectionDesc}>{description}</p>}
          </div>
          
          {highlights.length > 3 && (
            <div className={styles.navButtons}>
              <button 
                onClick={() => scroll('left')} 
                className={styles.navBtn}
                aria-label="Previous slides"
              >
                <FiChevronLeft size={20} />
              </button>
              <button 
                onClick={() => scroll('right')} 
                className={styles.navBtn}
                aria-label="Next slides"
              >
                <FiChevronRight size={20} />
              </button>
            </div>
          )}
        </div>

        {/* Horizontal Scrollable Highlights Track */}
        {highlights.length > 0 && (
          <div ref={scrollContainerRef} className={styles.track}>
            {highlights.map((item, index) => (
              <div key={index} className={styles.card}>
                {item.image && (
                  <div className={styles.imageContainer}>
                    <Image
                      src={item.image.startsWith('/') || item.image.startsWith('http') ? item.image : `/${item.image}`}
                      alt={item.title || 'Highlight'}
                      fill
                      sizes="(max-width: 768px) 100vw, 224px"
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                )}
                <div className={styles.cardInfo}>
                  <span className={styles.cardYear}>{item.yearRange}</span>
                  <h3 className={styles.cardTitle}>{item.title}</h3>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
