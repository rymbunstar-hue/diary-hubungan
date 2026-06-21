"use client";

import { useMoodStore, Incident } from "@/store/useMoodStore";
import { format, differenceInMinutes, differenceInHours } from "date-fns";
import { motion } from "framer-motion";
import { Clock, Calendar, AlertCircle, CheckCircle2, ChevronDown } from "lucide-react";
import { useState } from "react";

function HistoryCard({ incident, index }: { incident: Incident; index: number }) {
  const [isExpanded, setIsExpanded] = useState(false);

  let durationStr = "Belum Baikan";
  if (incident.resolved_at && incident.created_at) {
    const start = new Date(incident.created_at);
    const end = new Date(incident.resolved_at);
    const mins = differenceInMinutes(end, start);
    if (mins < 60) {
      durationStr = `${mins} menit`;
    } else {
      const hrs = differenceInHours(end, start);
      durationStr = `${hrs} jam ${mins % 60} menit`;
    }
  }

  const isResolved = incident.status === "Sudah Baikan";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className={`glass rounded-3xl p-6 border-l-4 ${
        isResolved ? "border-l-green-400" : "border-l-red-400"
      }`}
    >
      <div className="flex justify-between items-start cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
              isResolved ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
            }`}>
              {incident.status}
            </span>
            <span className="text-xs text-foreground/50 font-medium px-2 py-1 rounded-full bg-black/5 dark:bg-white/5">
              Skala: {incident.scale}
            </span>
            <span className="text-xs font-bold px-2 py-1 rounded-full bg-[#C8A27A]/20 text-[#b58d64] dark:text-[#e4c9ac]">
              {incident.who}
            </span>
          </div>
          <h3 className="font-playfair font-bold text-xl mb-1">{incident.reason}</h3>
          <div className="flex items-center gap-4 text-sm text-foreground/60 font-medium">
            <span className="flex items-center gap-1"><Calendar size={14} /> {incident.date}</span>
            <span className="flex items-center gap-1"><Clock size={14} /> {incident.time}</span>
          </div>
        </div>
        <button className={`p-2 transition-transform ${isExpanded ? "rotate-180" : ""}`}>
          <ChevronDown size={20} />
        </button>
      </div>

      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mt-4 pt-4 border-t border-black/10 dark:border-white/10 flex flex-col gap-3 text-sm"
        >
          <div className="flex justify-between items-center p-3 rounded-xl bg-black/5 dark:bg-white/5">
            <div className="flex items-center gap-2">
              <AlertCircle size={16} className="text-[#C8A27A]" />
              <span className="font-medium">Durasi Ngambek:</span>
            </div>
            <span className="font-bold">{durationStr}</span>
          </div>
          
          {incident.notes && (
            <div className="p-3 rounded-xl bg-black/5 dark:bg-white/5">
              <span className="font-medium block mb-1">Catatan:</span>
              <p className="text-foreground/80 italic">"{incident.notes}"</p>
            </div>
          )}

          {isResolved && incident.resolved_at && (
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400 mt-2">
              <CheckCircle2 size={16} />
              <span className="font-medium">Baikan pada: {format(new Date(incident.resolved_at), "dd MMM yyyy, HH:mm")}</span>
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}

export default function HistoryPage() {
  const { incidents } = useMoodStore();

  return (
    <div className="flex flex-col gap-8 w-full max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="font-playfair text-3xl font-bold text-foreground">Riwayat Ngambek 📖</h1>
        <p className="text-foreground/60 mt-2 font-cormorant text-lg">
          Mengingat masa lalu untuk belajar jadi lebih baik di masa depan.
        </p>
      </motion.div>

      {incidents.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass rounded-3xl p-12 text-center flex flex-col items-center justify-center min-h-[40vh]"
        >
          <div className="text-6xl mb-4">👼</div>
          <h2 className="font-playfair text-2xl font-bold mb-2">Belum Ada Riwayat!</h2>
          <p className="text-foreground/60 max-w-md">Wah, hebat! Pertahankan ya, semoga halamannya kosong terus.</p>
        </motion.div>
      ) : (
        <div className="flex flex-col gap-4">
          {incidents.map((incident, index) => (
            <HistoryCard key={incident.id} incident={incident} index={index} />
          ))}
        </div>
      )}
    </div>
  );
}
