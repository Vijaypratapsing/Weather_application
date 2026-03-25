import React, { useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import ScrollableChart from '../common/ScrollableChart';
import styles from './HourlyCharts.module.css';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'var(--bg-card)', border: '1px solid var(--border-accent)',
      borderRadius: 8, padding: '8px 12px', fontFamily: 'var(--font-mono)', fontSize: '0.72rem'
    }}>
      <div style={{ color: 'var(--text-muted)', marginBottom: 4 }}>{label}:00</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color }}>{p.name}: {typeof p.value === 'number' ? p.value.toFixed(1) : p.value}</div>
      ))}
    </div>
  );
};

export default function HourlyCharts({ weather, air }) {
  const [tempUnit, setTempUnit] = useState('C');

  const hourly = weather?.hourly;
  const airHourly = air?.hourly;

  if (!hourly) return null;

  const hours = hourly.time?.map(t => parseInt(t.split('T')[1])) ?? [];

  const toF = (c) => c != null ? (c * 9/5 + 32) : null;
  const tempValues = hourly.temperature_2m?.map(t => tempUnit === 'C' ? t : (t != null ? parseFloat(toF(t).toFixed(1)) : null));

  const buildData = (xArr, ...valArrs) =>
    xArr.map((x, i) => {
      const obj = { hour: x };
      valArrs.forEach(([key, arr]) => { obj[key] = arr?.[i] ?? null; });
      return obj;
    });

  const tempData    = buildData(hours, ['Temperature', tempValues]);
  const humidData   = buildData(hours, ['Humidity', hourly.relativehumidity_2m]);
  const precipData  = buildData(hours, ['Precipitation', hourly.precipitation]);
  const visData     = buildData(hours, ['Visibility', hourly.visibility?.map(v => v != null ? (v / 1000).toFixed(2) : null)]);
  const windData    = buildData(hours, ['Wind Speed', hourly.windspeed_10m]);
  const pm10Data    = buildData(hours, ['PM10', airHourly?.pm10], ['PM2.5', airHourly?.pm2_5]);

  const axisStyle = { fontFamily: 'var(--font-mono)', fontSize: '0.62rem', fill: '#4a6080' };
  const gridProps = { stroke: 'rgba(0,0,0,0.06)', strokeDasharray: '3 3' };

  return (
    <div className={styles.container}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Hourly Breakdown</h2>
        <div className={styles.toggleGroup}>
          <button
            className={`${styles.toggle} ${tempUnit === 'C' ? styles.toggleActive : ''}`}
            onClick={() => setTempUnit('C')}
          >°C</button>
          <button
            className={`${styles.toggle} ${tempUnit === 'F' ? styles.toggleActive : ''}`}
            onClick={() => setTempUnit('F')}
          >°F</button>
        </div>
      </div>

      {/* Temperature */}
      <ScrollableChart title={`Temperature (°${tempUnit})`} dataLength={hours.length}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={tempData}>
            <defs>
              <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#38bdf8" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid {...gridProps}/>
            <XAxis dataKey="hour" tick={axisStyle} tickFormatter={v => `${v}h`}/>
            <YAxis tick={axisStyle} unit={`°${tempUnit}`} width={45}/>
            <Tooltip content={<CustomTooltip />}/>
            <Area type="monotone" dataKey="Temperature" stroke="#38bdf8" fill="url(#tempGrad)" strokeWidth={2} dot={false}/>
          </AreaChart>
        </ResponsiveContainer>
      </ScrollableChart>

      {/* Relative Humidity */}
      <ScrollableChart title="Relative Humidity (%)" dataLength={hours.length}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={humidData}>
            <defs>
              <linearGradient id="humidGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#818cf8" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid {...gridProps}/>
            <XAxis dataKey="hour" tick={axisStyle} tickFormatter={v => `${v}h`}/>
            <YAxis tick={axisStyle} unit="%" domain={[0,100]} width={40}/>
            <Tooltip content={<CustomTooltip />}/>
            <Area type="monotone" dataKey="Humidity" stroke="#818cf8" fill="url(#humidGrad)" strokeWidth={2} dot={false}/>
          </AreaChart>
        </ResponsiveContainer>
      </ScrollableChart>

      {/* Precipitation */}
      <ScrollableChart title="Precipitation (mm)" dataLength={hours.length}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={precipData}>
            <CartesianGrid {...gridProps}/>
            <XAxis dataKey="hour" tick={axisStyle} tickFormatter={v => `${v}h`}/>
            <YAxis tick={axisStyle} unit="mm" width={40}/>
            <Tooltip content={<CustomTooltip />}/>
            <Bar dataKey="Precipitation" fill="#6366f1" radius={[3,3,0,0]}/>
          </BarChart>
        </ResponsiveContainer>
      </ScrollableChart>

      {/* Visibility */}
      <ScrollableChart title="Visibility (km)" dataLength={hours.length}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={visData}>
            <CartesianGrid {...gridProps}/>
            <XAxis dataKey="hour" tick={axisStyle} tickFormatter={v => `${v}h`}/>
            <YAxis tick={axisStyle} unit="km" width={40}/>
            <Tooltip content={<CustomTooltip />}/>
            <Line type="monotone" dataKey="Visibility" stroke="#34d399" strokeWidth={2} dot={false}/>
          </LineChart>
        </ResponsiveContainer>
      </ScrollableChart>

      {/* Wind Speed */}
      <ScrollableChart title="Wind Speed @ 10m (km/h)" dataLength={hours.length}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={windData}>
            <defs>
              <linearGradient id="windGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#34d399" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#34d399" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid {...gridProps}/>
            <XAxis dataKey="hour" tick={axisStyle} tickFormatter={v => `${v}h`}/>
            <YAxis tick={axisStyle} unit=" km/h" width={55}/>
            <Tooltip content={<CustomTooltip />}/>
            <Area type="monotone" dataKey="Wind Speed" stroke="#34d399" fill="url(#windGrad)" strokeWidth={2} dot={false}/>
          </AreaChart>
        </ResponsiveContainer>
      </ScrollableChart>

      {/* PM10 & PM2.5 combined */}
      <ScrollableChart title="Particulate Matter PM10 & PM2.5 (μg/m³)" dataLength={hours.length}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={pm10Data}>
            <CartesianGrid {...gridProps}/>
            <XAxis dataKey="hour" tick={axisStyle} tickFormatter={v => `${v}h`}/>
            <YAxis tick={axisStyle} unit=" μg" width={50}/>
            <Tooltip content={<CustomTooltip />}/>
            <Legend wrapperStyle={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', paddingTop: '4px' }}/>
            <Line type="monotone" dataKey="PM10" stroke="#f87171" strokeWidth={2} dot={false}/>
            <Line type="monotone" dataKey="PM2.5" stroke="#fb923c" strokeWidth={2} dot={false}/>
          </LineChart>
        </ResponsiveContainer>
      </ScrollableChart>
    </div>
  );
}
