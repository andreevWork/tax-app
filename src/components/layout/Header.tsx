import { GlobalSettings } from './GlobalSettings';

export const Header = () => {
  return (
    <header
      style={{
        height: '60px',
        padding: '0 20px',
        borderRadius: '8px',
        background: '#cccccc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <div
        className="logo-container"
        style={{
          width: '120px',
          height: '30px',
          borderRadius: '4px',
          background: '#aaaaaa',
        }}
      />
      <GlobalSettings />
    </header>
  );
};
