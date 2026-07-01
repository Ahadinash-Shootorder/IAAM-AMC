import React from 'react';
import styles from './ProceedingContent.module.css';

export default function ProceedingContent({ data }) {
  if (!data) return null;

  return (
    <section className={styles.contentSection}>
      <div className={styles.container}>
        <div 
          className={styles.htmlContent}
          dangerouslySetInnerHTML={{ __html: data.htmlContent || '' }}
        />
      </div>
    </section>
  );
}
