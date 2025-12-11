import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { getCountries } from './api/countries';
import AppCss from './App.module.css';
import reactLogo from './assets/react.svg';
import { useAppStore, useThemeStore, useUserStore } from './store';
import type { Country, CountryCode } from './types/taxes';
import viteLogo from '/vite.svg';

function App() {
  const { count, increase, decrease, reset } = useAppStore();
  const { username, isLoggedIn, login, logout } = useUserStore();
  const {
    theme,
    isSidebarOpen,
    language,
    toggleTheme,
    toggleSidebar,
    setLanguage,
  } = useThemeStore();

  const [countries, setCountries] = useState<Country[]>([]);
  const [currentCountry, setCurrentCountry] = useState<Country | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getCountries();
        setCountries(data);
      } catch (error) {
        console.log(error);
      }
    };

    void loadData();
  }, []);

  console.log('currentCountry:', currentCountry);

  const handleChangeCountry = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const code = event.target.value as CountryCode;
    const country = countries.find((c) => c.countryCode === code) || null;
    setCurrentCountry(country);
  };

  const countriesOptions = countries.map((country) => (
    <option key={country.countryCode} value={country.countryCode}>
      {country.name}
    </option>
  ));

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className={AppCss.logo} alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img
            src={reactLogo}
            className={clsx(AppCss.logo, AppCss.card)}
            alt="React logo"
          />
        </a>
      </div>
      <h1 data-testid="main-heading">Vite + React + Zustand</h1>
      <div className={AppCss.card}>
        <h2>Countries Selector</h2>
        <p>
          Selected Country:{' '}
          {currentCountry ? currentCountry.name : 'Not selected'}
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
          <select
            id="country-select"
            value={currentCountry?.countryCode ?? ''}
            onChange={handleChangeCountry}
            aria-label="Select a country"
          >
            <option value="" disabled>
              Select a country
            </option>
            {countriesOptions}
          </select>
        </div>
      </div>

      <div className={AppCss.card}>
        <h2>App State (example)</h2>
        <p>Count: {count}</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
          <button onClick={decrease}>Decrease -</button>
          <button onClick={reset}>Reset</button>
          <button onClick={increase}>Increase +</button>
        </div>
      </div>
      <div className={AppCss.card}>
        <h2>User State (example)</h2>
        {isLoggedIn ? (
          <>
            <p>Welcome, {username}!</p>
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <button
            onClick={() => {
              login('John', 'john@example.com');
            }}
          >
            Login
          </button>
        )}
      </div>
      <div className={AppCss.card}>
        <h2>Theme & UI (example)</h2>
        <p>Current theme: {theme}</p>
        <button onClick={toggleTheme}>Toggle Theme</button>
        <p>Sidebar: {isSidebarOpen ? 'Open' : 'Closed'}</p>
        <button onClick={toggleSidebar}>Toggle Sidebar</button>
        <p>Language: {language}</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
          <button
            onClick={() => {
              setLanguage('ru');
            }}
          >
            Ru
          </button>
          <button
            onClick={() => {
              setLanguage('en');
            }}
          >
            En
          </button>
        </div>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
