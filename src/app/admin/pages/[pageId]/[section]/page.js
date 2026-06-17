'use client';

import { useState, useEffect, useRef, use, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import styles from './page.module.css';
import CrudTable from '@/components/Admin/CrudTable';
import MediaPickerModal from '@/components/Admin/MediaPickerModal';
import { FiClock, FiSave, FiEye, FiUploadCloud, FiImage } from 'react-icons/fi';

export const dynamic = 'force-dynamic';

// Map page IDs to their DB event type for interlinked filtering
const dbBackedSections = {
  'upcoming-events.eventsList': { type: 'events', filter: 'upcoming', label: 'Upcoming Events' },
  'individual-events.eventsList': { type: 'events', filter: 'individual', label: 'Individual Events' },
  'congress-archive.eventsList': { type: 'events', filter: 'archive', label: 'Archive Events' },
  'congress-proceedings.proceedingsList': { type: 'proceedings', filter: null, label: 'Congress Proceedings' },
};

// Schema definitions for each section's editable fields
const sectionSchemas = {
  header: {
    label: 'Header / Navigation',
    fields: [
      { key: 'logo', label: 'Logo Image', type: 'image' },
      { key: 'navItems', label: 'Navigation Items', type: 'array', itemFields: [
        { key: 'label', label: 'Label', type: 'text' },
        { key: 'link', label: 'Link URL', type: 'text' },
      ]},
      { key: 'ctaButton.text', label: 'CTA Button Text', type: 'text' },
      { key: 'ctaButton.link', label: 'CTA Button Link', type: 'text' },
    ],
  },
  hero: {
    label: 'Hero Banner',
    fields: [
      { key: 'backgroundImage', label: 'Background Image', type: 'image' },
      { key: 'subtitle', label: 'Subtitle', type: 'text' },
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'tagline', label: 'Tagline', type: 'text' },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'buttons', label: 'Buttons', type: 'array', itemFields: [
        { key: 'text', label: 'Button Text', type: 'text' },
        { key: 'link', label: 'Button Link', type: 'text' },
        { key: 'style', label: 'Style (primary/outline)', type: 'text' },
      ]},
      { key: 'bottomStats', label: 'Bottom Stats', type: 'array', itemFields: [
        { key: 'text', label: 'Stat Text', type: 'text' },
      ]},
    ],
  },
  stats: {
    label: 'Stats Bar',
    fields: [
      { key: 'items', label: 'Stats', type: 'array', itemFields: [
        { key: 'number', label: 'Number', type: 'text' },
        { key: 'label', label: 'Label', type: 'text' },
      ]},
    ],
  },
  'home.speakers': {
    label: 'Home Speakers Section',
    fields: [
      { key: 'title', label: 'Section Title', type: 'text' },
    ],
  },
  'about.speakers': {
    label: 'About Speakers Section',
    fields: [
      { key: 'title', label: 'Section Title', type: 'text' },
    ],
  },
  'about.sponsors': {
    label: 'About Sponsors Section',
    fields: [
      { key: 'title', label: 'Section Title', type: 'text' },
    ],
  },
  aboutHero: {
    label: 'About Hero',
    fields: [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'image', label: 'Side Image', type: 'image' },
    ],
  },
  ourStory: {
    label: 'Our Story',
    fields: [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'paragraphs', label: 'Paragraphs', type: 'stringArray' },
      { key: 'image', label: 'Side Image', type: 'image' },
    ],
  },
  globalEvents: {
    label: 'Global Events',
    fields: [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'events', label: 'Event Images', type: 'array', itemFields: [
        { key: 'image', label: 'Image', type: 'image' },
      ]},
    ],
  },
  eventsList: {
    label: 'Events List',
    fields: [
      { key: 'title', label: 'Page Title', type: 'text' },
    ],
  },
  proceedingsList: {
    label: 'Proceedings List',
    fields: [
      { key: 'title', label: 'Page Title', type: 'text' },
    ],
  },
  becomeMember: {
    label: 'Become Member CTA',
    fields: [
      { key: 'titlePrefix', label: 'Title Prefix', type: 'text' },
      { key: 'type', label: 'Type (Member)', type: 'text' },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'subDescription', label: 'Sub Description', type: 'textarea' },
      { key: 'buttonText', label: 'Button Text', type: 'text' },
      { key: 'buttonLink', label: 'Button Link', type: 'text' },
      { key: 'backgroundImage', label: 'Background Image', type: 'image' },
    ],
  },
  explore: {
    label: 'Explore More',
    fields: [
      { key: 'title', label: 'Section Title', type: 'text' },
      { key: 'cards', label: 'Cards', type: 'array', itemFields: [
        { key: 'heading', label: 'Heading', type: 'text' },
        { key: 'subHeading', label: 'Sub Heading', type: 'text' },
        { key: 'buttonText', label: 'Button Text', type: 'text' },
        { key: 'buttonLink', label: 'Button Link', type: 'text' },
        { key: 'image', label: 'Card Image', type: 'image' },
      ]},
    ],
  },
  sponsors: {
    label: 'Sponsors',
    fields: [
      { key: 'title', label: 'Section Title', type: 'text' },
    ],
  },
  becomeSponsor: {
    label: 'Become Sponsor CTA',
    fields: [
      { key: 'titlePrefix', label: 'Title Prefix', type: 'text' },
      { key: 'type', label: 'Type (Sponsor)', type: 'text' },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'subDescription', label: 'Sub Description', type: 'textarea' },
      { key: 'buttonText', label: 'Button Text', type: 'text' },
      { key: 'buttonLink', label: 'Button Link', type: 'text' },
      { key: 'backgroundImage', label: 'Background Image', type: 'image' },
    ],
  },
  footer: {
    label: 'Footer',
    fields: [
      { key: 'title', label: 'Organization Name', type: 'text' },
      { key: 'subtitle', label: 'Location', type: 'text' },
      { key: 'infoTexts', label: 'Info Texts', type: 'stringArray' },
      { key: 'links', label: 'Quick Links', type: 'array', itemFields: [
        { key: 'label', label: 'Link Text', type: 'text' },
        { key: 'link', label: 'Link URL', type: 'text' },
      ]},
      { key: 'bottomText', label: 'Bottom Text', type: 'text' },
    ],
  },
  'site-identity': {
    label: 'Site Identity & SEO',
    fields: [
      { key: 'websiteTitle', label: 'Website Title', type: 'text' },
      { key: 'websiteDescription', label: 'Website Description', type: 'textarea' },
      { key: 'keywords', label: 'Keywords (Comma separated)', type: 'text' },
      { key: 'faviconImage', label: 'Favicon (.ico or .png)', type: 'image' },
      { key: 'ogImage', label: 'OpenGraph Image (Banner for social sharing)', type: 'image' },
    ],
  },
};

