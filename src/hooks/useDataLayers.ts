import { useState, useEffect } from 'react';
import { useAppStore } from '@/stores/appStore';

export function useDataLayers() {
  const { activeLayers } = useAppStore();
  const [weatherData, setWeatherData] = useState<any[]>([]);
  const [newsData, setNewsData] = useState<any[]>([]);
  const [flightsData, setFlightsData] = useState<any[]>([]);
  const [economicData, setEconomicData] = useState<any[]>([]);

  useEffect(() => {
    if (activeLayers.weather && weatherData.length === 0) {
      fetch('/api/weather').then(res => res.json()).then(setWeatherData).catch(console.error);
    }
  }, [activeLayers.weather, weatherData.length]);

  useEffect(() => {
    if (activeLayers.news && newsData.length === 0) {
      fetch('/api/news').then(res => res.json()).then(setNewsData).catch(console.error);
    }
  }, [activeLayers.news, newsData.length]);

  useEffect(() => {
    if (activeLayers.flights) {
      const fetchFlights = () => fetch('/api/flights').then(res => res.json()).then(setFlightsData).catch(console.error);
      fetchFlights();
      const interval = setInterval(fetchFlights, 30000);
      return () => clearInterval(interval);
    }
  }, [activeLayers.flights]);

  useEffect(() => {
    if (activeLayers.economic && economicData.length === 0) {
      fetch('/api/economic').then(res => res.json()).then(setEconomicData).catch(console.error);
    }
  }, [activeLayers.economic, economicData.length]);

  return { weatherData, newsData, flightsData, economicData };
}
