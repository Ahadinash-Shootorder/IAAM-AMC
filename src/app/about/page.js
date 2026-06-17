import Header from '@/components/Common/Header';
import Footer from '@/components/Common/Footer';
import AboutHero from '@/components/About/AboutHero/AboutHero';
import OurStory from '@/components/About/OurStory/OurStory';
import GlobalEvents from '@/components/About/GlobalEvents/GlobalEvents';
import SpeakersSection from '@/components/SpeakersSection/SpeakersSection';
import SponsorsSection from '@/components/SponsorsSection/SponsorsSection';
import { readPageSectionData, getPageLayout } from '@/lib/data';
import prisma from '@/lib/prisma';

export const metadata = {
  title: 'About Us',
  description: 'Learn more about the Advanced Materials Congress and our mission.',
};

export const dynamic = 'force-dynamic';

const sectionComponents = {
  aboutHero: { Component: AboutHero, dataKey: 'aboutHero' },
  ourStory: { Component: OurStory, dataKey: 'ourStory' },
  globalEvents: { Component: GlobalEvents, dataKey: 'globalEvents' },
  speakers: { Component: SpeakersSection, dataKey: 'speakers' },
  sponsors: { Component: SponsorsSection, dataKey: 'sponsors' },
};

export default async function About() {
  const sectionsConfig = await getPageLayout('about');
  const headerData = await readPageSectionData('global', 'header');
  const footerData = await readPageSectionData('global', 'footer');

  // Sort body sections by order and filter visible ones
  const bodySections = (sectionsConfig.sections || [])
    .sort((a, b) => a.order - b.order)
    .filter((s) => s.visible && s.id !== 'header' && s.id !== 'footer');

  // Fetch the global speakers list and home sponsors list from DB
  const dbSpeakers = await prisma.speaker.findMany({ orderBy: { order: 'asc' } });
  const dbSponsorsRow = await prisma.sponsor.findMany({ orderBy: { order: 'asc' } });
  const dbSponsors = dbSponsorsRow.map(s => ({ ...s, image: s.logo, alt: s.name }));

  // Fetch all body sections data in parallel
  const bodySectionsWithData = await Promise.all(
    bodySections.map(async (section) => {
      const config = sectionComponents[section.id];
      if (!config) return null;
      let data = await readPageSectionData('about', config.dataKey);

      // Inject relational data from DB
      if (section.id === 'speakers') {
        data = { ...data, speakers: dbSpeakers };
      }

      // Inject relational data from DB
      if (section.id === 'sponsors') {
        data = { ...data, logos: dbSponsors };
      }

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
