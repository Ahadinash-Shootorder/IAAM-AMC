import React from 'react';
import Header from '@/components/Common/Header';
import Footer from '@/components/Common/Footer';
import ContactsTitle from '@/components/Contacts/ContactsTitle/ContactsTitle';
import ContactsDetails from '@/components/Contacts/ContactsDetails/ContactsDetails';
import ContactsMap from '@/components/Contacts/ContactsMap/ContactsMap';
import { readPageSectionData, getPageLayout } from '@/lib/data';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Contact Us - Advanced Materials Congress',
  description: 'Get in touch with the Advanced Materials Congress. We are happy to assist with any questions or concerns.',
};

const sectionComponents = {
  contactsTitle: ContactsTitle,
  contactsDetails: ContactsDetails,
  contactsMap: ContactsMap,
};

export default async function ContactsPage({ searchParams }) {
  const params = await searchParams;
  const isPreview = params?.preview === 'true';

  const sectionsConfig = await getPageLayout('contacts', isPreview);
  const headerData = await readPageSectionData('global', 'header', isPreview);
  const footerData = await readPageSectionData('global', 'footer', isPreview);

  // Sort body sections by order and filter visible ones
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
        data: section.content,
      };
    })
    .filter(Boolean);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#ffffff' }}>
      <Header data={headerData} />
      
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '72px', padding: '60px 24px 80px 24px', backgroundColor: '#ffffff' }}>
        {activeBodySections.map((section) => {
          const { Component, data } = section;
          return <Component key={section.id} data={data} />;
        })}
      </main>

      <Footer data={footerData} />
    </div>
  );
}
