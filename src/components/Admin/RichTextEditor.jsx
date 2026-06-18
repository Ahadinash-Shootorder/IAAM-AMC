'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import styles from './RichTextEditor.module.css';

/**
 * Lightweight, dependency-free Rich Text Editor using contentEditable.
 * Outputs HTML string compatible with existing data storage.
 * 
 * Props:
 *  - value: string (HTML content)
 *  - onChange: (html: string) => void
 *  - placeholder: string (optional)
 */
export default function RichTextEditor({ value = '', onChange, placeholder = 'Start typing...' }) {
  const editorRef = useRef(null);
  const [showSource, setShowSource] = useState(false);
  const [activeFormats, setActiveFormats] = useState({});
  const isInitialized = useRef(false);

  // Initialize editor content only once
  useEffect(() => {
    if (editorRef.current && !isInitialized.current) {
      editorRef.current.innerHTML = value || '';
      isInitialized.current = true;
    }
  }, [value]);

  // Sync external value changes (e.g., from history restore)
  useEffect(() => {
    if (editorRef.current && isInitialized.current) {
      const currentHTML = editorRef.current.innerHTML;
      if (value !== currentHTML) {
        editorRef.current.innerHTML = value || '';
      }
    }
  }, [value]);

  const emitChange = useCallback(() => {
    if (editorRef.current && onChange) {
      const html = editorRef.current.innerHTML;
      // Normalize empty state
      const cleaned = html === '<br>' || html === '<div><br></div>' ? '' : html;
      onChange(cleaned);
    }
  }, [onChange]);

  const updateActiveFormats = useCallback(() => {
    setActiveFormats({
      bold: document.queryCommandState('bold'),
      italic: document.queryCommandState('italic'),
      underline: document.queryCommandState('underline'),
      insertUnorderedList: document.queryCommandState('insertUnorderedList'),
      insertOrderedList: document.queryCommandState('insertOrderedList'),
    });
  }, []);

  const execCommand = useCallback((command, val = null) => {
    document.execCommand(command, false, val);
    editorRef.current?.focus();
    updateActiveFormats();
    emitChange();
  }, [updateActiveFormats, emitChange]);

  const handleKeyUp = useCallback(() => {
    updateActiveFormats();
  }, [updateActiveFormats]);

  const handleMouseUp = useCallback(() => {
    updateActiveFormats();
  }, [updateActiveFormats]);

  const handleSourceChange = useCallback((e) => {
    const html = e.target.value;
    if (onChange) onChange(html);
    if (editorRef.current) {
      editorRef.current.innerHTML = html;
    }
  }, [onChange]);

  const toolbarButtons = [
    { command: 'bold', icon: 'B', title: 'Bold (Ctrl+B)', style: { fontWeight: '800' } },
    { command: 'italic', icon: 'I', title: 'Italic (Ctrl+I)', style: { fontStyle: 'italic' } },
    { command: 'underline', icon: 'U', title: 'Underline (Ctrl+U)', style: { textDecoration: 'underline' } },
    { type: 'divider' },
    { command: 'insertUnorderedList', icon: '• —', title: 'Bullet List' },
    { command: 'insertOrderedList', icon: '1. —', title: 'Numbered List' },
    { type: 'divider' },
    { command: 'removeFormat', icon: '⊘', title: 'Clear Formatting' },
  ];

  if (showSource) {
    return (
      <div className={styles.editorWrapper}>
        <div className={styles.toolbar}>
          <button
            type="button"
            className={`${styles.toolbarBtn} ${styles.active}`}
            onClick={() => setShowSource(false)}
            title="Switch to Visual Editor"
          >
            ◀
          </button>
          <span style={{ fontSize: '12px', color: '#64748b', marginLeft: '8px' }}>HTML Source</span>
        </div>
        <textarea
          className={styles.sourceView}
          value={value || ''}
          onChange={handleSourceChange}
        />
      </div>
    );
  }

  return (
    <div className={styles.editorWrapper}>
      <div className={styles.toolbar}>
        {toolbarButtons.map((btn, i) => {
          if (btn.type === 'divider') {
            return <div key={i} className={styles.toolbarDivider} />;
          }
          return (
            <button
              key={btn.command}
              type="button"
              className={`${styles.toolbarBtn} ${activeFormats[btn.command] ? styles.active : ''}`}
              onClick={() => execCommand(btn.command)}
              title={btn.title}
              style={btn.style}
            >
              {btn.icon}
            </button>
          );
        })}
        <div className={styles.toolbarDivider} />
        <button
          type="button"
          className={styles.toolbarBtn}
          onClick={() => setShowSource(true)}
          title="View HTML Source"
          style={{ fontSize: '11px' }}
        >
          {'</>'}
        </button>
      </div>
      <div
        ref={editorRef}
        className={styles.editorContent}
        contentEditable
        suppressContentEditableWarning
        data-placeholder={placeholder}
        onInput={emitChange}
        onKeyUp={handleKeyUp}
        onMouseUp={handleMouseUp}
      />
    </div>
  );
}
