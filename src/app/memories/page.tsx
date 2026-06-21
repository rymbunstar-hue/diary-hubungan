"use client";

import { useMemoryStore, Memory } from "@/store/useMemoryStore";
import { motion, AnimatePresence } from "framer-motion";
import { useRef, useState, useCallback } from "react";
import { Plus, Trash2, Pencil, Check, X, UploadCloud } from "lucide-react";
import { format } from "date-fns";

// --- Upload Modal ---
function UploadModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { addMemory } = useMemoryStore();
  const [preview, setPreview] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [date, setDate] = useState(format(new Date(), "dd MMM yyyy"));
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const readFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) readFile(file);
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) readFile(file);
  }, []);

  const handleSave = () => {
    if (!preview || !caption.trim()) return;
    addMemory({ image_data: preview, caption, date });
    setPreview(null);
    setCaption("");
    setDate(format(new Date(), "dd MMM yyyy"));
    onClose();
  };

  const reset = () => {
    setPreview(null);
    setCaption("");
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
            onClick={reset}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 24 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md m-4"
          >
            <div className="bg-background rounded-3xl p-6 shadow-2xl border border-white/20">
              <div className="flex justify-between items-center mb-5">
                <h2 className="font-playfair text-2xl font-bold">Tambah Kenangan 📸</h2>
                <button onClick={reset} className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full">
                  <X size={20} />
                </button>
              </div>

              {/* Dropzone */}
              <div
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={onDrop}
                onClick={() => !preview && fileRef.current?.click()}
                className={`relative rounded-2xl overflow-hidden border-2 border-dashed transition-all cursor-pointer mb-4 aspect-square flex items-center justify-center
                  ${dragging ? "border-[#C8A27A] bg-[#C8A27A]/10" : "border-foreground/20 hover:border-[#C8A27A] hover:bg-black/5 dark:hover:bg-white/5"}
                `}
              >
                {preview ? (
                  <>
                    <img src={preview} alt="preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setPreview(null); }}
                      className="absolute top-2 right-2 bg-black/60 text-white p-1.5 rounded-full hover:bg-black/80"
                    >
                      <X size={14} />
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-3 text-foreground/40">
                    <UploadCloud size={40} />
                    <p className="text-sm font-medium">Klik atau seret foto kesini</p>
                  </div>
                )}
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFileChange} />
              </div>

              <div className="flex flex-col gap-3">
                <input
                  type="text"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Caption foto (wajib diisi)"
                  className="px-4 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 outline-none focus:ring-2 focus:ring-[#C8A27A] text-sm"
                />
                <input
                  type="text"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  placeholder="Tanggal (misal: 14 Feb 2023)"
                  className="px-4 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 outline-none focus:ring-2 focus:ring-[#C8A27A] text-sm"
                />
                <button
                  onClick={handleSave}
                  disabled={!preview || !caption.trim()}
                  className="mt-2 bg-[#C8A27A] disabled:opacity-40 disabled:cursor-not-allowed text-white py-3 rounded-xl font-bold text-base hover:bg-[#b58d64] transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  Simpan Kenangan
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// --- Memory Card ---
function MemoryCard({ memory, index }: { memory: Memory; index: number }) {
  const { deleteMemory, updateCaption } = useMemoryStore();
  const [editing, setEditing] = useState(false);
  const [tempCaption, setTempCaption] = useState(memory.caption);

  const saveCaption = () => {
    if (tempCaption.trim()) updateCaption(memory.id, tempCaption.trim());
    setEditing(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, rotate: memory.rotation * 2 }}
      animate={{ opacity: 1, scale: 1, rotate: memory.rotation }}
      exit={{ opacity: 0, scale: 0.5 }}
      transition={{ delay: index * 0.1, duration: 0.6, type: "spring" }}
      whileHover={{ scale: 1.04, rotate: 0, zIndex: 10 }}
      className="relative bg-white dark:bg-[#1A1A1A] p-4 pb-16 rounded-sm shadow-xl border border-black/5 dark:border-white/5 origin-center group"
    >
      {/* Tape effect */}
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-24 h-8 bg-white/40 dark:bg-black/40 backdrop-blur-md rotate-[-2deg] shadow-sm z-10 opacity-70" />

      <div className="relative w-full aspect-square overflow-hidden bg-black/5 dark:bg-white/5 mb-4">
        <img
          src={memory.image_data}
          alt={memory.caption}
          className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110 filter sepia-[0.15] contrast-[1.05]"
        />
      </div>

      <div className="absolute bottom-4 left-0 right-0 px-4 flex flex-col items-center gap-1 text-center">
        {editing ? (
          <div className="flex items-center gap-2 w-full">
            <input
              autoFocus
              value={tempCaption}
              onChange={(e) => setTempCaption(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") saveCaption(); if (e.key === "Escape") setEditing(false); }}
              className="flex-1 text-center text-sm bg-black/5 dark:bg-white/10 rounded-lg px-2 py-1 outline-none ring-1 ring-[#C8A27A]"
            />
            <button onClick={saveCaption} className="text-green-500"><Check size={16} /></button>
            <button onClick={() => setEditing(false)} className="text-red-400"><X size={16} /></button>
          </div>
        ) : (
          <p className="font-playfair font-bold text-[#111111] dark:text-[#F6F1EB] line-clamp-2 leading-snug">
            {memory.caption}
          </p>
        )}
        <p className="font-cormorant text-sm text-foreground/50">{memory.date}</p>
      </div>

      {/* Action buttons (visible on hover) */}
      <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-20">
        <button
          onClick={() => { setEditing(true); setTempCaption(memory.caption); }}
          className="bg-white/90 dark:bg-black/70 p-1.5 rounded-full shadow text-[#C8A27A] hover:bg-[#C8A27A] hover:text-white transition-colors"
        >
          <Pencil size={13} />
        </button>
        <button
          onClick={() => deleteMemory(memory.id)}
          className="bg-white/90 dark:bg-black/70 p-1.5 rounded-full shadow text-red-400 hover:bg-red-500 hover:text-white transition-colors"
        >
          <Trash2 size={13} />
        </button>
      </div>
    </motion.div>
  );
}

// --- Main Page ---
export default function MemoriesPage() {
  const { memories } = useMemoryStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex flex-col gap-10 w-full max-w-5xl mx-auto pb-12">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="font-playfair text-4xl md:text-5xl font-bold text-foreground mb-4">Gallery Kenangan 📸</h1>
        <p className="text-foreground/60 font-cormorant text-xl max-w-2xl mx-auto italic">
          "Kumpulan momen indah yang selalu bikin senyum-senyum sendiri kalau diingat."
        </p>
      </motion.div>

      {/* Upload Button */}
      <div className="flex justify-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-3 bg-[#C8A27A] text-white px-6 py-3 rounded-2xl shadow-lg font-semibold hover:bg-[#b58d64] transition-colors"
        >
          <Plus size={20} />
          Tambah Foto Kenangan
        </motion.button>
      </div>

      {/* Gallery Grid */}
      {memories.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass rounded-3xl p-16 text-center flex flex-col items-center justify-center min-h-[40vh]"
        >
          <div className="text-6xl mb-4">📷</div>
          <h2 className="font-playfair text-2xl font-bold mb-2">Belum Ada Foto</h2>
          <p className="text-foreground/60 max-w-sm">
            Tekan tombol "Tambah Foto Kenangan" di atas untuk mulai mengisi galeri kalian!
          </p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-16 px-4 py-8">
          <AnimatePresence>
            {memories.map((memory, index) => (
              <MemoryCard key={memory.id} memory={memory} index={index} />
            ))}
          </AnimatePresence>
        </div>
      )}

      <UploadModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}

