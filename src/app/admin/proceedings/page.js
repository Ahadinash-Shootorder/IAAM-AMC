import React from 'react';
import CrudTable from '@/components/Admin/CrudTable';

export default function ProceedingsPage() {
  const tableColumns = [
    { key: 'title', label: 'Title' },
    { key: 'category', label: 'Category' },
    { key: 'authors', label: 'Authors' },
    { key: 'order', label: 'Order' },
  ];

  const formColumns = [
    { key: 'title', label: 'Title', required: true },
    { key: 'category', label: 'Category' },
    { key: 'authors', label: 'Authors' },
    { key: 'pdfUrl', label: 'PDF URL' },
    { key: 'date', label: 'Date' },
    { key: 'coverImage', label: 'Cover Image URL' },
    { key: 'link', label: 'Link' },
    { key: 'order', label: 'Order', type: 'number' },
  ];

  return (
    <CrudTable
      title="Proceedings Management"
      endpoint="/api/admin/proceedings"
      tableColumns={tableColumns}
      formColumns={formColumns}
    />
  );
}
