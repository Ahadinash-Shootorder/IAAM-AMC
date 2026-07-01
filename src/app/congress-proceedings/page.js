import Header from '@/components/Common/Header';
import Footer from '@/components/Common/Footer';
import ProceedingsList from '@/components/Proceedings/ProceedingsList/ProceedingsList';
import { readPageSectionData } from '@/lib/data';
import prisma from '@/lib/prisma';

export const metadata = {
  title: 'Congress Proceedings',
  description: 'View the proceedings of past Advanced Materials Congress events.',
};

export const dynamic = 'force-dynamic';

export default async function CongressProceedings() {
  const headerData = await readPageSectionData('global', 'header');
  const footerData = await readPageSectionData('global', 'footer');
  let headerSectionData = await readPageSectionData('congress-proceedings', 'proceedingsHeader');
  let proceedingsData = { title: headerSectionData?.title || 'Congress Proceedings' };
  
  let dbProceedings = [];
  try {
    const fs = await import('fs/promises');
    const path = await import('path');
    const proceedingsJsonPath = path.default.join(process.cwd(), 'data', 'pages', 'congress-proceedings', 'proceedings.json');
    const raw = await fs.default.readFile(proceedingsJsonPath, 'utf-8');
    const parsed = JSON.parse(raw);
    dbProceedings = Object.values(parsed)
      .map(p => p.meta)
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  } catch (err) {
    console.error('Failed to load proceedings.json:', err);
  }

  proceedingsData = { ...proceedingsData, proceedings: dbProceedings };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header data={headerData} />
      <main style={{ flex: 1, backgroundColor: '#fff' }}>
        <ProceedingsList data={proceedingsData} />
      </main>
      <Footer data={footerData} />
    </div>
  );
}
