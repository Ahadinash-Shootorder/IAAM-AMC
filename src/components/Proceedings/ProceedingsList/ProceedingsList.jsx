import Image from 'next/image';
import styles from './ProceedingsList.module.css';

export default function ProceedingsList({ data }) {
  if (!data) return null;

  const proceedings = data.proceedings || [];

  return (
    <section className={styles.proceedingsSection}>
      <div className={styles.container}>
        <h1 className={styles.pageTitle}>{data.title}</h1>

        <div className={styles.grid}>
          {proceedings.map((item, index) => (
            <div key={index} className={styles.card}>
              <div className={styles.imageWrapper}>
                {item.coverImage ? (() => {
                  const rawImg = item.coverImage;
                  const imgSrc = rawImg.startsWith('/') || rawImg.startsWith('http') ? rawImg : `/${rawImg}`;
                  return <Image src={imgSrc} alt={item.title} className={styles.image} fill sizes="(max-width: 768px) 100vw, 33vw" loading="lazy" />;
                })() : (
                  <div className={styles.placeholderImage}></div>
                )}
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
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
