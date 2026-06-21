import { create } from 'zustand';
import { supabase } from '@/lib/supabase';

export interface Memory {
  id: string;
  image_data: string; // base64 data URL
  caption: string;
  date: string; // display date e.g. "14 Feb 2023"
  rotation: number;
  created_at?: string;
}

interface MemoryState {
  memories: Memory[];
  setMemories: (memories: Memory[]) => void;
  fetchMemories: () => Promise<void>;
  addMemory: (memory: Omit<Memory, 'id' | 'created_at' | 'rotation'>) => Promise<void>;
  deleteMemory: (id: string) => Promise<void>;
  updateCaption: (id: string, caption: string) => Promise<void>;
}

const rotations = [-3, 2, -1, 3, -2, 1];

export const useMemoryStore = create<MemoryState>((set, get) => ({
  memories: [],

  setMemories: (memories) => set({ memories }),

  fetchMemories: async () => {
    const { data, error } = await supabase
      .from('memories')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching memories:', error);
      return;
    }
    if (data) {
      set({ memories: data as Memory[] });
    }
  },

  addMemory: async (memoryData) => {
    const idx = get().memories.length % rotations.length;
    
    // Optimistic
    const tempId = crypto.randomUUID();
    const newMemory: Memory = {
      ...memoryData,
      id: tempId,
      rotation: rotations[idx],
      created_at: new Date().toISOString(),
    };
    set((state) => ({ memories: [...state.memories, newMemory] }));

    // Sync
    const { error } = await supabase.from('memories').insert([
      {
        image_data: memoryData.image_data,
        caption: memoryData.caption,
        date: memoryData.date,
        rotation: rotations[idx],
      }
    ]);
    if (error) console.error("Error adding memory:", error);
    else get().fetchMemories(); // Refresh to get real ID
  },

  deleteMemory: async (id) => {
    // Optimistic
    set((state) => ({
      memories: state.memories.filter((m) => m.id !== id),
    }));

    const { error } = await supabase.from('memories').delete().eq('id', id);
    if (error) console.error("Error deleting memory:", error);
  },

  updateCaption: async (id, caption) => {
    // Optimistic
    set((state) => ({
      memories: state.memories.map((m) => m.id === id ? { ...m, caption } : m),
    }));

    const { error } = await supabase.from('memories').update({ caption }).eq('id', id);
    if (error) console.error("Error updating caption:", error);
  },
}));
