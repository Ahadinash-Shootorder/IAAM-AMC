import Image from 'next/image';
import Link from 'next/link';
import styles from './ProceedingsList.module.css';

export default function ProceedingsList({ data }) {
  if (!data) return null;

  const proceedings = data.proceedings || [];
  const featured = proceedings.filter(p => p.featured === true || p.featured === 'true');
  const general = proceedings.filter(p => !p.featured || (p.featured !== true && p.featured !== 'true'));

  return (
    <section className={styles.proceedingsSection}>
      <div className={styles.container}>
        <h1 className={styles.pageTitle}>{data.title}</h1>

        {/* Featured Proceedings Section (Upper List) */}
        {featured.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '48px' }}>
            <h2 style={{ fontSize: '28px', fontFamily: 'Montserrat, sans-serif', color: '#1C3F9E', borderBottom: '2px solid #f04393', paddingBottom: '8px', alignSelf: 'flex-start' }}>
              Featured Reports
            </h2>
            <div className={styles.grid}>
              {featured.map((item, index) => {
                const slug = item.slug || item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                return (
                  <Link href={`/congress-proceedings/${slug}`} key={`featured-${index}`} className={styles.card} style={{ textDecoration: 'none', border: '2px solid #e0e7ff', borderRadius: '8px', background: '#f8fafc' }}>
                    <div className={styles.imageWrapper}>
                      {(() => {
                        const defaultImg = '/uploads/about/globalEvents/1782885225827-European.jpg';
                        const rawImg = item.coverImage || defaultImg;
                        const imgSrc = rawImg.startsWith('/') || rawImg.startsWith('http') ? rawImg : `/${rawImg}`;
                        return <Image src={imgSrc} alt={item.title} className={styles.image} fill sizes="(max-width: 768px) 100vw, 33vw" loading="lazy" />;
                      })()}
                    </div>
                    <div className={styles.cardContent}>
                      <div className={styles.textBlock}>
                        <div className={styles.categoryAndTitle}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span className={styles.category}>{item.category}</span>
                            <span style={{ fontSize: '11px', background: '#f04393', color: 'white', padding: '3px 8px', borderRadius: '12px', fontWeight: 'bold', textTransform: 'uppercase' }}>Featured</span>
                          </div>
                          <h2 className={styles.cardTitle}>{item.title}</h2>
                        </div>
                      </div>
                      <p className={styles.authorDate}>{item.authors} - {item.date}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* General/All Proceedings Section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {featured.length > 0 && (
            <h2 style={{ fontSize: '28px', fontFamily: 'Montserrat, sans-serif', color: '#474555', borderBottom: '2px solid #e2e8f0', paddingBottom: '8px', alignSelf: 'flex-start' }}>
              All Proceedings
            </h2>
          )}
          <div className={styles.grid}>
            {general.map((item, index) => {
              const slug = item.slug || item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
              return (
                <Link href={`/congress-proceedings/${slug}`} key={index} className={styles.card} style={{ textDecoration: 'none' }}>
                  <div className={styles.imageWrapper}>
                    {(() => {
                      const defaultImg = '/uploads/about/globalEvents/1782885225827-European.jpg';
                      const rawImg = item.coverImage || defaultImg;
                      const imgSrc = rawImg.startsWith('/') || rawImg.startsWith('http') ? rawImg : `/${rawImg}`;
                      return <Image src={imgSrc} alt={item.title} className={styles.image} fill sizes="(max-width: 768px) 100vw, 33vw" loading="lazy" />;
                    })()}
                  </div>
                  <div className={styles.cardContent}>
                    <div className={styles.textBlock}>
                      <div className={styles.categoryAndTitle}>
                        <span className={styles.category}>{item.category}</span>
                        <h2 className={styles.cardTitle}>{item.title}</h2>
                      </div>
                    </div>
                    <p className={styles.authorDate}>{item.authors} - {item.date}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
