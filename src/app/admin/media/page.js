'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import styles from './page.module.css';
import { FiUploadCloud, FiSearch, FiCopy, FiTrash2, FiChevronLeft, FiChevronRight, FiCheckCircle } from 'react-icons/fi';

const ITEMS_PER_PAGE = 12;

const CATEGORY_TABS = [
  { key: 'all', label: 'All' },
  { key: 'home', label: 'Home', match: '/uploads/home/' },
  { key: 'about', label: 'About', match: '/uploads/about/' },
  { key: 'events', label: 'Events', match: ['/uploads/upcoming-events/', '/uploads/individual-events/', '/uploads/congress-archive/'] },
  { key: 'proceedings', label: 'Proceedings', match: '/uploads/congress-proceedings/' },
  { key: 'global', label: 'Global', match: ['/uploads/global/', '/uploads/header/'] },
  { key: 'other', label: 'Other', match: '/uploads/crud/' },
];

export default function MediaLibraryPage() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [toast, setToast] = useState(null);

  async function fetchMedia() {
    try {
      const res = await fetch('/api/admin/media');
      const data = await res.json();
      setAssets(data.assets || []);
    } catch (err) {
      console.error('Failed to fetch media:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchMedia();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 2500);
  };

  // Filtered + paginated assets
  const filteredAssets = useMemo(() => {
    return assets.filter((asset) => {
      // Search filter
      const matchesSearch = !searchTerm ||
        asset.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.url.toLowerCase().includes(searchTerm.toLowerCase());

      // Category tab filter
      const tab = CATEGORY_TABS.find((t) => t.key === activeTab);
      let matchesTab = activeTab === 'all';
      if (!matchesTab && tab?.match) {
        if (Array.isArray(tab.match)) {
          matchesTab = tab.match.some((m) => asset.url.includes(m));
        } else {
          matchesTab = asset.url.includes(tab.match);
        }
      }

      return matchesSearch && matchesTab;
    });
  }, [assets, searchTerm, activeTab]);

  const totalPages = Math.max(1, Math.ceil(filteredAssets.length / ITEMS_PER_PAGE));
  const paginatedAssets = filteredAssets.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  async function handleFileUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('pageId', 'global');
    formData.append('section', 'media-library');

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        fetchMedia();
        showToast('File uploaded successfully!');
      } else {
        showToast('Upload failed');
      }
    } catch (err) {
      showToast('Upload failed');
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(url) {
    if (!confirm('Are you sure you want to delete this image? It may be in use.')) return;

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filePath: url }),
      });
      if (res.ok) {
        setAssets(assets.filter(a => a.url !== url));
        showToast('File deleted successfully');
      } else {
        showToast('Delete failed');
      }
    } catch (err) {
      showToast('Delete failed');
    }
  }

  function handleCopyUrl(url) {
    navigator.clipboard.writeText(url);
    showToast('URL copied to clipboard!');
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Media Library</h1>
          <p className={styles.subtitle}>{filteredAssets.length} files {searchTerm || activeTab !== 'all' ? '(filtered)' : 'total'}</p>
        </div>
        <label className={styles.uploadBtn}>
          {uploading ? 'Uploading...' : <><FiUploadCloud /> Upload New Media</>}
          <input type="file" accept="image/*" hidden onChange={handleFileUpload} disabled={uploading} />
        </label>
      </div>

      {/* Search Bar */}
      <div className={styles.searchBar}>
        <FiSearch className={styles.searchIcon} />
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Search files by name..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />
        {searchTerm && (
          <button className={styles.clearSearch} onClick={() => {
            setSearchTerm('');
            setCurrentPage(1);
          }}>✕</button>
        )}
      </div>

      {/* Category Tabs */}
      <div className={styles.tabs}>
        {CATEGORY_TABS.map((tab) => (
          <button
            key={tab.key}
            className={`${styles.tab} ${activeTab === tab.key ? styles.tabActive : ''}`}
            onClick={() => {
              setActiveTab(tab.key);
              setCurrentPage(1);
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div className={styles.loadingGrid}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className={styles.skeletonCard}>
              <div className={styles.skeletonImage} />
              <div className={styles.skeletonText} />
            </div>
          ))}
        </div>
      ) : paginatedAssets.length === 0 ? (
        <div className={styles.emptyState}>
          {searchTerm || activeTab !== 'all'
            ? 'No files match your search or filter.'
            : 'No media assets found. Upload something to get started!'}
        </div>
      ) : (
        <div className={styles.grid}>
          {paginatedAssets.map((asset) => (
            <div key={asset.id} className={styles.card}>
              <div className={styles.imageWrapper}>
                <Image
                  src={asset.url}
                  alt={asset.filename}
                  fill
                  style={{ objectFit: 'contain' }}
                  unoptimized
                />
              </div>
              <div className={styles.cardInfo}>
                <p className={styles.filename} title={asset.filename}>{asset.filename}</p>
                <div className={styles.actions}>
                  <button className={styles.copyBtn} onClick={() => handleCopyUrl(asset.url)} title="Copy URL">
                    <FiCopy size={13} /> Copy
                  </button>
                  <button className={styles.deleteBtn} onClick={() => handleDelete(asset.url)} title="Delete">
                    <FiTrash2 size={13} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && filteredAssets.length > ITEMS_PER_PAGE && (
        <div className={styles.pagination}>
          <button
            className={styles.pageBtn}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            <FiChevronLeft /> Prev
          </button>
          <div className={styles.pageInfo}>
            Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
          </div>
          <button
            className={styles.pageBtn}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Next <FiChevronRight />
          </button>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className={styles.toast}>
          <FiCheckCircle size={16} />
          {toast}
        </div>
      )}
    </div>
  );
}
