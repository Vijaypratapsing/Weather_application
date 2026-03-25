import React, { useState, useRef } from 'react';
import styles from './ScrollableChart.module.css';

export default function ScrollableChart({ title, children, dataLength = 0 }) {
  const [zoom, setZoom] = useState(1);
  const containerRef = useRef(null);

  const zoomIn  = () => setZoom(z => Math.min(z + 0.25, 4));
  const zoomOut = () => setZoom(z => Math.max(z - 0.25, 0.5));
  const reset   = () => setZoom(1);

  const minWidth = Math.max(600, dataLength * 12 * zoom);

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h3 className={styles.title}>{title}</h3>
        <div className={styles.controls}>
          <button onClick={zoomOut} title="Zoom out" className={styles.btn}>−</button>
          <span className={styles.zoomLabel}>{Math.round(zoom * 100)}%</span>
          <button onClick={zoomIn} title="Zoom in" className={styles.btn}>+</button>
          <button onClick={reset} title="Reset" className={styles.btnReset}>⊙</button>
        </div>
      </div>
      <div className={styles.scrollContainer} ref={containerRef}>
        <div style={{ minWidth: `${minWidth}px`, height: '100%' }}>
          {children}
        </div>
      </div>
    </div>
  );
}
