'use client';

import React, { useState, useEffect, useRef, use, useCallback } from 'react';
import Link from 'next/link';
import styles from './page.module.css';
import { FiMenu, FiImage, FiBarChart2, FiMic, FiUser, FiCompass, FiBriefcase, FiHeart, FiLayout, FiCalendar, FiBookOpen, FiSquare, FiFileText, FiEye } from 'react-icons/fi';

export default function PageLayoutManager({ params }) {
  const { pageId } = use(params);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const dragItem = useRef(null);
  const dragOverItem = useRef(null);

  const showToast = useCallback((message, type) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const handlePreview = async () => {
    let route;
    if (pageId === 'home' || pageId === 'global') {
      route = '/';
    } else if (pageId === 'fellow-awards') {
      route = '/fellow-&-awards';
    } else if (pageId.startsWith('event-')) {
      try {
        const eventId = pageId.slice(6);
        const res = await fetch(`/api/admin/events/${eventId}`);
        const event = await res.json();
        if (event && event.slug) {
          if (event.eventType === 'upcoming') {
            route = `/upcoming-events/${event.slug}`;
          } else if (event.eventType === 'individual') {
            route = `/individual-events/${event.slug}`;
          } else if (event.eventType === 'archive') {
            route = `/congress-archive/${event.slug}`;
          } else {
            route = `/events/${event.slug}`;
          }
        } else {
          route = `/events/${eventId}`;
        }
      } catch (err) {
        route = `/events/${pageId.slice(6)}`;
      }
    } else if (pageId.startsWith('proceeding-')) {
      try {
        const proceedingId = pageId.slice(11);
        const res = await fetch(`/api/admin/proceedings/${proceedingId}`);
        const proceeding = await res.json();
        if (proceeding && proceeding.slug) {
          route = `/congress-proceedings/${proceeding.slug}`;
        } else {
          route = `/congress-proceedings/${proceedingId}`;
        }
      } catch (err) {
        route = `/congress-proceedings/${pageId.slice(11)}`;
      }
    } else {
      route = `/${pageId}`;
    }
    window.open(`${route}?preview=true`, '_blank');
  };

  useEffect(() => {
    async function fetchSections() {
      try {
        const res = await fetch(`/api/admin/pages/${pageId}/sections`);
        const data = await res.json();
        setSections((data.sections || []).sort((a, b) => a.order - b.order));
      } catch (err) {
        showToast('Failed to load page layout', 'error');
      } finally {
        setLoading(false);
      }
    }
    fetchSections();
  }, [pageId, showToast]);

  async function saveSections(updatedSections) {
    setSaving(true);
    try {
      // Only send layout-relevant fields (id, order, visible, label) — strip content
      const layoutOnly = updatedSections.map((s) => ({
        id: s.id,
        label: s.label,
        order: s.order,
        visible: s.visible,
      }));
      const res = await fetch(`/api/admin/pages/${pageId}/sections`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sections: layoutOnly }),
      });
      if (res.ok) {
        showToast('Page layout updated!', 'success');
      } else {
        const errData = await res.json().catch(() => ({}));
        showToast(`Failed to save: ${errData.error || 'Unknown error'}`, 'error');
      }
    } catch (err) {
      showToast('Failed to save layout', 'error');
    } finally {
      setSaving(false);
    }
  }


  function toggleVisibility(id) {
    const updated = sections.map((s) =>
      s.id === id ? { ...s, visible: !s.visible } : s
    );
    setSections(updated);
    saveSections(updated);
  }

  // Drag and Drop
  function handleDragStart(e, index) {
    dragItem.current = index;
    e.dataTransfer.effectAllowed = 'move';
  }

  function handleDragEnter(index) {
    dragOverItem.current = index;
    setDragOverIndex(index);
  }

  function handleDragLeave() {
    // Keep highlight only when actually leaving the container
  }

  function handleDragEnd() {
    setDragOverIndex(null);
    if (dragItem.current === null || dragOverItem.current === null) return;
    if (dragItem.current === dragOverItem.current) {
      dragItem.current = null;
      dragOverItem.current = null;
      return;
    }

    const items = [...sections];
    const draggedItem = items[dragItem.current];
    items.splice(dragItem.current, 1);
    items.splice(dragOverItem.current, 0, draggedItem);

    // Reassign order
    const reordered = items.map((item, idx) => ({ ...item, order: idx }));

    dragItem.current = null;
    dragOverItem.current = null;
    setSections(reordered);
    saveSections(reordered);
  }

  const sectionIcons = {
    header: <FiMenu />,
    hero: <FiImage />,
    stats: <FiBarChart2 />,
    speakers: <FiMic />,
    becomeMember: <FiUser />,
    explore: <FiCompass />,
    sponsors: <FiBriefcase />,
    becomeSponsor: <FiHeart />,
    footer: <FiLayout />,
    aboutHero: <FiImage />,
    ourStory: <FiBookOpen />,
    globalEvents: <FiCompass />,
    eventsList: <FiCalendar />,
    proceedingsList: <FiFileText />,
    proceedingsHeader: <FiFileText />,
    proceedingHero: <FiImage />,
    proceedingDownload: <FiBookOpen />,
    proceedingContent: <FiBookOpen />,
    relatedProceedings: <FiCompass />,
    assembliesHero: <FiImage />,
    assembliesTabs: <FiMenu />,
    assembliesCards: <FiCalendar />,
    assembliesCta: <FiCompass />,
    awardsHero: <FiImage />,
    awardsIntro: <FiBookOpen />,
    awardsCategories: <FiBarChart2 />,
    awardsNomination: <FiFileText />,
    awardsPublications: <FiBookOpen />,
    awardsLaureates: <FiUser />,
    eventHero: <FiImage />,
    eventIntro: <FiBookOpen />,
    eventSymposia: <FiLayout />,
    eventDeadlines: <FiCalendar />,
    eventHighlights: <FiImage />,
    eventSDGs: <FiCompass />,
    eventPublications: <FiFileText />,
    contactsTitle: <FiFileText />,
    contactsDetails: <FiCompass />,
    contactsMap: <FiCompass />,
  };

  const sectionMeta = {
    header: {
      desc: 'Main navigation bar, website logo, page links, and primary CTA button.',
      summary: (content) => `CTA: "${content.ctaButton?.text || ''}" • Nav Items: ${(content.navItems || []).map(i => i.label).join(', ')}`
    },
    hero: {
      desc: 'The top prominent banner of the page with titles, tagline, buttons, and high-impact background.',
      summary: (content) => `Title: "${content.title || ''}"`
    },
    stats: {
      desc: 'Key numeric highlights and metrics displaying the organization\'s impact.',
      summary: (content) => `Stats: ${(content.stats || []).map(s => `${s.value || ''} ${s.label || ''}`).join(' | ')}`
    },
    speakers: {
      desc: 'Grid list of keynote and featured speakers loaded directly from the Speakers module.',
      summary: (content) => `Headline: "${content.title || ''}"`
    },
    becomeMember: {
      desc: 'Call-to-Action banner prompting visitors to submit applications and register as a fellow.',
      summary: (content) => `Headline: "${content.titlePrefix || ''} ${content.type || ''}"`
    },
    explore: {
      desc: 'Informative section displaying assemblies categories or navigation points.',
      summary: (content) => `Title: "${content.title || ''}"`
    },
    sponsors: {
      desc: 'Displays the logos of official sponsors categorized by tier.',
      summary: (content) => `Title: "${content.title || ''}"`
    },
    becomeSponsor: {
      desc: 'Call-to-Action inviting corporations to join and support the upcoming assemblies.',
      summary: (content) => `Headline: "${content.titlePrefix || ''}"`
    },
    footer: {
      desc: 'The website bottom menu containing address, copyright information, and social links.',
      summary: (content) => `Copyright: "${content.copyright || ''}"`
    },
    aboutHero: {
      desc: 'Introductory banner for the About page detailing the vision.',
      summary: (content) => `Title: "${content.title || ''}"`
    },
    ourStory: {
      desc: 'Timeline or history blocks illustrating the growth of the organization.',
      summary: (content) => `Title: "${content.title || ''}"`
    },
    globalEvents: {
      desc: 'Summary or interactive grid of worldwide assemblies.',
      summary: (content) => `Title: "${content.title || ''}"`
    },
    eventHero: {
      desc: 'Banner containing the title, date, venue location, and registration buttons of the event.',
      summary: (content) => `Title: "${content.title || ''}" • Date: ${content.date || ''} • Location: ${content.location || ''}`
    },
    eventIntro: {
      desc: 'Detailed introductory summary with paragraphs, metrics, and event description.',
      summary: (content) => `Headline: "${content.title || ''}"`
    },
    eventSymposia: {
      desc: 'List of focused scientific tracks and downloadable flyer attachment.',
      summary: (content) => `Headline: "${content.title || ''}" • Tracks: ${(content.symposia || []).length}`
    },
    eventDeadlines: {
      desc: 'Important timelines and key milestone dates for abstract submissions and registration.',
      summary: (content) => `Headline: "${content.title || ''}" • Deadlines: ${(content.deadlines || []).length}`
    },
    eventHighlights: {
      desc: 'Chronological summary highlighting past years\' milestones and achievements.',
      summary: (content) => `Headline: "${content.title || ''}" • Highlights: ${(content.highlights || []).length}`
    },
    eventSDGs: {
      desc: 'United Nations Sustainable Development Goals that this event aligns with.',
      summary: (content) => `Headline: "${content.title || ''}" • Goals: ${(content.goals || []).map(g => g.number).join(', ')}`
    },
    eventPublications: {
      desc: 'Indexed proceedings and academic publications associated with this congress.',
      summary: (content) => `Headline: "${content.title || ''}" • Publications: ${(content.publications || []).length}`
    },
    eventsList: {
      desc: 'Filterable list of events matching this category page.',
      summary: (content) => `Page Title: "${content.title || ''}"`
    },
    proceedingsList: {
      desc: 'List of published congress proceedings and PDF downloads.',
      summary: (content) => `Page Title: "${content.title || ''}"`
    },
    proceedingsHeader: {
      desc: 'The page header title displayed at the top of the Congress Proceedings listing page.',
      summary: (content) => `Title: "${content.title || 'Congress Proceedings'}"`
    },
    proceedingHero: {
      desc: 'Blue banner section showing category, title, author and date for the individual proceeding.',
      summary: (content) => `Title: "${content.title || ''}" • Author: ${content.author || ''}`
    },
    proceedingDownload: {
      desc: 'Download button section with PDF file link for the proceeding report.',
      summary: (content) => `Button: "${content.buttonText || 'Download Full PDF'}" • PDF: ${content.pdfUrl ? 'Set' : 'Not set'}`
    },
    proceedingContent: {
      desc: 'Main rich-text content body of the proceeding report with full HTML content.',
      summary: (content) => content.htmlContent ? 'Content configured' : 'No content yet'
    },
    relatedProceedings: {
      desc: 'Related proceedings section at the bottom showing 3 other proceedings.',
      summary: (content) => `Title: "${content.title || 'RELATED PROCEEDINGS'}"`
    },
    assembliesHero: {
      desc: 'Top prominent banner displaying the main title of the assemblies page.',
      summary: (content) => `Title: "${content.title || ''}"`
    },
    assembliesTabs: {
      desc: 'Interactive tab navigation between different categories of events.',
      summary: (content) => `Tabs: ${(content.tabs || []).map(t => t.label).join(', ')}`
    },
    assembliesCards: {
      desc: 'Cards showcasing assemblies categories and details.',
      summary: (content) => `Title: "${content.title || ''}"`
    },
    assembliesCta: {
      desc: 'Call-to-Action prompting members to join upcoming assemblies.',
      summary: (content) => `Title: "${content.title || ''}"`
    },
    awardsHero: {
      desc: 'Main banner for the Fellow & Awards page detailing criteria.',
      summary: (content) => `Title: "${content.title || ''}"`
    },
    awardsIntro: {
      desc: 'Introduction section detailing the award nominations process and criteria.',
      summary: (content) => `Title: "${content.title || ''}"`
    },
    awardsCategories: {
      desc: 'Categories of awards available for fellows.',
      summary: (content) => `Title: "${content.title || ''}"`
    },
    awardsNomination: {
      desc: 'Nomination submission details and links.',
      summary: (content) => `Title: "${content.title || ''}"`
    },
    awardsPublications: {
      desc: 'Academic publications related to the awards.',
      summary: (content) => `Title: "${content.title || ''}"`
    },
    awardsLaureates: {
      desc: 'List of past laureates and fellows in the organization.',
      summary: (content) => `Title: "${content.title || ''}"`
    },
    contactsTitle: {
      desc: 'Page-level title banner displayed at the top of the Contacts page.',
      summary: (content) => `Title: "${content.title || ''}"`
    },
    contactsDetails: {
      desc: 'Contact information block: heading, description, address, phone, and email.',
      summary: (content) => `Email: ${content.email || ''} • Phone: ${content.phone || ''}`
    },
    contactsMap: {
      desc: 'Embedded Google Maps iframe showing the office location.',
      summary: (content) => content.embedUrl ? 'Map embed configured' : 'No embed URL set'
    },
  };

  if (loading) {
    return (
      <div className={styles.loadingWrapper}>
        <div className={styles.spinner} />
        <p>Loading page layout...</p>
      </div>
    );
  }

  return (
    <div className={styles.dashboard}>
      {/* Toast */}
      {toast && (
        <div className={`${styles.toast} ${styles[toast.type]}`}>
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>{pageId} Page Layout</h2>
          <p className={styles.subtitle}>
            Drag to reorder • Toggle visibility • Click to edit content
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button 
            onClick={handlePreview} 
            style={{
              background: '#fff',
              color: '#1C3F9E',
              border: '1px solid #1C3F9E',
              padding: '8px 16px',
              borderRadius: '4px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <FiEye /> Preview Page
          </button>
          <div className={styles.headerBadge}>
            {sections.filter((s) => s.visible).length}/{sections.length} Active
          </div>
        </div>
      </div>

      {/* Section Cards */}
      <div className={styles.grid}>
        {sections.map((section, index) => {
          const isHeader = section.id === 'header';
          const isFooter = section.id === 'footer';
          const prevSection = sections[index - 1];
          const isFirstBodySection = !isHeader && !isFooter && (!prevSection || prevSection.id === 'header');

          const meta = sectionMeta[section.id];
          const descText = meta?.desc || 'Custom page content section.';
          const summaryText = meta?.summary ? meta.summary(section.content || {}) : '';

          return (
            <React.Fragment key={section.id}>
              {/* Category Dividers for Strapi-Style visual zones */}
              {isHeader && (
                <div className={styles.zoneHeader}>
                  <h4>Global Layout Components</h4>
                  <p>Global headers are shared across page layouts</p>
                </div>
              )}
              {isFirstBodySection && (
                <div className={styles.zoneHeader}>
                  <h4>Page Body Components</h4>
                  <p>Drag components vertically to change the order of the page layout</p>
                </div>
              )}
              {isFooter && (
                <div className={styles.zoneHeader}>
                  <h4>Global Footer components</h4>
                  <p>Bottom navigation page settings</p>
                </div>
              )}

              <div
                className={`${styles.card} ${!section.visible ? styles.cardHidden : ''} ${dragOverIndex === index ? styles.cardDragOver : ''} ${isHeader || isFooter ? styles.cardFixed : ''}`}
                draggable={!isHeader && !isFooter}
                onDragStart={(e) => handleDragStart(e, index)}
                onDragEnter={() => handleDragEnter(index)}
                onDragLeave={handleDragLeave}
                onDragEnd={handleDragEnd}
                onDragOver={(e) => e.preventDefault()}
              >
                <div className={styles.cardDragHandle}>
                  {!isHeader && !isFooter ? (
                    <span className={styles.dragDots} title="Drag to reorder"><FiMenu size={16} /></span>
                  ) : (
                    <span className={styles.dragDotsLock} title="Fixed component layout"><FiSquare size={12} /></span>
                  )}
                </div>

                <div className={styles.cardBody}>
                  <div className={styles.cardIcon}>
                    {sectionIcons[section.id] || <FiSquare />}
                  </div>
                  <div className={styles.cardInfo}>
                    <div className={styles.cardTitleRow}>
                      <h3 className={styles.cardTitle}>{section.label}</h3>
                      <span className={`${styles.statusBadge} ${section.visible ? styles.statusActive : styles.statusInactive}`}>
                        {section.visible ? 'Visible' : 'Hidden'}
                      </span>
                    </div>
                    <p className={styles.cardDescText}>{descText}</p>
                    {summaryText && (
                      <div className={styles.cardSummaryBadge}>
                        <span className={styles.summaryLabel}>Active Content:</span>
                        <span className={styles.summaryValue}>{summaryText}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className={styles.cardActions}>
                  {/* Visibility Toggle */}
                  <button
                    className={`${styles.toggle} ${section.visible ? styles.toggleOn : ''}`}
                    onClick={() => toggleVisibility(section.id)}
                    title={section.visible ? 'Hide section' : 'Show section'}
                  >
                    <span className={styles.toggleKnob} />
                  </button>

                  {/* Edit Button */}
                  <Link
                    href={`/admin/pages/${pageId}/${section.id}`}
                    className={styles.editBtn}
                  >
                    Edit Content →
                  </Link>
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </div>

      {saving && (
        <div className={styles.savingIndicator}>
          <div className={styles.spinnerSmall} /> Saving...
        </div>
      )}
    </div>
  );
}
