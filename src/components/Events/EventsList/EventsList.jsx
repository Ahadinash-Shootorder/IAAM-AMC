'use client';

import { useState } from 'react';
import Image from 'next/image';
import { FiSearch } from 'react-icons/fi';
import styles from './EventsList.module.css';

export default function EventsList({ data }) {
  const [searchTerm, setSearchTerm] = useState('');

  if (!data) return null;

  const events = data.events || [];
  
  // Basic search filter
  const filteredEvents = events.filter(event => 
    (event.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (event.location || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const colors = [styles.cardPink, styles.cardYellow, styles.cardBlue];

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
            <button className={styles.filterBtn}>Filter By Year</button>
            <button className={styles.filterBtn}>Filter By Year</button>
            <button className={styles.filterBtn}>Filter By Year</button>
            <button className={styles.filterBtn}>Filter By Year</button>
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
                    const imgSrc = rawImg.startsWith('/') || rawImg.startsWith('http') ? rawImg : `/${rawImg}`;
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
                  
                  <a href={event.link || '#'} className={styles.visitBtn}>
                    Visit Website
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
