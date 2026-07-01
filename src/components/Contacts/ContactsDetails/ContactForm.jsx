'use client';

import React, { useState } from 'react';
import styles from './ContactsDetails.module.css';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobileNumber: ''
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Your name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.mobileNumber.trim()) {
      newErrors.mobileNumber = 'Mobile number is required';
    } else if (!/^\+?[0-9\s\-()]{7,15}$/.test(formData.mobileNumber)) {
      newErrors.mobileNumber = 'Please enter a valid mobile number';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: 'Website Contact Enquiry',
          message: `Mobile Number: ${formData.mobileNumber}`,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong. Please try again.');
      }

      setSubmitted(true);
    } catch (err) {
      setSubmitError(err.message || 'Failed to submit form. Please check your connection.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className={styles.successContainer}>
        <div className={styles.successIcon}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h4 className={styles.successTitle}>Thank You!</h4>
        <p className={styles.successMessage}>
          Your message has been sent successfully. We will get in touch shortly.
        </p>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {submitError && <div className={styles.errorText} style={{ marginBottom: '10px' }}>{submitError}</div>}
      
      {/* Name Input */}
      <div className={styles.fieldGroup}>
        <label className={styles.label}>Your Name</label>
        <div className={`${styles.inputWrapper} ${errors.name ? styles.inputWrapperError : ''}`}>
          <input
            type="text"
            name="name"
            placeholder="Your Full Name"
            value={formData.name}
            onChange={handleChange}
            className={styles.input}
            disabled={submitting}
          />
        </div>
        {errors.name && <span className={styles.errorText}>{errors.name}</span>}
      </div>

      {/* Email Input */}
      <div className={styles.fieldGroup}>
        <label className={styles.label}>Email Address</label>
        <div className={`${styles.inputWrapper} ${errors.email ? styles.inputWrapperError : ''}`}>
          <input
            type="email"
            name="email"
            placeholder="Enter Your Email"
            value={formData.email}
            onChange={handleChange}
            className={styles.input}
            disabled={submitting}
          />
        </div>
        {errors.email && <span className={styles.errorText}>{errors.email}</span>}
      </div>

      {/* Mobile Input */}
      <div className={styles.fieldGroup}>
        <label className={styles.label}>Mobile Number</label>
        <div className={`${styles.inputWrapper} ${errors.mobileNumber ? styles.inputWrapperError : ''}`}>
          <input
            type="tel"
            name="mobileNumber"
            placeholder="Enter Your Mobile Number"
            value={formData.mobileNumber}
            onChange={handleChange}
            className={styles.input}
            disabled={submitting}
          />
        </div>
        {errors.mobileNumber && <span className={styles.errorText}>{errors.mobileNumber}</span>}
      </div>

      {/* Submit button */}
      <button type="submit" className={styles.submitBtn} disabled={submitting}>
        <span className={styles.submitBtnText}>
          {submitting ? 'Submitting...' : 'Submit Now'}
        </span>
      </button>
    </form>
  );
}
