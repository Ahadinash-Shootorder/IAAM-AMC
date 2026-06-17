'use client';

import { useEffect } from 'react';

export default function AdminError({ error, reset }) {
  useEffect(() => {
    console.error('Admin Panel Error:', error);
  }, [error]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      textAlign: 'center',
      fontFamily: 'var(--font-inter), sans-serif',
      padding: '20px'
    }}>
      <div style={{
        background: '#fef2f2',
        border: '1px solid #fecaca',
        borderRadius: '16px',
        padding: '32px 40px',
        maxWidth: '500px'
      }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
        <h2 style={{ color: '#991b1b', fontSize: '20px', fontWeight: '700', margin: '0 0 12px 0' }}>
          Something went wrong!
        </h2>
        <p style={{ color: '#7f1d1d', fontSize: '15px', marginBottom: '24px', lineHeight: '1.5' }}>
          We encountered an unexpected error while loading this dashboard page. Your data is safe.
        </p>
        <button
          onClick={() => reset()}
          style={{
            background: '#dc2626',
            color: 'white',
            border: 'none',
            padding: '10px 24px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'background 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.background = '#b91c1c'}
          onMouseOut={(e) => e.currentTarget.style.background = '#dc2626'}
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
