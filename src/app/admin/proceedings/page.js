'use client';

import React from 'react';
import Link from 'next/link';
import CrudTable from '@/components/Admin/CrudTable';

export default function ProceedingsPage() {
  const tableColumns = [
    { key: 'title', label: 'Title' },
    { key: 'slug', label: 'Slug' },
    { key: 'category', label: 'Category' },
    { key: 'authors', label: 'Authors' },
    { key: 'featured', label: 'Featured' },
    { key: 'order', label: 'Order' },
  ];

  const formColumns = [
    { key: 'title', label: 'Title', required: true },
    { key: 'slug', label: 'Slug' },
    { key: 'category', label: 'Category', type: 'category' },
    { key: 'authors', label: 'Authors' },
    { key: 'pdfUrl', label: 'PDF File', type: 'file' },
    { key: 'date', label: 'Date' },
    { key: 'coverImage', label: 'Cover Image', type: 'image' },
    { key: 'link', label: 'Link' },
    { key: 'featured', label: 'Featured', type: 'boolean' },
    { key: 'description', label: 'Description (Rich Text)', type: 'textarea' },
    { key: 'order', label: 'Order', type: 'number' },
  ];

  const renderCustomAction = (item) => (
    <Link
      href={`/admin/pages/proceeding-${item.id}`}
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
      title="Proceedings Management"
      endpoint="/api/admin/proceedings"
      tableColumns={tableColumns}
      formColumns={formColumns}
      customAction={renderCustomAction}
    />
  );
}
