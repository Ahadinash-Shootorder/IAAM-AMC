'use client';

import React, { useState } from 'react';
import styles from './AwardsNomination.module.css';

export default function AwardsNomination({ data }) {
  const title = data?.title || 'Nomination Process';
  const description = data?.description || 'IAAM follows a transparent, peer-reviewed nomination process to ensure the highest standards of integrity and excellence.';
  const steps = data?.steps || [
    {
      number: '01',
      title: 'Submission',
      description: 'Submit the nomination dossier including CV, publication list, and impact statement.'
    },
    {
      number: '02',
      title: 'Peer Review',
      description: 'The Scientific Committee evaluates nominations based on originality, impact, and legacy.'
    },
    {
      number: '03',
      title: 'Conferment',
      description: 'Final awardees are announced and celebrated during the EAEMC 2026 gala dinner.'
    }
  ];

  const formTitle = data?.formTitle || 'Submit Nomination';
  const categoryOptions = data?.categories || [
    'Advanced Materials Laureate',
    'Researcher of the Year',
    'Scientist Award',
    'Young Scientist Medal',
    'Innovation Award'
  ];

  const [nominator, setNominator] = useState('');
  const [nominee, setNominee] = useState('');
  const [category, setCategory] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState(null); // { type: 'success' | 'error', message: string }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nominator || !nominee || !category) {
      setStatus({ type: 'error', message: 'Please fill in all fields.' });
      return;
    }

    setSubmitting(true);
    setStatus(null);

    try {
      const res = await fetch('/api/nominate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nominator, nominee, category }),
      });
      const result = await res.json();
      if (res.ok) {
        setStatus({ type: 'success', message: 'Nomination submitted successfully! Thank you.' });
        setNominator('');
        setNominee('');
        setCategory('');
      } else {
        setStatus({ type: 'error', message: result.error || 'Failed to submit nomination. Please try again.' });
      }
    } catch (err) {
      setStatus({ type: 'error', message: 'A network error occurred. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className={styles.nominationSection}>
      {/* Visual background circle glow */}
      <div className={styles.bgGlow} />

      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Left: Nomination Process info */}
          <div className={styles.leftCol}>
            <h2 className={styles.sectionTitle}>{title}</h2>
            <p className={styles.sectionDesc}>{description}</p>
            
            <div className={styles.stepsList}>
              {steps.map((step, idx) => (
                <div key={idx} className={styles.stepRow}>
                  <div className={styles.stepNumberBadge}>
                    {step.number}
                  </div>
                  <div className={styles.stepContent}>
                    <h4 className={styles.stepTitle}>{step.title}</h4>
                    <p className={styles.stepDesc}>{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Submit Form card */}
          <div className={styles.rightCol}>
            <div className={styles.formCard}>
              <h3 className={styles.formTitle}>{formTitle}</h3>
              
              {status && (
                <div className={`${styles.alert} ${status.type === 'success' ? styles.alertSuccess : styles.alertError}`}>
                  {status.message}
                </div>
              )}

              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.fieldGroup}>
                  <label htmlFor="nominator" className={styles.label}>Nominator Name</label>
                  <input
                    type="text"
                    id="nominator"
                    value={nominator}
                    onChange={(e) => setNominator(e.target.value)}
                    placeholder="Your Full Name"
                    className={styles.input}
                    disabled={submitting}
                    required
                  />
                </div>

                <div className={styles.fieldGroup}>
                  <label htmlFor="nominee" className={styles.label}>Nominee Name</label>
                  <input
                    type="text"
                    id="nominee"
                    value={nominee}
                    onChange={(e) => setNominee(e.target.value)}
                    placeholder="Candidate's Full Name"
                    className={styles.input}
                    disabled={submitting}
                    required
                  />
                </div>

                <div className={styles.fieldGroup}>
                  <label htmlFor="category" className={styles.label}>Award Category</label>
                  <div className={styles.selectWrapper}>
                    <select
                      id="category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className={styles.select}
                      disabled={submitting}
                      required
                    >
                      <option value="" disabled>Select a category</option>
                      {categoryOptions.map((opt, index) => (
                        <option key={index} value={opt}>{opt}</option>
                      ))}
                    </select>
                    <div className={styles.selectArrow}>
                      <svg width="12" height="8" viewBox="0 0 12 8" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="2 2 6 6 10 2" />
                      </svg>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className={styles.submitBtn}
                  disabled={submitting}
                >
                  {submitting ? 'Submitting...' : 'Nominate Now'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
