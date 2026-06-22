'use client';

import { useState, useEffect, useRef, use, useCallback } from 'react';
import Link from 'next/link';
import styles from './page.module.css';
import { FiMenu, FiImage, FiBarChart2, FiMic, FiUser, FiCompass, FiBriefcase, FiHeart, FiLayout, FiCalendar, FiBookOpen, FiSquare, FiFileText } from 'react-icons/fi';

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
        <div className={styles.headerBadge}>
          {sections.filter((s) => s.visible).length}/{sections.length} Active
        </div>
      </div>

      {/* Section Cards */}
      <div className={styles.grid}>
        {sections.map((section, index) => (
          <div
            key={section.id}
            className={`${styles.card} ${!section.visible ? styles.cardHidden : ''} ${dragOverIndex === index ? styles.cardDragOver : ''}`}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragEnter={() => handleDragEnter(index)}
            onDragLeave={handleDragLeave}
            onDragEnd={handleDragEnd}
            onDragOver={(e) => e.preventDefault()}
          >
            <div className={styles.cardDragHandle}>
              <span className={styles.dragDots}><FiMenu size={16} /></span>
            </div>

            <div className={styles.cardBody}>
              <div className={styles.cardIcon}>
                {sectionIcons[section.id] || <FiSquare />}
              </div>
              <div className={styles.cardInfo}>
                <h3 className={styles.cardTitle}>{section.label}</h3>
                <span className={`${styles.statusBadge} ${section.visible ? styles.statusActive : styles.statusInactive}`}>
                  {section.visible ? 'Visible' : 'Hidden'}
                </span>
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
                Edit →
              </Link>
            </div>
          </div>
        ))}
      </div>

      {saving && (
        <div className={styles.savingIndicator}>
          <div className={styles.spinnerSmall} /> Saving...
        </div>
      )}
    </div>
  );
}
