import React, { useState } from 'react';
import { useLocation } from './hooks/useLocation';
import Navbar from './components/common/Navbar';
import Page1 from './components/Page1/Page1';
import Page2 from './components/Page2/Page2';
import LoadingScreen from './components/common/LoadingScreen';
import styles from './App.module.css';

export default function App() {
  const [activePage, setActivePage] = useState('today');
  const { location, loading: locLoading, error: locError } = useLocation();

  if (locLoading) {
    return (
      <div className={styles.app}>
        <Navbar activePage={activePage} onNavigate={setActivePage} />
        <LoadingScreen message="Detecting your location…" />
      </div>
    );
  }

  return (
    <div className={styles.app}>
      <Navbar activePage={activePage} onNavigate={setActivePage} />

      {locError && (
        <div className={styles.locBanner}>
          📍 {locError}
        </div>
      )}

      <main className={styles.main}>
        {activePage === 'today'
          ? <Page1 location={location} />
          : <Page2 location={location} />
        }
      </main>
    </div>
  );
}
