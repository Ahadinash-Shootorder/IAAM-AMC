'use client';

import React from 'react';
import Image from 'next/image';
import { FiCalendar, FiMapPin, FiGlobe, FiRadio, FiArrowRight, FiUsers, FiBookOpen } from 'react-icons/fi';
import styles from './AssembliesContent.module.css';

export default function AssembliesContent() {
  return (
    <div className={styles.pageWrapper}>

      {/* ── 1. Hero Section ── */}
      <section className={styles.heroSection}>
        <div className={styles.heroBg}>
          <Image
            src="/uploads/assemblies/A-HeroBanner.jpg"
            className={styles.heroImg}
            alt="Hero Background"
            fill
            sizes="100vw"
            priority
          />
          <div className={styles.heroOverlay} />
        </div>
        <div className={styles.heroContainer}>
          <div className={styles.heroContent}>
            <span className={styles.heroSubtitle}>SCIENTIFIC ASSEMBLIES 2026</span>
            <h1 className={styles.heroTitle}>Find Upcoming Advanced<br />Materials Congresses</h1>
            <p className={styles.heroDescription}>
              Join the world&apos;s leading researchers, scientists, and industry experts for a
              series of high-impact congresses dedicated to the future of advanced
              materials science.
            </p>
            <div className={styles.heroBadges}>
              <div className={styles.heroBadge}>
                <div className={styles.badgeIconWrap}>
                  <FiGlobe size={18} color="#B8C4FF" />
                </div>
                <span className={styles.badgeText}>Global Destinations</span>
              </div>
              <div className={styles.heroBadge}>
                <div className={styles.badgeIconWrap}>
                  <FiRadio size={18} color="#B8C4FF" />
                </div>
                <span className={styles.badgeText}>Hybrid Formats Available</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. Sub-tab Navigation ── */}
      <div className={styles.tabSection}>
        <div className={styles.tabContainer}>
          <div className={styles.tabList}>
            <button className={`${styles.tabBtn} ${styles.tabBtnActive}`}>2026 Congresses</button>
            <button className={styles.tabBtn}>Fellow Assemblies</button>
            <button className={styles.tabBtn}>Advanced Materials Lecture Series</button>
            <button className={styles.tabBtn}>Contact Us</button>
          </div>
        </div>
      </div>

      {/* ── 3. Event Cards Section ── */}
      <section className={styles.cardsSection}>
        <div className={styles.cardsContainer}>

          {/* Card 1: American Advanced Materials Congress */}
          <div className={styles.eventCard}>
            <div className={styles.cardImageWrapper}>
              <div className={styles.imgInner}>
                <Image
                  src="/uploads/assemblies/American.jpg"
                  className={styles.cardImg}
                  alt="American Advanced Materials Congress"
                  fill
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  priority
                />
              </div>
              <span className={styles.featuredBadge}>FEATURED</span>
            </div>
            <div className={styles.cardContent}>
              <div className={styles.cardMeta}>
                <div className={styles.cardMetaItem}>
                  <FiCalendar className={styles.metaIcon} size={14} />
                  <span>20-21 August 2026</span>
                </div>
                <div className={styles.cardMetaDivider}>|</div>
                <div className={styles.cardMetaItem}>
                  <FiMapPin className={styles.metaIcon} size={14} />
                  <span>New Jersey, USA</span>
                </div>
              </div>

              <h2 className={styles.cardTitle}>American Advanced Materials Congress</h2>

              <p className={styles.cardDescription}>
                Exploration of next-generation semiconductors, sustainable polymers, and aerospace materials engineering. A premier gathering for the North American research community.
              </p>

              <div className={styles.statsGrid}>
                <div className={styles.statItem}>
                  <span className={styles.statValue}>500+</span>
                  <span className={styles.statLabel}>Delegates</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statValue}>40+</span>
                  <span className={styles.statLabel}>Countries</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statValue}>120+</span>
                  <span className={styles.statLabel}>Speakers</span>
                </div>
              </div>

              <div className={styles.cardActions}>
                <a href="#" className={styles.btnVisit}>
                  <span>Visit Website</span>
                  <FiArrowRight size={14} />
                </a>
                <a href="#" className={styles.btnSubmit}>
                  Submit Abstract
                </a>
              </div>
            </div>
          </div>

          {/* Card 2: European Advanced Materials Congress */}
          <div className={styles.eventCard}>
            <div className={styles.cardImageWrapper}>
              <div className={styles.imgInner}>
                <Image
                  src="/uploads/assemblies/European.jpg"
                  className={styles.cardImg}
                  alt="European Advanced Materials Congress"
                  fill
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  loading="lazy"
                />
              </div>
            </div>
            <div className={styles.cardContent}>
              <div className={styles.cardMeta}>
                <div className={styles.cardMetaItem}>
                  <FiCalendar className={styles.metaIcon} size={14} />
                  <span>25-27 August 2026</span>
                </div>
                <div className={styles.cardMetaDivider}>|</div>
                <div className={styles.cardMetaItem}>
                  <FiMapPin className={styles.metaIcon} size={14} />
                  <span>Stockholm, Sweden</span>
                </div>
              </div>

              <h2 className={styles.cardTitle}>European Advanced Materials Congress</h2>

              <p className={styles.cardDescription}>
                The 2026 European edition focuses on the Circular Economy of Materials and Bio-integrated Electronics within the prestigious environment of the Baltic Sea cruises.
              </p>

              <div className={styles.statsGrid}>
                <div className={styles.statItem}>
                  <span className={styles.statValue}>850+</span>
                  <span className={styles.statLabel}>Delegates</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statValue}>65+</span>
                  <span className={styles.statLabel}>Countries</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statValue}>200+</span>
                  <span className={styles.statLabel}>Speakers</span>
                </div>
              </div>

              <div className={styles.cardActions}>
                <a href="#" className={styles.btnVisit}>
                  <span>Visit Website</span>
                  <FiArrowRight size={14} />
                </a>
                <a href="#" className={styles.btnSubmit}>
                  Submit Abstract
                </a>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── 4. CTA Section ("Cannot find your congress?") ── */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaOuterContainer}>
          <div className={styles.ctaCard}>
            <div className={styles.ctaCardBg} />

            <div className={styles.ctaLeftColumn}>
              <h2 className={styles.ctaTitle}>Cannot find your<br />congress?</h2>
              <p className={styles.ctaText}>
                Browse our full archive of past events or subscribe to our newsletter to receive notifications for newly announced assemblies.
              </p>
              <div className={styles.ctaActions}>
                <a href="#" className={styles.btnCtaPrimary}>Browse Archives</a>
                <a href="#" className={styles.btnCtaOutline}>Subscribe Now</a>
              </div>
            </div>


            <div className={styles.ctaRightColumn}>
              <div className={styles.gridBoxContainer}>
                <div className={styles.gridBox}>
                  <div className={styles.gridBoxIconWrap}>
                    <svg width="44" height="44" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2Q12 12 22 12Q12 12 12 22Q12 12 2 12Q12 12 12 2Z" fill="#B8C4FF" />
                      <path d="M19 5Q19 9 23 9Q19 9 19 13Q19 9 15 9Q19 9 19 5Z" fill="#B8C4FF" opacity="0.7" />
                      <path d="M6 14Q6 17 9 17Q6 17 6 20Q6 17 3 17Q6 17 6 14Z" fill="#B8C4FF" opacity="0.7" />
                    </svg>
                  </div>
                  <span className={styles.gridBoxTitle}>Network with Experts</span>
                </div>

                <div className={`${styles.gridBox} ${styles.gridBoxShifted}`}>
                  <div className={styles.gridBoxIconWrap}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#FA2E6E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4 10V6h16v4" />
                      <path d="M12 20V8" />
                      <path d="M7 13l5-5 5 5" />
                    </svg>
                  </div>
                  <span className={styles.gridBoxTitle}>Publish Results</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
