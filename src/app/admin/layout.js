'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import styles from './layout.module.css';
import { FiMenu, FiImage, FiBarChart2, FiMic, FiUser, FiCompass, FiBriefcase, FiHeart, FiLayout, FiCalendar, FiBookOpen, FiChevronDown, FiChevronRight, FiSquare, FiX, FiFileText, FiLogOut, FiSettings, FiActivity } from 'react-icons/fi';

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
  globalEvents: <FiCompass />,
  eventsList: <FiCalendar />,
  proceedingsList: <FiFileText />,
  assembliesHero: <FiImage />,
  assembliesTabs: <FiMenu />,
  assembliesCards: <FiCalendar />,
  assembliesCta: <FiCompass />,
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
              <span className={styles.treeHeaderIcon}><FiFileText /></span> Pages
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
                      <span className={styles.pageIcon}>{page.id === 'global' ? <FiSettings /> : <FiFileText />}</span>
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
            {/* Standalone Data Modules (no page equivalent in tree) */}
            <div className={styles.treeNode}>
              <div className={`${styles.treeItem} ${pathname === '/admin/speakers' ? styles.treeItemActive : ''}`}>
                <div style={{width: '24px'}} />
                <Link href="/admin/speakers" className={styles.treeLink} onClick={() => setSidebarOpen(false)}>
                  <span className={styles.pageIcon}><FiMic /></span>
                  <span className={styles.pageLabel}>Speakers</span>
                </Link>
              </div>
            </div>
            <div className={styles.treeNode}>
              <div className={`${styles.treeItem} ${pathname === '/admin/sponsors' ? styles.treeItemActive : ''}`}>
                <div style={{width: '24px'}} />
                <Link href="/admin/sponsors" className={styles.treeLink} onClick={() => setSidebarOpen(false)}>
                  <span className={styles.pageIcon}><FiBriefcase /></span>
                  <span className={styles.pageLabel}>Sponsors</span>
                </Link>
              </div>
            </div>
            <div className={styles.treeNode}>
              <div className={`${styles.treeItem} ${pathname === '/admin/media' ? styles.treeItemActive : ''}`}>
                <div style={{width: '24px'}} />
                <Link href="/admin/media" className={styles.treeLink} onClick={() => setSidebarOpen(false)}>
                  <span className={styles.pageIcon}><FiImage /></span>
                  <span className={styles.pageLabel}>Media Library</span>
                </Link>
              </div>
            </div>
            <div className={styles.sectionHeader}>SYSTEM</div>
            <div className={styles.treeNode}>
              <div className={`${styles.treeItem} ${pathname === '/admin/activity-logs' ? styles.treeItemActive : ''}`}>
                <div style={{width: '24px'}} />
                <Link href="/admin/activity-logs" className={styles.treeLink} onClick={() => setSidebarOpen(false)}>
                  <span className={styles.pageIcon}><FiActivity /></span>
                  <span className={styles.pageLabel}>Activity Logs</span>
                </Link>
              </div>
            </div>
            <div className={styles.treeNode}>
              <div className={`${styles.treeItem} ${pathname === '/admin/contacts' ? styles.treeItemActive : ''}`}>
                <div style={{width: '24px'}} />
                <Link href="/admin/contacts" className={styles.treeLink} onClick={() => setSidebarOpen(false)}>
                  <span className={styles.pageIcon}><FiFileText /></span>
                  <span className={styles.pageLabel}>Contact Queries</span>
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <div className={styles.sidebarFooter}>
          <Link href="/admin/settings" className={styles.logoutBtn} style={{ color: '#e4e4e7', marginBottom: '8px', textDecoration: 'none' }}>
            <FiSettings className={styles.logoutIcon} /> Settings
          </Link>
          <button onClick={handleLogout} className={styles.logoutBtn}>
            <FiLogOut className={styles.logoutIcon} /> Logout
          </button>
          <Link href="/" className={styles.viewSiteLink} target="_blank">
            ↗ View Live Site
          </Link>
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
          <h1 className={styles.pageTitle}></h1>
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
