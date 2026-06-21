"use client";

import { motion } from "framer-motion";
import { Heart } from "lucide-react";

export default function LoveLetterPage() {
  return (
    <div className="flex flex-col items-center w-full max-w-3xl mx-auto pb-12">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex flex-col items-center"
      >
        <Heart className="text-red-500 fill-red-500 mb-4 animate-pulse" size={32} />
        <h1 className="font-playfair text-3xl font-bold text-foreground">Surat Untuk Kamu 💌</h1>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="relative w-full"
      >
        {/* Vintage Paper Background styling */}
        <div className="absolute inset-0 bg-[#f4e4bc] dark:bg-[#d4bca4] opacity-50 rounded-sm shadow-2xl pointer-events-none mix-blend-multiply dark:mix-blend-color-burn" />
        
        {/* Paper texture overlay */}
        <div 
          className="absolute inset-0 opacity-[0.15] pointer-events-none rounded-sm"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />

        <div className="relative bg-[#Fdf6e3]/90 dark:bg-[#2c2621]/90 backdrop-blur-sm p-8 md:p-14 shadow-2xl rounded-sm border border-[#eaddc5] dark:border-[#4a3f35] min-h-[60vh]">
          {/* Fold lines / decorations */}
          <div className="absolute left-6 top-0 bottom-0 w-[1px] bg-red-400/30" />
          <div className="absolute left-8 top-0 bottom-0 w-[1px] bg-red-400/30" />
          
          <div className="pl-6 font-cormorant text-lg md:text-xl leading-loose text-[#3b312a] dark:text-[#eaddc5]">
            <p className="mb-6 font-bold text-2xl">Untuk perempuanku yang paling cantik,</p>
            
            <p className="mb-6">
              Aku nulis ini buat ngingetin kamu, kalau bagaimanapun keadaan kita, kamu tetep rumah buat aku. Mungkin kadang kita berantem, mungkin kadang kamu ngambek (yang sebenernya lucu banget kalau kamu tau), tapi percayalah, perasaanku ke kamu nggak pernah berubah.
            </p>

            <p className="mb-6">
              Maaf kalau kadang aku kurang peka, maaf kalau kadang aku bikin kamu kesel. Tapi aku janji, aku bakal selalu berusaha jadi versi terbaik dari diriku buat kamu. Karena kamu pantes dapetin yang terbaik.
            </p>

            <p className="mb-6">
              Jangan pernah ragu sama perasaanku ya. Kamu itu spesial, kamu satu-satunya, dan aku bersyukur banget bisa ketemu sama kamu.
            </p>

            <p className="mb-12">
              Semoga kita bisa sama-sama terus, lewatin seneng sedih bareng-bareng. I love you, lebih dari yang kamu tau.
            </p>

            <div className="text-right font-playfair italic font-bold text-2xl mt-12">
              <p>Dari aku,</p>
              <p className="mt-2 text-rose-600 dark:text-rose-400">Yang Paling Sayang Kamu ❤️</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
