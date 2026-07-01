import React from 'react';
import styles from './ContactsTitle.module.css';

export default function ContactsTitle({ data }) {
  if (!data) return null;

  return (
    <div className={styles.titleArea}>
      <h1 className={styles.title}>{data.title || 'CONTACT US'}</h1>
    </div>
  );
}
