import { GlobalSettings } from '../GlobalSettings/GlobalSettings';
import styles from './Header.module.css';

export function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.logoContainer} />
      <GlobalSettings />
    </header>
  );
}
