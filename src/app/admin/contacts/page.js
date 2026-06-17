/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.css';
import { FiMail, FiCheckCircle, FiCornerUpLeft, FiTrash2, FiX } from 'react-icons/fi';

export default function ContactsPage() {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuery, setSelectedQuery] = useState(null);

  async function fetchQueries() {
    try {
      const res = await fetch('/api/admin/contacts');
      const data = await res.json();
      setQueries(data.queries || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchQueries();
  }, []);

  async function updateStatus(id, newStatus) {
    try {
      await fetch('/api/admin/contacts', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus })
      });
      setQueries(queries.map(q => q.id === id ? { ...q, status: newStatus } : q));
      if (selectedQuery && selectedQuery.id === id) {
        setSelectedQuery({ ...selectedQuery, status: newStatus });
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Contact Queries</h1>
        <p className={styles.subtitle}>Manage website enquiries</p>
      </div>

      <div className={styles.layout}>
        {/* Inbox List */}
        <div className={styles.inbox}>
          {loading ? (
            <p className={styles.loading}>Loading queries...</p>
          ) : queries.length === 0 ? (
            <div className={styles.emptyState}>No contact queries found.</div>
          ) : (
            queries.map(q => (
              <div 
                key={q.id} 
                className={`${styles.queryItem} ${selectedQuery?.id === q.id ? styles.active : ''} ${q.status === 'unread' ? styles.unread : ''}`}
                onClick={() => {
                  setSelectedQuery(q);
                  if (q.status === 'unread') updateStatus(q.id, 'read');
                }}
              >
                <div className={styles.queryHeader}>
                  <span className={styles.queryName}>{q.name}</span>
                  <span className={styles.queryTime}>{new Date(q.createdAt).toLocaleDateString()}</span>
                </div>
                <div className={styles.querySubject}>{q.subject || 'No Subject'}</div>
                <div className={styles.queryPreview}>{q.message.substring(0, 60)}...</div>
                <div className={styles.queryStatus}>
                  {q.status === 'unread' && <span className={styles.badgeUnread}>New</span>}
                  {q.status === 'replied' && <span className={styles.badgeReplied}>Replied</span>}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Detail View */}
        <div className={styles.detailView}>
          {selectedQuery ? (
            <div className={styles.detailCard}>
              <div className={styles.detailHeader}>
                <div>
                  <h2 className={styles.detailSubject}>{selectedQuery.subject || 'No Subject'}</h2>
                  <div className={styles.detailMeta}>
                    <strong>From:</strong> {selectedQuery.name} &lt;{selectedQuery.email}&gt;
                  </div>
                  <div className={styles.detailMeta}>
                    <strong>Date:</strong> {new Date(selectedQuery.createdAt).toLocaleString()}
                  </div>
                </div>
                <div className={styles.detailActions}>
                  {selectedQuery.status !== 'replied' && (
                    <button onClick={() => updateStatus(selectedQuery.id, 'replied')} className={styles.btnReply}>
                      <FiCornerUpLeft /> Mark Replied
                    </button>
                  )}
                  <button onClick={() => setSelectedQuery(null)} className={styles.btnClose}>
                    <FiX />
                  </button>
                </div>
              </div>
              <div className={styles.detailBody}>
                {selectedQuery.message.split('\n').map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
            </div>
          ) : (
            <div className={styles.noSelection}>
              <FiMail className={styles.noSelectionIcon} />
              <p>Select a query to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
