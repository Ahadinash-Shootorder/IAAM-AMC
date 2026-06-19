'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Header.module.css';

export default function Header({ data }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const rawLogo = data?.logo || 'LOGO.jpg';
  const logo = rawLogo.startsWith('/') || rawLogo.startsWith('http') ? rawLogo : `/${rawLogo}`;
  const navItems = data?.navItems || [];
  const ctaButton = data?.ctaButton || { text: 'Submit Abstract', link: '#' };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const isInternal = (url) => url && url.startsWith('/') && !url.startsWith('//');
  const isCtaInternal = isInternal(ctaButton.link);

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
          <Link href={ctaButton.link} className={`${styles.ctaButton} ${styles.mobileHiddenCta}`}>
            {ctaButton.text}
          </Link>
        ) : (
          <a href={ctaButton.link || '#'} className={`${styles.ctaButton} ${styles.mobileHiddenCta}`}>
            {ctaButton.text}
          </a>
        )}
      </div>

      <nav className={`${styles.nav} ${isMenuOpen ? styles.navOpen : ''}`}>
        {navItems.map((item) => {
          const isItemInternal = isInternal(item.link);
          return isItemInternal ? (
            <Link
              key={item.label}
              href={item.link}
              className={styles.navLink}
              onClick={() => setIsMenuOpen(false)}
            >
              {item.label}
            </Link>
          ) : (
            <a
              key={item.label}
              href={item.link || '#'}
              className={styles.navLink}
              onClick={() => setIsMenuOpen(false)}
            >
              {item.label}
            </a>
          );
        })}
        {/* Render CTA button inside mobile menu as well */}
        {isCtaInternal ? (
          <Link href={ctaButton.link} className={`${styles.ctaButton} ${styles.mobileNavCta}`}>
            {ctaButton.text}
          </Link>
        ) : (
          <a href={ctaButton.link || '#'} className={`${styles.ctaButton} ${styles.mobileNavCta}`}>
            {ctaButton.text}
          </a>
        )}
      </nav>
      
      {/* Desktop right CTA */}
      {isCtaInternal ? (
        <Link href={ctaButton.link} className={`${styles.ctaButton} ${styles.desktopCta}`}>
          {ctaButton.text}
        </Link>
      ) : (
        <a href={ctaButton.link || '#'} className={`${styles.ctaButton} ${styles.desktopCta}`}>
          {ctaButton.text}
        </a>
      )}
    </header>
  );
}
