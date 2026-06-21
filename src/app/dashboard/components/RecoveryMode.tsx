"use client";

import { useMoodStore } from "@/store/useMoodStore";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

// Pesan buat Dea yang ngambek → dari Rymbun (cowok ke cewek)
const messagesForDea = [
  "Maaf ya cantik 🤍",
  "Aku sayang banget sama kamu, Dea.",
  "Semoga marahnya cepet ilang ya.",
  "Kalau bisa dipeluk sekarang, pasti aku peluk erat banget.",
  "Aku bakal lebih baik lagi buat kamu.",
  "Kamu tetap cewek paling cantik buat aku.",
  "Cantik banget sih, walaupun lagi ngambek. 😔🤍",
  "Jangan lama-lama ya marahnya, aku kangen senyummu.",
  "Sorry udah bikin kamu kesel, Dea. Beneran minta maaf.",
  "Aku nggak mau kamu sedih karena aku.",
];

// Pesan buat Rymbun yang ngambek → dari Dea (cewek ke cowok)
const messagesForRymbun = [
  "Maaf ya, sayang 🤍",
  "Aku sayang banget sama kamu, Rymbun.",
  "Semoga moodnya cepet balik ya.",
  "Kalau bisa aku peluk sekarang pasti aku mau.",
  "Aku bakal berusaha lebih perhatian lagi.",
  "Kamu tetap cowok terbaik buat aku.",
  "Ganteng walaupun lagi cemberut. 😄🤍",
  "Jangan lama-lama ngambeknya ya, aku kangen ketawa bareng.",
  "Maaf kalau aku salah, beneran minta maaf.",
  "Aku nggak mau kamu kecewa karena aku.",
];

export function RecoveryMode() {
  const incidents = useMoodStore(state => state.incidents);
  const resolveIncident = useMoodStore(state => state.resolveIncident);
  const incident = incidents.find(i => i.status === 'Masih Ngambek');
  
  const [messageIndex, setMessageIndex] = useState(0);
  const [elapsed, setElapsed] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isResolvedAnim, setIsResolvedAnim] = useState(false);

  useEffect(() => {
    if (!incident) return;

    // Update message every 5 seconds
    const messages = incident.who === 'Dea' ? messagesForDea : messagesForRymbun;
    const msgInterval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 5000);

    // Update timer every second
    const startTime = new Date(incident.created_at).getTime();
    const timerInterval = setInterval(() => {
      const now = new Date().getTime();
      const diff = now - startTime;

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setElapsed({ days, hours, minutes, seconds });
    }, 1000);

    return () => {
      clearInterval(msgInterval);
      clearInterval(timerInterval);
    };
  }, [incident]);

  const handleResolve = () => {
    if (!incident) return;
    
    // Trigger Confetti
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#ff0000', '#ffc0cb', '#ffffff']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#ff0000', '#ffc0cb', '#ffffff']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();

    setIsResolvedAnim(true);
    
    setTimeout(() => {
      resolveIncident(incident.id);
    }, 3500); // Wait for animation before changing state
  };

  if (!incident) return null;

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center relative overflow-hidden rounded-3xl p-8 bg-gradient-to-b from-pink-100 to-rose-50 dark:from-pink-950/30 dark:to-rose-900/20 shadow-2xl">
      {/* Floating Elements Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-4xl opacity-50"
            initial={{ y: "100%", x: `${Math.random() * 100}%` }}
            animate={{ y: "-20%", x: `${Math.random() * 100}%` }}
            transition={{ duration: Math.random() * 10 + 10, repeat: Infinity, ease: "linear" }}
          >
            {["❤️", "✨", "🐻", "☁️", "🌸", "💌"][i % 6]}
          </motion.div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {isResolvedAnim ? (
          <motion.div
            key="resolved"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="z-10 flex flex-col items-center"
          >
            <div className="text-8xl mb-6">🥹❤️🎉✨</div>
            <h1 className="font-playfair text-4xl md:text-6xl font-bold text-rose-600 dark:text-rose-400">
              Yey!! Kita Baikan Lagi 🤎
            </h1>
          </motion.div>
        ) : (
          <motion.div
            key="recovery"
            className="z-10 flex flex-col items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <div className="mb-8">
              <h2 className="font-playfair text-3xl mb-2 text-foreground">Waktu Sejak {incident.who} Ngambek</h2>
              <div className="flex gap-4 justify-center items-center font-poppins font-bold text-2xl md:text-4xl text-rose-500 bg-white/50 dark:bg-black/20 p-4 rounded-2xl backdrop-blur-sm">
                <div className="flex flex-col"><span className="tabular-nums">{elapsed.days}</span><span className="text-xs uppercase">Hari</span></div>
                <span>:</span>
                <div className="flex flex-col"><span className="tabular-nums">{String(elapsed.hours).padStart(2, '0')}</span><span className="text-xs uppercase">Jam</span></div>
                <span>:</span>
                <div className="flex flex-col"><span className="tabular-nums">{String(elapsed.minutes).padStart(2, '0')}</span><span className="text-xs uppercase">Menit</span></div>
                <span>:</span>
                <div className="flex flex-col"><span className="tabular-nums">{String(elapsed.seconds).padStart(2, '0')}</span><span className="text-xs uppercase">Detik</span></div>
              </div>
            </div>

            <div className="h-32 flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.p
                  key={messageIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="font-cormorant text-3xl md:text-4xl italic font-semibold text-foreground/80 max-w-xl"
                >
                  "{(incident.who === 'Dea' ? messagesForDea : messagesForRymbun)[messageIndex]}"
                </motion.p>
              </AnimatePresence>
            </div>

            <button
              onClick={handleResolve}
              className="mt-12 bg-white dark:bg-[#111111] text-rose-500 hover:text-white hover:bg-rose-500 px-8 py-4 rounded-full font-bold text-xl shadow-xl transition-all hover:scale-110 active:scale-95 flex items-center gap-2 border-2 border-rose-500"
            >
              Kita Udah Baikan ❤️
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
