"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ExternalLink } from "lucide-react";
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
  if (er >= 3) return "text-purple-400";
  return "text-red-400";
}

function erBg(er: number | undefined): string {
  if (er == null) return "bg-gray-400/10 border-gray-400/30";
  if (er >= 5) return "bg-emerald-400/10 border-emerald-400/30";
  if (er >= 3) return "bg-purple-400/10 border-purple-400/30";
  return "bg-red-400/10 border-red-400/30";
}

function scoreLabel(score: number): string {
  if (score === 0) return "PENDIENTE";
  if (score >= 80) return "EXCELENTE";
  if (score >= 60) return "BUENO";
  return "MEJORABLE";
}

function scoreGradient(score: number): { stroke: string; label: string } {
  if (score >= 80) return { stroke: "#22c55e", label: "text-emerald-400" };
  if (score >= 60) return { stroke: "#7c3aed", label: "text-purple-400" };
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
      <div className="w-20 h-20 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center">
        <span className="text-2xl font-black text-purple-400">{icons[platform]}</span>
      </div>
      <span className="text-sm text-neutral-500 font-medium">Sin vista previa</span>
    </div>
  );
}

// ─── Social Media Embed URL ───────────────────────────────────────────────

function getSocialEmbedUrl(originalUrl: string, platform: ReportData["platform"]): string | null {
  if (platform === "instagram") {
    const match = originalUrl.match(/\/p\/([A-Za-z0-9_-]+)/);
    if (match) return `https://www.instagram.com/p/${match[1]}/embed/`;
    // Also handle /reel/ URLs
    const reelMatch = originalUrl.match(/\/reel\/([A-Za-z0-9_-]+)/);
    if (reelMatch) return `https://www.instagram.com/p/${reelMatch[1]}/embed/`;
  }
  if (platform === "tiktok") {
    const match = originalUrl.match(/\/video\/(\d+)/);
    if (match) return `https://www.tiktok.com/embed/v2/${match[1]}`;
  }
  if (platform === "youtube") {
    // Handle youtu.be/ID, youtube.com/watch?v=ID, youtube.com/shorts/ID
    let videoId: string | null = null;
    const shortMatch = originalUrl.match(/youtu\.be\/([A-Za-z0-9_-]+)/);
    const longMatch = originalUrl.match(/[?&]v=([A-Za-z0-9_-]+)/);
    const shortsMatch = originalUrl.match(/\/shorts\/([A-Za-z0-9_-]+)/);
    if (shortMatch) videoId = shortMatch[1];
    else if (longMatch) videoId = longMatch[1];
    else if (shortsMatch) videoId = shortsMatch[1];
    if (videoId) return `https://www.youtube.com/embed/${videoId}`;
  }
  return null;
}

// ─── Drive Embed with Fallback ────────────────────────────────────────────

