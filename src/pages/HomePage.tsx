import { CaseSettings } from '../components/caseSettings/caseSettings';
import { TaxChart } from '../components/chart/TaxChart';
import { Header } from '../components/layout/Header';

export const HomePage = () => {
  return (
    <div
      className="home-page-wrapper"
      style={{
        maxWidth: '900px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 100,
      }}
    >
      <Header />
      <CaseSettings />
      <TaxChart />
    </div>
  );
};
