"use client";

import { useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import { motion } from "framer-motion";
import { useMusicStore } from "@/store/useMusicStore";

export function MusicPlayer() {
  const { isPlaying, isMuted, toggleMusic, toggleMute, pauseMusic } = useMusicStore();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Pakai lagu yang baru di-upload
  const audioSrc = "/love-moment.mp3";

  useEffect(() => {
    // Autoplay might be blocked by browser until user interacts
    if (audioRef.current && isPlaying) {
      audioRef.current.play().catch(() => pauseMusic());
    } else if (audioRef.current && !isPlaying) {
      audioRef.current.pause();
    }
  }, [isPlaying, pauseMusic]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  return (
    <div className="fixed bottom-6 right-6 z-40 glass rounded-full px-4 py-2 flex items-center gap-4 shadow-lg">
      <audio ref={audioRef} src={audioSrc} loop preload="auto" />
      
      <div className="flex items-center gap-2">
        <button
          onClick={toggleMusic}
          className="p-2 hover:bg-white/10 rounded-full transition-colors text-foreground"
        >
          {isPlaying ? <Pause size={20} /> : <Play size={20} />}
        </button>
        
        <button
          onClick={toggleMute}
          className="p-2 hover:bg-white/10 rounded-full transition-colors text-foreground"
        >
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
      </div>

      {isPlaying && (
        <div className="flex items-center gap-1">
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className="w-1 bg-[#C8A27A] rounded-full"
              animate={{ height: ["4px", "16px", "4px"] }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
