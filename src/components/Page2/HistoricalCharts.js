import React from 'react';
import {
  ComposedChart, Line, Bar, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import ScrollableChart from '../common/ScrollableChart';
import { windDirectionLabel, toIST } from '../../services/weatherApi';
import dayjs from 'dayjs';
import styles from './HistoricalCharts.module.css';

const axisStyle = { fontFamily: 'var(--font-mono)', fontSize: '0.58rem', fill: '#4a6080' };
const gridProps = { stroke: 'rgba(0,0,0,0.06)', strokeDasharray: '3 3' };

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className={styles.tooltip}>
      <div className={styles.tooltipLabel}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color }}>
          {p.name}: {typeof p.value === 'number' ? p.value.toFixed(1) : p.value}
          {p.payload.Direction && p.name === 'Max Wind' ? ` (${p.payload.Direction})` : ''}
        </div>
      ))}
    </div>
  );
};

export default function HistoricalCharts({ data }) {
  const daily = data?.weather?.daily;
  const pm10  = data?.pm10;
  const pm25  = data?.pm25;

  if (!daily) return null;

  const dates = daily.time ?? [];
  const fmt = (d) => dayjs(d).format('MMM D');
  const n = dates.length;

  // Determine tick interval based on data length for readability
  const interval = n > 365 ? 29 : n > 90 ? 6 : n > 30 ? 2 : 0;

  // 1. Temperature
  const tempData = dates.map((d, i) => ({
    date: fmt(d),
    Max: daily.temperature_2m_max?.[i],
    Min: daily.temperature_2m_min?.[i],
    Mean: daily.temperature_2m_mean?.[i],
  }));

  // 2. Sunrise / Sunset (as minutes since midnight for chart, label as IST)
  const parseTime = (iso) => {
    if (!iso) return null;
    const d = dayjs(iso);
    return d.hour() + d.minute() / 60;
  };
  const fmtTime = (hrs) => {
    if (hrs == null) return '';
    const h = Math.floor(hrs);
    const m = Math.round((hrs - h) * 60);
    const period = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return `${h12}:${String(m).padStart(2,'0')} ${period}`;
  };
  const sunData = dates.map((d, i) => ({
    date: fmt(d),
    Sunrise: parseTime(daily.sunrise?.[i]),
    Sunset: parseTime(daily.sunset?.[i]),
  }));

  // 3. Precipitation
  const precipData = dates.map((d, i) => ({
    date: fmt(d),
    Precipitation: daily.precipitation_sum?.[i],
  }));

  // 4. Wind
  const windData = dates.map((d, i) => ({
    date: fmt(d),
    'Max Wind': daily.windspeed_10m_max?.[i],
    Direction: windDirectionLabel(daily.winddirection_10m_dominant?.[i]),
  }));

  // 5. PM10 & PM2.5
  const pmData = dates.map((d, i) => ({
    date: fmt(d),
    PM10: pm10?.[i] != null ? parseFloat(pm10[i].toFixed(1)) : null,
    'PM2.5': pm25?.[i] != null ? parseFloat(pm25[i].toFixed(1)) : null,
  }));

  return (
    <div className={styles.chartList}>

      {/* 1. Temperature */}
      <ScrollableChart title="Mean / Max / Min Temperature (°C)" dataLength={n}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={tempData}>
            <CartesianGrid {...gridProps}/>
            <XAxis dataKey="date" tick={axisStyle} interval={interval}/>
            <YAxis tick={axisStyle} unit="°C" width={42}/>
            <Tooltip content={<CustomTooltip />}/>
            <Legend wrapperStyle={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem' }}/>
            <Area type="monotone" dataKey="Max" stroke="#f87171" fill="rgba(248,113,113,0.12)" strokeWidth={1.5} dot={false}/>
            <Line type="monotone" dataKey="Mean" stroke="#facc15" strokeWidth={2} dot={false}/>
            <Area type="monotone" dataKey="Min" stroke="#38bdf8" fill="rgba(56,189,248,0.1)" strokeWidth={1.5} dot={false}/>
          </ComposedChart>
        </ResponsiveContainer>
      </ScrollableChart>

      {/* 2. Sunrise & Sunset */}
      <ScrollableChart title="Sunrise & Sunset (IST)" dataLength={n}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={sunData}>
            <CartesianGrid {...gridProps}/>
            <XAxis dataKey="date" tick={axisStyle} interval={interval}/>
            <YAxis
              tick={axisStyle}
              domain={[4, 20]}
              tickFormatter={fmtTime}
              width={65}
              ticks={[5, 6, 7, 8, 12, 17, 18, 19]}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (!active || !payload?.length) return null;
                return (
                  <div className={styles.tooltip}>
                    <div className={styles.tooltipLabel}>{label}</div>
                    {payload.map((p, i) => (
                      <div key={i} style={{ color: p.color }}>{p.name}: {fmtTime(p.value)}</div>
                    ))}
                  </div>
                );
              }}
            />
            <Legend wrapperStyle={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem' }}/>
            <Line type="monotone" dataKey="Sunrise" stroke="#fb923c" strokeWidth={2} dot={false}/>
            <Line type="monotone" dataKey="Sunset" stroke="#a78bfa" strokeWidth={2} dot={false}/>
          </ComposedChart>
        </ResponsiveContainer>
      </ScrollableChart>

      {/* 3. Precipitation */}
      <ScrollableChart title="Daily Precipitation (mm)" dataLength={n}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={precipData}>
            <CartesianGrid {...gridProps}/>
            <XAxis dataKey="date" tick={axisStyle} interval={interval}/>
            <YAxis tick={axisStyle} unit="mm" width={42}/>
            <Tooltip content={<CustomTooltip />}/>
            <Bar dataKey="Precipitation" fill="#818cf8" radius={[2,2,0,0]} maxBarSize={8}/>
          </ComposedChart>
        </ResponsiveContainer>
      </ScrollableChart>

      {/* 4. Wind */}
      <ScrollableChart title="Max Wind Speed (km/h) & Dominant Direction" dataLength={n}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={windData}>
            <CartesianGrid {...gridProps}/>
            <XAxis dataKey="date" tick={axisStyle} interval={interval}/>
            <YAxis tick={axisStyle} unit=" km/h" width={55}/>
            <Tooltip content={<CustomTooltip />}/>
            <Legend wrapperStyle={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem' }}/>
            <Bar dataKey="Max Wind" fill="#34d399" radius={[2,2,0,0]} maxBarSize={8}/>
          </ComposedChart>
        </ResponsiveContainer>
      </ScrollableChart>

      {/* 5. PM10 & PM2.5 */}
      <ScrollableChart title="Air Quality PM10 & PM2.5 (μg/m³ — daily avg)" dataLength={n}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={pmData}>
            <CartesianGrid {...gridProps}/>
            <XAxis dataKey="date" tick={axisStyle} interval={interval}/>
            <YAxis tick={axisStyle} unit=" μg" width={48}/>
            <Tooltip content={<CustomTooltip />}/>
            <Legend wrapperStyle={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem' }}/>
            <Line type="monotone" dataKey="PM10" stroke="#f87171" strokeWidth={1.5} dot={false}/>
            <Line type="monotone" dataKey="PM2.5" stroke="#fb923c" strokeWidth={1.5} dot={false}/>
          </ComposedChart>
        </ResponsiveContainer>
      </ScrollableChart>

    </div>
  );
}
