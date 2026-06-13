'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import Globe from 'react-globe.gl';
import { useDataLayers } from '@/hooks/useDataLayers';
import { useAppStore } from '@/stores/appStore';

export default function AfricaGlobe() {
  const globeRef = useRef<any>();
  const [globeReady, setGlobeReady] = useState(false);
  const { activeLayers, simulationEvents } = useAppStore();
  const { weatherData, newsData, flightsData } = useDataLayers();

  useEffect(() => {
    if (globeRef.current && globeReady) {
      globeRef.current.pointOfView({ lat: 0, lng: 20, altitude: 2.0 }, 2000);
      const controls = globeRef.current.controls();
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.5;
    }
  }, [globeReady]);

  const arcsData = useMemo(() => {
    if (!activeLayers.flights) return [];
    return flightsData.map(f => ({
      startLat: f.lat,
      startLng: f.lng,
      endLat: f.lat + (Math.cos((f.heading - 90) * Math.PI / 180) * 0.5),
      endLng: f.lng + (Math.sin((f.heading - 90) * Math.PI / 180) * 0.5),
      color: '#38bdf8',
      altitude: f.altitude ? f.altitude / 100000 : 0.1,
    }));
  }, [activeLayers.flights, flightsData]);

  const hexBinData = useMemo(() => {
    if (!activeLayers.weather) return [];
    return weatherData.map(w => ({
      lat: w.lat,
      lng: w.lng,
      weight: w.temp,
      color: w.temp > 30 ? '#ef4444' : w.temp > 20 ? '#f59e0b' : '#38bdf8'
    }));
  }, [activeLayers.weather, weatherData]);

  const pointsData = useMemo(() => {
    if (!activeLayers.news) return [];
    return newsData.map(n => ({
      lat: n.lat,
      lng: n.lng,
      size: 0.5,
      color: '#a855f7',
      name: n.name
    }));
  }, [activeLayers.news, newsData]);

  const ringsData = useMemo(() => {
    return simulationEvents.map((evt: any) => ({
      lat: evt.lat,
      lng: evt.lng,
      maxR: evt.severity === 'CRITICAL' ? 5 : 3,
      propagationSpeed: evt.severity === 'CRITICAL' ? 2 : 1,
      repeatPeriod: 800,
      color: evt.severity === 'CRITICAL' ? '#ef4444' : '#f59e0b'
    }));
  }, [simulationEvents]);

  return (
    <div className="absolute inset-0 cursor-move">
      {typeof window !== 'undefined' && (
        <Globe
          ref={globeRef}
          globeImageUrl="/textures/earth_day.jpg"
          bumpImageUrl="/textures/earth_bump.png"
          backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
          animateIn={true}
          onGlobeReady={() => setGlobeReady(true)}
          atmosphereColor="#38bdf8"
          atmosphereAltitude={0.15}
          
          arcsData={arcsData}
          arcColor="color"
          arcDashLength={0.4}
          arcDashGap={0.2}
          arcDashAnimateTime={1500}
          arcAltitude="altitude"
          
          hexBinPointsData={hexBinData}
          hexBinPointWeight="weight"
          hexBinResolution={4}
          hexMargin={0.2}
          hexTopColor={(d: any) => d.points[0].color}
          hexSideColor={(d: any) => d.points[0].color}
          hexAltitude={(d: any) => d.sumWeight / 1000}
          
          pointsData={pointsData}
          pointColor="color"
          pointAltitude={0.05}
          pointRadius="size"
          pointLabel="name"

          ringsData={ringsData}
          ringColor="color"
          ringMaxRadius="maxR"
          ringPropagationSpeed="propagationSpeed"
          ringRepeatPeriod="repeatPeriod"
        />
      )}
    </div>
  );
}
