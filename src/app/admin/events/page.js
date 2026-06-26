'use client';

import React from 'react';
import Link from 'next/link';
import CrudTable from '@/components/Admin/CrudTable';

export default function EventsPage() {
  const tableColumns = [
    { key: 'title', label: 'Event Title' },
    { key: 'slug', label: 'Slug' },
    { key: 'eventType', label: 'Event Type' },
    { key: 'order', label: 'Order' },
  ];

  const formColumns = [
    { key: 'title', label: 'Event Title', required: true },
    { key: 'slug', label: 'Slug' },
    {
      key: 'eventType',
      label: 'Event Type',
      type: 'select',
      required: true,
      options: [
        { value: 'upcoming', label: 'Upcoming Event' },
        { value: 'individual', label: 'Individual Event' },
        { value: 'archive', label: 'Archive Event' },
      ],
    },
    { key: 'image', label: 'Card Image Override', type: 'image' },
    { key: 'link', label: 'External Event Link (Optional)' },
    { key: 'order', label: 'Order', type: 'number' },
  ];

  const renderCustomAction = (item) => (
    <Link
      href={`/admin/pages/event-${item.id}`}
      style={{
        background: '#1C3F9E',
        color: '#fff',
        padding: '6px 12px',
        borderRadius: '4px',
        fontSize: '13px',
        fontWeight: '500',
        textDecoration: 'none',
        marginRight: '8px',
        display: 'inline-flex',
        alignItems: 'center'
      }}
    >
      Manage Content
    </Link>
  );

  return (
    <CrudTable
      title="Events Management"
      endpoint="/api/admin/events"
      tableColumns={tableColumns}
      formColumns={formColumns}
      customAction={renderCustomAction}
    />
  );
}

