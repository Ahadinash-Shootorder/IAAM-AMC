'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import styles from './layout.module.css';
import { 
  FiMenu, FiImage, FiBarChart2, FiMic, FiUser, FiCompass, 
  FiBriefcase, FiHeart, FiLayout, FiCalendar, FiBookOpen, 
  FiChevronDown, FiChevronRight, FiSquare, FiX, FiFileText, 
  FiLogOut, FiSettings, FiActivity, FiFolder, FiMessageSquare,
  FiHome, FiInfo, FiArchive, FiBook, FiUsers, FiAward, FiPhone, FiMap, FiClock,
  FiGrid, FiStar, FiList, FiEdit } from 'react-icons/fi';

const pageIcons = {
  home: <FiHome />,
  global: <FiSettings />,
  about: <FiInfo />,
  'upcoming-events': <FiClock />,
  'individual-events': <FiCalendar />,
  'congress-archive': <FiArchive />,
  'congress-proceedings': <FiBook />,
  assemblies: <FiUsers />,
  'fellow-awards': <FiAward />,
  contacts: <FiPhone />,
};

const sectionIcons = {
  header: <FiMenu />,
  hero: <FiImage />,
  stats: <FiBarChart2 />,
  speakers: <FiMic />,
  becomeMember: <FiUser />,
  explore: <FiCompass />,
  sponsors: <FiBriefcase />,
  becomeSponsor: <FiHeart />,
  footer: <FiLayout />,
  aboutHero: <FiImage />,
  ourStory: <FiBookOpen />,
  globalEvents: <FiMap />,
  eventsList: <FiCalendar />,
  proceedingsHeader: <FiFileText />,
  proceedingsList: <FiFolder />,
  proceedingHero: <FiImage />,
  proceedingDownload: <FiBookOpen />,
  proceedingContent: <FiFileText />,
  relatedProceedings: <FiBook />,
  assembliesHero: <FiImage />,
  assembliesTabs: <FiMenu />,
  assembliesCards: <FiUsers />,
  assembliesCta: <FiCompass />,
  contactsTitle: <FiMessageSquare />,
  contactsDetails: <FiPhone />,
  contactsMap: <FiMap />,
  awardsHero: <FiImage />,
  awardsIntro: <FiInfo />,
  awardsCategories: <FiGrid />,
  awardsPublications: <FiBook />,
  awardsNomination: <FiEdit />,
  awardsLaureates: <FiAward />,
};

