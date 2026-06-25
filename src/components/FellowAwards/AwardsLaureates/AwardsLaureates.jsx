'use client';

import React from 'react';
import styles from './AwardsLaureates.module.css';

export default function AwardsLaureates({ data }) {
  const title = data?.title || 'Distinguished Fellows';
  const description = data?.description || 'Celebrating a legacy of scientific leadership and extraordinary vision.';
  const ctaText = data?.ctaText || 'View All Fellows';
  const ctaLink = data?.ctaLink || '#';
  const laureates = data?.laureates || [
    {
      image: '/uploads/fellow-awards/rodrigo.jpg',
      name: 'Prof. Rodrigo Martins',
      title: 'FIAAM LAUREATE',
      description: 'Pioneer in paper electronics and transparent semiconductors, shaping the next generation of sustainable technology.',
      affiliation: 'NOVA University Lisbon'
    },
    {
      image: '/uploads/fellow-awards/federico.jpg',
      name: 'Prof. Federico Rosei',
      title: 'FIAAM LAUREATE',
      description: 'World-renowned for his work in nanomaterials and their applications in solar energy harvesting and storage solutions.',
      affiliation: 'INRS-EMT, Canada'
    },
    {
      image: '/uploads/fellow-awards/sarah.jpg',
      name: 'Prof. Dr. Sarah Chen',
      title: 'FIAAM FELLOW',
      description: 'Leading innovations in 2D materials for ultra-efficient hydrogen production and zero-emission energy cycles.',
      affiliation: 'ETH Zurich'
    }
  ];

  return (
    <section className={styles.laureatesSection}>
      <div className={styles.container}>
        {/* Header Row */}
        <div className={styles.headerRow}>
          <div className={styles.headerLeft}>
            <div className={styles.titleWrapper}>
              <h2 className={styles.title}>{title}</h2>
            </div>
            <div className={styles.descWrapper}>
              <p className={styles.description}>{description}</p>
            </div>
          </div>
          <div className={styles.headerRight}>
            <a href={ctaLink} className={styles.ctaLink}>
              <span className={styles.ctaText}>{ctaText}</span>
              <span className={styles.ctaIconWrapper}>
                <span className={styles.ctaIcon} />
              </span>
            </a>
          </div>
        </div>

        {/* Laureates Grid */}
        <div className={styles.grid}>
          {laureates.map((person, idx) => {
            const initials = person.name.split(' ').pop()?.[0] || 'F';
            return (
              <div key={idx} className={styles.card}>
                {/* Top Row: Avatar + Name/Badge Info */}
                <div className={styles.cardHeader}>
                  <div className={styles.avatarWrapper}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={person.image}
                      alt={person.name}
                      className={styles.avatar}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentNode.querySelector('[data-placeholder]').style.display = 'flex';
                      }}
                    />
                    <div className={styles.avatarPlaceholder} data-placeholder="" style={{ display: 'none' }}>
                      <span>{initials}</span>
                    </div>
                  </div>

                  <div className={styles.headerInfo}>
                    <div className={styles.nameWrapper}>
                      <h3 className={styles.name}>{person.name}</h3>
                    </div>
                    <div className={styles.badgeWrapper}>
                      <span className={styles.badge}>{person.title}</span>
                    </div>
                  </div>
                </div>

                {/* Middle Row: Biography description */}
                <div className={styles.bioWrapper}>
                  <p className={styles.bio}>{person.description}</p>
                </div>

                {/* Bottom Row: Affiliation */}
                <div className={styles.cardFooter}>
                  <div className={styles.affiliationWrapper}>
                    <span className={styles.affiliation}>Affiliation: {person.affiliation}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
