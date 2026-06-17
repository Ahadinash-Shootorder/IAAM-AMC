import Image from 'next/image';
import styles from './GlobalEvents.module.css';

export default function GlobalEvents({ data }) {
  if (!data) return null;

  return (
    <section className={styles.globalEvents}>
      <div className={styles.container}>
        <h2 className={styles.title}>{data.title}</h2>
        <div className={styles.grid}>
          {data.events && data.events.map((event, index) => (
            <div key={index} className={styles.eventBox}>
              {event.image ? (() => {
                const rawImg = event.image;
                const imgSrc = rawImg.startsWith('/') || rawImg.startsWith('http') ? rawImg : `/${rawImg}`;
                return <Image src={imgSrc} alt={`Event ${index + 1}`} className={styles.image} fill sizes="(max-width: 768px) 100vw, 25vw" loading="lazy" />;
              })() : (
                <div className={styles.placeholderImage}></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
