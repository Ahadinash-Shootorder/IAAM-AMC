import Header from '@/components/Common/Header';
import Footer from '@/components/Common/Footer';
import EventsList from '@/components/Events/EventsList/EventsList';
import AssembliesTabs from '@/components/Assemblies/AssembliesTabs/AssembliesTabs';
import { readPageSectionData, getPageLayout } from '@/lib/data';
import prisma from '@/lib/prisma';

export const metadata = {
  title: 'Congress Archive',
  description: 'View the archive of past Advanced Materials Congress events.',
};

export const dynamic = 'force-dynamic';

export default async function CongressArchive() {
  const sectionsConfig = await getPageLayout('congress-archive');
  const headerData = await readPageSectionData('global', 'header');
  const footerData = await readPageSectionData('global', 'footer');
  const tabsData = await readPageSectionData('assemblies', 'assembliesTabs');

  // Fetch the events data
  const eventsListSection = (sectionsConfig.sections || []).find((s) => s.id === 'eventsList');
  let eventsListData = eventsListSection ? eventsListSection.content : {};
  const dbEvents = await prisma.event.findMany({ 
    where: { eventType: 'archive' },
    orderBy: { order: 'asc' } 
  });
  eventsListData = { ...eventsListData, events: dbEvents };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header data={headerData} />
      <main style={{ flex: 1, backgroundColor: '#fff' }}>
        <AssembliesTabs data={tabsData} />
        <EventsList data={eventsListData} />
      </main>
      <Footer data={footerData} />
    </div>
  );
}