function DriveEmbed({ driveMediaId, platform }: { driveMediaId: string; platform: ReportData["platform"] }) {
  const [failed, setFailed] = useState(false);
  const driveUrl = `https://drive.google.com/file/d/${driveMediaId}/preview`;
  const openUrl = `https://drive.google.com/file/d/${driveMediaId}/view`;

  if (failed) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-4 bg-neutral-900 px-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-400">
            <polygon points="23 7 16 12 23 17 23 7" />
            <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
          </svg>
        </div>
        <p className="text-sm text-neutral-400">Vista previa no disponible</p>
        <a
          href={openUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-500/20 border border-purple-500/40 text-purple-400 text-sm font-semibold hover:bg-purple-500/30 transition-colors"
        >
          Abrir video
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
        </a>
      </div>
    );
  }

  return (
    <iframe
      src={driveUrl}
      className="w-full h-full border-0"
      allow="autoplay"
      title="Video de contenido analizado"
      allowFullScreen
      onError={() => setFailed(true)}
    />
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
          <span className="text-3xl font-black text-white leading-none">{score === 0 ? "—" : animated}</span>
          <span className="text-xs text-neutral-400 font-medium">{score === 0 ? "" : "/100"}</span>
        </div>
      </div>
      {/* Badge */}
      <span
        className={`text-xs font-bold tracking-widest px-3 py-1 rounded-full border ${
          score >= 80
            ? "bg-emerald-400/10 border-emerald-400/40 text-emerald-400"
            : score >= 60
            ? "bg-purple-400/10 border-purple-400/40 text-purple-400"
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
  effectiveScores?: ReportData['scores'];
  viewsEstimated?: boolean;
  estimatedViews?: number | null;
  effectiveER?: number;
}

export default function HeroSection({ data, effectiveScores, viewsEstimated, estimatedViews, effectiveER }: HeroSectionProps) {
  const { platform, content_type, creator_username, creator_followers, duration_seconds, metrics, drive_media_id, scores, original_url, creator_verified, creator_bio, published_at, engagement_rate, niche, sound_used } = data;
  const rawER = effectiveER ?? engagement_rate ?? metrics.engagement_rate;
  const er = (rawER != null && rawER > 0) ? rawER : undefined;
  const displayViews = viewsEstimated && estimatedViews ? estimatedViews : metrics.views;
  const totalScore = effectiveScores?.total ?? scores.total;
  const socialEmbedUrl = original_url ? getSocialEmbedUrl(original_url, platform) : null;
  const pLabel = platformLabel(platform);

  return (
    <section
      className="noise-overlay bg-mesh-gradient relative min-h-screen w-full flex flex-col overflow-hidden"
    >
      {/* Subtle radial glow top-left */}
      <div
        className="pointer-events-none absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full opacity-20"
        style={{
          background: "radial-gradient(circle, rgba(124,58,237,0.35) 0%, transparent 70%)",
        }}
      />
      {/* Subtle radial glow right (blue-ish) */}
      <div
        className="pointer-events-none absolute top-1/3 -right-32 w-[500px] h-[500px] rounded-full opacity-10"
        style={{
          background: "radial-gradient(circle, rgba(59,130,246,0.3) 0%, transparent 70%)",
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
              className="card-premium rounded-2xl p-[2px] shadow-2xl animate-pulse-kreoon"
              style={{
                background: "linear-gradient(135deg, rgba(124,58,237,0.7) 0%, rgba(124,58,237,0.15) 50%, rgba(124,58,237,0.5) 100%)",
                boxShadow: "0 0 60px rgba(124,58,237,0.3), 0 0 100px rgba(124,58,237,0.1), 0 25px 60px rgba(0,0,0,0.6)",
              }}
            >
              {/* 9:16 aspect ratio container */}
              <div className="rounded-[14px] overflow-hidden bg-black" style={{ aspectRatio: "9/16" }}>
                {socialEmbedUrl ? (
                  <iframe
                    src={socialEmbedUrl}
                    className="w-full h-full border-0"
                    allow="autoplay; encrypted-media"
                    title="Video de contenido analizado"
                    allowFullScreen
                  />
                ) : drive_media_id ? (
                  <DriveEmbed driveMediaId={drive_media_id} platform={platform} />
                ) : (
                  <PlatformIcon platform={platform} />
                )}
              </div>
              {original_url && (
                <a
                  href={original_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 mt-3 text-xs text-gray-400 hover:text-purple-400 transition-colors"
                >
                  <ExternalLink size={12} />
                  Ver post original en {pLabel}
                </a>
              )}
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
          <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-2">
            <span
              className="badge-ai inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase border"
              style={{
                backgroundColor: "rgba(124,58,237,0.1)",
                borderColor: "rgba(124,58,237,0.4)",
                color: "#7c3aed",
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full bg-purple-500"
                style={{ boxShadow: "0 0 6px rgba(124,58,237,0.8)" }}
              />
              AI REPORT · {platformLabel(platform)} · {contentTypeLabel(content_type)}
            </span>
            {niche && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border bg-blue-500/10 border-blue-500/30 text-blue-400">
                {niche}
              </span>
            )}
          </motion.div>

          {/* Title */}
          <motion.div variants={fadeUp}>
            <h1
              className="text-5xl md:text-7xl font-black leading-none tracking-tight"
              style={{ textShadow: "0 0 40px rgba(124,58,237,0.15)" }}
            >
              <span className="text-white/80">ANÁLISIS</span>
              <br />
              <span
                className="text-transparent bg-clip-text"
                style={{
                  backgroundImage: "linear-gradient(90deg, #7c3aed 0%, #a855f7 60%, #c084fc 100%)",
                }}
              >
                ESTRATÉGICO
              </span>
            </h1>
          </motion.div>

          {/* Creator */}
          <motion.div variants={fadeUp} className="flex flex-col gap-1">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-500/20 border border-purple-500/40 flex items-center justify-center">
                <span className="text-purple-400 font-bold text-sm">@</span>
              </div>
              <span className="text-lg font-semibold text-white">
                @{creator_username}
              </span>
              {creator_verified && (
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-purple-500" title="Cuenta verificada">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
              )}
              {creator_followers != null && (
                <>
                  <span className="text-neutral-600">·</span>
                  <span className="text-sm text-neutral-400 font-medium">
                    {formatNumber(creator_followers)} seguidores
                  </span>
                </>
              )}
            </div>
            {creator_bio && (
              <p className="text-sm text-neutral-500 ml-11 line-clamp-2">{creator_bio}</p>
            )}
          </motion.div>

          {/* Stats pills */}
          <motion.div variants={fadeUp} className="flex flex-wrap gap-2">
            {/* Duration */}
            <StatPill label="Duración" value={formatDuration(duration_seconds)} className="card-premium bg-white/[0.03] border-white/[0.08] backdrop-blur-sm text-white" />

            {/* Published date */}
            {published_at && (
              <StatPill
                label="Publicado"
                value={new Date(published_at).toLocaleDateString("es-CO", { day: "2-digit", month: "short" })}
                className="card-premium bg-white/[0.03] border-white/[0.08] backdrop-blur-sm text-white"
              />
            )}

            {/* Views */}
            <StatPill
              label={viewsEstimated && estimatedViews ? "Vistas (est.)" : "Vistas"}
              value={`${viewsEstimated && estimatedViews ? "~" : ""}${formatNumber(displayViews)}`}
              className="card-premium bg-white/[0.03] border-white/[0.08] backdrop-blur-sm text-white"
            />

            {/* Likes */}
            <StatPill
              label="Likes"
              value={formatNumber(metrics.likes)}
              className="card-premium bg-white/[0.03] border-white/[0.08] backdrop-blur-sm text-white"
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

          {/* Sound used */}
          {sound_used && (
            <motion.div variants={fadeUp} className="flex items-center gap-2 text-sm text-neutral-400">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-400 flex-shrink-0">
                <path d="M9 18V5l12-2v13" />
                <circle cx="6" cy="18" r="3" />
                <circle cx="18" cy="16" r="3" />
              </svg>
              <span className="truncate">{sound_used}</span>
            </motion.div>
          )}

          {/* Score circle */}
          <motion.div variants={fadeUp}>
            <ScoreCircle score={totalScore} />
          </motion.div>

          {/* CTA */}
          <motion.div variants={fadeUp}>
            <div className="relative inline-flex">
              {/* Animated glow ring */}
              <div
                className="absolute -inset-1 rounded-xl opacity-40 blur-md animate-pulse-kreoon"
                style={{
                  background: "linear-gradient(135deg, rgba(124,58,237,0.4), rgba(168,85,247,0.2))",
                }}
              />
            <button
              onClick={() => {
                const next = document.getElementById("analysis-sections");
                if (next) next.scrollIntoView({ behavior: "smooth" });
                else window.scrollBy({ top: window.innerHeight * 0.9, behavior: "smooth" });
              }}
              className="relative group inline-flex items-center gap-3 px-6 py-3 rounded-xl border font-semibold text-sm text-purple-400 transition-all duration-300"
              style={{
                borderColor: "rgba(124,58,237,0.5)",
                backgroundColor: "rgba(124,58,237,0.06)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.boxShadow =
                  "0 0 24px rgba(124,58,237,0.35), 0 0 48px rgba(124,58,237,0.15)";
                (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                  "rgba(124,58,237,0.12)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
                (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                  "rgba(124,58,237,0.06)";
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
            </div>
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
