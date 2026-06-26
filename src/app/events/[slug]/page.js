import { readPageSectionData, getPageLayout } from '@/lib/data';
import Header from '@/components/Common/Header';
import Footer from '@/components/Common/Footer';
import EventHero from '@/components/EventDetails/EventHero/EventHero';
import EventIntro from '@/components/EventDetails/EventIntro/EventIntro';
import EventSymposia from '@/components/EventDetails/EventSymposia/EventSymposia';
import EventDeadlines from '@/components/EventDetails/EventDeadlines/EventDeadlines';
import EventHighlights from '@/components/EventDetails/EventHighlights/EventHighlights';
import EventSDGs from '@/components/EventDetails/EventSDGs/EventSDGs';
import EventPublications from '@/components/EventDetails/EventPublications/EventPublications';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import styles from '../../page.module.css';

export const dynamic = 'force-dynamic';

const sectionComponents = {
  eventHero: EventHero,
  eventIntro: EventIntro,
  eventSymposia: EventSymposia,
  eventDeadlines: EventDeadlines,
  eventHighlights: EventHighlights,
  eventSDGs: EventSDGs,
  eventPublications: EventPublications,
};

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const event = await prisma.event.findUnique({
    where: { slug }
  });

  if (!event) {
    return { title: 'Event Not Found' };
  }

  return {
    title: `${event.title} | AMC`,
    description: event.description || `Join us at ${event.title} in ${event.location || 'Stockholm, Sweden'}.`,
  };
}

export default async function EventDetailPage({ params }) {
  const { slug } = await params;

  const eventRow = await prisma.event.findUnique({
    where: { slug }
  });

  if (!eventRow) {
    notFound();
  }

  const [headerData, footerData, sectionsConfig] = await Promise.all([
    readPageSectionData('global', 'header'),
    readPageSectionData('global', 'footer'),
    getPageLayout(`event-${eventRow.id}`)
  ]);

  // Sort and filter visible sections
  const bodySections = (sectionsConfig.sections || [])
    .sort((a, b) => a.order - b.order)
    .filter((s) => s.visible && s.id !== 'header' && s.id !== 'footer');

  const activeBodySections = bodySections
    .map((section) => {
      const Component = sectionComponents[section.id];
      if (!Component) return null;
      return {
        ...section,
        Component,
        data: section.content
      };
    })
    .filter(Boolean);

  return (
    <div className={styles.wrapper}>
      <Header data={headerData} />
      <main className={styles.main}>
        {activeBodySections.map((section) => {
          const { Component, data } = section;
          return <Component key={section.id} data={data} />;
        })}
      </main>
      <Footer data={footerData} />
    </div>
  );
}
