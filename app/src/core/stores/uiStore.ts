/**
 * Zustand store for UI state
 * Manages overlays, panels, and navigation within the room scene
 */

import { create } from 'zustand';

type PanelType = 'add' | 'settings' | 'gardens' | null;

interface UIState {
  // Plant closeup
  selectedFriendId: string | null;

  // Side panels
  activePanel: PanelType;

  // Actions
  openPlantCloseup: (friendId: string) => void;
  closePlantCloseup: () => void;
  openPanel: (panel: PanelType) => void;
  closePanel: () => void;
  closeAll: () => void;
}

export const useUIStore = create<UIState>()((set) => ({
  selectedFriendId: null,
  activePanel: null,

  openPlantCloseup: (friendId) => {
    set({ selectedFriendId: friendId, activePanel: null });
  },

  closePlantCloseup: () => {
    set({ selectedFriendId: null });
  },

  openPanel: (panel) => {
    set({ activePanel: panel, selectedFriendId: null });
  },

  closePanel: () => {
    set({ activePanel: null });
  },

  closeAll: () => {
    set({ selectedFriendId: null, activePanel: null });
  },
}));
