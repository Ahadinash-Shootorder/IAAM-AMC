import Link from 'next/link';
import {
  FiFileText, FiLayers, FiCheckCircle, FiSettings,
  FiMic, FiHome, FiClock, FiActivity, FiUserCheck, FiLayout, FiCalendar, FiBriefcase, FiImage, FiMessageSquare
} from 'react-icons/fi';
import styles from './page.module.css';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  // Fetch pages from DB
  const pages = await prisma.page.findMany({
    include: { sections: true },
  });

  const totalPages = pages.length;
  let totalSections = 0;
  let activeSections = 0;

  pages.forEach(page => {
    if (page.sections) {
      totalSections += page.sections.length;
      activeSections += page.sections.filter(s => s.visible).length;
    }
  });

  // Fetch stats from DB
  const speakersCount = await prisma.speaker.count();
  const eventsCount = await prisma.event.count();
  const sponsorsCount = await prisma.sponsor.count();
  const mediaCount = await prisma.mediaAsset.count();

  // Fetch new data
  const unreadContacts = await prisma.contactQuery.count({ where: { status: 'unread' } });
  const recentLogs = await prisma.activityLog.findMany({
    orderBy: { createdAt: 'desc' },
    take: 4
  });

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className={styles.dashboard}>

      {/* ─── Stats Row ─── */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#eef2ff', color: '#4f46e5' }}>
            <FiLayout />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>{totalPages}</span>
            <span className={styles.statLabel}>CMS Pages</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#fdf4ff', color: '#c026d3' }}>
            <FiMic />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>{speakersCount}</span>
            <span className={styles.statLabel}>Total Speakers</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#f0fdf4', color: '#16a34a' }}>
            <FiImage />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>{mediaCount}</span>
            <span className={styles.statLabel}>Media Assets</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#fffbeb', color: '#d97706' }}>
            <FiMessageSquare />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>{unreadContacts}</span>
            <span className={styles.statLabel}>Unread Enquiries</span>
          </div>
        </div>
      </div>

      {/* ─── Bento Grid Layout ─── */}
      <div className={styles.bentoGrid}>

        {/* Left Column (70%) */}
        <div className={styles.bentoLeft}>
          <div className={styles.sectionPanel}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>
                <FiFileText /> Content Manager
              </h2>
            </div>

            <div className={styles.tableWrapper}>
              <table className={styles.dataTable}>
                <thead>
                  <tr>
                    <th>Page Name</th>
                    <th>Route</th>
                    <th>Sections</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pages.map((page) => (
                    <tr key={page.id}>
                      <td>
                        <div className={styles.pageCell}>
                          <div className={styles.pageIcon}>
                            <FiFileText />
                          </div>
                          <span className={styles.pageName}>{page.label}</span>
                        </div>
                      </td>
                      <td>
                        <span className={styles.pageRoute}>{page.route}</span>
                      </td>
                      <td>
                        <span className={styles.badge}>
                          {(page.sections || []).length} Sections
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <Link href={`/admin/pages/${page.id}`} className={styles.editBtn}>
                          Manage →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column (30%) */}
        <div className={styles.bentoRight}>

          <div className={styles.sectionPanel}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>
                <FiSettings /> Quick Actions
              </h2>
            </div>
            <div className={styles.actionList}>
              <Link href="/admin/pages/home" className={styles.actionCard}>
                <FiHome className={styles.actionIcon} />
                Edit Home Page
              </Link>
              <Link href="/admin/pages/global" className={styles.actionCard}>
                <FiSettings className={styles.actionIcon} />
                Global Settings
              </Link>
              <Link href="/admin/speakers" className={styles.actionCard}>
                <FiMic className={styles.actionIcon} />
                Manage Speakers
              </Link>
              <Link href="/admin/events" className={styles.actionCard}>
                <FiCalendar className={styles.actionIcon} />
                Manage Events
              </Link>
            </div>
          </div>

          <div className={styles.sectionPanel}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>
                <FiActivity /> System Status
              </h2>
            </div>
            <div className={styles.activityList}>
              {recentLogs.length === 0 ? (
                <div style={{ color: '#64748b', fontSize: '14px', padding: '12px 0' }}>No recent activity.</div>
              ) : (
                recentLogs.map((log, index) => (
                  <div key={log.id} className={styles.timelineItem}>
                    <div className={`${styles.timelineDot} ${index === 0 ? styles.active : ''}`}>
                      <FiActivity />
                    </div>
                    <div className={styles.timelineContent}>
                      <span className={styles.timelineTitle}>{log.action.replace(/_/g, ' ')}</span>
                      <span className={styles.timelineTime}>{new Date(log.createdAt).toLocaleString()} by {log.admin.split('@')[0]}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
