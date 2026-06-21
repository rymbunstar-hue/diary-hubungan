"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const quotes = [
  "Hubungan yang indah bukan karena tidak pernah bertengkar, tetapi karena selalu memilih untuk kembali saling mencintai.",
  "Kalau hari ini kamu ngambek, semoga besok kita ketawa bareng lagi.",
  "Setiap detiknya berharga kalau dihabiskan sama kamu.",
  "Marahmu lucu, tapi senyummu jauh lebih cantik.",
  "Satu-satunya tempat favoritku untuk pulang adalah kamu."
];

export function WelcomeQuote() {
  const [quote, setQuote] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show once per session or just on mount
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setQuote(randomQuote);
    
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1500);

    const hideTimer = setTimeout(() => {
      setIsVisible(false);
    }, 8000);

    return () => {
      clearTimeout(timer);
      clearTimeout(hideTimer);
    };
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-md"
        >
          <div className="glass rounded-2xl p-6 text-center shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-white/5" />
            <p className="font-playfair text-lg italic text-[#C8A27A] relative z-10">
              "{quote}"
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
