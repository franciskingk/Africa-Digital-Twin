import { create } from 'zustand';

interface AppState {
  viewMode: 'globe' | 'command_center' | 'narrative';
  activeLayers: {
    weather: boolean;
    news: boolean;
    flights: boolean;
    economic: boolean;
    population: boolean;
    conflict: boolean;
  };
  simulationEvents: any[];
  systemMetrics: any;
  setViewMode: (mode: 'globe' | 'command_center' | 'narrative') => void;
  toggleLayer: (layer: keyof AppState['activeLayers']) => void;
  addSimulationEvent: (event: any) => void;
  setSystemMetrics: (metrics: any) => void;
}

export const useAppStore = create<AppState>((set) => ({
  viewMode: 'globe',
  activeLayers: {
    weather: true,
    news: false,
    flights: false,
    economic: false,
    population: false,
    conflict: false,
  },
  simulationEvents: [],
  systemMetrics: { events_per_sec: 0, active_nodes: 0, cpu_load: 0 },
  setViewMode: (mode) => set({ viewMode: mode }),
  toggleLayer: (layer) => set((state) => ({
    activeLayers: { ...state.activeLayers, [layer]: !state.activeLayers[layer] }
  })),
  addSimulationEvent: (event) => set((state) => ({
    simulationEvents: [...state.simulationEvents, event]
  })),
  setSystemMetrics: (metrics) => set({ systemMetrics: metrics }),
}));
