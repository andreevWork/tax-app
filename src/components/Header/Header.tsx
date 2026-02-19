import { GlobalSettings } from '../GlobalSettings/GlobalSettings';
import { Logo } from '../Logo/Logo';
import styles from './Header.module.css';

export function Header() {
  return (
    <header className={styles.header}>
      <Logo color="#3b82f6" />
      <GlobalSettings />
    </header>
  );
}
