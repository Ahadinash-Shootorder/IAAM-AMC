import Header from '@/components/Common/Header';
import Footer from '@/components/Common/Footer';
import EventsList from '@/components/Events/EventsList/EventsList';
import { readPageSectionData, getPageLayout } from '@/lib/data';
import prisma from '@/lib/prisma';

export const metadata = {
  title: 'Upcoming Events',
  description: 'View the latest upcoming Advanced Materials Congress events.',
};

export const dynamic = 'force-dynamic';

export default async function UpcomingEvents() {
  const sectionsConfig = await getPageLayout('upcoming-events');
  const headerData = await readPageSectionData('global', 'header');
  const footerData = await readPageSectionData('global', 'footer');

  // Fetch the events data
  let eventsListData = await readPageSectionData('upcoming-events', 'eventsList');
  const dbEvents = await prisma.event.findMany({ 
    where: { eventType: 'upcoming' },
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
