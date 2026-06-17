/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './page.module.css';
import { FiUploadCloud } from 'react-icons/fi';

export default function MediaLibraryPage() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

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
    fetchMedia();
  }, []);

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
      } else {
        alert('Upload failed');
      }
    } catch (err) {
      alert('Upload failed');
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
      } else {
        alert('Delete failed');
      }
    } catch (err) {
      alert('Delete failed');
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Media Library</h1>
        <label className={styles.uploadBtn}>
          {uploading ? 'Uploading...' : <><FiUploadCloud /> Upload New Media</>}
          <input type="file" accept="image/*" hidden onChange={handleFileUpload} disabled={uploading} />
        </label>
      </div>

      {loading ? (
        <p>Loading media...</p>
      ) : assets.length === 0 ? (
        <div className={styles.emptyState}>No media assets found.</div>
      ) : (
        <div className={styles.grid}>
          {assets.map((asset) => (
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
                  <button
                    className={styles.copyBtn}
                    onClick={() => {
                      navigator.clipboard.writeText(asset.url);
                      alert('URL copied to clipboard!');
                    }}
                  >
                    Copy URL
                  </button>
                  <button className={styles.deleteBtn} onClick={() => handleDelete(asset.url)}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
