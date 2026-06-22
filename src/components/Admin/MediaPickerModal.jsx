'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function MediaPickerModal({ isOpen, onClose, onSelect }) {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Reset the search filter whenever the modal transitions to open. The
  // React `react-hooks/set-state-in-effect` rule discourages this, but the
  // alternatives (lifting state to the parent, key-based remount, or
  // previous-value tracking via ref) are disproportionate for clearing a
  // UI filter on modal open. The setState is a discrete one-shot reset,
  // not a synchronization loop, so cascading renders are not a concern.
  useEffect(() => {
    if (!isOpen) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSearchTerm('');
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    let active = true;
    async function fetchMedia() {
      try {
        const res = await fetch('/api/admin/media');
        const data = await res.json();
        if (active) {
          setAssets(data.assets || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    fetchMedia();

    return () => {
      active = false;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredAssets = assets.filter(asset =>
    (asset.filename || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (asset.url || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <div style={{ padding: '12px 20px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
          <input
            type="text"
            placeholder="Search by filename..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              fontSize: '14px',
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
        </div>
        <div style={{ padding: '20px', overflowY: 'auto', flex: 1 }}>
          {loading ? (
            <p>Loading...</p>
          ) : filteredAssets.length === 0 ? (
            <p>No matching media found.</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '16px' }}>
              {filteredAssets.map(asset => (
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
