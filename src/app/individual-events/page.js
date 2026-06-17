import Header from '@/components/Common/Header';
import Footer from '@/components/Common/Footer';
import EventsList from '@/components/Events/EventsList/EventsList';
import { readPageSectionData, getPageLayout } from '@/lib/data';
import prisma from '@/lib/prisma';

export const metadata = {
  title: 'Individual Events',
  description: 'View individual Advanced Materials Congress events.',
};

export const dynamic = 'force-dynamic';

export default async function IndividualEvents() {
  const sectionsConfig = await getPageLayout('individual-events');
  const headerData = await readPageSectionData('global', 'header');
  const footerData = await readPageSectionData('global', 'footer');

  // Fetch the events data
  let eventsListData = await readPageSectionData('individual-events', 'eventsList');
  const dbEvents = await prisma.event.findMany({ 
    where: { eventType: 'individual' },
    orderBy: { order: 'asc' } 
  });
  eventsListData = { ...eventsListData, events: dbEvents };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header data={headerData} />
      <main style={{ flex: 1, backgroundColor: '#fff' }}>
        <EventsList data={eventsListData} />
      </main>
      <Footer data={footerData} />
    </div>
  );
}
