'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import styles from './Header.module.css';

export default function Header({ data }) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const rawLogo = data?.logo || 'LOGO.jpg';
  const logo = rawLogo.startsWith('/') || rawLogo.startsWith('http') ? rawLogo : `/${rawLogo}`;
  const navItems = data?.navItems || [];
  const ctaButton = data?.ctaButton || { text: 'Submit Abstract', link: '#' };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

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
  
  const cleanCtaLink = sanitizeLink(ctaButton.link);
  const isCtaInternal = isCtaInternalHelper(cleanCtaLink);

  function isCtaInternalHelper(url) {
    return isInternal(url);
  }

  return (
    <header className={styles.header}>
      <Link href="/">
        <Image
          className={styles.logo}
          src={logo}
          alt="Logo"
          width={109}
          height={41}
          priority
        />
      </Link>

      <div className={styles.mobileRight}>
        <button 
          className={styles.hamburger} 
          onClick={toggleMenu}
          aria-label="Toggle Menu"
        >
          {isMenuOpen ? '✕' : '☰'}
        </button>

        {isCtaInternal ? (
          <Link href={cleanCtaLink} className={`${styles.ctaButton} ${styles.mobileHiddenCta}`}>
            {ctaButton.text}
          </Link>
        ) : (
          <a href={cleanCtaLink} className={`${styles.ctaButton} ${styles.mobileHiddenCta}`}>
            {ctaButton.text}
          </a>
        )}
      </div>

      <nav className={`${styles.nav} ${isMenuOpen ? styles.navOpen : ''}`}>
        {navItems.map((item) => {
          let linkHref = item.link || '#';
          if (pathname !== '/' && linkHref.startsWith('#')) {
            linkHref = `/${linkHref}`;
          } else {
            linkHref = sanitizeLink(linkHref);
          }
          const isItemInternal = isInternal(linkHref);
          return isItemInternal ? (
            <Link
              key={item.label}
              href={linkHref}
              className={styles.navLink}
              onClick={() => setIsMenuOpen(false)}
            >
              {item.label}
            </Link>
          ) : (
            <a
              key={item.label}
              href={linkHref}
              className={styles.navLink}
              onClick={() => setIsMenuOpen(false)}
            >
              {item.label}
            </a>
          );
        })}
        {/* Render CTA button inside mobile menu as well */}
        {isCtaInternal ? (
          <Link href={cleanCtaLink} className={`${styles.ctaButton} ${styles.mobileNavCta}`}>
            {ctaButton.text}
          </Link>
        ) : (
          <a href={cleanCtaLink} className={`${styles.ctaButton} ${styles.mobileNavCta}`}>
            {ctaButton.text}
          </a>
        )}
      </nav>
      
      {/* Desktop right CTA */}
      {isCtaInternal ? (
        <Link href={cleanCtaLink} className={`${styles.ctaButton} ${styles.desktopCta}`}>
          {ctaButton.text}
        </Link>
      ) : (
        <a href={cleanCtaLink} className={`${styles.ctaButton} ${styles.desktopCta}`}>
          {ctaButton.text}
        </a>
      )}
    </header>
  );
}
