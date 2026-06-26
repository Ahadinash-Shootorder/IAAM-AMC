'use client';

import React from 'react';
import Link from 'next/link';
import CrudTable from '@/components/Admin/CrudTable';

export default function EventsPage() {
  const tableColumns = [
    { key: 'title', label: 'Event Title' },
    { key: 'slug', label: 'Slug' },
    { key: 'date', label: 'Date' },
    { key: 'location', label: 'Location' },
    { key: 'order', label: 'Order' },
  ];

  const formColumns = [
    { key: 'title', label: 'Event Title', required: true },
    { key: 'slug', label: 'Slug' },
    { key: 'date', label: 'Date', type: 'date' },
    { key: 'location', label: 'Location' },
    { key: 'description', label: 'Description', type: 'textarea' },
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
    { key: 'link', label: 'Event Link' },
    { key: 'image', label: 'Image URL' },
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

