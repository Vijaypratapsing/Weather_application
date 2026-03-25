import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import dayjs from 'dayjs';
import { useRangeWeather } from '../../hooks/useWeather';
import HistoricalCharts from './HistoricalCharts';
import LoadingScreen from '../common/LoadingScreen';
import styles from './Page2.module.css';

export default function Page2({ location }) {
  const today = dayjs();
  const defaultEnd = today.subtract(1, 'day').format('YYYY-MM-DD'); // End date = kal
  const defaultStart = today.subtract(30, 'day').format('YYYY-MM-DD'); // Start date = 30 din pehle

  const [startDate, setStartDate] = useState(new Date(defaultStart));
  const [endDate, setEndDate] = useState(new Date(defaultEnd));
  const [applied, setApplied] = useState({ start: defaultStart, end: defaultEnd });

  const maxRange = 2 * 365; // days
  const minDate = new Date();
  minDate.setFullYear(minDate.getFullYear() - 5);
  const maxDate = new Date();

  const handleApply = () => {
    if (!startDate || !endDate) return;
    const s = dayjs(startDate);
    const e = dayjs(endDate);
    if (e.diff(s, 'day') > maxRange) {
      alert('Maximum date range is 2 years. Please select a shorter range.');
      return;
    }
    if (e.isBefore(s)) {
      alert('End date must be after start date.');
      return;
    }
    setApplied({ start: s.format('YYYY-MM-DD'), end: e.format('YYYY-MM-DD') });
  };

  const { data, loading, error } = useRangeWeather(
    location?.lat,
    location?.lon,
    applied.start,
    applied.end
  );

  const rangeDays = dayjs(applied.end).diff(dayjs(applied.start), 'day') + 1;

  const presets = [
    { label: '7D',  days: 7  },
    { label: '1M',  days: 30 },
    { label: '3M',  days: 90 },
    { label: '6M',  days: 180 },
    { label: '1Y',  days: 365 },
    { label: '2Y',  days: 730 },
  ];

  const applyPreset = (days) => {
    const end = dayjs().subtract(1, 'day'); // archive goes to yesterday
    const start = end.subtract(days - 1, 'day');
    setStartDate(new Date(start.format('YYYY-MM-DD')));
    setEndDate(new Date(end.format('YYYY-MM-DD')));
    setApplied({ start: start.format('YYYY-MM-DD'), end: end.format('YYYY-MM-DD') });
  };

  return (
    <div className={styles.page}>
      {/* Controls */}
      <div className={styles.controls}>
        <div className={styles.controlsTitle}>
          <span className={styles.icon}>◷</span>
          Historical Date Range
        </div>

        <div className={styles.presets}>
          {presets.map(p => (
            <button
              key={p.label}
              className={styles.preset}
              onClick={() => applyPreset(p.days)}
            >
              {p.label}
            </button>
          ))}
        </div>

        <div className={styles.dateRow}>
          <div className={styles.dateField}>
            <span className={styles.fieldLabel}>From</span>
            <DatePicker
              selected={startDate}
              onChange={d => setStartDate(d)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              maxDate={endDate || maxDate}
              minDate={minDate}
              dateFormat="MMM d, yyyy"
            />
          </div>
          <span className={styles.dateSep}>→</span>
          <div className={styles.dateField}>
            <span className={styles.fieldLabel}>To</span>
            <DatePicker
              selected={endDate}
              onChange={d => setEndDate(d)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate || minDate}
              maxDate={(() => {
                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
                return yesterday;
              })()}
              dateFormat="MMM d, yyyy"
            />
          </div>
          <button className={styles.applyBtn} onClick={handleApply}>
            Load Data
          </button>
        </div>

        <div className={styles.rangeInfo}>
          Showing <strong>{rangeDays}</strong> day{rangeDays !== 1 ? 's' : ''} of historical data
          &nbsp;·&nbsp;
          {dayjs(applied.start).format('MMM D, YYYY')} – {dayjs(applied.end).format('MMM D, YYYY')}
        </div>
      </div>

      {/* Content */}
      {loading && <LoadingScreen message="Loading historical data…" />}

      {error && !loading && (
        <div className={styles.error}>
          <span>⚠</span> {error}
        </div>
      )}

      {data && !loading && (
        <HistoricalCharts data={data} />
      )}
    </div>
  );
}