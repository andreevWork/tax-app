import styles from './GlobalSettings.module.css';

export const GlobalSettings = () => {
  return (
    <nav className={styles.headerNavContainer}>
      <div className={`${styles.navItem} ${styles['item-60']}`} />
      <div className={`${styles.navItem} ${styles['item-50']}`} />
      <div className={`${styles.navItem} ${styles['item-80']}`} />
    </nav>
  );
};
