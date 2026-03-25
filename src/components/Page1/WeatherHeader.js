import React from 'react';
import dayjs from 'dayjs';
import { aqiLabel, weatherCodeDesc } from '../../services/weatherApi';
import StatCard from '../common/StatCard';
import styles from './WeatherHeader.module.css';

export default function WeatherHeader({ weather, air, selectedDate }) {
  const daily = weather?.daily;
  const current = weather?.current_weather;
  const airHourly = air?.hourly;

  // Get current hour index for air quality
  const now = dayjs();
  const isToday = selectedDate === now.format('YYYY-MM-DD');
  const currentHour = isToday ? now.hour() : 12;

  const getAirValue = (arr) => {
    if (!arr) return null;
    return arr[currentHour] ?? null;
  };

  const aqi = getAirValue(airHourly?.european_aqi);
  const aqiInfo = aqiLabel(aqi);

  const tempMin = daily?.temperature_2m_min?.[0];
  const tempMax = daily?.temperature_2m_max?.[0];
  const tempCurrent = current?.temperature;
  const precipitation = daily?.precipitation_sum?.[0];
  const sunrise = daily?.sunrise?.[0];
  const sunset  = daily?.sunset?.[0];
  const windMax = daily?.windspeed_10m_max?.[0];
  const uvIndex = daily?.uv_index_max?.[0];
  const precipProb = daily?.precipitation_probability_max?.[0];
  const pm10 = getAirValue(airHourly?.pm10);
  const pm25 = getAirValue(airHourly?.pm2_5);
  const co   = getAirValue(airHourly?.carbon_monoxide);
  const no2  = getAirValue(airHourly?.nitrogen_dioxide);
  const so2  = getAirValue(airHourly?.sulphur_dioxide);
  const rh   = getAirValue(weather?.hourly?.relativehumidity_2m);
  const co2  = getAirValue(airHourly?.carbon_dioxide);

  // Sunrise/Sunset formatting
  const fmt = (iso) => iso ? dayjs(iso).format('h:mm A') : '—';

  return (
    <div className={styles.container}>
      {/* Hero temp */}
      <div className={styles.hero}>
        <div className={styles.tempDisplay}>
          <span className={styles.currentTemp}>{tempCurrent != null ? Math.round(tempCurrent) : '—'}</span>
          <span className={styles.tempUnit}>°C</span>
        </div>
        <div className={styles.heroMeta}>
          <div className={styles.condition}>{weatherCodeDesc(current?.weathercode)}</div>
          <div className={styles.tempRange}>
            <span style={{ color: '#f87171' }}>↑ {tempMax != null ? Math.round(tempMax) : '—'}°</span>
            <span style={{ color: '#38bdf8' }}>↓ {tempMin != null ? Math.round(tempMin) : '—'}°</span>
          </div>
          <div className={styles.dateLabel}>{dayjs(selectedDate).format('dddd, MMMM D YYYY')}</div>
        </div>
      </div>

      {/* Weather stats grid */}
      <div className={styles.sectionTitle}>Weather Conditions</div>
      <div className={styles.grid}>
        <StatCard icon="🌡️" label="Temp Min / Max" value={`${tempMin != null ? Math.round(tempMin) : '—'} / ${tempMax != null ? Math.round(tempMax) : '—'}`} unit="°C" color="#38bdf8" />
        <StatCard icon="🌧️" label="Precipitation" value={precipitation?.toFixed(1) ?? '—'} unit="mm" color="#818cf8" />
        <StatCard icon="🌅" label="Sunrise" value={fmt(sunrise)} color="#fb923c" />
        <StatCard icon="🌇" label="Sunset" value={fmt(sunset)} color="#f472b6" />
        <StatCard icon="💨" label="Max Wind Speed" value={windMax?.toFixed(1) ?? '—'} unit="km/h" color="#34d399" />
        <StatCard icon="💧" label="Relative Humidity" value={rh ?? '—'} unit="%" color="#818cf8" />
        <StatCard icon="☀️" label="UV Index" value={uvIndex?.toFixed(1) ?? '—'} color="#facc15" />
        <StatCard icon="🌂" label="Precip. Prob. Max" value={precipProb ?? '—'} unit="%" color="#a78bfa" />
      </div>

      {/* Air Quality */}
      <div className={styles.sectionTitle} style={{ marginTop: '1.5rem' }}>Air Quality</div>
      <div className={styles.aqiBadge} style={{ '--aqi-color': aqiInfo.color }}>
        <span className={styles.aqiNum}>{aqi ?? '—'}</span>
        <div>
          <div className={styles.aqiLabel}>AQI — {aqiInfo.label}</div>
          <div className={styles.aqiSub}>European Air Quality Index</div>
        </div>
      </div>
      <div className={styles.grid}>
        <StatCard icon="🔴" label="PM10" value={pm10?.toFixed(1) ?? '—'} unit="μg/m³" color="#f87171" />
        <StatCard icon="🟠" label="PM2.5" value={pm25?.toFixed(1) ?? '—'} unit="μg/m³" color="#fb923c" />
        <StatCard icon="💨" label="Carbon Monoxide" value={co?.toFixed(0) ?? '—'} unit="μg/m³" color="#facc15" />
        <StatCard icon="🟡" label="Nitrogen Dioxide" value={no2?.toFixed(1) ?? '—'} unit="μg/m³" color="#a3e635" />
        <StatCard icon="🔵" label="Sulphur Dioxide" value={so2?.toFixed(1) ?? '—'} unit="μg/m³" color="#38bdf8" />
        <StatCard icon="🌫️" label="Carbon Dioxide" value={co2?.toFixed(0) ?? '—'} unit="ppm" color="#8b5cf6" />
      </div>
    </div>
  );
}
