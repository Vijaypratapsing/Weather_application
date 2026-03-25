import React from 'react';
import styles from './StatCard.module.css';

export default function StatCard({ icon, label, value, unit, subValue, color, size = 'normal' }) {
  return (
    <div className={`${styles.card} ${styles[size]}`} style={{ '--accent-color': color || 'var(--accent)' }}>
      {icon && <div className={styles.icon}>{icon}</div>}
      <div className={styles.content}>
        <div className={styles.label}>{label}</div>
        <div className={styles.valueRow}>
          <span className={styles.value}>{value ?? '—'}</span>
          {unit && <span className={styles.unit}>{unit}</span>}
        </div>
        {subValue && <div className={styles.sub}>{subValue}</div>}
      </div>
    </div>
  );
}
