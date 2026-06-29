'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FiChevronDown, FiCalendar } from 'react-icons/fi';
import styles from './page.module.css';

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    title: '',
    firstName: '',
    lastName: '',
    dob: '',
    email: '',
    gender: '',
    countryCode: '',
    mobileNumber: '',
    membershipCategory: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const titles = ['Mr.', 'Mrs.', 'Ms.', 'Dr.', 'Prof.'];
  const genders = ['Male', 'Female', 'Non-Binary', 'Prefer not to say'];
  const membershipCategories = ['Student Member', 'Professional Member', 'Fellow Member', 'Corporate Member'];
  
  const countries = [
    { name: 'United States', code: '+1' },
    { name: 'United Kingdom', code: '+44' },
    { name: 'India', code: '+91' },
    { name: 'Sweden', code: '+46' },
    { name: 'Germany', code: '+49' },
    { name: 'France', code: '+33' },
    { name: 'Canada', code: '+1' },
    { name: 'Australia', code: '+61' },
    { name: 'Japan', code: '+81' },
    { name: 'China', code: '+86' },
    { name: 'Brazil', code: '+55' },
    { name: 'South Africa', code: '+27' },
    { name: 'Singapore', code: '+65' }
  ];

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
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.dob) newErrors.dob = 'Date of birth is required';
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.countryCode) newErrors.countryCode = 'Country code is required';
    
    if (!formData.mobileNumber.trim()) {
      newErrors.mobileNumber = 'Mobile number is required';
    } else if (!/^\+?[0-9\s\-()]{7,15}$/.test(formData.mobileNumber)) {
      newErrors.mobileNumber = 'Please enter a valid mobile number';
    }
    
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
          Thank you, <strong>{formData.title} {formData.firstName} {formData.lastName}</strong>. Your nomination for the Advanced Materials Congress has been successfully received. We will contact you at <strong>{formData.email}</strong> shortly.
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
              <option value="" disabled>Select Title</option>
              {titles.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            <FiChevronDown className={styles.arrowIcon} size={20} />
          </div>
          {errors.title && <span className={styles.errorText}>{errors.title}</span>}
        </div>

        {/* First Name */}
        <div className={styles.fieldGroup}>
          <label className={styles.label}>First Name</label>
          <div className={`${styles.inputWrapper} ${errors.firstName ? styles.inputWrapperError : ''}`}>
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
              className={styles.input}
            />
          </div>
          {errors.firstName && <span className={styles.errorText}>{errors.firstName}</span>}
        </div>

        {/* Last Name */}
        <div className={styles.fieldGroup}>
          <label className={styles.label}>Last Name</label>
          <div className={`${styles.inputWrapper} ${errors.lastName ? styles.inputWrapperError : ''}`}>
            <input
              type="text"
              name="lastName"
              placeholder="Enter Last Name"
              value={formData.lastName}
              onChange={handleChange}
              className={styles.input}
            />
          </div>
          {errors.lastName && <span className={styles.errorText}>{errors.lastName}</span>}
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
          {errors.dob && <span className={styles.errorText}>{errors.dob}</span>}
        </div>

        {/* Email Address */}
        <div className={styles.fieldGroup}>
          <label className={styles.label}>Email Address</label>
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
          {errors.email && <span className={styles.errorText}>{errors.email}</span>}
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
          {errors.gender && <span className={styles.errorText}>{errors.gender}</span>}
        </div>

        {/* Country Code */}
        <div className={styles.fieldGroup}>
          <label className={styles.label}>Country Code</label>
          <div className={`${styles.inputWrapper} ${errors.countryCode ? styles.inputWrapperError : ''}`}>
            <select
              name="countryCode"
              value={formData.countryCode}
              onChange={handleChange}
              className={`${styles.select} ${!formData.countryCode ? styles.selectDefault : ''}`}
            >
              <option value="" disabled>Select Country</option>
              {countries.map((c) => (
                <option key={c.name} value={`${c.name} (${c.code})`}>
                  {c.name} ({c.code})
                </option>
              ))}
            </select>
            <FiChevronDown className={styles.arrowIcon} size={20} />
          </div>
          {errors.countryCode && <span className={styles.errorText}>{errors.countryCode}</span>}
        </div>

        {/* Mobile Number */}
        <div className={styles.fieldGroup}>
          <label className={styles.label}>Mobile Number</label>
          <div className={`${styles.inputWrapper} ${errors.mobileNumber ? styles.inputWrapperError : ''}`}>
            <input
              type="tel"
              name="mobileNumber"
              placeholder="Mobile Number"
              value={formData.mobileNumber}
              onChange={handleChange}
              className={styles.input}
            />
          </div>
          {errors.mobileNumber && <span className={styles.errorText}>{errors.mobileNumber}</span>}
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
          {errors.membershipCategory && <span className={styles.errorText}>{errors.membershipCategory}</span>}
        </div>
      </div>

      {/* Submit Button */}
      <button type="submit" className={styles.submitBtn}>
        <span className={styles.submitBtnText}>Register Now</span>
      </button>
    </form>
  );
}
