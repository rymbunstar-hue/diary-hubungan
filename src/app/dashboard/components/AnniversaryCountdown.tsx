"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PartyPopper, Heart } from "lucide-react";

function getNextAnniversary(): Date {
  const now = new Date();
  const thisYear = now.getFullYear();

  // Anniversary = 27 Agustus
  let anniversary = new Date(thisYear, 7, 27, 0, 0, 0, 0); // bulan 7 = Agustus (0-indexed)

  // Kalau tanggal anniversary tahun ini sudah lewat, pakai tahun depan
  if (anniversary <= now) {
    anniversary = new Date(thisYear + 1, 7, 27, 0, 0, 0, 0);
  }

  return anniversary;
}

function getAnniversaryYear(): number {
  const startYear = 2022; // Mulai jadian (estimasi dari 1394 hari lalu ~Nov 2022, anniversary di Agustus)
  const nextAnniversary = getNextAnniversary();
  return nextAnniversary.getFullYear() - startYear;
}

export function AnniversaryCountdown() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isToday, setIsToday] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const tick = () => {
      const now = new Date();
      const target = getNextAnniversary();
      const diff = target.getTime() - now.getTime();

      if (diff <= 0) {
        setIsToday(true);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setIsToday(false);
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      });
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!mounted) return null;

  const nthYear = getAnniversaryYear();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.6 }}
      className={`relative overflow-hidden rounded-3xl p-6 md:p-8 ${
        isToday
          ? "bg-gradient-to-br from-rose-400 to-pink-500 text-white shadow-2xl shadow-rose-500/30"
          : "glass"
      }`}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {["❤️", "🥂", "✨", "🌹", "💍", "🎂"].map((emoji, i) => (
          <motion.span
            key={i}
            className="absolute text-3xl opacity-10"
            style={{ left: `${10 + i * 15}%`, top: `${20 + (i % 3) * 30}%` }}
            animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 3 + i, repeat: Infinity, ease: "easeInOut" }}
          >
            {emoji}
          </motion.span>
        ))}
      </div>

      <div className="relative z-10">
        {isToday ? (
          <div className="text-center">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="text-6xl mb-4"
            >
              🎉
            </motion.div>
            <h2 className="font-playfair text-3xl md:text-4xl font-bold mb-2">
              Selamat Anniversary ke-{nthYear}! 🥂
            </h2>
            <p className="text-white/90 font-cormorant text-xl italic">
              Makasih udah {nthYear} tahun ini sama aku. I love you, Dea. ❤️
            </p>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="p-3 rounded-2xl bg-[#C8A27A]/15">
                <PartyPopper size={26} className="text-[#C8A27A]" />
              </div>
              <div>
                <p className="text-foreground/50 text-xs font-medium uppercase tracking-widest">Menuju</p>
                <h2 className="font-playfair text-xl md:text-2xl font-bold text-foreground">
                  Anniversary ke-{nthYear} · 27 Agustus 🎂
                </h2>
              </div>
            </div>

            {/* Countdown blocks */}
            <div className="grid grid-cols-4 gap-3">
              {[
                { label: "Hari", value: timeLeft.days },
                { label: "Jam", value: timeLeft.hours },
                { label: "Menit", value: timeLeft.minutes },
                { label: "Detik", value: timeLeft.seconds },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="flex flex-col items-center bg-[#C8A27A]/10 dark:bg-[#C8A27A]/10 rounded-2xl p-3 md:p-4 border border-[#C8A27A]/20"
                >
                  <motion.span
                    key={value}
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="font-playfair font-bold text-2xl md:text-4xl text-[#C8A27A] tabular-nums leading-none"
                  >
                    {String(value).padStart(2, "0")}
                  </motion.span>
                  <span className="text-foreground/50 text-[10px] uppercase tracking-widest mt-1 font-medium">
                    {label}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 mt-4 text-foreground/50 text-sm">
              <Heart size={13} className="fill-rose-400 text-rose-400" />
              <span className="font-cormorant italic text-base">Dikit lagi nih, udah deket banget 🥹</span>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
