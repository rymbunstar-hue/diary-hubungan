import type { Metadata } from "next";
import { Playfair_Display, Poppins, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { CustomCursor } from "@/components/CustomCursor";
import { MusicPlayer } from "@/components/MusicPlayer";
import { Navigation } from "@/components/Navigation";
import { WelcomeQuote } from "@/components/WelcomeQuote";
import { ClientInit } from "@/components/ClientInit";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Diary Mood Relationship 🤎",
  description: "Website khusus kita berdua. Semoga setiap ngambek selalu berakhir dengan pelukan.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${playfair.variable} ${poppins.variable} ${cormorant.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col relative overflow-x-hidden">
        <ClientInit />
        <CustomCursor />
        <Navigation />
        <main className="flex-1 flex flex-col pt-24 pb-20 px-4 md:px-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
        <MusicPlayer />
        <WelcomeQuote />
      </body>
    </html>
  );
}
