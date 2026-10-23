import { create } from 'zustand';

/**
 * État partagé de la carte. La carte écrit la zone cliquée, les autres écrans la lisent :
 * panneau de détail (#60), couches (#68), navigation temporelle (#62).
 */
export interface MapState {
  /** Index H3 de la zone sélectionnée, `null` quand rien n'est sélectionné. */
  selectedZoneId: string | null;
  selectZone: (zoneId: string) => void;
  clearSelection: () => void;
}

export const useMapStore = create<MapState>()((set) => ({
  selectedZoneId: null,
  selectZone: (zoneId) => set({ selectedZoneId: zoneId }),
  clearSelection: () => set({ selectedZoneId: null }),
}));
