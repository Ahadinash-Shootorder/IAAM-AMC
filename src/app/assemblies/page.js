import Header from '@/components/Common/Header';
import Footer from '@/components/Common/Footer';
import AssembliesContent from './AssembliesContent';
import { readPageSectionData, getPageLayout, getEventsWithDetails } from '@/lib/data';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Scientific Assemblies 2026',
  description: 'Join the world\'s leading materials science researchers at the Advanced Materials Congress assemblies.',
};

export default async function AssembliesPage({ searchParams }) {
  const params = await searchParams;
  const isPreview = params?.preview === 'true';

  const headerData = await readPageSectionData('global', 'header', isPreview);
  const footerData = await readPageSectionData('global', 'footer', isPreview);

  // Fetch all assemblies sections
  const heroData = await readPageSectionData('assemblies', 'assembliesHero', isPreview);
  const tabsData = await readPageSectionData('assemblies', 'assembliesTabs', isPreview);
  const cardsData = await readPageSectionData('assemblies', 'assembliesCards', isPreview);
  const ctaData = await readPageSectionData('assemblies', 'assembliesCta', isPreview);

  // Fetch the events lists for tabs
  const upcomingEvents = await getEventsWithDetails('upcoming');
  const individualEvents = await getEventsWithDetails('individual');
  const archiveEvents = await getEventsWithDetails('archive');

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header data={headerData} />
      <main style={{ flex: 1, backgroundColor: '#fff' }}>
        <AssembliesContent
          heroData={heroData}
          tabsData={tabsData}
          cardsData={cardsData}
          ctaData={ctaData}
          upcomingEvents={upcomingEvents}
          individualEvents={individualEvents}
          archiveEvents={archiveEvents}
        />
      </main>
      <Footer data={footerData} />
    </div>
  );
}
