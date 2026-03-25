import { useState, useEffect } from 'react';

export function useLocation() {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
        });
        setLoading(false);
      },
      (err) => {
        // Fallback to Mumbai if denied
        console.warn('GPS denied, using default location:', err.message);
        setLocation({ lat: 19.076, lon: 72.8777 });
        setError('Location access denied. Showing Mumbai by default.');
        setLoading(false);
      },
      { timeout: 8000, maximumAge: 300000 }
    );
  }, []);

  return { location, error, loading };
}
//Done