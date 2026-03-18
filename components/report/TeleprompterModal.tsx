"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ScriptLine } from "@/types/report";

// ─── Types ─────────────────────────────────────────────────────────────────────

type Phase = "idle" | "countdown" | "playing" | "paused" | "complete";
type FontSize = "S" | "M" | "L";

const FONT_SIZE_MAP: Record<FontSize, string> = {
  S: "text-xl md:text-2xl",
  M: "text-2xl md:text-4xl",
  L: "text-3xl md:text-5xl",
};

// Speed 1–10 → pixels per animation frame at 60fps
// Speed 1 ≈ 0.5px/frame, Speed 10 ≈ 5px/frame
function speedToPxPerFrame(speed: number): number {
  return 0.4 + (speed - 1) * (4.6 / 9);
}

// ─── Section label colours ──────────────────────────────────────────────────────

const SECTION_COLOR: Record<ScriptLine["section"], string> = {
  hook: "#7c3aed",
  development: "#60a5fa",
  cta: "#4ade80",
  transition: "#a78bfa",
};

const SECTION_LABEL: Record<ScriptLine["section"], string> = {
  hook: "HOOK",
  development: "DESARROLLO",
  cta: "CTA",
  transition: "TRANSICIÓN",
};

// ─── Countdown display ─────────────────────────────────────────────────────────

const COUNTDOWN_STEPS: Array<{ label: string; color: string }> = [
  { label: "3", color: "#ffffff" },
  { label: "2", color: "#ffffff" },
  { label: "1", color: "#ffffff" },
  { label: "GO!", color: "#7c3aed" },
];

// ─── Component ─────────────────────────────────────────────────────────────────

interface TeleprompterModalProps {
  isOpen: boolean;
  onClose: () => void;
  script: ScriptLine[];
  versionLabel: string;
}

