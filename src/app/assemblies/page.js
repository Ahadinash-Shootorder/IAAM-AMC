import Header from '@/components/Common/Header';
import Footer from '@/components/Common/Footer';
import AssembliesHero from '@/components/Assemblies/AssembliesHero/AssembliesHero';
import AssembliesTabs from '@/components/Assemblies/AssembliesTabs/AssembliesTabs';
import AssembliesCards from '@/components/Assemblies/AssembliesCards/AssembliesCards';
import AssembliesCta from '@/components/Assemblies/AssembliesCta/AssembliesCta';
import { readPageSectionData, getPageLayout } from '@/lib/data';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Scientific Assemblies 2026',
  description: 'Join the world\'s leading materials science researchers at the Advanced Materials Congress assemblies.',
};

const sectionComponents = {
  assembliesHero: { Component: AssembliesHero, dataKey: 'assembliesHero' },
  assembliesTabs: { Component: AssembliesTabs, dataKey: 'assembliesTabs' },
  assembliesCards: { Component: AssembliesCards, dataKey: 'assembliesCards' },
  assembliesCta: { Component: AssembliesCta, dataKey: 'assembliesCta' },
};

export default async function AssembliesPage({ searchParams }) {
  const params = await searchParams;
  const isPreview = params?.preview === 'true';

  const sectionsConfig = await getPageLayout('assemblies', isPreview);
  const headerData = await readPageSectionData('global', 'header', isPreview);
  const footerData = await readPageSectionData('global', 'footer', isPreview);

  // Sort body sections by order and filter visible ones
  const bodySections = (sectionsConfig.sections || [])
    .sort((a, b) => a.order - b.order)
    .filter((s) => s.visible && s.id !== 'header' && s.id !== 'footer');

  // Fetch all body sections data in parallel
  const bodySectionsWithData = await Promise.all(
    bodySections.map(async (section) => {
      const config = sectionComponents[section.id];
      if (!config) return null;
      const data = await readPageSectionData('assemblies', config.dataKey, isPreview);

      return {
        ...section,
        Component: config.Component,
        data,
      };
    })
  );

  const activeBodySections = bodySectionsWithData.filter(Boolean);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header data={headerData} />
      <main style={{ flex: 1, backgroundColor: '#fff' }}>
        {activeBodySections.map((section) => {
          const { Component, data } = section;
          return <Component key={section.id} data={data} />;
        })}
      </main>
      <Footer data={footerData} />
    </div>
  );
}
