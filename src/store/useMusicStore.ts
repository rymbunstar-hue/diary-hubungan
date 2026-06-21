import { create } from 'zustand';

interface MusicState {
  isPlaying: boolean;
  isMuted: boolean;
  playMusic: () => void;
  pauseMusic: () => void;
  toggleMusic: () => void;
  toggleMute: () => void;
}

export const useMusicStore = create<MusicState>((set) => ({
  isPlaying: false,
  isMuted: false,
  playMusic: () => set({ isPlaying: true }),
  pauseMusic: () => set({ isPlaying: false }),
  toggleMusic: () => set((state) => ({ isPlaying: !state.isPlaying })),
  toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
}));