export default function TeleprompterModal({
  isOpen,
  onClose,
  script: rawScript,
  versionLabel,
}: TeleprompterModalProps) {
  // Fallback: if script is empty, show a single placeholder line
  const script: ScriptLine[] =
    rawScript.length > 0
      ? rawScript
      : [{ time: "", text: "No hay script disponible.", direction: "", section: "development" as const }];
  // ── Phase & scroll state
  const [phase, setPhase] = useState<Phase>("idle");
  const [countdownStep, setCountdownStep] = useState(0); // 0=3, 1=2, 2=1, 3=GO!
  const [speed, setSpeed] = useState(5);
  const [fontSize, setFontSize] = useState<FontSize>("M");
  const [showControls, setShowControls] = useState(true);
  const [scrollPct, setScrollPct] = useState(0); // 0–100 for progress bar
  const [activeLineIndex, setActiveLineIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  // ── Refs
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const offsetRef = useRef(0); // current translateY offset (negative = scrolled up)
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);
  const countdownTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lineRefsArr = useRef<Array<HTMLDivElement | null>>([]);

  // ── Portal mount guard
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // ── Reset when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      cancelAnimationFrame(rafRef.current ?? 0);
      clearTimeout(countdownTimerRef.current ?? undefined);
      clearTimeout(hideTimerRef.current ?? undefined);
      wakeLockRef.current?.release().catch(() => {});
      wakeLockRef.current = null;
      setPhase("idle");
      setCountdownStep(0);
      offsetRef.current = 0;
      setScrollPct(0);
      setActiveLineIndex(0);
      setShowControls(true);
    }
  }, [isOpen]);

  // ── Wake lock
  const acquireWakeLock = useCallback(async () => {
    try {
      if ("wakeLock" in navigator) {
        wakeLockRef.current = await navigator.wakeLock.request("screen");
      }
    } catch {
      // silently ignore — not critical
    }
  }, []);

  // ── Auto-hide controls after 3s
  const resetHideTimer = useCallback(() => {
    setShowControls(true);
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    if (phase === "playing") {
      hideTimerRef.current = setTimeout(() => setShowControls(false), 3000);
    }
  }, [phase]);

  useEffect(() => {
    if (phase === "playing") {
      resetHideTimer();
    } else {
      setShowControls(true);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    }
  }, [phase, resetHideTimer]);

  // ── Countdown logic
  const startCountdown = useCallback(() => {
    setPhase("countdown");
    setCountdownStep(0);

    let step = 0;
    const tick = () => {
      step++;
      if (step < COUNTDOWN_STEPS.length) {
        setCountdownStep(step);
        countdownTimerRef.current = setTimeout(tick, 1000);
      } else {
        // After GO! (1s), start playing
        countdownTimerRef.current = setTimeout(() => {
          setPhase("playing");
          acquireWakeLock();
        }, 1000);
      }
    };
    countdownTimerRef.current = setTimeout(tick, 1000);
  }, [acquireWakeLock]);

  // ── rAF scroll loop
  useEffect(() => {
    if (phase !== "playing") {
      cancelAnimationFrame(rafRef.current ?? 0);
      return;
    }

    const pxPerFrame = speedToPxPerFrame(speed);

    const animate = () => {
      const content = contentRef.current;
      const container = scrollContainerRef.current;
      if (!content || !container) {
        rafRef.current = requestAnimationFrame(animate);
        return;
      }

      const containerH = container.clientHeight;
      const contentH = content.scrollHeight;
      const maxOffset = contentH - containerH;

      offsetRef.current = Math.min(offsetRef.current + pxPerFrame, maxOffset);
      content.style.transform = `translateY(-${offsetRef.current}px)`;

      // Progress
      const pct = maxOffset > 0 ? (offsetRef.current / maxOffset) * 100 : 0;
      setScrollPct(pct);

      // Active line detection: find which line is nearest the guide line (1/3 from top)
      const guideY = containerH / 3;
      const lines = lineRefsArr.current;
      let closestIdx = 0;
      let closestDist = Infinity;
      lines.forEach((el, idx) => {
        if (!el) return;
        const elTop = el.offsetTop - offsetRef.current;
        const dist = Math.abs(elTop - guideY);
        if (dist < closestDist) {
          closestDist = dist;
          closestIdx = idx;
        }
      });
      setActiveLineIndex(closestIdx);

      if (offsetRef.current >= maxOffset) {
        setPhase("complete");
        setScrollPct(100);
        return;
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current ?? 0);
  }, [phase, speed]);

  // ── Keyboard shortcuts
  useEffect(() => {
    if (!isOpen) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === " " || e.code === "Space") {
        e.preventDefault();
        handlePlayPause();
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSpeed((s) => Math.min(10, s + 1));
        resetHideTimer();
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSpeed((s) => Math.max(1, s - 1));
        resetHideTimer();
        return;
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, phase]);

  // ── Play / Pause handler
  const handlePlayPause = useCallback(() => {
    if (phase === "idle" || phase === "complete") {
      // Reset scroll on complete restart
      if (phase === "complete") {
        offsetRef.current = 0;
        if (contentRef.current) contentRef.current.style.transform = "translateY(0px)";
        setScrollPct(0);
        setActiveLineIndex(0);
      }
      startCountdown();
    } else if (phase === "countdown") {
      // Cancel countdown, go idle
      clearTimeout(countdownTimerRef.current ?? undefined);
      setPhase("idle");
      setCountdownStep(0);
    } else if (phase === "playing") {
      setPhase("paused");
      resetHideTimer();
    } else if (phase === "paused") {
      setPhase("playing");
      acquireWakeLock();
    }
  }, [phase, startCountdown, resetHideTimer, acquireWakeLock]);

  // ── Mobile tap on content area = play/pause
  const handleContentTap = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      // Don't trigger if tapping controls bar
      const target = e.target as HTMLElement;
      if (target.closest("[data-controls]")) return;
      handlePlayPause();
    },
    [handlePlayPause]
  );

  // ── Controls interaction keeps them visible
  const handleControlsInteraction = useCallback(() => {
    resetHideTimer();
  }, [resetHideTimer]);

  if (!mounted || !isOpen) return null;

  // ── Icon helpers
  const PlayIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <path d="M8 5v14l11-7z" />
    </svg>
  );

  const PauseIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
    </svg>
  );

  const CloseIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
    </svg>
  );

  const isPlayPhase = phase === "playing";
  const canShowPlayPause = phase !== "countdown";

  // ── Render portal
  return createPortal(
    <div
      className="fixed inset-0 z-[9999] bg-black select-none"
      style={{ touchAction: "none" }}
      onClick={handleContentTap}
      onTouchStart={handleContentTap}
    >
      {/* ── Progress bar (top) ──────────────────────────────────────────── */}
      <div className="absolute top-0 left-0 right-0 h-[3px] z-10">
        <div
          className="h-full transition-none"
          style={{
            width: `${scrollPct}%`,
            background: "linear-gradient(90deg, #7c3aed, #a855f7)",
          }}
        />
      </div>

      {/* ── Reading guide line (1/3 from top) ────────────────────────────── */}
      <div
        className="absolute left-0 right-0 pointer-events-none z-10"
        style={{
          top: "33%",
          height: "72px",
          background:
            "linear-gradient(180deg, transparent 0%, rgba(124,58,237,0.08) 40%, rgba(124,58,237,0.12) 50%, rgba(124,58,237,0.08) 60%, transparent 100%)",
        }}
      >
        <div
          className="absolute left-0 right-0"
          style={{
            top: "50%",
            height: "1px",
            background:
              "linear-gradient(90deg, transparent 0%, rgba(124,58,237,0.4) 10%, rgba(124,58,237,0.6) 50%, rgba(124,58,237,0.4) 90%, transparent 100%)",
          }}
        />
      </div>

      {/* ── Scroll container ──────────────────────────────────────────────── */}
      <div
        ref={scrollContainerRef}
        className="absolute inset-0 overflow-hidden"
        style={{ paddingBottom: "80px" }}
      >
        {/* Top fade gradient */}
        <div
          className="absolute top-0 left-0 right-0 pointer-events-none z-[5]"
          style={{
            height: "15%",
            background: "linear-gradient(180deg, #000 0%, transparent 100%)",
          }}
        />

        {/* Bottom fade gradient */}
        <div
          className="absolute bottom-0 left-0 right-0 pointer-events-none z-[5]"
          style={{
            height: "20%",
            background: "linear-gradient(0deg, #000 0%, transparent 100%)",
          }}
        />

        <div
          ref={contentRef}
          className="px-6 md:px-16 lg:px-32 will-change-transform"
          style={{
            paddingTop: "40vh",
            paddingBottom: "60vh",
            transform: "translateY(0px)",
          }}
        >
          {script.map((line, idx) => {
            const isActive = idx === activeLineIndex;
            const sectionColor = SECTION_COLOR[line.section];

            return (
              <div
                key={idx}
                ref={(el) => {
                  lineRefsArr.current[idx] = el;
                }}
                className="mb-10"
              >
                {/* Section marker */}
                <div
                  className="font-mono text-xs mb-2 flex items-center gap-2 opacity-70"
                  style={{ color: sectionColor }}
                >
                  <span
                    className="inline-block px-1.5 py-0.5 rounded text-[10px] font-bold tracking-widest"
                    style={{
                      background: `${sectionColor}22`,
                      border: `1px solid ${sectionColor}44`,
                    }}
                  >
                    {SECTION_LABEL[line.section]}
                  </span>
                  <span className="opacity-60">{line.time}</span>
                  {line.on_screen_text && (
                    <span className="opacity-50 truncate max-w-xs">
                      [pantalla: {line.on_screen_text}]
                    </span>
                  )}
                </div>

                {/* Spoken text */}
                <p
                  className={`${FONT_SIZE_MAP[fontSize]} font-semibold leading-snug transition-all duration-150`}
                  style={{
                    color: isActive ? "#ffffff" : "rgba(255,255,255,0.45)",
                    textShadow: isActive
                      ? `0 0 40px ${sectionColor}99, 0 0 80px ${sectionColor}44`
                      : "none",
                  }}
                >
                  {line.text}
                </p>

                {/* Direction note */}
                {line.direction && (
                  <p
                    className="text-sm md:text-base mt-2 italic leading-relaxed"
                    style={{ color: "rgba(156,163,175,0.6)" }}
                  >
                    ↳ {line.direction}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Idle / Complete overlay ─────────────────────────────────────── */}
      <AnimatePresence>
        {(phase === "idle" || phase === "complete") && (
          <motion.div
            key="idle-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none"
          >
            <div className="text-center px-8">
              {phase === "complete" ? (
                <>
                  <p className="text-5xl mb-4">✓</p>
                  <p className="text-2xl font-bold text-white mb-2">¡Script completado!</p>
                  <p className="text-gray-400 text-lg">Presiona Play para repetir</p>
                </>
              ) : (
                <>
                  <p className="text-gray-500 text-lg mb-3">Listo para grabar</p>
                  <p className="text-gray-600 text-sm">Presiona Play o barra espaciadora</p>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Countdown overlay ──────────────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        {phase === "countdown" && (
          <motion.div
            key="countdown-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.3 } }}
            className="absolute inset-0 bg-black flex items-center justify-center z-30"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={countdownStep}
                initial={{ scale: 2.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1, transition: { duration: 0.25, ease: "easeOut" } }}
                exit={{ scale: 0.5, opacity: 0, transition: { duration: 0.2 } }}
                className="text-9xl font-black leading-none"
                style={{ color: COUNTDOWN_STEPS[countdownStep]?.color ?? "#fff" }}
              >
                {COUNTDOWN_STEPS[countdownStep]?.label}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Paused badge ───────────────────────────────────────────────────── */}
      <AnimatePresence>
        {phase === "paused" && (
          <motion.div
            key="paused-badge"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none"
          >
            <div
              className="px-8 py-4 rounded-2xl text-2xl font-bold tracking-widest"
              style={{
                background: "rgba(0,0,0,0.75)",
                border: "1px solid rgba(124,58,237,0.4)",
                color: "#7c3aed",
                backdropFilter: "blur(8px)",
              }}
            >
              II PAUSADO
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Controls bar ───────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            key="controls-bar"
            data-controls="true"
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1, transition: { duration: 0.2, ease: "easeOut" } }}
            exit={{ y: 80, opacity: 0, transition: { duration: 0.2 } }}
            className="absolute bottom-0 left-0 right-0 z-40 flex items-center gap-3 px-4 md:px-6"
            style={{
              height: "72px",
              background:
                "linear-gradient(0deg, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.85) 100%)",
              borderTop: "1px solid rgba(255,255,255,0.06)",
              backdropFilter: "blur(12px)",
            }}
            onClick={(e) => {
              e.stopPropagation();
              handleControlsInteraction();
            }}
            onTouchStart={(e) => {
              e.stopPropagation();
              handleControlsInteraction();
            }}
          >
            {/* Version label */}
            <span
              className="text-xs font-mono truncate max-w-[80px] md:max-w-[140px] shrink-0"
              style={{ color: "#7c3aed" }}
            >
              {versionLabel}
            </span>

            <div className="flex-1" />

            {/* Speed control */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold transition-colors hover:bg-white/10 active:bg-white/20 text-gray-300"
                onClick={() => setSpeed((s) => Math.max(1, s - 1))}
                aria-label="Velocidad menos"
              >
                −
              </button>
              <div className="flex flex-col items-center w-8">
                <span className="text-xs text-gray-500 leading-none mb-0.5">vel</span>
                <span className="text-sm font-bold text-white leading-none">{speed}</span>
              </div>
              <button
                className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold transition-colors hover:bg-white/10 active:bg-white/20 text-gray-300"
                onClick={() => setSpeed((s) => Math.min(10, s + 1))}
                aria-label="Velocidad más"
              >
                +
              </button>
            </div>

            {/* Separator */}
            <div className="w-px h-7 bg-white/10 shrink-0" />

            {/* Font size */}
            <div className="flex items-center gap-1 shrink-0">
              {(["S", "M", "L"] as FontSize[]).map((sz) => (
                <button
                  key={sz}
                  className="w-7 h-7 rounded flex items-center justify-center text-xs font-bold transition-colors"
                  style={{
                    background: fontSize === sz ? "rgba(124,58,237,0.25)" : "transparent",
                    color: fontSize === sz ? "#7c3aed" : "rgba(255,255,255,0.4)",
                    border: fontSize === sz ? "1px solid rgba(124,58,237,0.5)" : "1px solid transparent",
                  }}
                  onClick={() => setFontSize(sz)}
                  aria-label={`Tamaño de fuente ${sz}`}
                >
                  {sz}
                </button>
              ))}
            </div>

            {/* Separator */}
            <div className="w-px h-7 bg-white/10 shrink-0" />

            {/* Play / Pause */}
            {canShowPlayPause && (
              <button
                className="w-10 h-10 rounded-full flex items-center justify-center transition-colors shrink-0"
                style={{
                  background: "rgba(124,58,237,0.2)",
                  border: "1px solid rgba(124,58,237,0.5)",
                  color: "#7c3aed",
                }}
                onClick={handlePlayPause}
                aria-label={isPlayPhase ? "Pausar" : "Reproducir"}
              >
                {isPlayPhase ? <PauseIcon /> : <PlayIcon />}
              </button>
            )}

            {/* Close */}
            <button
              className="w-9 h-9 rounded-full flex items-center justify-center transition-colors hover:bg-white/10 active:bg-white/20 shrink-0"
              style={{ color: "rgba(255,255,255,0.5)" }}
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              aria-label="Cerrar teleprompter"
            >
              <CloseIcon />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>,
    document.body
  );
}
