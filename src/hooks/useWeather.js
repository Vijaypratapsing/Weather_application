import { useState, useEffect, useCallback } from 'react';
import { fetchDayWeather, fetchRangeWeather } from '../services/weatherApi';

const cache = new Map();

export function useDayWeather(lat, lon, date) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    if (!lat || !lon || !date) return;
    const key = `day_${lat}_${lon}_${date}`;
    if (cache.has(key)) {
      setData(cache.get(key));
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const result = await fetchDayWeather(lat, lon, date);
      cache.set(key, result);
      setData(result);
    } catch (e) {
      setError(e.message || 'Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  }, [lat, lon, date]);

  useEffect(() => { load(); }, [load]);

  return { data, loading, error, reload: load };
}

export function useRangeWeather(lat, lon, startDate, endDate) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    if (!lat || !lon || !startDate || !endDate) return;
    const key = `range_${lat}_${lon}_${startDate}_${endDate}`;
    if (cache.has(key)) {
      setData(cache.get(key));
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const result = await fetchRangeWeather(lat, lon, startDate, endDate);
      cache.set(key, result);
      setData(result);
    } catch (e) {
      setError(e.message || 'Failed to fetch historical data');
    } finally {
      setLoading(false);
    }
  }, [lat, lon, startDate, endDate]);

  useEffect(() => { load(); }, [load]);

  return { data, loading, error, reload: load };
}
//Done