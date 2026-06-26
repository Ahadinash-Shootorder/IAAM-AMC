import Link from 'next/link';
import Header from '@/components/Common/Header';
import Footer from '@/components/Common/Footer';
import { readPageSectionData } from '@/lib/data';

export default async function NotFound() {
  const headerData = await readPageSectionData('global', 'header');
  const footerData = await readPageSectionData('global', 'footer');

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header data={headerData} />
      <main style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '40px 20px',
        background: '#f9fafb'
      }}>
        <div style={{ maxWidth: '500px' }}>
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
          <Link href="/" style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#F04393',
            color: 'white',
            textDecoration: 'none',
            padding: '12px 28px',
            borderRadius: '8px',
            fontSize: '15px',
            fontWeight: '600',
            boxShadow: '0 4px 14px rgba(240, 67, 147, 0.3)',
          }}>
            Return to Homepage
          </Link>
        </div>
      </main>
      <Footer data={footerData} />
    </div>
  );
}
