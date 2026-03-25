import React from 'react';
import styles from './LoadingScreen.module.css';

export default function LoadingScreen({ message = 'Loading weather data...' }) {
  return (
    <div className={styles.overlay}>
      <div className={styles.inner}>
        <div className={styles.spinner}></div>
        <p className={styles.message}>{message}</p>
      </div>
    </div>
  );
}
