import React from 'react';
import CrudTable from '@/components/Admin/CrudTable';

export default function SpeakersPage() {
  const tableColumns = [
    { key: 'name', label: 'Name' },
    { key: 'slug', label: 'Slug' },
    { key: 'designation', label: 'Designation' },
    { key: 'order', label: 'Order' },
  ];

  const formColumns = [
    { key: 'name', label: 'Name', required: true },
    { key: 'slug', label: 'Slug' },
    { key: 'designation', label: 'Designation' },
    { key: 'organization', label: 'Organization' },
    { key: 'location', label: 'Location' },
    { key: 'image', label: 'Image', type: 'image' },
    { key: 'bannerImage', label: 'Banner Image', type: 'image' },
    { key: 'bannerImageMobile', label: 'Banner Image (Mobile)', type: 'image' },
    { key: 'shortBio', label: 'Short Bio', type: 'textarea' },
    { key: 'fullBio', label: 'Full Bio', type: 'textarea' },
    { key: 'expertise', label: 'Expertise', type: 'stringArray' },
    { key: 'stats', label: 'Stats', type: 'objectArray', itemFields: [
      { key: 'icon', label: 'Icon (e.g., papers)', type: 'text' },
      { key: 'number', label: 'Number (e.g., 120+)', type: 'text' },
      { key: 'label', label: 'Label (e.g., Research Papers)', type: 'text' }
    ]},
    { key: 'ctaText', label: 'CTA Text' },
    { key: 'ctaLink', label: 'CTA Link' },
    { key: 'order', label: 'Order', type: 'number' },
  ];

  return (
    <CrudTable
      title="Speakers Management"
      endpoint="/api/admin/speakers"
      tableColumns={tableColumns}
      formColumns={formColumns}
    />
  );
}
