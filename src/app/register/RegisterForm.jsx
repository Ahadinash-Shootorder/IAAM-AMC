'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FiChevronDown, FiCalendar } from 'react-icons/fi';
import styles from './page.module.css';

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    title: '',
    fullName: '',
    gender: '',
    email: '',
    dob: '',
    membershipCategory: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const titles = ['Mr.', 'Mrs.', 'Ms.', 'Dr.', 'Prof.'];
  const genders = ['Male', 'Female', 'Non-Binary', 'Prefer not to say'];
  const membershipCategories = ['Student Member', 'Professional Member', 'Fellow Member', 'Corporate Member'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title) newErrors.title = 'Title is required';
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.dob) newErrors.dob = 'Date of birth is required';
    if (!formData.membershipCategory) newErrors.membershipCategory = 'Membership category is required';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Submit successfully
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className={styles.successCard}>
        <div className={styles.successIcon}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h3 className={styles.successTitle}>Nomination Submitted!</h3>
        <p className={styles.successMessage}>
          Thank you, <strong>{formData.fullName}</strong>. Your nomination for the Advanced Materials Congress has been successfully received. We will contact you at <strong>{formData.email}</strong> shortly.
        </p>
        <Link href="/" className={styles.backHomeBtn}>
          Back to Homepage
        </Link>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.grid}>
        {/* Title */}
        <div className={styles.fieldGroup}>
          <label className={styles.label}>Title</label>
          <div className={`${styles.inputWrapper} ${errors.title ? styles.inputWrapperError : ''}`}>
            <select
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`${styles.select} ${!formData.title ? styles.selectDefault : ''}`}
            >
              <option value="" disabled>Select the title</option>
              {titles.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            <FiChevronDown className={styles.arrowIcon} size={20} />
          </div>
        </div>

        {/* Full Name */}
        <div className={styles.fieldGroup}>
          <label className={styles.label}>Full Name</label>
          <div className={`${styles.inputWrapper} ${errors.fullName ? styles.inputWrapperError : ''}`}>
            <input
              type="text"
              name="fullName"
              placeholder="Enter Your Full Name"
              value={formData.fullName}
              onChange={handleChange}
              className={styles.input}
            />
          </div>
        </div>

        {/* Gender */}
        <div className={styles.fieldGroup}>
          <label className={styles.label}>Gender</label>
          <div className={`${styles.inputWrapper} ${errors.gender ? styles.inputWrapperError : ''}`}>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className={`${styles.select} ${!formData.gender ? styles.selectDefault : ''}`}
            >
              <option value="" disabled>Select the Gender</option>
              {genders.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
            <FiChevronDown className={styles.arrowIcon} size={20} />
          </div>
        </div>

        {/* Work Email Address */}
        <div className={styles.fieldGroup}>
          <label className={styles.label}>Work Email Address</label>
          <div className={`${styles.inputWrapper} ${errors.email ? styles.inputWrapperError : ''}`}>
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className={styles.input}
            />
          </div>
        </div>

        {/* Date Of Birth */}
        <div className={styles.fieldGroup}>
          <label className={styles.label}>Date Of Birth</label>
          <div className={`${styles.inputWrapper} ${errors.dob ? styles.inputWrapperError : ''}`}>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              className={styles.input}
              placeholder="dd/mm/yyyy"
            />
            <FiCalendar className={styles.calendarIcon} size={20} />
          </div>
        </div>

        {/* Category Of Membership */}
        <div className={styles.fieldGroup}>
          <label className={styles.label}>Category Of Membership</label>
          <div className={`${styles.inputWrapper} ${errors.membershipCategory ? styles.inputWrapperError : ''}`}>
            <select
              name="membershipCategory"
              value={formData.membershipCategory}
              onChange={handleChange}
              className={`${styles.select} ${!formData.membershipCategory ? styles.selectDefault : ''}`}
            >
              <option value="" disabled>Select Category</option>
              {membershipCategories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <FiChevronDown className={styles.arrowIcon} size={20} />
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <button type="submit" className={styles.submitBtn}>
        <span className={styles.submitBtnText}>Submit Form</span>
      </button>
    </form>
  );
}
