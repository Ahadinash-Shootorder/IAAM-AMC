import Link from 'next/link';
import prisma from '@/lib/prisma';
import styles from './page.module.css';
import { FiActivity, FiUser, FiClock, FiFileText } from 'react-icons/fi';

export const dynamic = 'force-dynamic';

export default async function ActivityLogsPage({ searchParams }) {
  const params = await searchParams;
  const page = parseInt(params?.page || '1', 10);
  const limit = 20;
  const skip = (page - 1) * limit;

  const [logs, totalLogs] = await Promise.all([
    prisma.activityLog.findMany({
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.activityLog.count(),
  ]);

  const totalPages = Math.ceil(totalLogs / limit);
  const prevPage = page > 1 ? page - 1 : null;
  const nextPage = page < totalPages ? page + 1 : null;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Activity Logs</h1>
        <p className={styles.subtitle}>Recent administrative actions</p>
      </div>

      <div className={styles.card}>
        {logs.length === 0 ? (
          <div className={styles.emptyState}>No activity logs found.</div>
        ) : (
          <>
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Action</th>
                    <th>Admin</th>
                    <th>Details</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map(log => (
                    <tr key={log.id}>
                      <td>
                        <div className={styles.actionBadge}>
                          <FiActivity className={styles.icon} />
                          {log.action.replace(/_/g, ' ')}
                        </div>
                      </td>
                      <td>
                        <div className={styles.adminCell}>
                          <FiUser className={styles.icon} />
                          {log.admin}
                        </div>
                      </td>
                      <td>
                        <div className={styles.detailsCell} title={log.details || ''}>
                          {log.details ? (
                            <span className={styles.codeSnippet}>{log.details}</span>
                          ) : (
                            <span className={styles.muted}>No details</span>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className={styles.timeCell}>
                          <FiClock className={styles.icon} />
                          {new Date(log.createdAt).toLocaleString()}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className={styles.pagination}>
                <span>
                  Showing {skip + 1}–{Math.min(skip + limit, totalLogs)} of {totalLogs} logs
                </span>
                <div className={styles.paginationButtons}>
                  <Link
                    href={`/admin/activity-logs?page=${prevPage || 1}`}
                    className={`${styles.pageBtn} ${!prevPage ? styles.disabled : ''}`}
                  >
                    ← Previous
                  </Link>
                  <span style={{ display: 'inline-flex', alignItems: 'center', padding: '0 8px' }}>
                    Page {page} of {totalPages}
                  </span>
                  <Link
                    href={`/admin/activity-logs?page=${nextPage || totalPages}`}
                    className={`${styles.pageBtn} ${!nextPage ? styles.disabled : ''}`}
                  >
                    Next →
                  </Link>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
