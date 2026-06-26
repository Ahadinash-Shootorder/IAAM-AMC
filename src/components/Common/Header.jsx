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
  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  const CtaTag = isInternal(cleanCtaLink) ? Link : 'a';
  const ctaProps = isInternal(cleanCtaLink) ? { href: cleanCtaLink } : { href: cleanCtaLink };

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

        <CtaTag {...ctaProps} className={`${styles.ctaButton} ${styles.mobileHiddenCta}`}>
          {ctaButton.text}
        </CtaTag>
      </div>

      <nav className={`${styles.nav} ${isMenuOpen ? styles.navOpen : ''}`}>
        {navItems.map((item) => {
          let linkHref = item.link || '#';
          if (linkHref.startsWith('#')) {
            if (pathname !== '/') {
              linkHref = `/${linkHref}`;
            }
          } else {
            linkHref = sanitizeLink(linkHref);
          }
          const isItemInternal = isInternal(linkHref);
          const Tag = isItemInternal ? Link : 'a';
          const tagProps = isItemInternal ? { href: linkHref } : { href: linkHref };
          return (
            <Tag
              key={item.label}
              {...tagProps}
              className={styles.navLink}
              onClick={() => setIsMenuOpen(false)}
            >
              {item.label}
            </Tag>
          );
        })}
        <CtaTag {...ctaProps} className={`${styles.ctaButton} ${styles.mobileNavCta}`}>
          {ctaButton.text}
        </CtaTag>
      </nav>

      <CtaTag {...ctaProps} className={`${styles.ctaButton} ${styles.desktopCta}`}>
        {ctaButton.text}
      </CtaTag>
    </header>
  );
}
