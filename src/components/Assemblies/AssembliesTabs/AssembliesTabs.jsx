'use client';

import React, { useState } from 'react';
import styles from './AssembliesTabs.module.css';

export default function AssembliesTabs({ data }) {
  const [activeTabIdx, setActiveTabIdx] = useState(0);
  if (!data) return null;

  const { tabs = [] } = data;

  return (
    <div className={styles.tabSection}>
      <div className={styles.tabContainer}>
        <div className={styles.tabList}>
          {tabs.map((tab, idx) => (
            <button
              key={idx}
              className={`${styles.tabBtn} ${activeTabIdx === idx ? styles.tabBtnActive : ''}`}
              onClick={() => setActiveTabIdx(idx)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
