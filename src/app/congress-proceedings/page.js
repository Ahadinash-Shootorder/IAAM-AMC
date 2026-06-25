import Header from '@/components/Common/Header';
import Footer from '@/components/Common/Footer';
import ProceedingsList from '@/components/Proceedings/ProceedingsList/ProceedingsList';
import AssembliesTabs from '@/components/Assemblies/AssembliesTabs/AssembliesTabs';
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
  const tabsData = await readPageSectionData('assemblies', 'assembliesTabs');
  let proceedingsData = await readPageSectionData('congress-proceedings', 'proceedingsList');
  const dbProceedings = await prisma.proceeding.findMany({ orderBy: { order: 'asc' } });
  proceedingsData = { ...proceedingsData, proceedings: dbProceedings };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header data={headerData} />
      <main style={{ flex: 1, backgroundColor: '#fff' }}>
        <AssembliesTabs data={tabsData} />
        <ProceedingsList data={proceedingsData} />
      </main>
      <Footer data={footerData} />
    </div>
  );
}
