'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

const SITE_ROUTES = [
  { path: '/', label: 'Home Page' },
  { path: '/about', label: 'About Page' },
  { path: '/upcoming-events', label: 'Upcoming Events' },
  { path: '/individual-events', label: 'Individual Events' },
  { path: '/congress-archive', label: 'Congress Archive' },
  { path: '/congress-proceedings', label: 'Congress Proceedings' },
  { path: '/speakers', label: 'Speakers Page' },
  { path: '/contact', label: 'Contact Page' },
  { path: '#', label: 'Anchor Link (# section)' },
];

/**
 * Smart Link Input with autocomplete suggestions and URL validation.
 * 
 * Props:
 *  - value: string (current URL value)
 *  - onChange: (value: string) => void
 *  - placeholder: string (optional)
 *  - required: boolean (optional)
 */
export default function LinkInput({ value = '', onChange, placeholder = 'Enter URL or select page...', required = false }) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredRoutes, setFilteredRoutes] = useState(SITE_ROUTES);
  const wrapperRef = useRef(null);

  const isValidUrl = useCallback((url) => {
    if (!url) return true; // empty is OK
    return url.startsWith('/') || url.startsWith('http://') || url.startsWith('https://') || url.startsWith('#') || url.startsWith('mailto:') || url.startsWith('tel:');
  }, []);

  const handleInputChange = (e) => {
    const val = e.target.value;
    onChange(val);

    // Filter suggestions based on input
    if (val) {
      const filtered = SITE_ROUTES.filter(
        (r) => r.path.toLowerCase().includes(val.toLowerCase()) || r.label.toLowerCase().includes(val.toLowerCase())
      );
      setFilteredRoutes(filtered);
    } else {
      setFilteredRoutes(SITE_ROUTES);
    }
  };

  const handleSelect = (path) => {
    onChange(path);
    setShowSuggestions(false);
  };

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const valid = isValidUrl(value);

  return (
    <div ref={wrapperRef} style={{ position: 'relative', width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <input
            type="text"
            value={value}
            onChange={handleInputChange}
            onFocus={() => setShowSuggestions(true)}
            placeholder={placeholder}
            required={required}
            style={{
              width: '100%',
              padding: '10px 36px 10px 12px',
              border: `1px solid ${!valid ? '#f97316' : '#d1d5db'}`,
              borderRadius: '8px',
              fontSize: '14px',
              outline: 'none',
              transition: 'border-color 0.2s, box-shadow 0.2s',
              background: !valid ? '#fffbeb' : '#fff',
            }}
            onMouseOver={(e) => { if (valid) e.target.style.borderColor = '#240E8B'; }}
            onMouseOut={(e) => { if (valid) e.target.style.borderColor = '#d1d5db'; }}
          />
          {/* Validation badge */}
          {value && (
            <span style={{
              position: 'absolute',
              right: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: '14px',
              lineHeight: 1,
            }}>
              {valid ? '✓' : '⚠'}
            </span>
          )}
        </div>
      </div>

      {/* Validation warning */}
      {value && !valid && (
        <div style={{
          fontSize: '12px',
          color: '#ea580c',
          marginTop: '4px',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
        }}>
          ⚠ URL should start with <code style={{ background: '#f1f5f9', padding: '1px 4px', borderRadius: '3px', fontSize: '11px' }}>/</code>,{' '}
          <code style={{ background: '#f1f5f9', padding: '1px 4px', borderRadius: '3px', fontSize: '11px' }}>http://</code>, or{' '}
          <code style={{ background: '#f1f5f9', padding: '1px 4px', borderRadius: '3px', fontSize: '11px' }}>#</code>
        </div>
      )}

      {/* Suggestions dropdown */}
      {showSuggestions && filteredRoutes.length > 0 && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          background: '#fff',
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
          zIndex: 100,
          maxHeight: '240px',
          overflowY: 'auto',
          marginTop: '4px',
        }}>
          <div style={{ padding: '8px 12px', fontSize: '11px', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid #f1f5f9' }}>
            Site Pages
          </div>
          {filteredRoutes.map((route) => (
            <button
              key={route.path}
              type="button"
              onClick={() => handleSelect(route.path)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                padding: '10px 12px',
                border: 'none',
                background: value === route.path ? '#f0f0ff' : 'transparent',
                cursor: 'pointer',
                fontSize: '13px',
                textAlign: 'left',
                transition: 'background 0.15s',
              }}
              onMouseOver={(e) => e.target.style.background = '#f8fafc'}
              onMouseOut={(e) => e.target.style.background = value === route.path ? '#f0f0ff' : 'transparent'}
            >
              <span style={{ color: '#1e293b', fontWeight: '500' }}>{route.label}</span>
              <span style={{ color: '#94a3b8', fontSize: '12px', fontFamily: 'monospace' }}>{route.path}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
