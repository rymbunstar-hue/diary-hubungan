"use client";

import { useRouter } from "next/navigation";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { Heart } from "lucide-react";
import { useMusicStore } from "@/store/useMusicStore";

export default function Home() {
  const router = useRouter();
  const { playMusic } = useMusicStore();

  const handleEnter = () => {
    // Start the global background music
    playMusic();

    // Navigate after a short delay
    setTimeout(() => {
      router.push("/dashboard");
    }, 400);
  };

  return (
    <div className="relative min-h-[calc(100vh-8rem)] flex items-center justify-center">
      <AnimatedBackground />
      
      <div className="z-10 text-center flex flex-col items-center">
        <div className="glass px-10 py-16 rounded-3xl flex flex-col items-center shadow-2xl relative overflow-hidden">
          {/* Subtle glow effect */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-[#C8A27A] rounded-full blur-[80px] opacity-50" />
          
          <Heart className="text-red-400 fill-red-400 mb-6 animate-pulse" size={48} />
          
          <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-[#111111] dark:text-[#F6F1EB]">
            Website Khusus Kita Berdua 🤎
          </h1>
          
          <p className="font-cormorant text-xl md:text-2xl text-foreground/80 mb-10 max-w-lg italic">
            "Semoga setiap ngambek selalu berakhir dengan pelukan."
          </p>
          
          <button
            onClick={handleEnter}
            className="group relative inline-flex items-center justify-center px-8 py-3 font-semibold text-white transition-all duration-300 bg-[#C8A27A] rounded-full hover:bg-[#b58d64] hover:shadow-[0_0_20px_rgba(200,162,122,0.4)] overflow-hidden active:scale-95"
          >
            <span className="relative z-10 flex items-center gap-2">
              Masuk
            </span>
            <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
          </button>
        </div>
      </div>
    </div>
  );
}
