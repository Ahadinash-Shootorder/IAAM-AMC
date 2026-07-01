import React from 'react';
import styles from './ContactsMap.module.css';

export default function ContactsMap({ data }) {
  if (!data) return null;

  const embedUrl = data.embedUrl || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2047.8864757279768!2d15.4287515!3d58.1187427!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4659779df30b4ad1%3A0x6b2ff825c521ab29!2sGammalkilsv%C3%A4gen%2018%2C%20590%2053%20Ulrika%2C%20Sweden!5e0!3m2!1sen!2sin!4v1719660000000!5m2!1sen!2sin";

  return (
    <section className={styles.mapSection}>
      <div className={styles.mapWrapper}>
        <iframe
          src={embedUrl}
          className={styles.mapIframe}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Office Location Map"
        />
      </div>
    </section>
  );
}
