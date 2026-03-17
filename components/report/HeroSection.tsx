"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ReportData } from "@/types/report";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatNumber(n: number | undefined | null): string {
  if (n == null) return "—";
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, "")}K`;
  return n.toString();
}

function formatDuration(seconds: number | null): string {
  if (seconds == null) return "—";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

function platformLabel(platform: ReportData["platform"]): string {
  const map: Record<ReportData["platform"], string> = {
    instagram: "Instagram",
    tiktok: "TikTok",
    youtube: "YouTube",
    twitter: "Twitter / X",
    linkedin: "LinkedIn",
    facebook: "Facebook",
  };
  return map[platform] ?? platform;
}

function contentTypeLabel(ct: ReportData["content_type"]): string {
  const map: Record<ReportData["content_type"], string> = {
    reel: "Reel",
    post: "Post",
    carousel: "Carrusel",
    story: "Story",
    short: "Short",
    video: "Video",
    thread: "Thread",
    unknown: "Contenido",
  };
  return map[ct] ?? ct;
}

function erColor(er: number | undefined): string {
  if (er == null) return "text-gray-400";
  if (er >= 5) return "text-emerald-400";
  if (er >= 3) return "text-orange-400";
  return "text-red-400";
}

function erBg(er: number | undefined): string {
  if (er == null) return "bg-gray-400/10 border-gray-400/30";
  if (er >= 5) return "bg-emerald-400/10 border-emerald-400/30";
  if (er >= 3) return "bg-orange-400/10 border-orange-400/30";
  return "bg-red-400/10 border-red-400/30";
}

function scoreLabel(score: number): string {
  if (score >= 80) return "EXCELENTE";
  if (score >= 60) return "BUENO";
  return "MEJORABLE";
}

function scoreGradient(score: number): { stroke: string; label: string } {
  if (score >= 80) return { stroke: "#22c55e", label: "text-emerald-400" };
  if (score >= 60) return { stroke: "#f97316", label: "text-orange-400" };
  return { stroke: "#ef4444", label: "text-red-400" };
}

// ─── Platform Icon Placeholder ────────────────────────────────────────────────

function PlatformIcon({ platform }: { platform: ReportData["platform"] }) {
  const icons: Record<ReportData["platform"], string> = {
    instagram: "IG",
    tiktok: "TK",
    youtube: "YT",
    twitter: "X",
    linkedin: "LI",
    facebook: "FB",
  };
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-neutral-900">
      <div className="w-20 h-20 rounded-2xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center">
        <span className="text-2xl font-black text-orange-400">{icons[platform]}</span>
      </div>
      <span className="text-sm text-neutral-500 font-medium">Sin vista previa</span>
    </div>
  );
}

// ─── Score Circle ─────────────────────────────────────────────────────────────

function ScoreCircle({ score }: { score: number }) {
  const [animated, setAnimated] = useState(0);
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const { stroke, label } = scoreGradient(score);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(score), 200);
    return () => clearTimeout(timer);
  }, [score]);

  const offset = circumference - (animated / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-32 h-32">
        {/* Track */}
        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.07)"
            strokeWidth="8"
          />
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke={stroke}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 1.4s cubic-bezier(0.4,0,0.2,1)" }}
            filter="url(#glow)"
          />
          <defs>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
        </svg>
        {/* Center */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-black text-white leading-none">{animated}</span>
          <span className="text-xs text-neutral-400 font-medium">/100</span>
        </div>
      </div>
      {/* Badge */}
      <span
        className={`text-xs font-bold tracking-widest px-3 py-1 rounded-full border ${
          score >= 80
            ? "bg-emerald-400/10 border-emerald-400/40 text-emerald-400"
            : score >= 60
            ? "bg-orange-400/10 border-orange-400/40 text-orange-400"
            : "bg-red-400/10 border-red-400/40 text-red-400"
        }`}
      >
        {scoreLabel(score)}
      </span>
    </div>
  );
}

// ─── Scroll Indicator ─────────────────────────────────────────────────────────

function ScrollIndicator() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY < 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 pointer-events-none"
      style={{ opacity: visible ? 1 : 0, transition: "opacity 0.4s ease" }}
    >
      <span className="text-xs text-neutral-500 tracking-widest font-medium uppercase">
        Scroll
      </span>
      <motion.div
        animate={{ y: [0, 6, 0] }}
        transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-neutral-500"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </motion.div>
    </div>
  );
}

// ─── Stagger variants ─────────────────────────────────────────────────────────

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.15,
    },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.6, ease: "easeOut" } },
};

// ─── Main Component ───────────────────────────────────────────────────────────

interface HeroSectionProps {
  data: ReportData;
}

export default function HeroSection({ data }: HeroSectionProps) {
  const { platform, content_type, creator_username, creator_followers, duration_seconds, metrics, drive_media_id, scores } = data;
  const er = metrics.engagement_rate;
  const totalScore = scores.total;

  return (
    <section
      className="relative min-h-screen w-full flex flex-col overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #0A0A0A 0%, #0F0A06 60%, #140C05 100%)",
      }}
    >
      {/* Subtle radial glow top-left */}
      <div
        className="pointer-events-none absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full opacity-20"
        style={{
          background: "radial-gradient(circle, rgba(249,115,22,0.35) 0%, transparent 70%)",
        }}
      />

      {/* ── Main grid ── */}
      <div className="relative z-10 flex flex-col md:flex-row flex-1 items-stretch px-4 md:px-10 lg:px-16 pt-16 pb-24 gap-8 md:gap-12 max-w-[1400px] mx-auto w-full">

        {/* ── Video (mobile: top) ── */}
        <motion.div
          variants={fadeIn}
          initial="hidden"
          animate="show"
          className="order-first md:order-last md:w-[40%] flex items-center justify-center"
        >
          <div className="w-full max-w-[280px] md:max-w-none mx-auto">
            {/* Gradient border wrapper */}
            <div
              className="rounded-2xl p-[2px] shadow-2xl"
              style={{
                background: "linear-gradient(135deg, rgba(249,115,22,0.7) 0%, rgba(249,115,22,0.15) 50%, rgba(249,115,22,0.5) 100%)",
                boxShadow: "0 0 40px rgba(249,115,22,0.25), 0 25px 60px rgba(0,0,0,0.6)",
              }}
            >
              {/* 9:16 aspect ratio container */}
              <div className="rounded-[14px] overflow-hidden bg-black" style={{ aspectRatio: "9/16" }}>
                {drive_media_id ? (
                  <iframe
                    src={`https://drive.google.com/file/d/${drive_media_id}/preview`}
                    className="w-full h-full border-0"
                    allow="autoplay"
                    title="Video de contenido analizado"
                    allowFullScreen
                  />
                ) : (
                  <PlatformIcon platform={platform} />
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Text column ── */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="order-last md:order-first md:w-[60%] flex flex-col justify-center gap-6"
        >
          {/* Platform badge */}
          <motion.div variants={fadeUp}>
            <span
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase border"
              style={{
                backgroundColor: "rgba(249,115,22,0.1)",
                borderColor: "rgba(249,115,22,0.4)",
                color: "#f97316",
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full bg-orange-500"
                style={{ boxShadow: "0 0 6px rgba(249,115,22,0.8)" }}
              />
              {platformLabel(platform)} · {contentTypeLabel(content_type)}
            </span>
          </motion.div>

          {/* Title */}
          <motion.div variants={fadeUp}>
            <h1 className="text-5xl md:text-7xl font-black text-white leading-none tracking-tight">
              ANÁLISIS
              <br />
              <span
                className="text-transparent bg-clip-text"
                style={{
                  backgroundImage: "linear-gradient(90deg, #f97316 0%, #fb923c 60%, #fdba74 100%)",
                }}
              >
                ESTRATÉGICO
              </span>
            </h1>
          </motion.div>

          {/* Creator */}
          <motion.div variants={fadeUp} className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-orange-500/20 border border-orange-500/40 flex items-center justify-center">
              <span className="text-orange-400 font-bold text-sm">@</span>
            </div>
            <span className="text-lg font-semibold text-white">
              @{creator_username}
            </span>
            {creator_followers != null && (
              <>
                <span className="text-neutral-600">·</span>
                <span className="text-sm text-neutral-400 font-medium">
                  {formatNumber(creator_followers)} seguidores
                </span>
              </>
            )}
          </motion.div>

          {/* Stats pills */}
          <motion.div variants={fadeUp} className="flex flex-wrap gap-2">
            {/* Duration */}
            <StatPill label="Duración" value={formatDuration(duration_seconds)} className="bg-white/5 border-white/10 text-white" />

            {/* Views */}
            <StatPill
              label="Vistas"
              value={formatNumber(metrics.views)}
              className="bg-white/5 border-white/10 text-white"
            />

            {/* Likes */}
            <StatPill
              label="Likes"
              value={formatNumber(metrics.likes)}
              className="bg-white/5 border-white/10 text-white"
            />

            {/* ER */}
            <div
              className={`inline-flex flex-col items-center px-4 py-2 rounded-xl border text-center min-w-[72px] ${erBg(er)}`}
            >
              <span className={`text-lg font-black leading-none ${erColor(er)}`}>
                {er != null ? `${er.toFixed(1)}%` : "—"}
              </span>
              <span className="text-[10px] font-medium text-neutral-500 mt-0.5 uppercase tracking-wide">
                ER
              </span>
            </div>
          </motion.div>

          {/* Score circle */}
          <motion.div variants={fadeUp}>
            <ScoreCircle score={totalScore} />
          </motion.div>

          {/* CTA */}
          <motion.div variants={fadeUp}>
            <button
              onClick={() => {
                const next = document.getElementById("analysis-sections");
                if (next) next.scrollIntoView({ behavior: "smooth" });
                else window.scrollBy({ top: window.innerHeight * 0.9, behavior: "smooth" });
              }}
              className="group inline-flex items-center gap-3 px-6 py-3 rounded-xl border font-semibold text-sm text-orange-400 transition-all duration-300"
              style={{
                borderColor: "rgba(249,115,22,0.5)",
                backgroundColor: "rgba(249,115,22,0.06)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.boxShadow =
                  "0 0 24px rgba(249,115,22,0.35), 0 0 48px rgba(249,115,22,0.15)";
                (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                  "rgba(249,115,22,0.12)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
                (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                  "rgba(249,115,22,0.06)";
              }}
            >
              Ver análisis completo
              <motion.span
                animate={{ y: [0, 3, 0] }}
                transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 5v14M5 12l7 7 7-7" />
                </svg>
              </motion.span>
            </button>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <ScrollIndicator />

      {/* Bottom fade */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-24"
        style={{
          background: "linear-gradient(to bottom, transparent, rgba(10,10,10,0.6))",
        }}
      />
    </section>
  );
}

// ─── StatPill helper ──────────────────────────────────────────────────────────

function StatPill({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div
      className={`inline-flex flex-col items-center px-4 py-2 rounded-xl border min-w-[72px] text-center ${className ?? ""}`}
    >
      <span className="text-lg font-black leading-none">{value}</span>
      <span className="text-[10px] font-medium text-neutral-500 mt-0.5 uppercase tracking-wide">
        {label}
      </span>
    </div>
  );
}
