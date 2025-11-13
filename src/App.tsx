import styles from './App.module.css';
import { Header } from './components/Header/Header';
import { HomePage } from './pages/HomePage/HomePage';

function App() {
  return (
    <main className={styles.main}>
      <Header />
      <HomePage />
    </main>
  );
}

export default App;
