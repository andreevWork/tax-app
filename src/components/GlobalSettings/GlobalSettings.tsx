import styles from './GlobalSettings.module.css';

export const GlobalSettings = () => {
  return (
    <nav className={styles.headerNavContainer}>
      <div className={`${styles.navItem} ${styles.item60}`} />
      <div className={`${styles.navItem} ${styles.item50}`} />
      <div className={`${styles.navItem} ${styles.item80}`} />
    </nav>
  );
};
