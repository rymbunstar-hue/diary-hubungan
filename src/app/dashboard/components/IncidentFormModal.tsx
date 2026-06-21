"use client";

import { useMoodStore, IncidentScale } from "@/store/useMoodStore";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";

export function IncidentFormModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { addIncident } = useMoodStore();
  
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [time, setTime] = useState(format(new Date(), "HH:mm"));
  const [who, setWho] = useState<'Dea' | 'Rymbun'>('Dea');
  const [reason, setReason] = useState("");
  const [scale, setScale] = useState<IncidentScale>("Lumayan");
  const [notes, setNotes] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;

    addIncident({
      who,
      date,
      time,
      reason,
      scale,
      notes,
    });
    
    // Reset
    setReason("");
    setNotes("");
    setScale("Lumayan");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg"
          >
            <div className="bg-background rounded-3xl p-6 shadow-2xl m-4 border border-white/20">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-playfair text-2xl font-bold text-foreground">
                  Laporan Ngambek 📝
                </h2>
                <button onClick={onClose} className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium">Tanggal</label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="px-4 py-2 rounded-xl bg-black/5 dark:bg-white/5 border-none outline-none focus:ring-2 focus:ring-[#C8A27A]"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium">Jam</label>
                    <input
                      type="time"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="px-4 py-2 rounded-xl bg-black/5 dark:bg-white/5 border-none outline-none focus:ring-2 focus:ring-[#C8A27A]"
                      required
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium">Siapa yang Ngambek?</label>
                  <div className="flex gap-2">
                    {(["Dea", "Rymbun"] as const).map((person) => (
                      <button
                        key={person}
                        type="button"
                        onClick={() => setWho(person)}
                        className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${
                          who === person
                            ? "bg-[#C8A27A] text-white shadow-lg scale-105"
                            : "bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10"
                        }`}
                      >
                        {person}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium">Alasan Ngambek</label>
                  <input
                    type="text"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Misal: Telat balas chat, lupa tanggal jadian..."
                    className="px-4 py-2 rounded-xl bg-black/5 dark:bg-white/5 border-none outline-none focus:ring-2 focus:ring-[#C8A27A]"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium">Skala Ngambek</label>
                  <div className="flex gap-2">
                    {(["Sedikit", "Lumayan", "Parah"] as IncidentScale[]).map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setScale(s)}
                        className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${
                          scale === s
                            ? "bg-[#C8A27A] text-white shadow-lg scale-105"
                            : "bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10"
                        }`}
                      >
                        {s === "Sedikit" ? "😊 Sedikit" : s === "Lumayan" ? "😑 Lumayan" : "😡 Parah"}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium">Catatan Tambahan (Opsional)</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Ada yang mau dicatat lagi?"
                    className="px-4 py-2 rounded-xl bg-black/5 dark:bg-white/5 border-none outline-none focus:ring-2 focus:ring-[#C8A27A] resize-none h-24"
                  />
                </div>

                <button
                  type="submit"
                  className="mt-4 bg-[#111111] dark:bg-white text-white dark:text-black py-3 rounded-xl font-bold text-lg hover:scale-[1.02] active:scale-[0.98] transition-transform"
                >
                  Simpan Data
                </button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
