import Header from '@/components/Common/Header';
import Footer from '@/components/Common/Footer';
import EventsList from '@/components/Events/EventsList/EventsList';
import { readPageSectionData, getPageLayout, getEventsWithDetails } from '@/lib/data';
import prisma from '@/lib/prisma';

export const metadata = {
  title: 'Upcoming Events',
  description: 'View the latest upcoming Advanced Materials Congress events.',
};

export const dynamic = 'force-dynamic';

export default async function UpcomingEvents({ searchParams }) {
  const params = await searchParams;
  const isPreview = params?.preview === 'true';

  const sectionsConfig = await getPageLayout('upcoming-events', isPreview);
  const headerData = await readPageSectionData('global', 'header', isPreview);
  const footerData = await readPageSectionData('global', 'footer', isPreview);

  // Fetch the events data
  const eventsListSection = (sectionsConfig.sections || []).find((s) => s.id === 'eventsList');
  let eventsListData = eventsListSection ? eventsListSection.content : {};
  const dbEvents = await getEventsWithDetails('upcoming');
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
