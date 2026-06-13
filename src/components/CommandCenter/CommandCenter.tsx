'use client';

import { useAppStore } from '@/stores/appStore';
import { useDataLayers } from '@/hooks/useDataLayers';
import { Activity, Clock, CloudRain, DollarSign, Newspaper, ShieldAlert } from 'lucide-react';
import clsx from 'clsx';
import { useEffect, useState } from 'react';

export default function CommandCenter() {
  const { viewMode, systemMetrics, simulationEvents } = useAppStore();
  const { weatherData, newsData, economicData } = useDataLayers();
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateTime = () => setTime(new Date().toISOString().split('T')[1].substring(0, 8));
    updateTime();
    const int = setInterval(updateTime, 1000);
    return () => clearInterval(int);
  }, []);

  if (viewMode !== 'command_center') return null;

  return (
    <div className="absolute inset-0 z-30 bg-[#030712]/90 backdrop-blur-md p-6 pointer-events-auto flex flex-col">
      <header className="flex justify-between items-center mb-6 pb-4 border-b border-sky-500/20">
        <div className="flex items-center gap-4">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
          <h1 className="text-2xl font-heading text-sky-400 uppercase tracking-widest">Global Intelligence</h1>
        </div>
        <div className="flex items-center gap-6 font-mono text-sm text-sky-200/60">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">EVENTS/SEC:</span>
            <span className="text-sky-400 font-bold">{systemMetrics.events_per_sec || 0}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-400">ACTIVE NODES:</span>
            <span className="text-sky-400 font-bold">{systemMetrics.active_nodes || 0}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={16} />
            <span>{time} UTC</span>
          </div>
          <div className="flex items-center gap-2 text-emerald-400">
            <Activity size={16} />
            <span>SYS.ONLINE</span>
          </div>
        </div>
      </header>

      <div className="flex-1 grid grid-cols-12 grid-rows-6 gap-6">
        {/* Main Display - left side */}
        <div className="col-span-8 row-span-6 glass-panel rounded-2xl relative overflow-hidden flex flex-col p-6 border-sky-500/20">
          <div className="scanline" />
          <h2 className="text-sky-500/40 font-heading text-lg uppercase tracking-[0.2em] font-bold z-10 border-b border-sky-500/20 pb-2 mb-4">Simulation & Event Stream</h2>
          
          <div className="flex-1 overflow-y-auto flex flex-col gap-4 z-10 custom-scrollbar pr-2">
            {simulationEvents.length > 0 ? (
              simulationEvents.map((evt, i) => (
                <div key={i} className={clsx(
                  "p-4 rounded-xl border bg-slate-900/60 backdrop-blur flex flex-col gap-2 transition-all",
                  evt.severity === 'CRITICAL' ? 'border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.2)]' :
                  evt.severity === 'HIGH' ? 'border-orange-500/50' : 'border-sky-500/30'
                )}>
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className={clsx(
                      "px-2 py-1 rounded",
                      evt.severity === 'CRITICAL' ? 'bg-red-500/20 text-red-400' :
                      evt.severity === 'HIGH' ? 'bg-orange-500/20 text-orange-400' : 'bg-sky-500/20 text-sky-400'
                    )}>{evt.category.toUpperCase()} // {evt.severity}</span>
                    <span className="text-slate-500">LAT: {evt.lat.toFixed(3)} LNG: {evt.lng.toFixed(3)}</span>
                  </div>
                  <p className="text-sm text-slate-200 mt-1">{evt.effect}</p>
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-sky-500/20">
                <ShieldAlert size={48} className="mb-4 opacity-50" />
                <h3 className="font-heading text-2xl uppercase tracking-[0.5em] font-bold">Awaiting Input</h3>
                <p className="font-mono mt-2">Use Copilot to initiate scenario simulations</p>
              </div>
            )}
          </div>
        </div>

        {/* Right side panels */}
        <div className="col-span-4 row-span-2 glass-panel rounded-2xl p-4 flex flex-col gap-3 border-purple-500/20">
          <div className="flex items-center gap-2 text-purple-400 border-b border-purple-500/20 pb-2 mb-2">
            <Newspaper size={18} />
            <h3 className="font-heading uppercase tracking-wider text-sm">Live Alerts Feed</h3>
          </div>
          <div className="flex-1 overflow-y-auto flex flex-col gap-2 font-mono text-xs pr-2">
            {newsData.length > 0 ? newsData.slice(0, 8).map((news, i) => (
              <div key={i} className="bg-slate-800/50 p-2 rounded border-l-2 border-purple-500 truncate text-slate-300">
                <span className="text-purple-400 mr-2">[{news.domain}]</span>
                {news.name}
              </div>
            )) : <div className="text-slate-500 animate-pulse">Awaiting signal...</div>}
          </div>
        </div>

        <div className="col-span-4 row-span-2 glass-panel rounded-2xl p-4 flex flex-col gap-3 border-emerald-500/20">
          <div className="flex items-center gap-2 text-emerald-400 border-b border-emerald-500/20 pb-2 mb-2">
            <DollarSign size={18} />
            <h3 className="font-heading uppercase tracking-wider text-sm">Economic Indicators</h3>
          </div>
          <div className="flex-1 overflow-y-auto flex flex-col gap-3">
            {economicData.length > 0 ? economicData.slice(0, 5).map((econ, i) => (
              <div key={i} className="flex justify-between items-center text-sm">
                <span className="text-slate-400">{econ.countryName}</span>
                <span className="font-mono text-emerald-400">${(econ.gdp / 1e9).toFixed(1)}B</span>
              </div>
            )) : <div className="text-slate-500 animate-pulse">Loading econometric models...</div>}
          </div>
        </div>

        <div className="col-span-4 row-span-2 glass-panel rounded-2xl p-4 flex flex-col gap-3 border-blue-500/20">
          <div className="flex items-center gap-2 text-blue-400 border-b border-blue-500/20 pb-2 mb-2">
            <CloudRain size={18} />
            <h3 className="font-heading uppercase tracking-wider text-sm">Regional Weather</h3>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
             {weatherData.length > 0 ? weatherData.slice(0, 8).map((w, i) => (
               <div key={i} className="bg-slate-800/50 p-2 rounded flex justify-between items-center">
                 <span className="text-slate-400 text-xs">{w.name}</span>
                 <span className={clsx("font-mono text-xs", w.temp > 30 ? 'text-red-400' : 'text-blue-400')}>{w.temp}°C</span>
               </div>
             )) : <div className="text-slate-500 animate-pulse col-span-2">Syncing satellite telemetry...</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
