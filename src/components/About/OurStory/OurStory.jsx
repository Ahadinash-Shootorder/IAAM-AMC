import Image from 'next/image';
import styles from './OurStory.module.css';

export default function OurStory({ data }) {
  if (!data) return null;

  return (
    <section className={styles.ourStory}>
      <div className={styles.container}>
        <div className={styles.textContent}>
          <h2 className={styles.title}>{data.title}</h2>
          {data.paragraphs && data.paragraphs.map((para, index) => (
            <p key={index} className={styles.paragraph}>{para}</p>
          ))}
        </div>
        <div className={styles.imageContainer}>
          {data.image ? (() => {
            const rawImg = data.image;
            const imgSrc = rawImg.startsWith('/') || rawImg.startsWith('http') ? rawImg : `/${rawImg}`;
            return <Image src={imgSrc} alt={data.title} className={styles.image} fill sizes="(max-width: 768px) 100vw, 50vw" loading="lazy" />;
          })() : (
            <div className={styles.placeholderImage}></div>
          )}
        </div>
      </div>
    </section>
  );
}
