import React from 'react';
import Image from 'next/image';
import { FiCalendar, FiMapPin, FiArrowRight } from 'react-icons/fi';
import styles from './AssembliesCards.module.css';

export default function AssembliesCards({ data }) {
  if (!data) return null;

  const { cards = [] } = data;

  return (
    <section className={styles.cardsSection}>
      <div className={styles.cardsContainer}>
        {cards.map((card, index) => {
          const { image, isFeatured, date, location, title, description, stats = [], buttons = [] } = card;
          const showFeatured = isFeatured === 'true' || isFeatured === true;

          return (
            <div key={index} className={styles.eventCard}>
              <div className={styles.cardImageWrapper}>
                <div className={styles.imgInner}>
                  {image && (
                    <Image
                      src={image}
                      className={styles.cardImg}
                      alt={title || "Congress Image"}
                      fill
                      sizes="(max-width: 1024px) 100vw, 33vw"
                      priority={index === 0}
                      loading={index === 0 ? undefined : "lazy"}
                    />
                  )}
                </div>
                {showFeatured && <span className={styles.featuredBadge}>FEATURED</span>}
              </div>
              <div className={styles.cardContent}>
                <div className={styles.cardMeta}>
                  {date && (
                    <div className={styles.cardMetaItem}>
                      <FiCalendar className={styles.metaIcon} size={14} />
                      <span>{date}</span>
                    </div>
                  )}
                  {date && location && <div className={styles.cardMetaDivider}>|</div>}
                  {location && (
                    <div className={styles.cardMetaItem}>
                      <FiMapPin className={styles.metaIcon} size={14} />
                      <span>{location}</span>
                    </div>
                  )}
                </div>

                {title && <h2 className={styles.cardTitle}>{title}</h2>}

                {description && <p className={styles.cardDescription}>{description}</p>}

                {stats.length > 0 && (
                  <div className={styles.statsGrid}>
                    {stats.map((stat, sIdx) => (
                      <div key={sIdx} className={styles.statItem}>
                        <span className={styles.statValue}>{stat.value}</span>
                        <span className={styles.statLabel}>{stat.label}</span>
                      </div>
                    ))}
                  </div>
                )}

                {buttons.length > 0 && (
                  <div className={styles.cardActions}>
                    {buttons.map((btn, bIdx) => {
                      const isOutline = bIdx > 0;
                      return (
                        <a
                          key={bIdx}
                          href={btn.link || '#'}
                          className={isOutline ? styles.btnSubmit : styles.btnVisit}
                        >
                          <span>{btn.text}</span>
                          {!isOutline && <FiArrowRight size={14} />}
                        </a>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
