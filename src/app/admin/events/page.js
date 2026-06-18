import React from 'react';
import CrudTable from '@/components/Admin/CrudTable';

export default function EventsPage() {
  const tableColumns = [
    { key: 'title', label: 'Event Title' },
    { key: 'date', label: 'Date' },
    { key: 'location', label: 'Location' },
    { key: 'order', label: 'Order' },
  ];

  const formColumns = [
    { key: 'title', label: 'Event Title', required: true },
    { key: 'date', label: 'Date', type: 'date' },
    { key: 'location', label: 'Location' },
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

  return (
    <CrudTable
      title="Events Management"
      endpoint="/api/admin/events"
      tableColumns={tableColumns}
      formColumns={formColumns}
    />
  );
}
