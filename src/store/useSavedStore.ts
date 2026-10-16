import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SavedState {
  savedIds: string[];
  toggleSave: (id: string) => void;
  isSaved: (id: string) => boolean;
  clearAllSaved: () => void;
}

export const useSavedStore = create<SavedState>()(
  persist(
    (set, get) => ({
      // เก็บเฉพาะ Array ของ ID ตามกฎ Non-Functional Requirement
      savedIds: [],

      toggleSave: (id: string) => {
        const currentSaved = get().savedIds;
        if (currentSaved.includes(id)) {
          set({ savedIds: currentSaved.filter((itemKey) => itemKey !== id) });
        } else {
          set({ savedIds: [...currentSaved, id] });
        }
      },

      isSaved: (id: string) => {
        return get().savedIds.includes(id);
      },

      clearAllSaved: () => {
        set({ savedIds: [] });
      },
    }),
    {
      name: 'findit-saved-items', // บันทึกลง localStorage ภายใต้คีย์นี้
    }
  )
);