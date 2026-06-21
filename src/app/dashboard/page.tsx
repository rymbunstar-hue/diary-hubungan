"use client";

import { useMoodStore } from "@/store/useMoodStore";
import { DashboardStats } from "./components/DashboardStats";
import { RecoveryMode } from "./components/RecoveryMode";
import { useState, useEffect } from "react";
import { IncidentFormModal } from "./components/IncidentFormModal";
import { motion, AnimatePresence } from "framer-motion";
import { AnniversaryCountdown } from "./components/AnniversaryCountdown";

export default function Dashboard() {
  const [mounted, setMounted] = useState(false);
  const incidents = useMoodStore((state) => state.incidents);
  const hasUnresolved = incidents.some((i) => i.status === 'Masih Ngambek');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="w-full relative min-h-full">
      <AnimatePresence mode="wait">
        {hasUnresolved ? (
          <motion.div
            key="recovery"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.5 }}
          >
            <RecoveryMode />
          </motion.div>
        ) : (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-8"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-4">
              <div>
                <h1 className="font-playfair text-3xl font-bold text-foreground">
                  Beranda Kita 🤎
                </h1>
                <p className="text-foreground/60 mt-2 font-cormorant text-lg">
                  Semoga hari ini penuh senyum dan tanpa ngambek.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-2xl shadow-lg transition-transform hover:scale-105 active:scale-95 font-semibold flex items-center gap-2"
              >
                <span>Ada yang Lagi Ngambek 😭</span>
              </button>
            </div>

            <DashboardStats />
            <AnniversaryCountdown />
            
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal */}
      <IncidentFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
