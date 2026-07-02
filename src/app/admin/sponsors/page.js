import React from 'react';
import CrudTable from '@/components/Admin/CrudTable';

export default function SponsorsPage() {
  const tableColumns = [
    { key: 'name', label: 'Sponsor Name' },
    { key: 'tier', label: 'Tier' },
    { key: 'order', label: 'Order' },
  ];

  const formColumns = [
    { key: 'name', label: 'Sponsor Name', required: true },
    {
      key: 'tier',
      label: 'Tier',
      type: 'select',
      options: [
        { value: 'Platinum', label: 'Platinum' },
        { value: 'Gold', label: 'Gold' },
        { value: 'Silver', label: 'Silver' },
        { value: 'Bronze', label: 'Bronze' },
        { value: 'Supporter', label: 'Supporter' },
        { value: 'Partner', label: 'Partner' }
      ],
      required: true
    },
    { key: 'websiteUrl', label: 'Website URL' },
    { key: 'logo', label: 'Logo', type: 'image' },
    { key: 'order', label: 'Order', type: 'number' },
  ];

  return (
    <CrudTable
      title="Sponsors Management"
      endpoint="/api/admin/sponsors"
      tableColumns={tableColumns}
      formColumns={formColumns}
    />
  );
}
