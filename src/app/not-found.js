import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      textAlign: 'center',
      fontFamily: 'var(--font-inter), sans-serif',
      padding: '20px',
      background: '#f9fafb'
    }}>
      <style>{`
        .not-found-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: #F04393;
          color: white;
          text-decoration: none;
          padding: 12px 28px;
          border-radius: 8px;
          font-size: 15px;
          font-weight: 600;
          transition: background 0.2s;
          box-shadow: 0 4px 14px rgba(240, 67, 147, 0.3);
        }
        .not-found-btn:hover {
          background: #d93b84;
        }
      `}</style>
      <div style={{
        maxWidth: '500px'
      }}>
        <h1 style={{ 
          fontSize: '120px', 
          fontWeight: '800', 
          color: '#240E8B', 
          margin: '0',
          lineHeight: '1',
          letterSpacing: '-2px'
        }}>
          404
        </h1>
        <h2 style={{ 
          color: '#111827', 
          fontSize: '24px', 
          fontWeight: '700', 
          margin: '16px 0',
          letterSpacing: '-0.5px'
        }}>
          Page Not Found
        </h2>
        <p style={{ 
          color: '#6b7280', 
          fontSize: '16px', 
          marginBottom: '32px', 
          lineHeight: '1.6' 
        }}>
          The page you are looking for does not exist or has been moved. 
          Please check the URL or navigate back to the homepage.
        </p>
        <Link href="/" className="not-found-btn">
          Return to Homepage
        </Link>
      </div>
    </div>
  );
}
