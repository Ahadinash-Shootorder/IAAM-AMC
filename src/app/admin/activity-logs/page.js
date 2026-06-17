import prisma from '@/lib/prisma';
import styles from './page.module.css';
import { FiActivity, FiUser, FiClock, FiFileText } from 'react-icons/fi';

export const dynamic = 'force-dynamic';

export default async function ActivityLogsPage() {
  const logs = await prisma.activityLog.findMany({
    orderBy: { createdAt: 'desc' },
    take: 100 // Limit to recent 100 logs
  });

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
        )}
      </div>
    </div>
  );
}
