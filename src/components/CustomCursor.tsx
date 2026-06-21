"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Sparkle {
  id: number;
  x: number;
  y: number;
}

interface Heart {
  id: number;
  x: number;
  y: number;
}

export function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);
  const [hearts, setHearts] = useState<Heart[]>([]);

  useEffect(() => {
    // Only run on desktop/devices with a pointer
    if (window.matchMedia("(pointer: coarse)").matches) return;

    let sparkleId = 0;
    let heartId = 0;

    const onMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      
      // Randomly add sparkles
      if (Math.random() > 0.8) {
        const id = sparkleId++;
        setSparkles((prev) => [...prev.slice(-10), { id, x: e.clientX, y: e.clientY }]);
        setTimeout(() => {
          setSparkles((prev) => prev.filter((s) => s.id !== id));
        }, 800);
      }
    };

    const onClick = (e: MouseEvent) => {
      const id = heartId++;
      setHearts((prev) => [...prev.slice(-5), { id, x: e.clientX, y: e.clientY }]);
      setTimeout(() => {
        setHearts((prev) => prev.filter((h) => h.id !== id));
      }, 1000);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("click", onClick);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("click", onClick);
    };
  }, []);

  // Hide custom cursor on mobile
  if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {/* Main Cursor Dot */}
      <motion.div
        className="fixed top-0 left-0 w-4 h-4 bg-[#C8A27A] rounded-full mix-blend-difference pointer-events-none z-50"
        animate={{
          x: mousePosition.x - 8,
          y: mousePosition.y - 8,
        }}
        transition={{ type: "tween", ease: "backOut", duration: 0.15 }}
      />
      
      {/* Sparkles */}
      <AnimatePresence>
        {sparkles.map((sparkle) => (
          <motion.div
            key={sparkle.id}
            initial={{ opacity: 1, scale: 0 }}
            animate={{ opacity: 0, scale: 1.5, y: sparkle.y - 20 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="fixed w-2 h-2 rounded-full bg-yellow-200 shadow-[0_0_8px_rgba(253,224,71,0.8)] pointer-events-none"
            style={{ left: sparkle.x, top: sparkle.y }}
          />
        ))}
      </AnimatePresence>

      {/* Click Hearts */}
      <AnimatePresence>
        {hearts.map((heart) => (
          <motion.div
            key={heart.id}
            initial={{ opacity: 1, scale: 0.5, y: heart.y }}
            animate={{ opacity: 0, scale: 2, y: heart.y - 50 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="fixed text-red-500 text-2xl pointer-events-none"
            style={{ left: heart.x - 12, top: heart.y - 12 }}
          >
            ❤️
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
