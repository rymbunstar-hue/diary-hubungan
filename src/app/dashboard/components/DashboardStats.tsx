"use client";

import { useMoodStore } from "@/store/useMoodStore";
import { differenceInDays } from "date-fns";
import { motion } from "framer-motion";
import { CalendarHeart, HeartHandshake, Frown, HeartPulse, TimerReset } from "lucide-react";

export function DashboardStats() {
  const relationshipStartDate = useMoodStore(state => state.relationshipStartDate);
  const incidents = useMoodStore(state => state.incidents);
  const getMoodPercentage = useMoodStore(state => state.getMoodPercentage);

  const totalHariBersama = differenceInDays(new Date(), new Date(relationshipStartDate)) || 0;
  
  const totalNgambek = incidents.length;
  const moodPercentage = getMoodPercentage();

  // Total Hari Bahagia = Total Hari Bersama - Hari dimana dia ngambek
  // For simplicity, we just count unique days of ngambek
  const ngambekDates = new Set(incidents.map((i) => i.date));
  const totalHariBahagia = Math.max(0, totalHariBersama - ngambekDates.size);

  const lastIncident = incidents[0];
  let daysSinceNgambek = totalHariBersama; // default if never
  if (lastIncident && lastIncident.resolved_at) {
    daysSinceNgambek = differenceInDays(new Date(), new Date(lastIncident.resolved_at));
  } else if (lastIncident && lastIncident.status === "Masih Ngambek") {
    daysSinceNgambek = 0;
  }

  const stats = [
    {
      title: "Total Hari Bersama",
      value: `${totalHariBersama} Hari`,
      icon: CalendarHeart,
      color: "text-pink-500",
      bg: "bg-pink-500/10",
    },
    {
      title: "Total Hari Bahagia",
      value: `${totalHariBahagia} Hari`,
      icon: HeartHandshake,
      color: "text-green-500",
      bg: "bg-green-500/10",
    },
    {
      title: "Total Ngambek",
      value: `${totalNgambek} Kali`,
      icon: Frown,
      color: "text-red-500",
      bg: "bg-red-500/10",
    },
    {
      title: "Mood Relationship",
      value: `${moodPercentage}%`,
      icon: HeartPulse,
      color: "text-rose-500",
      bg: "bg-rose-500/10",
    },
    {
      title: "Hari Damai",
      value: `${daysSinceNgambek} Hari`,
      icon: TimerReset,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className="glass rounded-3xl p-6 flex items-center gap-6 hover:scale-[1.02] hover:shadow-xl transition-all group"
          >
            <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
              <Icon size={32} />
            </div>
            <div>
              <p className="text-foreground/60 text-sm font-medium mb-1 uppercase tracking-wider">
                {stat.title}
              </p>
              <p className="text-2xl font-bold font-playfair text-foreground">
                {stat.value}
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
