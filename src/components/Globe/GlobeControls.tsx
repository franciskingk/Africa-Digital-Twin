'use client';

import { useAppStore } from '@/stores/appStore';
import { CloudRain, Newspaper, Plane, DollarSign, Users, ShieldAlert, MonitorPlay, Globe } from 'lucide-react';
import clsx from 'clsx';

export default function GlobeControls() {
  const { activeLayers, toggleLayer, viewMode, setViewMode } = useAppStore();

  const layers = [
    { id: 'weather', icon: CloudRain, label: 'Weather', color: 'text-blue-400' },
    { id: 'news', icon: Newspaper, label: 'News Events', color: 'text-purple-400' },
    { id: 'flights', icon: Plane, label: 'Aviation', color: 'text-sky-300' },
    { id: 'economic', icon: DollarSign, label: 'Economics', color: 'text-emerald-400' },
    { id: 'population', icon: Users, label: 'Population', color: 'text-amber-400' },
    { id: 'conflict', icon: ShieldAlert, label: 'Conflict', color: 'text-red-500' },
  ] as const;

  return (
    <div className="absolute bottom-8 left-8 flex flex-col gap-4 z-40">
      <div className="glass-panel p-2 rounded-2xl flex flex-col gap-2 pointer-events-auto">
        {layers.map(({ id, icon: Icon, label, color }) => {
          const isActive = activeLayers[id as keyof typeof activeLayers];
          return (
            <button
              key={id}
              onClick={() => toggleLayer(id as keyof typeof activeLayers)}
              className={clsx(
                "group relative flex items-center gap-3 px-4 py-2 rounded-xl transition-all duration-300",
                isActive ? "bg-slate-800/80 glass-glow" : "hover:bg-slate-800/40"
              )}
              title={label}
            >
              <Icon size={20} className={clsx("transition-colors duration-300", isActive ? color : "text-slate-400")} />
              <span className={clsx(
                "text-sm font-medium transition-colors duration-300",
                isActive ? "text-slate-100" : "text-slate-400"
              )}>
                {label}
              </span>
            </button>
          );
        })}
      </div>

      <div className="glass-panel p-2 rounded-2xl flex gap-2 pointer-events-auto">
        <button
          onClick={() => setViewMode('globe')}
          className={clsx(
            "p-3 rounded-xl transition-all",
            viewMode === 'globe' ? "bg-slate-800/80 text-[#38bdf8] glass-glow" : "text-slate-400 hover:bg-slate-800/40"
          )}
          title="Globe Mode"
        >
          <Globe size={20} />
        </button>
        <button
          onClick={() => setViewMode('command_center')}
          className={clsx(
            "p-3 rounded-xl transition-all",
            viewMode === 'command_center' ? "bg-slate-800/80 text-[#38bdf8] glass-glow" : "text-slate-400 hover:bg-slate-800/40"
          )}
          title="Command Center"
        >
          <MonitorPlay size={20} />
        </button>
      </div>
    </div>
  );
}
