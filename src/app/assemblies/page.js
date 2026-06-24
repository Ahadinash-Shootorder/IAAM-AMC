import Header from '@/components/Common/Header';
import Footer from '@/components/Common/Footer';
import { readPageSectionData } from '@/lib/data';
import AssembliesContent from './AssembliesContent';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Scientific Assemblies 2026',
  description: 'Join the world\'s leading materials science researchers at the Advanced Materials Congress assemblies.',
};

export default async function AssembliesPage() {
  const headerData = await readPageSectionData('global', 'header');
  const footerData = await readPageSectionData('global', 'footer');

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header data={headerData} />
      <main style={{ flex: 1 }}>
        <AssembliesContent />
      </main>
      <Footer data={footerData} />
    </div>
  );
}
