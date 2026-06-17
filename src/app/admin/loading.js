export default function AdminLoading() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      color: '#6b7280',
      fontFamily: 'var(--font-inter), sans-serif'
    }}>
      <style>{`
        .admin-spinner {
          width: 40px;
          height: 40px;
          border: 4px solid rgba(36, 14, 139, 0.1);
          border-top-color: #240E8B;
          border-radius: 50%;
          animation: admin-spin 0.8s linear infinite;
          margin-bottom: 16px;
        }
        @keyframes admin-spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
      <div className="admin-spinner"></div>
      <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: '0 0 8px 0' }}>
        Loading Dashboard...
      </h3>
      <p style={{ fontSize: '14px', margin: 0 }}>
        Fetching your latest data safely.
      </p>
    </div>
  );
}
