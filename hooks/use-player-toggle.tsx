import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface usePlayerStore {
    on: boolean;
    setOn: () => void;
}

export const usePlayerSpeechToggle = create(
    persist<usePlayerStore>(
        (set, get) => ({
            on: true,
            setOn: () => {
                set({ on: !get().on });
            }
        }),
        {
            name: 'speech-player-on',
            storage: createJSONStorage(() => localStorage)
        }
    )
);