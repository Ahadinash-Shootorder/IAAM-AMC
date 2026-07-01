/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { FiEdit2, FiTrash2, FiPlus, FiX, FiSearch, FiFilter, FiUploadCloud, FiCheckCircle, FiAlertCircle, FiInbox } from 'react-icons/fi';
import styles from './CrudTable.module.css';
import MediaPickerModal from './MediaPickerModal';
import RichTextEditor from './RichTextEditor';
import LinkInput from './LinkInput';

export default function CrudTable({ title, endpoint, tableColumns, formColumns, columns, defaultValues = {}, customAction }) {
  // Support both old 'columns' prop and new separate props
  const displayCols = tableColumns || columns || [];
  const editCols = formColumns || columns || [];

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filterKey, setFilterKey] = useState('');
  const [filterValue, setFilterValue] = useState('');
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [mediaPickerField, setMediaPickerField] = useState(null);
  const [isNewCategoryMode, setIsNewCategoryMode] = useState({});
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await fetch(endpoint);
      const data = await res.json();
      if (Array.isArray(data)) setItems(data);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchItems();
  }, [endpoint]);

  const handleAdd = () => {
    const defaultData = editCols.reduce((acc, col) => {
      acc[col.key] = col.type === 'stringArray' || col.type === 'objectArray' ? [] : '';
      return acc;
    }, {});
    // Merge default values (e.g., eventType for filtered pages)
    setFormData({ ...defaultData, ...defaultValues });
    setEditingItem('new');
    setIsNewCategoryMode({});
  };

  const handleEdit = (item) => {
    const parsedData = { ...item };
    editCols.forEach((col) => {
      if ((col.type === 'stringArray' || col.type === 'objectArray') && typeof parsedData[col.key] === 'string') {
        try {
          parsedData[col.key] = JSON.parse(parsedData[col.key]);
        } catch (e) {
          parsedData[col.key] = [];
        }
      } else if ((col.type === 'stringArray' || col.type === 'objectArray') && !parsedData[col.key]) {
        parsedData[col.key] = [];
      }
    });
    setFormData(parsedData);
    setEditingItem(item.id);
    
    // Determine category modes based on existing values
    const newModes = {};
    editCols.forEach(col => {
      if (col.type === 'category') {
        const existing = [...new Set(items.map(i => i[col.key]).filter(Boolean))];
        const val = item[col.key] || '';
        if (val && !existing.includes(val)) {
          newModes[col.key] = true;
        }
      }
    });
    setIsNewCategoryMode(newModes);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    try {
      const res = await fetch(`${endpoint}/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast('Item deleted successfully', 'success');
        fetchItems();
      } else {
        showToast('Failed to delete item', 'error');
      }
    } catch (e) {
      showToast('Error deleting item', 'error');
      console.error(e);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData };
      editCols.forEach((col) => {
        if (col.type === 'stringArray') {
          let val = payload[col.key] || [];
          if (typeof val === 'string') {
            val = val.split(',').map(s => s.trim()).filter(Boolean);
          }
          payload[col.key] = JSON.stringify(val);
        } else if (col.type === 'objectArray') {
          payload[col.key] = JSON.stringify(payload[col.key] || []);
        }
      });

      const method = editingItem === 'new' ? 'POST' : 'PUT';
      const url = editingItem === 'new' ? endpoint : `${endpoint}/${editingItem}`;
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        showToast('Saved successfully', 'success');
        setEditingItem(null);
        fetchItems();
      } else {
        showToast('Failed to save', 'error');
      }
    } catch (e) {
      showToast('Error saving item', 'error');
      console.error(e);
    }
  };

  const handleInputChange = (key, value) => {
    setFormData((prev) => {
      const next = { ...prev, [key]: value };
      if ((key === 'name' || key === 'title') && editCols.some(c => c.key === 'slug')) {
        const oldSlug = prev.slug || '';
        const prevText = prev[key] || '';
        const expectedOldSlug = prevText
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
        
        if (!oldSlug || oldSlug === expectedOldSlug) {
          next.slug = value
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
        }
      }
      return next;
    });
  };

  const handleArrayItemChange = (arrayKey, index, fieldKey, value) => {
    setFormData((prev) => {
      const arr = [...(prev[arrayKey] || [])];
      arr[index] = { ...arr[index], [fieldKey]: value };
      return { ...prev, [arrayKey]: arr };
    });
  };

  const addArrayItem = (arrayKey, itemFields) => {
    setFormData((prev) => {
      const arr = [...(prev[arrayKey] || [])];
      const newItem = itemFields.reduce((acc, f) => ({ ...acc, [f.key]: '' }), {});
      arr.push(newItem);
      return { ...prev, [arrayKey]: arr };
    });
  };

  const removeArrayItem = (arrayKey, index) => {
    setFormData((prev) => {
      const arr = [...(prev[arrayKey] || [])];
      arr.splice(index, 1);
      return { ...prev, [arrayKey]: arr };
    });
  };

  const handleFileUpload = async (e, key) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('pageId', 'crud');
    formData.append('section', 'uploads');

    try {
      setLoading(true);
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.success) {
        handleInputChange(key, data.path);
      } else {
        alert(data.error || 'Upload failed');
      }
    } catch (err) {
      alert('Upload failed');
    } finally {
      setLoading(false);
    }
  };

  // Filter and search logic
  const filteredItems = items.filter((item) => {
    // Search: match any displayCol value
    const matchesSearch = !searchTerm || displayCols.some((col) => {
      const val = String(item[col.key] || '').toLowerCase();
      return val.includes(searchTerm.toLowerCase());
    });

    // Filter by selected column value
    const matchesFilter = !filterKey || !filterValue || 
      String(item[filterKey] || '').toLowerCase() === filterValue.toLowerCase();

    return matchesSearch && matchesFilter;
  });

  // Get unique values for selected filter column
  const filterOptions = filterKey
    ? [...new Set(items.map((item) => item[filterKey]).filter(Boolean))]
    : [];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>{title}</h2>
        {!editingItem && (
          <button className={styles.addBtn} onClick={handleAdd}>
            <FiPlus /> Add New
          </button>
        )}
      </div>

      {/* Search & Filter Bar */}
      {!editingItem && (
        <div className={styles.toolbar}>
          <div className={styles.searchBox}>
            <FiSearch className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>
          <div className={styles.filterBox}>
            <FiFilter className={styles.filterIcon} />
            <select
              value={filterKey}
              onChange={(e) => { setFilterKey(e.target.value); setFilterValue(''); }}
              className={styles.filterSelect}
            >
              <option value="">Filter by...</option>
              {displayCols.map((col) => (
                <option key={col.key} value={col.key}>{col.label}</option>
              ))}
            </select>
            {filterKey && (
              <select
                value={filterValue}
                onChange={(e) => setFilterValue(e.target.value)}
                className={styles.filterSelect}
              >
                <option value="">All</option>
                {filterOptions.map((val) => (
                  <option key={val} value={val}>{val}</option>
                ))}
              </select>
            )}
          </div>
        </div>
      )}

      {editingItem && (
        <form className={styles.editorForm} onSubmit={handleSave}>
          <h3>{editingItem === 'new' ? 'Create New' : 'Edit Item'}</h3>
          <div className={styles.formGrid}>
            {editCols.map((col) => {
              const isImageField = col.key.toLowerCase().includes('image') || col.key === 'logo';
              const isLinkField = col.key.toLowerCase().includes('link') || col.key.toLowerCase().includes('url');
              const isFullWidth = col.type === 'textarea' || col.type === 'stringArray' || col.type === 'objectArray' || isImageField;
              return (
                <div key={col.key} className={`${styles.formGroup} ${isFullWidth ? styles.fullWidth : ''}`}>
                  <label>{col.label}</label>
                  {col.type === 'textarea' ? (
                    <RichTextEditor
                      value={formData[col.key] || ''}
                      onChange={(html) => handleInputChange(col.key, html)}
                      placeholder={`Enter ${col.label.toLowerCase()}...`}
                    />
                  ) : col.type === 'select' && col.options ? (
                    <select
                      value={formData[col.key] || ''}
                      onChange={(e) => handleInputChange(col.key, e.target.value)}
                      required={col.required}
                    >
                      <option value="">-- Select --</option>
                      {col.options.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  ) : col.type === 'category' ? (
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      {isNewCategoryMode[col.key] ? (
                        <>
                          <input
                            type="text"
                            value={formData[col.key] || ''}
                            onChange={(e) => handleInputChange(col.key, e.target.value)}
                            placeholder="Type new category..."
                            style={{ flexGrow: 1 }}
                            required={col.required}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setIsNewCategoryMode(prev => ({ ...prev, [col.key]: false }));
                              handleInputChange(col.key, '');
                            }}
                            style={{ background: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}
                          >
                            Select Existing
                          </button>
                        </>
                      ) : (
                        <>
                          <select
                            value={formData[col.key] || ''}
                            onChange={(e) => handleInputChange(col.key, e.target.value)}
                            required={col.required}
                            style={{ flexGrow: 1 }}
                          >
                            <option value="">-- Select Category --</option>
                            {[...new Set(items.map((i) => i[col.key]).filter(Boolean))].map((cat) => (
                              <option key={cat} value={cat}>{cat}</option>
                            ))}
                          </select>
                          <button
                            type="button"
                            onClick={() => setIsNewCategoryMode(prev => ({ ...prev, [col.key]: true }))}
                            style={{ background: '#e0e7ff', color: '#4338ca', border: '1px solid #c7d2fe', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}
                          >
                            + Create New
                          </button>
                        </>
                      )}
                    </div>
                  ) : isImageField ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', background: '#fafafa', padding: '20px', borderRadius: '10px', border: '1px solid #e5e7eb' }}>
                        {formData[col.key] ? (
                          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                            <div style={{ position: 'relative', width: '160px', height: '120px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #e5e7eb', background: '#f3f4f6', flexShrink: 0 }}>
                              <Image 
                                src={formData[col.key].startsWith('/') || formData[col.key].startsWith('http') ? formData[col.key] : `/${formData[col.key]}`}
                                alt="Preview"
                                fill
                                sizes="(max-width: 768px) 100vw, 300px"
                                style={{ objectFit: 'cover' }}
                              />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', justifyContent: 'center' }}>
                              <div style={{ color: '#6b7280', fontSize: '13px', wordBreak: 'break-all' }}>
                                {formData[col.key]}
                              </div>
                              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                  <label style={{ background: '#240E8B', color: '#fff', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: '600', transition: 'background 0.2s' }}>
                                    Change Image
                                    <input 
                                      type="file" 
                                      accept="image/*"
                                      hidden
                                      onChange={(e) => handleFileUpload(e, col.key)}
                                    />
                                  </label>
                                  <button
                                    type="button"
                                    onClick={() => { setMediaPickerField(col.key); setMediaPickerOpen(true); }}
                                    style={{ background: '#f8fafc', color: '#0f172a', border: '1px solid #cbd5e1', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: '600', transition: 'all 0.2s' }}
                                    onMouseOver={(e) => { e.target.style.background = '#f1f5f9'; }}
                                    onMouseOut={(e) => { e.target.style.background = '#f8fafc'; }}
                                  >
                                    Select from Library
                                  </button>
                                <button 
                                  type="button"
                                  onClick={() => handleInputChange(col.key, '')}
                                  style={{ color: '#ef4444', background: 'transparent', border: '1px solid #ef4444', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: '600', transition: 'all 0.2s' }}
                                  onMouseOver={(e) => { e.target.style.background = '#fef2f2'; }}
                                  onMouseOut={(e) => { e.target.style.background = 'transparent'; }}
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center', padding: '32px', border: '2px dashed #d1d5db', borderRadius: '8px', background: '#fff', transition: 'border-color 0.2s' }}
                               onMouseOver={(e) => e.currentTarget.style.borderColor = '#240E8B'}
                               onMouseOut={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
                          >
                            <span style={{ fontSize: '32px', color: '#240E8B', marginBottom: '-8px' }}><FiUploadCloud /></span>
                            <span style={{ fontSize: '15px', fontWeight: '500', color: '#6b7280' }}>Add {col.label}</span>
                            
                            <div style={{ display: 'flex', gap: '12px' }}>
                              <label style={{ background: '#240E8B', color: '#fff', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: '600', transition: 'background 0.2s' }}>
                                Upload New
                                <input 
                                  type="file" 
                                  accept="image/*"
                                  hidden
                                  onChange={(e) => handleFileUpload(e, col.key)}
                                />
                              </label>
                              <button
                                type="button"
                                onClick={() => { setMediaPickerField(col.key); setMediaPickerOpen(true); }}
                                style={{ background: '#f8fafc', color: '#0f172a', border: '1px solid #cbd5e1', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: '600', transition: 'all 0.2s' }}
                                onMouseOver={(e) => { e.target.style.background = '#f1f5f9'; }}
                                onMouseOut={(e) => { e.target.style.background = '#f8fafc'; }}
                              >
                                Select from Library
                              </button>
                            </div>
                            <span style={{ fontSize: '12px', color: '#9ca3af' }}>SVG, PNG, JPG or GIF (max. 5MB)</span>
                          </div>
                        )}
                      </div>
                    ) : col.type === 'file' ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', background: '#fafafa', padding: '20px', borderRadius: '10px', border: '1px solid #e5e7eb' }}>
                        {formData[col.key] ? (
                          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                            <div style={{ padding: '12px', background: '#f1f5f9', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#334155', flexGrow: 1, wordBreak: 'break-all' }}>
                              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                                <polyline points="14 2 14 8 20 8"/>
                              </svg>
                              <span>{formData[col.key]}</span>
                            </div>
                            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                              <label style={{ background: '#240E8B', color: '#fff', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: '600', transition: 'background 0.2s' }}>
                                Change File
                                <input 
                                  type="file" 
                                  accept=".pdf,application/pdf"
                                  hidden
                                  onChange={(e) => handleFileUpload(e, col.key)}
                                />
                              </label>
                              <button 
                                type="button"
                                onClick={() => handleInputChange(col.key, '')}
                                style={{ color: '#ef4444', background: 'transparent', border: '1px solid #ef4444', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: '600', transition: 'all 0.2s' }}
                                onMouseOver={(e) => { e.target.style.background = '#fef2f2'; }}
                                onMouseOut={(e) => { e.target.style.background = 'transparent'; }}
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center', padding: '32px', border: '2px dashed #d1d5db', borderRadius: '8px', background: '#fff', transition: 'border-color 0.2s' }}
                               onMouseOver={(e) => e.currentTarget.style.borderColor = '#240E8B'}
                               onMouseOut={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
                          >
                            <span style={{ fontSize: '32px', color: '#240E8B', marginBottom: '-8px' }}><FiUploadCloud /></span>
                            <span style={{ fontSize: '15px', fontWeight: '500', color: '#6b7280' }}>Add {col.label}</span>
                            
                            <div style={{ display: 'flex', gap: '12px' }}>
                              <label style={{ background: '#240E8B', color: '#fff', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: '600', transition: 'background 0.2s' }}>
                                Upload PDF / File
                                <input 
                                  type="file" 
                                  accept=".pdf,application/pdf"
                                  hidden
                                  onChange={(e) => handleFileUpload(e, col.key)}
                                />
                              </label>
                            </div>
                            <span style={{ fontSize: '12px', color: '#9ca3af' }}>PDF (max. 10MB)</span>
                          </div>
                        )}
                      </div>
                    ) : col.type === 'stringArray' ? (
                      <input
                        type="text"
                        value={Array.isArray(formData[col.key]) ? formData[col.key].join(', ') : formData[col.key] || ''}
                        onChange={(e) => {
                          handleInputChange(col.key, e.target.value);
                        }}
                        placeholder="Tag1, Tag2, Tag3"
                        style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px' }}
                      />
                    ) : col.type === 'objectArray' && col.itemFields ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '8px' }}>
                        {(formData[col.key] || []).map((item, idx) => (
                          <div key={idx} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px', position: 'relative' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #e2e8f0' }}>
                              <span style={{ fontWeight: '600', color: '#475569', fontSize: '14px' }}>Item #{idx + 1}</span>
                              <button 
                                type="button" 
                                onClick={() => removeArrayItem(col.key, idx)} 
                                style={{ color: '#ef4444', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '4px' }}
                              >
                                <FiTrash2 /> Remove
                              </button>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
                              {col.itemFields.map(f => (
                                <div key={f.key} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                  <label style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>{f.label}</label>
                                  <input
                                    type={f.type || 'text'}
                                    value={item[f.key] || ''}
                                    onChange={(e) => handleArrayItemChange(col.key, idx, f.key, e.target.value)}
                                    placeholder={`Enter ${f.label.toLowerCase()}`}
                                    style={{ padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px', outline: 'none', transition: 'border-color 0.2s' }}
                                    onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                                    onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                        <button 
                          type="button" 
                          onClick={() => addArrayItem(col.key, col.itemFields)} 
                          style={{ alignSelf: 'flex-start', background: '#e0e7ff', color: '#4338ca', border: '1px dashed #6366f1', padding: '10px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.2s' }}
                          onMouseOver={(e) => { e.target.style.background = '#c7d2fe'; e.target.style.borderColor = '#4f46e5'; }}
                          onMouseOut={(e) => { e.target.style.background = '#e0e7ff'; e.target.style.borderColor = '#6366f1'; }}
                        >
                          <FiPlus /> Add New {col.label}
                        </button>
                      </div>
                    ) : isLinkField && !isImageField ? (
                      <LinkInput
                        value={formData[col.key] || ''}
                        onChange={(val) => handleInputChange(col.key, val)}
                        required={col.required}
                      />
                    ) : col.type === 'boolean' ? (
                      <label style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', cursor: 'pointer', padding: '8px 0', userSelect: 'none' }}>
                        <input
                          type="checkbox"
                          checked={!!formData[col.key]}
                          onChange={(e) => handleInputChange(col.key, e.target.checked)}
                          style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#240E8B' }}
                        />
                        <span style={{ fontSize: '14px', color: '#374151', fontWeight: '500' }}>
                          {formData[col.key] ? 'Yes — Featured' : 'No — Not Featured'}
                        </span>
                      </label>
                    ) : (
                      <input
                        type={col.type || 'text'}
                        value={formData[col.key] || ''}
                        onChange={(e) => handleInputChange(col.key, e.target.value)}
                        required={col.required}
                      />
                    )}
                </div>
              );
            })}
          </div>
          <div className={styles.formActions}>
            <button type="submit" className={styles.saveBtn}>Save Changes</button>
            <button type="button" className={styles.cancelBtn} onClick={() => setEditingItem(null)}>Cancel</button>
          </div>
        </form>
      )}

      {!editingItem && (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                {displayCols.map((col) => (
                  <th key={col.key}>{col.label}</th>
                ))}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 3 }).map((_, idx) => (
                  <tr key={idx} className={styles.skeletonRow}>
                    {displayCols.map((col) => (
                      <td key={col.key}><div className={styles.skeletonCell}></div></td>
                    ))}
                    <td><div className={styles.skeletonCell}></div></td>
                  </tr>
                ))
              ) : filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={displayCols.length + 1}>
                    <div className={styles.emptyState}>
                      <FiInbox className={styles.emptyStateIcon} />
                      <h4>No Items Found</h4>
                      <p>There are currently no items to display here. Click the add button to create one.</p>
                      <button className={styles.emptyStateBtn} onClick={handleAdd}>
                        <FiPlus /> Add First Item
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr key={item.id}>
                    {displayCols.map((col) => (
                      <td key={col.key}>
                        {col.key === 'image' || col.key === 'logo' || col.key === 'coverImage' || col.key === 'bannerImage' ? (
                          item[col.key] ? (
                            <Image
                              src={item[col.key].startsWith('/') || item[col.key].startsWith('http') ? item[col.key] : `/${item[col.key]}`}
                              alt="preview"
                              className={styles.imgPreview}
                              width={40}
                              height={40}
                              style={{ objectFit: 'cover', borderRadius: '4px' }}
                            />
                          ) : '—'
                        ) : typeof item[col.key] === 'boolean' ? (
                          item[col.key] ? 'Yes' : 'No'
                        ) : (
                          String(item[col.key] ?? '').length > 60
                            ? String(item[col.key]).substring(0, 60) + '...'
                            : (item[col.key] ?? '—')
                        )}
                      </td>
                    ))}
                    <td className={styles.actionsCell}>
                      {customAction && customAction(item)}
                      <button className={styles.editBtn} onClick={() => handleEdit(item)} title="Edit">
                        <FiEdit2 size={16} />
                      </button>
                      <button className={styles.deleteBtn} onClick={() => handleDelete(item.id)} title="Delete">
                        <FiTrash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className={styles.toastContainer}>
          <div className={`${styles.toast} ${toast.type === 'error' ? styles.error : ''}`}>
            {toast.type === 'error' ? <FiAlertCircle size={18} /> : <FiCheckCircle size={18} />}
            {toast.message}
          </div>
        </div>
      )}
    </div>
  );
}
