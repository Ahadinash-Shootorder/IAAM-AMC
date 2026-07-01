import { readPageSectionData } from '@/lib/data';
import Header from '@/components/Common/Header';
import Footer from '@/components/Common/Footer';
import ProceedingHero from '@/components/ProceedingDetail/ProceedingHero/ProceedingHero';
import ProceedingDownload from '@/components/ProceedingDetail/ProceedingDownload/ProceedingDownload';
import ProceedingContent from '@/components/ProceedingDetail/ProceedingContent/ProceedingContent';
import ProceedingRelated from '@/components/ProceedingDetail/ProceedingRelated/ProceedingRelated';
import { notFound } from 'next/navigation';
import fs from 'fs/promises';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  
  const proceedingsJsonPath = path.join(process.cwd(), 'data', 'pages', 'congress-proceedings', 'proceedings.json');
  let allProceedings = {};
  try {
    const raw = await fs.readFile(proceedingsJsonPath, 'utf-8');
    allProceedings = JSON.parse(raw);
  } catch (err) {}

  const proceedingEntry = Object.values(allProceedings).find(p => p.meta.slug === slug);

  if (!proceedingEntry) {
    return { title: 'Proceeding Not Found' };
  }

  return {
    title: `${proceedingEntry.meta.title} — Congress Proceedings | AMC`,
    description: proceedingEntry.meta.title,
  };
}

export default async function ProceedingPage({ params }) {
  const { slug } = await params;

  const [headerData, footerData] = await Promise.all([
    readPageSectionData('global', 'header'),
    readPageSectionData('global', 'footer'),
  ]);

  const proceedingsJsonPath = path.join(process.cwd(), 'data', 'pages', 'congress-proceedings', 'proceedings.json');
  let allProceedings = {};
  try {
    const raw = await fs.readFile(proceedingsJsonPath, 'utf-8');
    allProceedings = JSON.parse(raw);
  } catch (err) {}

  const proceedingEntry = Object.entries(allProceedings).find(([id, p]) => p.meta.slug === slug);

  if (!proceedingEntry) {
    notFound();
  }

  const [proceedingId, data] = proceedingEntry;
  const sections = data.sections || {};
  const layout = data.layout?.sections || [];

  // Determine visibility
  const isVisible = (id) => {
    const sec = layout.find(s => s.id === id);
    return sec ? sec.visible : false;
  };

  return (
    <div style={{ backgroundColor: '#fff', minHeight: '100vh' }}>
      <Header data={headerData} />
      
      {isVisible('proceedingHero') && (
        <ProceedingHero data={sections.proceedingHero} coverImage={data.meta.coverImage} />
      )}
      
      {isVisible('proceedingDownload') && (
        <ProceedingDownload data={sections.proceedingDownload} />
      )}

      {isVisible('proceedingContent') && (
        <ProceedingContent data={sections.proceedingContent} />
      )}

      {isVisible('relatedProceedings') && (
        <ProceedingRelated data={sections.relatedProceedings} allProceedings={allProceedings} currentId={proceedingId} />
      )}

      <Footer data={footerData} />
    </div>
  );
}
