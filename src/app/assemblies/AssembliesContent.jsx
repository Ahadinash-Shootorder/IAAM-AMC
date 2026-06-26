'use client';

import React, { useState } from 'react';
import AssembliesHero from '@/components/Assemblies/AssembliesHero/AssembliesHero';
import AssembliesTabs from '@/components/Assemblies/AssembliesTabs/AssembliesTabs';
import AssembliesCards from '@/components/Assemblies/AssembliesCards/AssembliesCards';
import AssembliesCta from '@/components/Assemblies/AssembliesCta/AssembliesCta';
import EventsList from '@/components/Events/EventsList/EventsList';

export default function AssembliesContent({
  heroData,
  tabsData,
  cardsData,
  ctaData,
  upcomingEvents = [],
  individualEvents = [],
  archiveEvents = []
}) {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (idx) => {
    setActiveTab(idx);
  };

  const renderActiveTabContent = () => {
    switch (activeTab) {
      case 0:
        // Tab 1: 2026 Congresses
        // Use the assemblies cards but enrich them / fallback to upcoming events if no cards
        return <AssembliesCards data={cardsData} />;
      case 1:
        // Tab 2: Fellow Assemblies
        return (
          <EventsList 
            data={{
              title: "Fellow Assemblies",
              events: individualEvents
            }} 
          />
        );
      case 2:
        // Tab 3: Advanced Materials Lecture Series
        return (
          <EventsList 
            data={{
              title: "Advanced Materials Lecture Series",
              events: archiveEvents
            }} 
          />
        );
      case 3:
        // Tab 4: Contact Us
        return (
          <section style={{ padding: '80px 48px', backgroundColor: '#FDF7FF', textAlign: 'center' }}>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
              <h2 style={{ fontSize: '32px', color: '#00287E', marginBottom: '24px', fontFamily: 'Montserrat', fontWeight: '600' }}>Contact Us</h2>
              <p style={{ fontSize: '18px', color: '#474555', marginBottom: '32px', lineHeight: '1.6' }}>
                For inquiries regarding the Scientific Assemblies, please contact the Advanced Materials Congress coordinating office.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', textAlign: 'left' }}>
                <div style={{ padding: '24px', background: '#fff', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
                  <h3 style={{ color: '#00287E', fontSize: '20px', marginBottom: '12px' }}>General Enquiries</h3>
                  <p style={{ margin: '4px 0', color: '#474555' }}>Email: info@iaam.se</p>
                  <p style={{ margin: '4px 0', color: '#474555' }}>Phone: +46 13 13 24 24</p>
                </div>
                <div style={{ padding: '24px', background: '#fff', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
                  <h3 style={{ color: '#00287E', fontSize: '20px', marginBottom: '12px' }}>Venue & Registration</h3>
                  <p style={{ margin: '4px 0', color: '#474555' }}>Email: registration@iaamonline.org</p>
                  <p style={{ margin: '4px 0', color: '#474555' }}>Address: Linköping, Sweden</p>
                </div>
              </div>
            </div>
          </section>
        );
      default:
        return null;
    }
  };

  return (
    <>
      {heroData && <AssembliesHero data={heroData} />}
      {tabsData && (
        <AssembliesTabs 
          data={tabsData} 
          activeTab={activeTab} 
          onTabChange={handleTabChange} 
        />
      )}
      
      {/* Active Tab Content Area */}
      <div className="tab-content-area" style={{ minHeight: '300px' }}>
        {renderActiveTabContent()}
      </div>

      {ctaData && <AssembliesCta data={ctaData} />}
    </>
  );
}
