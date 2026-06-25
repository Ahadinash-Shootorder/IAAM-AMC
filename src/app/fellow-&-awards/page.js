import React from 'react';
import Header from '@/components/Common/Header';
import Footer from '@/components/Common/Footer';
import AwardsHero from '@/components/FellowAwards/AwardsHero/AwardsHero';
import AwardsIntro from '@/components/FellowAwards/AwardsIntro/AwardsIntro';
import AwardsCategories from '@/components/FellowAwards/AwardsCategories/AwardsCategories';
import AwardsNomination from '@/components/FellowAwards/AwardsNomination/AwardsNomination';
import AwardsPublications from '@/components/FellowAwards/AwardsPublications/AwardsPublications';
import AwardsLaureates from '@/components/FellowAwards/AwardsLaureates/AwardsLaureates';
import { readPageSectionData, getPageLayout } from '@/lib/data';

export const metadata = {
  title: 'Fellows & Awards',
  description: 'Honoring excellence in materials science research and technology.',
};

export const dynamic = 'force-dynamic';

const sectionComponents = {
  awardsHero: { Component: AwardsHero, dataKey: 'awardsHero' },
  awardsIntro: { Component: AwardsIntro, dataKey: 'awardsIntro' },
  awardsCategories: { Component: AwardsCategories, dataKey: 'awardsCategories' },
  awardsPublications: { Component: AwardsPublications, dataKey: 'awardsPublications' },
  awardsNomination: { Component: AwardsNomination, dataKey: 'awardsNomination' },
  awardsLaureates: { Component: AwardsLaureates, dataKey: 'awardsLaureates' },
};

export default async function FellowAwardsPage({ searchParams }) {
  const params = await searchParams;
  const isPreview = params?.preview === 'true';

  const sectionsConfig = await getPageLayout('fellow-awards', isPreview);
  const headerData = await readPageSectionData('global', 'header', isPreview);
  const footerData = await readPageSectionData('global', 'footer', isPreview);

  // Sort and map visible body sections to components
  const activeBodySections = (sectionsConfig.sections || [])
    .filter((s) => s.visible && s.id !== 'header' && s.id !== 'footer')
    .sort((a, b) => a.order - b.order)
    .map((section) => {
      const config = sectionComponents[section.id];
      if (!config) return null;
      return {
        ...section,
        Component: config.Component,
        data: section.content,
      };
    })
    .filter(Boolean);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header data={headerData} />
      <main style={{ flex: 1, backgroundColor: '#FDF7FF' }}>
        {activeBodySections.map((section) => {
          const { Component, data } = section;
          return <Component key={section.id} data={data} />;
        })}
      </main>
      <Footer data={footerData} />
    </div>
  );
}
