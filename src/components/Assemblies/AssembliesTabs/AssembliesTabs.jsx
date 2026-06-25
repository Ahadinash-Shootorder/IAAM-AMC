'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './AssembliesTabs.module.css';

export default function AssembliesTabs({ data }) {
  const pathname = usePathname();
  if (!data) return null;

  const { tabs = [] } = data;
  console.log('DEBUG TABS DATA:', JSON.stringify(tabs));

  const isInternal = (url) => typeof url === 'string' && url.startsWith('/') && !url.startsWith('//');

  return (
    <div className={styles.tabSection}>
      <div className={styles.tabContainer}>
        <div className={styles.tabList}>
          {tabs.map((tab, idx) => {
            if (typeof tab === 'string') {
              return (
                <span
                  key={idx}
                  className={`${styles.tabBtn} ${pathname === '#' ? styles.tabBtnActive : ''}`}
                >
                  {tab}
                </span>
              );
            }

            const isTabActive = tab.isActive === 'true' || tab.isActive === true || pathname === tab.link;
            const isTabInternal = isInternal(tab.link);

            if (isTabInternal) {
              return (
                <Link
                  key={idx}
                  href={tab.link}
                  className={`${styles.tabBtn} ${isTabActive ? styles.tabBtnActive : ''}`}
                >
                  {tab.label}
                </Link>
              );
            }

            return (
              <a
                key={idx}
                href={tab.link || '#'}
                className={`${styles.tabBtn} ${isTabActive ? styles.tabBtnActive : ''}`}
              >
                {tab.label}
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
