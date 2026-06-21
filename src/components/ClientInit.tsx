"use client";

import { useEffect } from "react";
import { useMoodStore } from "@/store/useMoodStore";
import { useMemoryStore } from "@/store/useMemoryStore";

export function ClientInit() {
  const { fetchIncidents, subscribeToIncidents } = useMoodStore();
  const { fetchMemories } = useMemoryStore();

  useEffect(() => {
    fetchIncidents();
    fetchMemories();
    const unsubscribe = subscribeToIncidents();
    
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [fetchIncidents, fetchMemories, subscribeToIncidents]);

  return null;
}
