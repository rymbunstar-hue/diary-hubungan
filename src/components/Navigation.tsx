"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, History, Image as ImageIcon, Mail, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

export function Navigation() {
  const pathname = usePathname();

  // Hide navigation on landing page
  if (pathname === "/") return null;

  const links = [
    { href: "/dashboard", icon: Home, label: "Beranda" },
    { href: "/history", icon: History, label: "Riwayat" },
    { href: "/memories", icon: ImageIcon, label: "Kenangan" },
    { href: "/love-letter", icon: Mail, label: "Surat" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 px-6 py-4 flex justify-center">
      <div className="glass rounded-full px-6 py-3 flex items-center gap-8 shadow-sm">
        <Link href="/dashboard" className="flex items-center gap-2 mr-4">
          <Heart className="text-red-400 fill-red-400" size={24} />
          <span className="font-playfair font-bold text-lg hidden md:block">Diary Mood</span>
        </Link>
        
        <div className="flex items-center gap-6">
          {links.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex flex-col items-center gap-1 transition-all hover:text-[#C8A27A]",
                  isActive ? "text-[#C8A27A]" : "text-foreground/60"
                )}
              >
                <Icon size={20} className={cn(isActive && "drop-shadow-[0_0_8px_rgba(200,162,122,0.8)]")} />
                <span className="text-[10px] uppercase tracking-wider font-medium hidden md:block">
                  {link.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
