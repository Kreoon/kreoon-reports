"use client";

import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import SectionHeader from "@/components/report/shared/SectionHeader";
import type { BrandDiagnosisData } from "@/types/report";

function ScoreBar({ label, score, color }: { label: string; score: number; color: string }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.3 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="space-y-1.5">
      <div className="flex justify-between text-sm">
        <span className="text-gray-300">{label}</span>
        <span className="font-bold text-white">{score}/100</span>
      </div>
      <div className="h-2.5 rounded-full bg-zinc-800 overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${color}`}
          initial={{ width: 0 }}
          animate={visible ? { width: `${score}%` } : {}}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

function FunnelBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-gray-400 w-12 text-right">{label}</span>
      <div className="flex-1 h-6 rounded-lg bg-zinc-800 overflow-hidden relative">
        <motion.div
          className={`h-full rounded-lg ${color}`}
          initial={{ width: 0 }}
          whileInView={{ width: `${value}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        />
        <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
          {value}%
        </span>
      </div>
    </div>
  );
}

interface Props {
  diagnosis: BrandDiagnosisData;
}

export default function StrategicDiagnosis({ diagnosis }: Props) {
  const { scores, funnel_coverage, pillar_distribution, hook_patterns } = diagnosis;

  return (
    <section id="diagnosis" className="max-w-4xl mx-auto px-4 py-10">
      <div className="card-premium p-6 space-y-8">
        <SectionHeader
          icon={<span className="text-lg">🎯</span>}
          title="Diagnóstico Estratégico"
          subtitle="Evaluación por dimensiones clave"
          badge="AI"
        />

        {/* Score bars */}
        <div className="space-y-4">
          <ScoreBar label="Calidad de Contenido" score={scores.content_quality} color="bg-gradient-to-r from-purple-500 to-pink-500" />
          <ScoreBar label="Estrategia" score={scores.strategy} color="bg-gradient-to-r from-blue-500 to-cyan-500" />
          <ScoreBar label="Consistencia" score={scores.consistency} color="bg-gradient-to-r from-green-500 to-emerald-500" />
          <ScoreBar label="Engagement" score={scores.engagement} color="bg-gradient-to-r from-yellow-500 to-orange-500" />
          <ScoreBar label="Branding" score={scores.branding} color="bg-gradient-to-r from-kreoon to-purple-400" />
        </div>

        <div className="divider-kreoon" />

        {/* Funnel coverage */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Cobertura del Embudo</h3>
          <div className="space-y-3">
            <FunnelBar label="TOFU" value={funnel_coverage.tofu} color="bg-gradient-to-r from-blue-400 to-blue-500" />
            <FunnelBar label="MOFU" value={funnel_coverage.mofu} color="bg-gradient-to-r from-yellow-400 to-yellow-500" />
            <FunnelBar label="BOFU" value={funnel_coverage.bofu} color="bg-gradient-to-r from-green-400 to-green-500" />
          </div>
        </div>

        <div className="divider-kreoon" />

        {/* Pillar distribution */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Distribución de Pilares</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {([
              { label: "Educar", value: pillar_distribution.educar, emoji: "📚" },
              { label: "Entretener", value: pillar_distribution.entretener, emoji: "🎭" },
              { label: "Inspirar", value: pillar_distribution.inspirar, emoji: "✨" },
              { label: "Vender", value: pillar_distribution.vender, emoji: "💰" },
            ] as const).map(({ label, value, emoji }) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-zinc-800/60 rounded-xl p-4 text-center"
              >
                <span className="text-2xl">{emoji}</span>
                <p className="text-2xl font-bold text-white mt-2">{value}%</p>
                <p className="text-xs text-gray-400">{label}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Hook patterns */}
        {hook_patterns.length > 0 && (
          <>
            <div className="divider-kreoon" />
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-white">Patrones de Hook Detectados</h3>
              <div className="flex flex-wrap gap-2">
                {hook_patterns.map((pattern, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 rounded-full bg-zinc-800 border border-zinc-700 text-sm text-gray-300"
                  >
                    {pattern}
                  </span>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