const sectionLabels = {
  header: 'Header / Navigation',
  hero: 'Hero Banner',
  stats: 'Stats Bar',
  speakers: 'Speakers Section',
  becomeMember: 'Become Member CTA',
  explore: 'Explore More',
  sponsors: 'Sponsors',
  becomeSponsor: 'Become Sponsor CTA',
  footer: 'Footer',
  aboutHero: 'About Hero',
  ourStory: 'Our Story',
  globalEvents: 'Global Events',
  eventsList: 'Events List',
  proceedingsHeader: 'Page Header / Title',
  proceedingsList: 'Proceedings List',
  proceedingHero: 'Hero Section',
  proceedingDownload: 'Download Section',
  proceedingContent: 'Main Content',
  relatedProceedings: 'Related Proceedings',
  assembliesHero: 'Assemblies Hero',
  assembliesTabs: 'Assemblies Tabs',
  assembliesCards: 'Assemblies Cards',
  assembliesCta: 'Assemblies CTA',
  contactsTitle: 'Contacts Title',
  contactsDetails: 'Contacts Details',
  contactsMap: 'Contacts Map',
};

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pages, setPages] = useState([]);
  const [expandedPages, setExpandedPages] = useState({});

  // Auto-expand the sidebar section based on the current URL
  useEffect(() => {
    const match = pathname.match(/^\/admin\/pages\/([^/]+)/);
    if (match && match[1]) {
      setTimeout(() => setExpandedPages({ [match[1]]: true }), 0);
    } else {
      setTimeout(() => setExpandedPages({}), 0);
    }
  }, [pathname]);

  useEffect(() => {
    async function fetchPages() {
      try {
        const res = await fetch('/api/admin/pages');
        const data = await res.json();
        if (data.pages) {
          setPages(data.pages);
        }
      } catch (err) {
        console.error('Failed to fetch pages in sidebar:', err);
      }
    }
    fetchPages();
  }, [pathname]);

  const togglePageExpand = (pageId, e) => {
    e.preventDefault();
    e.stopPropagation();
    setExpandedPages((prev) => 
      prev[pageId] ? {} : { [pageId]: true }
    );
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      router.push('/admin/login');
      router.refresh();
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  // Generate breadcrumb info
  const getBreadcrumb = () => {
    if (pathname === '/admin') return 'Dashboard';
    if (pathname === '/admin/speakers') return 'Content Modules > Speakers';
    if (pathname === '/admin/sponsors') return 'Content Modules > Sponsors';
    if (pathname === '/admin/media') return 'Content Modules > Media Library';
    if (pathname === '/admin/activity-logs') return 'System > Activity Logs';
    if (pathname === '/admin/contacts') return 'System > Contact Queries';
    if (pathname === '/admin/settings') return 'System > Settings';

    const pageMatch = pathname.match(/^\/admin\/pages\/([^/]+)$/);
    if (pageMatch) {
      const pageId = pageMatch[1];
      const page = pages.find(p => p.id === pageId);
      return `Pages > ${page ? page.label : pageId}`;
    }

    const secMatch = pathname.match(/^\/admin\/pages\/([^/]+)\/([^/]+)$/);
    if (secMatch) {
      const pageId = secMatch[1];
      const secId = secMatch[2];
      const page = pages.find(p => p.id === pageId);
      const sectionLabel = sectionLabels[secId] || secId;
      return `Pages > ${page ? page.label : pageId} > ${sectionLabel}`;
    }

    return 'Admin';
  };

  const renderBreadcrumbs = () => {
    const text = getBreadcrumb();
    const parts = text.split(' > ');
    return parts.map((part, idx) => (
      <span key={idx} style={{ display: 'inline-flex', alignItems: 'center' }}>
        {idx > 0 && <span style={{ margin: '0 8px', color: '#c0c0cf', fontWeight: 'normal' }}>/</span>}
        <span style={{ color: idx === parts.length - 1 ? '#212134' : '#666687', fontWeight: idx === parts.length - 1 ? '600' : 'normal' }}>
          {part}
        </span>
      </span>
    ));
  };

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <div className={styles.layout}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className={styles.overlay}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.sidebarHeader}>
          <Link href="/admin" className={styles.brand}>
            <Image
              src="/WHITE LOGO AMC.png"
              alt="IAAM Logo"
              width={109}
              height={41}
              className={styles.brandLogo}
              priority
            />
          </Link>
          <button
            className={styles.closeSidebar}
            onClick={() => setSidebarOpen(false)}
          >
            ✕
          </button>
        </div>

        <nav className={styles.nav}>
          {/* Dashboard Link */}
          <Link
            href="/admin"
            className={`${styles.navLink} ${pathname === '/admin' ? styles.navLinkActive : ''}`}
            onClick={() => setSidebarOpen(false)}
          >
            <span className={styles.navIcon}><FiLayout /></span>
            <span className={styles.navLabel}>Dashboard</span>
          </Link>

          <div className={styles.sectionHeader}>CONTENT MANAGER</div>

          <div className={styles.treeContainer}>
            <div className={styles.treeHeader}>
              <span className={styles.treeHeaderIcon}><FiFolder /></span> Pages
            </div>

            {pages.map((page) => {
              const isExpanded = expandedPages[page.id];
              const pageHref = `/admin/pages/${page.id}`;
              const isPageActive = pathname === pageHref;

              return (
                <div key={page.id} className={styles.treeNode}>
                  <div className={`${styles.treeItem} ${isPageActive ? styles.treeItemActive : ''}`}>
                    <button
                      className={styles.treeCollapseBtn}
                      onClick={(e) => togglePageExpand(page.id, e)}
                    >
                      {isExpanded ? <FiChevronDown size={12} /> : <FiChevronRight size={12} />}
                    </button>
                    <Link
                      href={pageHref}
                      className={styles.treeLink}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <span className={styles.pageIcon}>{pageIcons[page.id] || <FiFileText />}</span>
                      <span className={styles.pageLabel}>{page.label}</span>
                    </Link>
                  </div>

                  {isExpanded && page.sections && (
                    <div className={styles.treeChildren}>
                      {page.sections
                        .sort((a, b) => a.order - b.order)
                        .map((sec) => {
                          const secHref = `/admin/pages/${page.id}/${sec.id}`;
                          const isSecActive = pathname === secHref;

                          return (
                            <Link
                              key={sec.id}
                              href={secHref}
                              className={`${styles.childLink} ${isSecActive ? styles.childLinkActive : ''}`}
                              onClick={() => setSidebarOpen(false)}
                            >
                              <span className={styles.childIcon}>
                                {sectionIcons[sec.id] || <FiSquare />}
                              </span>
                              <span className={styles.childLabel}>{sec.label}</span>
                              {!sec.visible && (
                                <span className={styles.hiddenIndicator} title="Hidden on site"><FiX size={12} /></span>
                              )}
                            </Link>
                          );
                        })}
                    </div>
                  )}
                </div>
              );
            })}

            <div className={styles.sectionHeader} style={{ padding: '16px 16px 8px' }}>CONTENT MODULES</div>

            {/* Standalone Data Modules */}
            <div className={styles.treeNode}>
              <div className={`${styles.treeItem} ${pathname === '/admin/speakers' ? styles.treeItemActive : ''}`}>
                <div style={{ width: '20px' }} />
                <Link href="/admin/speakers" className={styles.treeLink} onClick={() => setSidebarOpen(false)}>
                  <span className={styles.pageIcon}><FiMic /></span>
                  <span className={styles.pageLabel}>Speakers</span>
                </Link>
              </div>
            </div>
            <div className={styles.treeNode}>
              <div className={`${styles.treeItem} ${pathname === '/admin/sponsors' ? styles.treeItemActive : ''}`}>
                <div style={{ width: '20px' }} />
                <Link href="/admin/sponsors" className={styles.treeLink} onClick={() => setSidebarOpen(false)}>
                  <span className={styles.pageIcon}><FiBriefcase /></span>
                  <span className={styles.pageLabel}>Sponsors</span>
                </Link>
              </div>
            </div>
            <div className={styles.treeNode}>
              <div className={`${styles.treeItem} ${pathname === '/admin/media' ? styles.treeItemActive : ''}`}>
                <div style={{ width: '20px' }} />
                <Link href="/admin/media" className={styles.treeLink} onClick={() => setSidebarOpen(false)}>
                  <span className={styles.pageIcon}><FiImage /></span>
                  <span className={styles.pageLabel}>Media Library</span>
                </Link>
              </div>
            </div>


          </div>
        </nav>

        <div className={styles.sidebarFooter}>
          <Link href="/admin/settings" className={styles.viewSiteLink} style={{ color: 'white', marginBottom: '4px', textDecoration: 'none', background: '#32324d' }}>
            <FiSettings /> Settings
          </Link>
          <button onClick={handleLogout} className={styles.logoutBtn}>
            <FiLogOut /> Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className={styles.mainArea}>
        <header className={styles.topbar}>
          <button
            className={styles.menuToggle}
            onClick={() => setSidebarOpen(true)}
          >
            ☰
          </button>
          <h1 className={styles.pageTitle}>
            Dashboard
          </h1>
          <Link href="/" className={styles.liveLink} target="_blank">
            ↗ View Site
          </Link>
        </header>

        <main className={styles.content}>
          {children}
        </main>
      </div>
    </div>
  );
}
