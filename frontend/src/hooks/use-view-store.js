import { create } from 'zustand';

export const useViewStore = create((set) => ({
  view: 'kanban',
  setView: (newView) => set({ view: newView }),
}));