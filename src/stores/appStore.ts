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
  setViewMode: (mode: 'globe' | 'command_center' | 'narrative') => void;
  toggleLayer: (layer: keyof AppState['activeLayers']) => void;
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
  setViewMode: (mode) => set({ viewMode: mode }),
  toggleLayer: (layer) => set((state) => ({
    activeLayers: { ...state.activeLayers, [layer]: !state.activeLayers[layer] }
  })),
}));
