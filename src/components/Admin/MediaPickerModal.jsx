'use client';
import { useState, useEffect } from 'react';
/* eslint-disable react-hooks/exhaustive-deps */
import Image from 'next/image';

export default function MediaPickerModal({ isOpen, onClose, onSelect }) {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchMedia() {
    try {
      const res = await fetch('/api/admin/media');
      const data = await res.json();
      setAssets(data.assets || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (isOpen) {
      fetchMedia();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.5)', zIndex: 9999,
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div style={{
        background: 'white', width: '80%', maxWidth: '900px', height: '80vh',
        borderRadius: '12px', display: 'flex', flexDirection: 'column', overflow: 'hidden'
      }}>
        <div style={{ padding: '20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between' }}>
          <h2 style={{ margin: 0, fontSize: '20px' }}>Select from Media Library</h2>
          <button onClick={onClose} style={{ cursor: 'pointer', background: 'transparent', border: 'none', fontSize: '24px' }}>&times;</button>
        </div>
        <div style={{ padding: '20px', overflowY: 'auto', flex: 1 }}>
          {loading ? (
            <p>Loading...</p>
          ) : assets.length === 0 ? (
            <p>No media found. Upload something first in the Media Library.</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '16px' }}>
              {assets.map(asset => (
                <div 
                  key={asset.id} 
                  style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden', cursor: 'pointer' }}
                  onClick={() => onSelect(asset.url)}
                >
                  <div style={{ width: '100%', height: '120px', position: 'relative', background: '#f8fafc' }}>
                    <Image src={asset.url} alt={asset.filename} fill style={{ objectFit: 'contain' }} unoptimized />
                  </div>
                  <div style={{ padding: '8px', fontSize: '12px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {asset.filename}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
