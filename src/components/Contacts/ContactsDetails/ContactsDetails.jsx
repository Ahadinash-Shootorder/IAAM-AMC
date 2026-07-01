import React from 'react';
import ContactForm from './ContactForm';
import styles from './ContactsDetails.module.css';

export default function ContactsDetails({ data }) {
  if (!data) return null;

  return (
    <section className={styles.contactSection}>
      <div className={styles.contactBlock}>
        <div className={styles.decorativeBg} />
        
        {/* Left Column: Info details */}
        <div className={styles.infoColumn}>
          <h2 className={styles.infoTitle}>{data.heading || 'Contact Us'}</h2>
          <p className={styles.infoDesc}>
            {data.description || 'Thank you for your interest in the Advanced Materials Congress! We are happy to assist with any questions or concerns you may have about our conferences, symposiums, or other inquiries.'}
          </p>

          <div className={styles.detailsList}>
            {/* Address */}
            <div className={styles.detailItem}>
              <div className={styles.iconWrapper}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <div className={styles.detailContent}>
                <span className={styles.detailLabel}>Address</span>
                <span className={styles.detailValue}>{data.address || 'Gammalkilsvägen 18, Ulrika 590 53, Sweden'}</span>
              </div>
            </div>

            {/* Phone */}
            <div className={styles.detailItem}>
              <div className={styles.iconWrapper}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </div>
              <div className={styles.detailContent}>
                <span className={styles.detailLabel}>Phone</span>
                <span className={styles.detailValue}>{data.phone || '(+46) 1313-2424'}</span>
              </div>
            </div>

            {/* Email */}
            <div className={styles.detailItem}>
              <div className={styles.iconWrapper}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </div>
              <div className={styles.detailContent}>
                <span className={styles.detailLabel}>Email</span>
                <span className={styles.detailValue}>{data.email || 'communication@iaamonline.org'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Contact Form */}
        <div className={styles.formColumn}>
          <h3 className={styles.formTitle}>Get in Touch</h3>
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
