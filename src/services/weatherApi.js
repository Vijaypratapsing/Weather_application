import axios from 'axios';

const BASE_URL = 'https://api.open-meteo.com/v1';
const AIR_URL = 'https://air-quality-api.open-meteo.com/v1';
const ARCHIVE_URL = 'https://archive-api.open-meteo.com/v1';

/**
 * Fetch current + hourly weather for a single date
 */
export async function fetchDayWeather(lat, lon, date) {
  const dateStr = date; // "YYYY-MM-DD"

  const [weatherRes, airRes] = await Promise.all([
    axios.get(`${BASE_URL}/forecast`, {
      params: {
        latitude: lat,
        longitude: lon,
        start_date: dateStr,
        end_date: dateStr,
        daily: [
          'temperature_2m_max',
          'temperature_2m_min',
          'precipitation_sum',
          'sunrise',
          'sunset',
          'windspeed_10m_max',
          'uv_index_max',
          'precipitation_probability_max',
        ].join(','),
        hourly: [
          'temperature_2m',
          'relativehumidity_2m',
          'precipitation',
          'visibility',
          'windspeed_10m',
          'weathercode',
        ].join(','),
        current_weather: true,
        timezone: 'auto',
      },
    }),
    axios.get(`${AIR_URL}/air-quality`, {
      params: {
        latitude: lat,
        longitude: lon,
        start_date: dateStr,
        end_date: dateStr,
        hourly: [
          'pm10',
          'pm2_5',
          'carbon_monoxide',
          'nitrogen_dioxide',
          'sulphur_dioxide',
          'carbon_dioxide',
          'european_aqi',
        ].join(','),
        timezone: 'auto',
      },
    }),
  ]);

  return {
    weather: weatherRes.data,
    air: airRes.data,
  };
}

/**
 * Fetch historical range data (up to 2 years)
 */
export async function fetchRangeWeather(lat, lon, startDate, endDate) {
  const [weatherRes, airRes] = await Promise.all([
    axios.get(`${ARCHIVE_URL}/archive`, {
      params: {
        latitude: lat,
        longitude: lon,
        start_date: startDate,
        end_date: endDate,
        daily: [
          'temperature_2m_max',
          'temperature_2m_min',
          'temperature_2m_mean',
          'sunrise',
          'sunset',
          'precipitation_sum',
          'windspeed_10m_max',
          'winddirection_10m_dominant',
        ].join(','),
        timezone: 'auto',
      },
    }),
    axios.get(`${AIR_URL}/air-quality`, {
      params: {
        latitude: lat,
        longitude: lon,
        start_date: startDate,
        end_date: endDate,
        hourly: ['pm10', 'pm2_5'].join(','),
        timezone: 'auto',
      },
    }),
  ]);

  // Use a more efficient pre-grouping strategy for aggregation (O(N) instead of O(Days * Hours))
  const airHourly = airRes.data.hourly;
  const dates = weatherRes.data.daily.time;
  const pm10Daily = [];
  const pm25Daily = [];

  const airIndicesByDate = {};
  airHourly.time.forEach((time, index) => {
    const datePart = time.split('T')[0];
    if (!airIndicesByDate[datePart]) airIndicesByDate[datePart] = [];
    airIndicesByDate[datePart].push(index);
  });

  dates.forEach((date) => {
    const indices = airIndicesByDate[date] || [];

    const avg = (arr, idxs) => {
      const vals = idxs.map((i) => arr[i]).filter((v) => v !== null);
      return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : null;
    };

    pm10Daily.push(avg(airHourly.pm10, indices));
    pm25Daily.push(avg(airHourly.pm2_5, indices));
  });

  return {
    weather: weatherRes.data,
    pm10: pm10Daily,
    pm25: pm25Daily,
  };
}

/**
 * Get wind direction label from degrees
 */
export function windDirectionLabel(degrees) {
  if (degrees === null || degrees === undefined) return 'N/A';
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  return dirs[Math.round(degrees / 45) % 8];
}

/**
 * Convert UTC sunrise/sunset to IST string
 */
export function toIST(isoString) {
  if (!isoString) return 'N/A';
  const date = new Date(isoString);
  return date.toLocaleTimeString('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

/**
 * Get AQI label from numeric value
 */
export function aqiLabel(aqi) {
  if (aqi === null || aqi === undefined) return { label: 'N/A', color: '#64748b' };
  if (aqi <= 50)  return { label: 'Good', color: '#16a34a' };
  if (aqi <= 100) return { label: 'Fair', color: '#84cc16' };
  if (aqi <= 150) return { label: 'Moderate', color: '#ca8a04' };
  if (aqi <= 200) return { label: 'Poor', color: '#ea580c' };
  if (aqi <= 300) return { label: 'Very Poor', color: '#dc2626' };
  return { label: 'Hazardous', color: '#9d174d' };
}

/**
 * Weather code to description
 */
export function weatherCodeDesc(code) {
  const map = {
    0: 'Clear Sky', 1: 'Mainly Clear', 2: 'Partly Cloudy', 3: 'Overcast',
    45: 'Foggy', 48: 'Icy Fog',
    51: 'Light Drizzle', 53: 'Drizzle', 55: 'Heavy Drizzle',
    61: 'Light Rain', 63: 'Rain', 65: 'Heavy Rain',
    71: 'Light Snow', 73: 'Snow', 75: 'Heavy Snow',
    80: 'Light Showers', 81: 'Showers', 82: 'Heavy Showers',
    95: 'Thunderstorm', 96: 'Thunderstorm w/ Hail', 99: 'Severe Thunderstorm',
  };
  return map[code] || 'Unknown';
}
