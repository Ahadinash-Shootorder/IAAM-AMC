'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiSearch } from 'react-icons/fi';
import styles from './EventsList.module.css';

export default function EventsList({ data }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState('all');

  if (!data) return null;

  const events = data.events || [];
  
  // Extract unique years from the events list
  const years = Array.from(
    new Set(
      events
        .map((event) => {
          const match = (event.date || '').match(/\b(20\d{2})\b/);
          return match ? match[1] : null;
        })
        .filter(Boolean)
    )
  ).sort((a, b) => b - a); // Sort descending

  // Filter events based on search term AND selected year
  const filteredEvents = events.filter(event => {
    const matchesSearch = 
      (event.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (event.location || '').toLowerCase().includes(searchTerm.toLowerCase());
      
    if (!matchesSearch) return false;
    if (selectedYear === 'all') return true;

    const match = (event.date || '').match(/\b(20\d{2})\b/);
    const eventYear = match ? match[1] : null;
    return eventYear === selectedYear;
  });

  const colors = [styles.cardPink, styles.cardYellow, styles.cardBlue];
  
  const isInternal = (url) => typeof url === 'string' && url.startsWith('/') && !url.startsWith('//');

  return (
    <section className={styles.eventsListSection}>
      <div className={styles.container}>
        <div className={styles.headerRow}>
          <h1 className={styles.pageTitle}>{data.title}</h1>
        </div>

        <div className={styles.filtersRow}>
          <div className={styles.searchBox}>
            <span className={styles.searchIcon}>
              <FiSearch size={20} color="#474555" />
            </span>
            <input 
              type="text" 
              placeholder="Search" 
              className={styles.searchInput}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className={styles.filterPills}>
            <button 
              className={`${styles.filterBtn} ${selectedYear === 'all' ? styles.filterBtnActive : ''}`}
              onClick={() => setSelectedYear('all')}
            >
              All
            </button>
            {years.map((year) => (
              <button 
                key={year}
                className={`${styles.filterBtn} ${selectedYear === year ? styles.filterBtnActive : ''}`}
                onClick={() => setSelectedYear(year)}
              >
                {year}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.eventsGrid}>
          {filteredEvents.map((event, index) => {
            const colorClass = colors[index % colors.length];
            return (
              <div key={index} className={`${styles.eventCard} ${colorClass}`}>
                <div className={styles.imageContainer}>
                  {event.image ? (() => {
                    const rawImg = event.image;
                    const imgSrc = typeof rawImg === 'string' && (rawImg.startsWith('/') || rawImg.startsWith('http')) ? rawImg : `/${rawImg}`;
                    return <Image src={imgSrc} alt={event.title} className={styles.image} fill sizes="(max-width: 768px) 100vw, 50vw" priority={index === 0} loading={index === 0 ? undefined : "lazy"} />;
                  })() : (
                    <div className={styles.placeholderImage}></div>
                  )}
                </div>
                
                <div className={styles.cardContent}>
                  <div className={styles.textContent}>
                    <h2 className={styles.eventTitle}>{event.title}</h2>
                    <div className={styles.eventDetails}>
                      <p className={styles.location}>{event.location}</p>
                      <p className={styles.date}>{event.date}</p>
                    </div>
                  </div>
                  
                  {isInternal(event.link) ? (
                    <Link href={event.link} className={styles.visitBtn}>
                      Visit Website
                    </Link>
                  ) : (
                    <a 
                      href={event.link || '#'} 
                      className={styles.visitBtn}
                      target={typeof event.link === 'string' && event.link.startsWith('http') ? '_blank' : undefined}
                      rel={typeof event.link === 'string' && event.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                    >
                      Visit Website
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
