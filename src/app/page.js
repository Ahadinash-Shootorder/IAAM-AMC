import Header from '@/components/Common/Header';
import HeroSection from '@/components/Home/HeroSection/HeroSection';
import StatsSection from '@/components/Home/StatsSection/StatsSection';
import SpeakersSection from '@/components/SpeakersSection/SpeakersSection';
import ExploreSection from '@/components/Home/ExploreSection/ExploreSection';
import SponsorsSection from '@/components/SponsorsSection/SponsorsSection';
import BecomeMember from '@/components/Home/BecomeMember/BecomeMember';
import BecomeSponsor from '@/components/Home/BecomeSponsor/BecomeSponsor';
import Footer from '@/components/Common/Footer';
import { readPageSectionData, getPageLayout } from '@/lib/data';
import prisma from '@/lib/prisma';
import styles from './page.module.css';

export const dynamic = 'force-dynamic';

// Map section IDs to their components and data loaders
const sectionComponents = {
  hero: { Component: HeroSection, dataKey: 'hero' },
  stats: { Component: StatsSection, dataKey: 'stats' },
  speakers: { Component: SpeakersSection, dataKey: 'speakers' },
  becomeMember: { Component: BecomeMember, dataKey: 'becomeMember', wrapperClass: 'ctaWrapperLight' },
  explore: { Component: ExploreSection, dataKey: 'explore' },
  sponsors: { Component: SponsorsSection, dataKey: 'sponsors' },
  becomeSponsor: { Component: BecomeSponsor, dataKey: 'becomeSponsor', wrapperClass: 'ctaWrapperGray' },
};

export default async function Home() {
  const sectionsConfig = await getPageLayout('home');
  const headerData = await readPageSectionData('global', 'header');
  const footerData = await readPageSectionData('global', 'footer');

  // Sort body sections by order and filter visible ones
  const bodySections = (sectionsConfig.sections || [])
    .sort((a, b) => a.order - b.order)
    .filter((s) => s.visible && s.id !== 'header' && s.id !== 'footer');

  // Always show global header/footer for now
  const showHeader = true;
  const showFooter = true;

  // Fetch global models from DB
  const dbSpeakers = await prisma.speaker.findMany({ orderBy: { order: 'asc' } });
  const dbSponsorsRow = await prisma.sponsor.findMany({ orderBy: { order: 'asc' } });
  const dbSponsors = dbSponsorsRow.map(s => ({ ...s, image: s.logo, alt: s.name }));

  // Fetch all body sections data in parallel
  const bodySectionsWithData = await Promise.all(
    bodySections.map(async (section) => {
      const config = sectionComponents[section.id];
      if (!config) return null;
      let data = await readPageSectionData('home', config.dataKey);

      // Inject relational data from DB
      if (section.id === 'speakers') {
        data = { ...data, speakers: dbSpeakers };
      }
      if (section.id === 'sponsors') {
        data = { ...data, logos: dbSponsors };
      }

      return {
        ...section,
        Component: config.Component,
        wrapperClass: config.wrapperClass,
        data,
      };
    })
  );

  // Filter out any null configurations
  const activeBodySections = bodySectionsWithData.filter(Boolean);

  return (
    <div className={styles.wrapper}>
      {showHeader && <Header data={headerData} />}
      <main className={styles.main}>
        {activeBodySections.map((section) => {
          const { Component, wrapperClass, data } = section;

          if (wrapperClass) {
            return (
              <div key={section.id} className={`${styles.ctaWrapper} ${styles[wrapperClass]}`}>
                <Component data={data} />
              </div>
            );
          }

          return <Component key={section.id} data={data} />;
        })}
      </main>
      {showFooter && <Footer data={footerData} />}
    </div>
  );
}
