import { create } from 'zustand';
import { differenceInDays } from 'date-fns';
import { supabase } from '@/lib/supabase';

export type IncidentScale = 'Sedikit' | 'Lumayan' | 'Parah';
export type IncidentStatus = 'Masih Ngambek' | 'Sudah Baikan';

export interface Incident {
  id: string;
  who: 'Dea' | 'Rymbun';
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  reason: string;
  scale: IncidentScale;
  notes?: string;
  status: IncidentStatus;
  created_at?: string; // ISO string from DB
  resolved_at?: string | null; // ISO string from DB
}

interface MoodState {
  relationshipStartDate: string; // ISO string
  incidents: Incident[];
  setIncidents: (incidents: Incident[]) => void;
  fetchIncidents: () => Promise<void>;
  subscribeToIncidents: () => () => void;
  addIncident: (incident: Omit<Incident, 'id' | 'status' | 'created_at' | 'resolved_at'>) => Promise<void>;
  resolveIncident: (id: string) => Promise<void>;
  getMoodPercentage: () => number;
  hasUnresolvedIncident: () => boolean;
  getUnresolvedIncident: () => Incident | undefined;
}

export const useMoodStore = create<MoodState>((set, get) => ({
  // Hardcoded to 27 Agustus 2022 (approx 1394 days from mid-2026)
  relationshipStartDate: "2022-08-27T00:00:00.000Z",
  incidents: [],

  setIncidents: (incidents) => set({ incidents }),

  fetchIncidents: async () => {
    const { data, error } = await supabase
      .from('incidents')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching incidents:', error);
      return;
    }
    if (data) {
      set({ incidents: data as Incident[] });
    }
  },

  subscribeToIncidents: () => {
    console.log("Subscribing to Supabase Realtime...");
    const subscription = supabase
      .channel('public:incidents')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'incidents' },
        (payload) => {
          console.log("REALTIME UPDATE RECEIVED!", payload);
          // Re-fetch all incidents whenever there's a change
          // to ensure correct ordering and simplicity
          get().fetchIncidents();
        }
      )
      .subscribe((status) => {
        console.log("Realtime subscription status:", status);
      });
      
    return () => {
      supabase.removeChannel(subscription);
    };
  },

  addIncident: async (incidentData) => {
    // Optimistic update locally
    const tempId = crypto.randomUUID();
    const newIncident: Incident = {
      ...incidentData,
      id: tempId,
      status: 'Masih Ngambek',
      created_at: new Date().toISOString(),
    };
    set((state) => ({ incidents: [newIncident, ...state.incidents] }));

    // Send to Supabase
    const { error } = await supabase.from('incidents').insert([
      {
        id: tempId,
        who: incidentData.who,
        date: incidentData.date,
        time: incidentData.time,
        reason: incidentData.reason,
        scale: incidentData.scale,
        notes: incidentData.notes,
        status: 'Masih Ngambek',
      }
    ]);
    if (error) console.error("Error adding incident:", error);
  },

  resolveIncident: async (id) => {
    // Optimistic update
    set((state) => ({
      incidents: state.incidents.map((incident) =>
        incident.id === id
          ? { ...incident, status: 'Sudah Baikan', resolved_at: new Date().toISOString() }
          : incident
      ),
    }));

    // Update Supabase
    const { error } = await supabase
      .from('incidents')
      .update({ status: 'Sudah Baikan', resolved_at: new Date().toISOString() })
      .eq('id', id);

    if (error) console.error("Error resolving incident:", error);
  },

  getMoodPercentage: () => {
    const state = get();
    if (state.incidents.length === 0) return 100;

    const unresolved = state.incidents.filter((i) => i.status === 'Masih Ngambek');
    if (unresolved.length > 0) {
      const latest = unresolved[0];
      if (latest.scale === 'Parah') return 30;
      if (latest.scale === 'Lumayan') return 50;
      return 70;
    }

    const lastIncident = state.incidents[0];
    if (!lastIncident || !lastIncident.resolved_at) return 100;
    
    const daysSinceResolved = differenceInDays(new Date(), new Date(lastIncident.resolved_at));
    const recoveryDays = 7; 
    if (daysSinceResolved >= recoveryDays) return 100;

    return Math.min(100, 85 + Math.floor((15 / recoveryDays) * daysSinceResolved));
  },

  hasUnresolvedIncident: () => {
    return get().incidents.some((i) => i.status === 'Masih Ngambek');
  },

  getUnresolvedIncident: () => {
    return get().incidents.find((i) => i.status === 'Masih Ngambek');
  }
}));
