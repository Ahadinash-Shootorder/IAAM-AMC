import { readPageSectionData } from '@/lib/data';
import Header from '@/components/Common/Header';
import Footer from '@/components/Common/Footer';
import SpeakerDetail from '@/components/SpeakerDetail/SpeakerDetail';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const speaker = await prisma.speaker.findUnique({
    where: { slug }
  });

  if (!speaker) {
    return { title: 'Speaker Not Found' };
  }

  return {
    title: `${speaker.name} — Speaker Profile | AMC`,
    description: speaker.shortBio || `Learn more about ${speaker.name}`,
  };
}

export default async function SpeakerPage({ params }) {
  const { slug } = await params;

  const [headerData, footerData, speakerRow] = await Promise.all([
    readPageSectionData('global', 'header'),
    readPageSectionData('global', 'footer'),
    prisma.speaker.findUnique({ where: { slug } })
  ]);

  if (!speakerRow) {
    notFound();
  }

  const speaker = {
    ...speakerRow,
    title: speakerRow.designation,
    company: speakerRow.organization,
    expertise: speakerRow.expertise ? JSON.parse(speakerRow.expertise) : [],
    stats: speakerRow.stats ? JSON.parse(speakerRow.stats) : []
  };

  return (
    <div>
      <Header data={headerData} />
      <SpeakerDetail speaker={speaker} />
      <Footer data={footerData} />
    </div>
  );
}
