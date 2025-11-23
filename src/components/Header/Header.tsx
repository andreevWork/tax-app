import { GlobalSettings } from '../GlobalSettings/GlobalSettings';
import styles from './Header.module.css';

export const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.logoContainer} />
      <GlobalSettings />
    </header>
  );
};