// Helper to get nested value from an object using dot notation
function getNestedValue(obj, path) {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}

// Helper to set nested value in an object using dot notation
function setNestedValue(obj, path, value) {
  const clone = JSON.parse(JSON.stringify(obj));
  const keys = path.split('.');
  let current = clone;
  for (let i = 0; i < keys.length - 1; i++) {
    current = current[keys[i]];
  }
  current[keys[keys.length - 1]] = value;
  return clone;
}

export default function SectionEditor({ params }) {
  const { pageId, section } = use(params);
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [uploading, setUploading] = useState(null);
  const [dragArrayKey, setDragArrayKey] = useState(null);
  const [dragArrayOverIdx, setDragArrayOverIdx] = useState(null);
  const [expandedArrayItems, setExpandedArrayItems] = useState({});
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [mediaPickerField, setMediaPickerField] = useState(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [historyItems, setHistoryItems] = useState([]);
  const arrayDragItem = useRef(null);
  const arrayDragOverItem = useRef(null);

  const showToast = useCallback((message, type) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const schema = sectionSchemas[`${pageId}.${section}`] || sectionSchemas[section];

  // Check if this section is DB-backed (events/proceedings)
  const dbConfig = dbBackedSections[`${pageId}.${section}`];

  useEffect(() => {
    if (!schema && !dbConfig) {
      router.push(`/admin/pages/${pageId}`);
      return;
    }

    async function fetchData() {
      try {
        const res = await fetch(`/api/admin/pages/${pageId}/content/${section}`);
        const json = await res.json();
        setData(json);
      } catch (err) {
        showToast('Failed to load data', 'error');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [pageId, section, schema, dbConfig, router, showToast]);

  async function handleSave(asDraft = false) {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/pages/${pageId}/content/${section}${asDraft ? '?draft=true' : ''}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        showToast(asDraft ? 'Draft saved!' : 'Published successfully!', 'success');
      } else {
        showToast('Failed to save', 'error');
      }
    } catch (err) {
      showToast('Failed to save', 'error');
    } finally {
      setSaving(false);
    }
  }

  function handlePreview() {
    const route = pageId === 'home' || pageId === 'global' ? '/' : `/${pageId}`;
    window.open(`${route}?preview=true`, '_blank');
  }

  async function fetchHistory() {
    try {
      const res = await fetch(`/api/admin/pages/${pageId}/history/${section}`);
      const data = await res.json();
      setHistoryItems(data.history || []);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleRestoreHistory(historyId) {
    if (!confirm('This will overwrite your current draft with the selected version. Are you sure?')) return;
    
    try {
      const res = await fetch(`/api/admin/pages/${pageId}/history/${section}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ historyId }),
      });
      const result = await res.json();
      if (result.success) {
        setData(result.restoredContent);
        setHistoryOpen(false);
        showToast('Version restored to draft!', 'success');
      } else {
        showToast('Failed to restore', 'error');
      }
    } catch (err) {
      showToast('Failed to restore', 'error');
    }
  }

  async function handleImageUpload(fieldPath, file, arrayIndex) {
    const uploadKey = arrayIndex !== undefined ? `${fieldPath}-${arrayIndex}` : fieldPath;
    setUploading(uploadKey);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('pageId', pageId);
    formData.append('section', section);

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });
      const result = await res.json();

      if (result.success) {
        if (arrayIndex !== undefined) {
          // Field inside an array item
          const arrayKey = fieldPath.split('.')[0];
          const itemField = fieldPath.split('.')[1];
          const updated = JSON.parse(JSON.stringify(data));
          updated[arrayKey][arrayIndex][itemField] = result.path;
          setData(updated);
        } else {
          setData(setNestedValue(data, fieldPath, result.path));
        }
        showToast('Image uploaded!', 'success');
      } else {
        showToast('Upload failed', 'error');
      }
    } catch (err) {
      showToast('Upload failed', 'error');
    } finally {
      setUploading(null);
    }
  }

  function handleFieldChange(fieldPath, value) {
    setData(setNestedValue(data, fieldPath, value));
  }

  function handleArrayItemChange(arrayKey, index, itemKey, value) {
    const updated = JSON.parse(JSON.stringify(data));
    updated[arrayKey][index][itemKey] = value;
    setData(updated);
  }

  function addArrayItem(arrayKey, itemFields) {
    const updated = JSON.parse(JSON.stringify(data));
    const newItem = {};
    itemFields.forEach((f) => {
      newItem[f.key] = '';
    });
    if (!updated[arrayKey]) updated[arrayKey] = [];
    updated[arrayKey].push(newItem);
    setData(updated);
  }

  function removeArrayItem(arrayKey, index) {
    const updated = JSON.parse(JSON.stringify(data));
    updated[arrayKey].splice(index, 1);
    setData(updated);
  }

  // Drag-and-drop for array items (nav items, speakers, sponsors etc.)
  function handleArrayDragStart(e, arrayKey, index) {
    arrayDragItem.current = index;
    setDragArrayKey(arrayKey);
    e.dataTransfer.effectAllowed = 'move';
  }

  function handleArrayDragEnter(arrayKey, index) {
    if (dragArrayKey !== arrayKey) return;
    arrayDragOverItem.current = index;
    setDragArrayOverIdx(index);
  }

  function handleArrayDragEnd(arrayKey) {
    setDragArrayOverIdx(null);
    setDragArrayKey(null);
    if (arrayDragItem.current === null || arrayDragOverItem.current === null) return;
    if (arrayDragItem.current === arrayDragOverItem.current) {
      arrayDragItem.current = null;
      arrayDragOverItem.current = null;
      return;
    }

    const updated = JSON.parse(JSON.stringify(data));
    const items = updated[arrayKey];
    const dragged = items[arrayDragItem.current];
    items.splice(arrayDragItem.current, 1);
    items.splice(arrayDragOverItem.current, 0, dragged);
    updated[arrayKey] = items;

    arrayDragItem.current = null;
    arrayDragOverItem.current = null;
    setData(updated);
  }

  const toggleArrayItem = (fieldKey, idx) => {
    const key = `${fieldKey}-${idx}`;
    setExpandedArrayItems((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleStringArrayChange = (fieldKey, idx, value) => {
    const updated = JSON.parse(JSON.stringify(data));
    updated[fieldKey][idx] = value;
    setData(updated);
  }

  function addStringArrayItem(key) {
    const updated = JSON.parse(JSON.stringify(data));
    if (!updated[key]) updated[key] = [];
    updated[key].push('');
    setData(updated);
  }

  function removeStringArrayItem(key, index) {
    const updated = JSON.parse(JSON.stringify(data));
    updated[key].splice(index, 1);
    setData(updated);
  }

  if (!schema && !dbConfig) return null;

  if (loading) {
    return (
      <div className={styles.loadingWrapper}>
        <div className={styles.spinner} />
        <p>Loading {schema?.label || dbConfig?.label}...</p>
      </div>
    );
  }

  // DB-backed section: show CrudTable with filtered data
  if (dbConfig) {
    const eventsTableColumns = [
      { key: 'title', label: 'Event Title' },
      { key: 'date', label: 'Date' },
      { key: 'location', label: 'Location' },
      { key: 'order', label: 'Order' },
    ];
    const eventsFormColumns = [
      { key: 'title', label: 'Event Title', required: true },
      { key: 'date', label: 'Date' },
      { key: 'location', label: 'Location' },
      { key: 'link', label: 'Event Link' },
      { key: 'image', label: 'Image URL' },
      { key: 'order', label: 'Order', type: 'number' },
    ];
    const procTableColumns = [
      { key: 'title', label: 'Title' },
      { key: 'category', label: 'Category' },
      { key: 'authors', label: 'Authors' },
      { key: 'order', label: 'Order' },
    ];
    const procFormColumns = [
      { key: 'title', label: 'Title', required: true },
      { key: 'category', label: 'Category' },
      { key: 'authors', label: 'Authors' },
      { key: 'pdfUrl', label: 'PDF URL' },
      { key: 'date', label: 'Date' },
      { key: 'coverImage', label: 'Cover Image URL' },
      { key: 'link', label: 'Link' },
      { key: 'order', label: 'Order', type: 'number' },
    ];

    const isEvents = dbConfig.type === 'events';
    const endpoint = isEvents
      ? `/api/admin/events?eventType=${dbConfig.filter}`
      : '/api/admin/proceedings';

    return (
      <div className={styles.editor}>
        {toast && (
          <div className={`${styles.toast} ${styles[toast.type]}`}>
            {toast.message}
          </div>
        )}
        <div className={styles.editorHeader}>
          <button className={styles.backBtn} onClick={() => router.push(`/admin/pages/${pageId}`)}>
            ← Back
          </button>
          <div className={styles.editorTitleGroup}>
            <h2 className={styles.editorTitle}>{dbConfig.label}</h2>
            <p className={styles.editorSubtitle}>Manage {dbConfig.label.toLowerCase()} — saved directly to database</p>
          </div>
        </div>

        {/* Page title field (still from JSON) */}
        {schema && data && schema.fields.length > 0 && (
          <div className={styles.fieldsContainer} style={{ marginBottom: '0' }}>
            {schema.fields.map((field) => (
              <div key={field.key} className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>{field.label}</label>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <input
                    type="text"
                    className={styles.textInput}
                    value={getNestedValue(data, field.key) || ''}
                    onChange={(e) => handleFieldChange(field.key, e.target.value)}
                  />
                  <button className={styles.saveBtn} onClick={handleSave} disabled={saving} style={{ whiteSpace: 'nowrap' }}>
                    {saving ? 'Saving...' : 'Save Title'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* DB-backed CrudTable */}
        <CrudTable
          title={dbConfig.label}
          endpoint={endpoint}
          tableColumns={isEvents ? eventsTableColumns : procTableColumns}
          formColumns={isEvents ? eventsFormColumns : procFormColumns}
          defaultValues={isEvents ? { eventType: dbConfig.filter } : {}}
        />
      </div>
    );
  }

  return (
    <div className={styles.editor}>
      {/* Toast */}
      {toast && (
        <div className={`${styles.toast} ${styles[toast.type]}`}>
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className={styles.editorHeader}>
        <button className={styles.backBtn} onClick={() => router.push(`/admin/pages/${pageId}`)}>
          ← Back
        </button>
        <div className={styles.editorTitleGroup}>
          <h2 className={styles.editorTitle}>{schema.label}</h2>
          <p className={styles.editorSubtitle}>Edit section content and media</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            className={styles.secondaryBtn}
            onClick={() => { fetchHistory(); setHistoryOpen(true); }}
          >
            <FiClock /> History
          </button>
          <button
            className={styles.secondaryBtn}
            onClick={() => handleSave(true)}
            disabled={saving}
          >
            {saving ? '...' : <><FiSave /> Save Draft</>}
          </button>
          <button
            className={styles.secondaryBtn}
            onClick={handlePreview}
            disabled={saving}
          >
            <FiEye /> Preview
          </button>
          <button
            className={styles.saveBtn}
            onClick={() => handleSave(false)}
            disabled={saving}
          >
            {saving ? 'Publishing...' : <><FiUploadCloud /> Publish Live</>}
          </button>
        </div>
      </div>

      {/* Fields */}
      <div className={styles.fieldsContainer}>
        {schema.fields.map((field) => (
          <div key={field.key} className={styles.fieldGroup}>
            {field.type === 'text' && (
              <>
                <label className={styles.fieldLabel}>{field.label}</label>
                <input
                  type="text"
                  className={styles.textInput}
                  value={getNestedValue(data, field.key) || ''}
                  onChange={(e) => handleFieldChange(field.key, e.target.value)}
                />
              </>
            )}

            {field.type === 'textarea' && (
              <>
                <label className={styles.fieldLabel}>{field.label}</label>
                <textarea
                  className={styles.textArea}
                  rows={4}
                  value={getNestedValue(data, field.key) || ''}
                  onChange={(e) => handleFieldChange(field.key, e.target.value)}
                />
              </>
            )}

            {field.type === 'image' && (
              <>
                <label className={styles.fieldLabel}>{field.label}</label>
                <div className={styles.imageField}>
                  {getNestedValue(data, field.key) && (() => {
                    const rawImg = getNestedValue(data, field.key);
                    return (
                      <div className={styles.imagePreview}>
                        <Image
                          src={getNestedValue(data, field.key)}
                          alt="Preview"
                          fill
                          style={{ objectFit: 'contain' }}
                          unoptimized
                        />
                      </div>
                    );
                  })()}
                  <div className={styles.imageControls}>
                    <input
                      type="text"
                      className={styles.textInput}
                      value={getNestedValue(data, field.key) || ''}
                      onChange={(e) => handleFieldChange(field.key, e.target.value)}
                      placeholder="Image path or URL"
                    />
                    <label className={styles.uploadBtn}>
                      {uploading === field.key ? 'Uploading...' : <><FiUploadCloud /> Upload New</>}
                      <input
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            handleImageUpload(field.key, e.target.files[0]);
                          }
                        }}
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => { setMediaPickerField(field.key); setMediaPickerOpen(true); }}
                      style={{ background: '#f8fafc', color: '#0f172a', border: '1px solid #cbd5e1', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: '600', transition: 'all 0.2s' }}
                      onMouseOver={(e) => { e.target.style.background = '#f1f5f9'; }}
                      onMouseOut={(e) => { e.target.style.background = '#f8fafc'; }}
                    >
                      <FiImage /> Select from Library
                    </button>
                    {getNestedValue(data, field.key) && (
                      <button 
                        className={styles.removeBtn} 
                        onClick={() => handleFieldChange(field.key, '')}
                        title="Remove Image"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </>
            )}

            {field.type === 'stringArray' && (
              <>
                <label className={styles.fieldLabel}>{field.label}</label>
                <div className={styles.arrayContainer}>
                  {(data[field.key] || []).map((item, idx) => (
                    <div key={idx} className={styles.stringArrayItem}>
                      <input
                        type="text"
                        className={styles.textInput}
                        value={item}
                        onChange={(e) => handleStringArrayChange(field.key, idx, e.target.value)}
                      />
                      <button
                        className={styles.removeBtn}
                        onClick={() => removeStringArrayItem(field.key, idx)}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    className={styles.addBtn}
                    onClick={() => addStringArrayItem(field.key)}
                  >
                    + Add Item
                  </button>
                </div>
              </>
            )}

            {field.type === 'array' && (
              <>
                <label className={styles.fieldLabel}>
                  {field.label}
                  <span className={styles.arrayCount}>
                    {(data[field.key] || []).length} items
                  </span>
                </label>
                <div className={styles.arrayContainer}>
                  {(data[field.key] || []).map((item, idx) => (
                    <div
                      key={idx}
                      className={`${styles.arrayItem} ${dragArrayKey === field.key && dragArrayOverIdx === idx ? styles.arrayItemDragOver : ''}`}
                      draggable
                      onDragStart={(e) => handleArrayDragStart(e, field.key, idx)}
                      onDragEnter={() => handleArrayDragEnter(field.key, idx)}
                      onDragEnd={() => handleArrayDragEnd(field.key)}
                      onDragOver={(e) => e.preventDefault()}
                    >
                      <div className={styles.arrayItemHeader}>
                        <div className={styles.arrayItemLeft}>
                          <span className={styles.arrayDragHandle} title="Drag to reorder">⠿</span>
                          <span className={styles.arrayItemIndex}>
                            #{idx + 1}
                            {(() => {
                              const titleField = field.itemFields.find(f => f.type === 'text');
                              const val = titleField ? item[titleField.key] : null;
                              return val ? ` - ${val}` : '';
                            })()}
                          </span>
                        </div>
                        <div className={styles.arrayItemActions}>
                          <button
                            className={styles.editBtn}
                            onClick={() => toggleArrayItem(field.key, idx)}
                          >
                            {expandedArrayItems[`${field.key}-${idx}`] ? '▲ Collapse' : '▼ Edit Item'}
                          </button>
                          <button
                            className={styles.removeBtn}
                            onClick={() => removeArrayItem(field.key, idx)}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                      
                      {expandedArrayItems[`${field.key}-${idx}`] && (
                        <div className={styles.arrayItemFields}>
                          {field.itemFields.map((subField) => {
                            const isFullWidth = subField.type === 'textarea' || subField.type === 'subArray' || subField.type === 'commaSeparated';
                            return (
                              <div key={subField.key} className={`${styles.subField} ${isFullWidth ? styles.subFieldFull : ''}`}>
                                <label className={styles.subFieldLabel}>
                                  {subField.label}
                                </label>
                            {subField.type === 'text' && (
                              <input
                                type="text"
                                className={styles.textInput}
                                value={item[subField.key] || ''}
                                onChange={(e) =>
                                  handleArrayItemChange(field.key, idx, subField.key, e.target.value)
                                }
                              />
                            )}
                            {subField.type === 'textarea' && (
                              <textarea
                                className={styles.textArea}
                                rows={3}
                                value={item[subField.key] || ''}
                                onChange={(e) =>
                                  handleArrayItemChange(field.key, idx, subField.key, e.target.value)
                                }
                              />
                            )}
                            {subField.type === 'commaSeparated' && (
                              <input
                                type="text"
                                className={styles.textInput}
                                value={Array.isArray(item[subField.key]) ? item[subField.key].join(', ') : (item[subField.key] || '')}
                                onChange={(e) => {
                                  const val = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                                  handleArrayItemChange(field.key, idx, subField.key, val);
                                }}
                                placeholder="Tag1, Tag2, Tag3"
                              />
                            )}
                            {subField.type === 'subArray' && (
                              <div className={styles.subArrayContainer}>
                                {(item[subField.key] || []).map((subItem, subIdx) => (
                                  <div key={subIdx} className={styles.subArrayItem}>
                                    <div className={styles.subArrayHeader}>
                                      <span className={styles.arrayItemIndex}>#{subIdx + 1}</span>
                                      <button
                                        className={styles.removeBtn}
                                        onClick={() => {
                                          const updated = JSON.parse(JSON.stringify(data));
                                          updated[field.key][idx][subField.key].splice(subIdx, 1);
                                          setData(updated);
                                        }}
                                      >
                                        ✕
                                      </button>
                                    </div>
                                    {subField.subFields.map((sf) => (
                                      <div key={sf.key} className={styles.subField}>
                                        <label className={styles.subFieldLabel}>{sf.label}</label>
                                        <input
                                          type="text"
                                          className={styles.textInput}
                                          value={subItem[sf.key] || ''}
                                          onChange={(e) => {
                                            const updated = JSON.parse(JSON.stringify(data));
                                            updated[field.key][idx][subField.key][subIdx][sf.key] = e.target.value;
                                            setData(updated);
                                          }}
                                        />
                                      </div>
                                    ))}
                                  </div>
                                ))}
                                <button
                                  className={styles.addBtn}
                                  onClick={() => {
                                    const updated = JSON.parse(JSON.stringify(data));
                                    const newSub = {};
                                    subField.subFields.forEach((sf) => { newSub[sf.key] = ''; });
                                    if (!updated[field.key][idx][subField.key]) {
                                      updated[field.key][idx][subField.key] = [];
                                    }
                                    updated[field.key][idx][subField.key].push(newSub);
                                    setData(updated);
                                  }}
                                >
                                  + Add Stat
                                </button>
                              </div>
                            )}
                            {subField.type === 'image' && (
                              <div className={styles.imageField}>
                                {item[subField.key] && (() => {
                                  const rawImg = item[subField.key];
                                  const imgSrc = rawImg.startsWith('/') || rawImg.startsWith('http') ? rawImg : `/${rawImg}`;
                                  return (
                                    <div className={styles.imagePreviewSmall}>
                                      <Image
                                        src={imgSrc}
                                        alt={subField.label}
                                        className={styles.previewImgSmall}
                                        width={100}
                                        height={50}
                                        style={{ objectFit: 'contain' }}
                                      />
                                    </div>
                                  );
                                })()}
                                <div className={styles.imageControls}>
                                  <input
                                    type="text"
                                    className={styles.textInput}
                                    value={item[subField.key] || ''}
                                    onChange={(e) =>
                                      handleArrayItemChange(field.key, idx, subField.key, e.target.value)
                                    }
                                    placeholder="Image path or URL"
                                  />
                                  <label className={styles.uploadBtn}>
                                    {uploading === `${field.key}.${subField.key}-${idx}` ? 'Uploading...' : <><FiUploadCloud /> Upload</>}
                                    <input
                                      type="file"
                                      accept="image/*"
                                      hidden
                                      onChange={(e) => {
                                        if (e.target.files?.[0]) {
                                          handleImageUpload(
                                            `${field.key}.${subField.key}`,
                                            e.target.files[0],
                                            idx
                                          );
                                        }
                                      }}
                                    />
                                  </label>
                                  {item[subField.key] && (
                                    <button 
                                      className={styles.removeBtn} 
                                      onClick={() => handleArrayItemChange(field.key, idx, subField.key, '')}
                                      title="Remove Image"
                                    >
                                      ✕ Remove
                                    </button>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                        })}
                      </div>
                    )}
                  </div>
                  ))}
                  <button
                    className={styles.addBtn}
                    onClick={() => addArrayItem(field.key, field.itemFields)}
                  >
                    + Add {field.label.replace(/s$/, '')}
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      <MediaPickerModal 
        isOpen={mediaPickerOpen} 
        onClose={() => setMediaPickerOpen(false)} 
        onSelect={(url) => {
          // If the field contains a dot, it might be an array item or nested, but handleFieldChange handles simple keys.
          // Wait, handleFieldChange just sets simple root keys in the data state.
          handleFieldChange(mediaPickerField, url);
          setMediaPickerOpen(false);
        }} 
      />

      {/* History Modal */}
      {historyOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', zIndex: 9999,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{
            background: 'white', width: '500px', maxHeight: '80vh',
            borderRadius: '12px', display: 'flex', flexDirection: 'column', overflow: 'hidden'
          }}>
            <div style={{ padding: '20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between' }}>
              <h2 style={{ margin: 0, fontSize: '18px' }}>Version History</h2>
              <button onClick={() => setHistoryOpen(false)} style={{ cursor: 'pointer', background: 'transparent', border: 'none', fontSize: '24px' }}>&times;</button>
            </div>
            <div style={{ padding: '20px', overflowY: 'auto', flex: 1 }}>
              {historyItems.length === 0 ? (
                <p>No history available for this section yet.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {historyItems.map((h, i) => (
                    <div key={h.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', border: '1px solid #e2e8f0', borderRadius: '8px', background: '#f8fafc' }}>
                      <div>
                        <div style={{ fontWeight: '600', fontSize: '14px' }}>Version {historyItems.length - i}</div>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>{new Date(h.createdAt).toLocaleString()}</div>
                      </div>
                      <button 
                        onClick={() => handleRestoreHistory(h.id)}
                        style={{ background: '#240E8B', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
                      >
                        Restore
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Sticky Save Bar */}
      <div className={styles.stickyBar}>
        <div style={{ display: 'flex', gap: '12px', width: '100%', justifyContent: 'flex-end' }}>
          <button
            className={styles.secondaryBtn}
            onClick={() => handleSave(true)}
            disabled={saving}
          >
            {saving ? '...' : <><FiSave /> Save Draft</>}
          </button>
          <button
            className={styles.secondaryBtn}
            onClick={handlePreview}
            disabled={saving}
          >
            <FiEye /> Preview
          </button>
          <button
            className={styles.saveBtn}
            onClick={() => handleSave(false)}
            disabled={saving}
          >
            {saving ? 'Publishing...' : <><FiUploadCloud /> Publish Live</>}
          </button>
        </div>
      </div>
    </div>
  );
}
