"use client";

import { motion } from "framer-motion";

export function AnimatedBackground() {
  const elements = Array.from({ length: 20 });

  return (
    <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden bg-[#F6F1EB] dark:bg-[#111111]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent dark:from-[#C8A27A]/10 dark:via-transparent dark:to-transparent" />
      
      {/* Floating Elements */}
      {elements.map((_, i) => {
        const size = Math.random() * 20 + 10;
        const left = Math.random() * 100;
        const duration = Math.random() * 10 + 10;
        const delay = Math.random() * 10;

        return (
          <motion.div
            key={i}
            className="absolute opacity-30 dark:opacity-20 text-[#C8A27A]"
            initial={{ y: "110vh", x: `${left}vw`, rotate: 0 }}
            animate={{
              y: "-10vh",
              x: `${left + (Math.random() * 10 - 5)}vw`,
              rotate: 360,
            }}
            transition={{
              duration,
              delay,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{ fontSize: size }}
          >
            {i % 3 === 0 ? "✨" : i % 3 === 1 ? "🤎" : "🍃"}
          </motion.div>
        );
      })}
    </div>
  );
}
