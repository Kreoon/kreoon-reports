"use client";

import { motion } from "framer-motion";
import type { BrandDiagnosisData } from "@/types/report";

function ScoreRing({ score, size = 120 }: { score: number; size?: number }) {
  const radius = (size - 12) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const color = score >= 80 ? "#fbbf24" : score >= 60 ? "#22c55e" : score >= 40 ? "#7c3aed" : "#ef4444";

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke="#27272a" strokeWidth={8}
        />
        <motion.circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke={color} strokeWidth={8}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-white">{score}</span>
        <span className="text-xs text-gray-400">/100</span>
      </div>
    </div>
  );
}

interface Props {
  diagnosis: BrandDiagnosisData;
}

export default function DiagnosisHero({ diagnosis }: Props) {
  const meetingDate = new Date(diagnosis.meeting_date);
  const formattedDate = meetingDate.toLocaleDateString("es-CO", {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <section className="relative min-h-[60vh] flex items-center justify-center px-4 py-16 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-mesh-gradient opacity-40" />
      <div className="absolute inset-0 noise-overlay opacity-20" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 max-w-3xl mx-auto text-center space-y-8"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-kreoon/10 border border-kreoon/20"
        >
          <span className="w-2 h-2 rounded-full bg-kreoon animate-pulse" />
          <span className="text-xs font-semibold text-kreoon uppercase tracking-wider">
            Diagnóstico de Marca
          </span>
        </motion.div>

        {/* Brand name */}
        <h1 className="text-4xl sm:text-5xl font-bold text-white">
          {diagnosis.brand_name}
        </h1>

        {/* Industry */}
        <p className="text-lg text-gray-400">
          {diagnosis.brand_industry}
          {diagnosis.brand_website && (
            <>
              {" · "}
              <a
                href={diagnosis.brand_website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-kreoon hover:underline"
              >
                {diagnosis.brand_website.replace(/^https?:\/\//, "")}
              </a>
            </>
          )}
        </p>

        {/* Score ring */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="flex justify-center"
        >
          <ScoreRing score={diagnosis.overall_score} size={140} />
        </motion.div>

        {/* Meeting info */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-400">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-800/60">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
            </svg>
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-800/60">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0" />
            </svg>
            <span>{diagnosis.attendee_name}</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-800/60">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
            <span>{diagnosis.attendee_email}</span>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
