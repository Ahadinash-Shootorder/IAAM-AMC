import React from 'react';
import Link from 'next/link';
import { FiTwitter, FiLinkedin, FiFacebook, FiYoutube } from 'react-icons/fi';
import styles from './Footer.module.css';

export default function Footer({ data }) {
  const title = data?.title || 'International Association of Advance Material';
  const subtitle = data?.subtitle || 'Stockholm, Sweden';
  const infoTexts = data?.infoTexts || [];
  const links = data?.links || [];
  const bottomText = data?.bottomText || 'Advance Material Congress Powered By IAAM';

  // Split links into two columns for a better layout if there are many
  const midpoint = Math.ceil(links.length / 2);
  const linksCol1 = links.slice(0, midpoint);
  const linksCol2 = links.slice(midpoint);

  const sanitizeLink = (url) => {
    if (typeof url !== 'string') return '#';
    if (
      url.startsWith('/') ||
      url.startsWith('http') ||
      url.startsWith('mailto:') ||
      url.startsWith('tel:') ||
      url.startsWith('#')
    ) {
      return url;
    }
    return `/${url}`;
  };

  const isInternal = (url) => typeof url === 'string' && url.startsWith('/') && !url.startsWith('//');

  return (
    <footer id="contacts" className={styles.footer}>
      <div className={styles.inner}>
        
        <div className={styles.topSection}>
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.subtitle}>{subtitle}</p>
        </div>

        <div className={styles.divider} />

        <div className={styles.grid}>
          {/* Left: Info Texts */}
          <div className={styles.infoGroup}>
            {infoTexts.map((text, index) => (
              <p key={index} className={styles.infoText}>{text}</p>
            ))}
          </div>

          {/* Right: Quick Links Grid */}
          <div className={styles.linksGroup}>
            <div className={styles.linkColumn}>
              <span className={styles.linkTitle}>Quick Links</span>
              {linksCol1.map((link) => {
                const cleanLink = sanitizeLink(link.link);
                const isItemInternal = isInternal(cleanLink);
                return isItemInternal ? (
                  <Link key={link.label} href={cleanLink} className={styles.link}>
                    {link.label}
                  </Link>
                ) : (
                  <a key={link.label} href={cleanLink} className={styles.link}>
                    {link.label}
                  </a>
                );
              })}
            </div>
            {linksCol2.length > 0 && (
              <div className={styles.linkColumn}>
                <span className={styles.linkTitle}>Resources</span>
                {linksCol2.map((link) => {
                  const cleanLink = sanitizeLink(link.link);
                  const isItemInternal = isInternal(cleanLink);
                  return isItemInternal ? (
                    <Link key={link.label} href={cleanLink} className={styles.link}>
                      {link.label}
                    </Link>
                  ) : (
                    <a key={link.label} href={cleanLink} className={styles.link}>
                      {link.label}
                    </a>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className={styles.bottomBar}>
          <p className={styles.bottomText}>
            © {new Date().getFullYear()} {bottomText}. All rights reserved.
          </p>
          <div className={styles.socials}>
            <a href="#" className={styles.socialIcon} aria-label="LinkedIn"><FiLinkedin size={18} /></a>
            <a href="#" className={styles.socialIcon} aria-label="Twitter"><FiTwitter size={18} /></a>
            <a href="#" className={styles.socialIcon} aria-label="Facebook"><FiFacebook size={18} /></a>
            <a href="#" className={styles.socialIcon} aria-label="YouTube"><FiYoutube size={18} /></a>
          </div>
        </div>

      </div>
    </footer>
  );
}
