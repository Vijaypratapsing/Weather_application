import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import dayjs from 'dayjs';
import { useDayWeather } from '../../hooks/useWeather';
import WeatherHeader from './WeatherHeader';
import HourlyCharts from './HourlyCharts';
import LoadingScreen from '../common/LoadingScreen';
import styles from './Page1.module.css';

export default function Page1({ location }) {
  const today = dayjs().format('YYYY-MM-DD');
  const [selectedDate, setSelectedDate] = useState(today);

  const { data, loading, error } = useDayWeather(
    location?.lat,
    location?.lon,
    selectedDate
  );

  const handleDateChange = (date) => {
    if (date) setSelectedDate(dayjs(date).format('YYYY-MM-DD'));
  };

  // Max date: today. Min date: 1 year ago (open-meteo archive)
  const maxDate = new Date();
  const minDate = new Date();
  minDate.setFullYear(minDate.getFullYear() - 1);

  return (
    <div className={styles.page}>
      {/* Date Picker Bar */}
      <div className={styles.toolbar}>
        <div className={styles.toolbarLeft}>
          <span className={styles.toolbarLabel}>Viewing</span>
          <DatePicker
            selected={new Date(selectedDate)}
            onChange={handleDateChange}
            dateFormat="MMM d, yyyy"
            maxDate={maxDate}
            minDate={minDate}
            className={styles.datePicker}
            popperPlacement="bottom-start"
          />
        </div>
        <button
          className={styles.todayBtn}
          onClick={() => setSelectedDate(today)}
          disabled={selectedDate === today}
        >
          Today
        </button>
      </div>

      {/* Content */}
      {loading && <LoadingScreen message="Fetching weather data…" />}

      {error && !loading && (
        <div className={styles.error}>
          <span>⚠</span> {error}
        </div>
      )}

      {data && !loading && (
        <>
          <WeatherHeader
            weather={data.weather}
            air={data.air}
            selectedDate={selectedDate}
          />
          <HourlyCharts
            weather={data.weather}
            air={data.air}
          />
        </>
      )}
    </div>
  );
}
