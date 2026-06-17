import Image from 'next/image';
import styles from './AboutHero.module.css';

export default function AboutHero({ data }) {
  if (!data) return null;

  const rawImg = data.image || '';
  const imgSrc = rawImg && !rawImg.startsWith('/') && !rawImg.startsWith('http') ? `/${rawImg}` : rawImg;

  return (
    <section className={styles.aboutHero}>
      <div className={styles.blurCircle}></div>
      <div className={styles.container}>
        <div className={styles.textContent}>
          <h1 className={styles.title}>{data.title}</h1>
          <p className={styles.description}>{data.description}</p>
        </div>
        <div className={styles.imageContainer}>
          {imgSrc ? (
            <Image src={imgSrc} alt={data.title} className={styles.image} fill sizes="(max-width: 768px) 100vw, 50vw" priority />
          ) : (
            <div className={styles.placeholderImage}></div>
          )}
        </div>
      </div>
    </section>
  );
}
