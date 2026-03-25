import React from 'react';
import styles from './Navbar.module.css';

export default function Navbar({ activePage, onNavigate }) {
  return (
    <nav className={styles.nav}>
      <div className={styles.brand}>
        <span className={styles.logo}>◈</span>
        <span className={styles.brandName}>SkyCast</span>
      </div>
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activePage === 'today' ? styles.active : ''}`}
          onClick={() => onNavigate('today')}
        >
          <span className={styles.tabIcon}>⌂</span>
          <span>Daily View</span>
        </button>
        <button
          className={`${styles.tab} ${activePage === 'history' ? styles.active : ''}`}
          onClick={() => onNavigate('history')}
        >
          <span className={styles.tabIcon}>◷</span>
          <span>Historical</span>
        </button>
      </div>
    </nav>
  );
}
//Nav