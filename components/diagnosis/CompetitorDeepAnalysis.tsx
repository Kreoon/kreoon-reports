"use client";

import { motion } from "framer-motion";
import SectionHeader from "@/components/report/shared/SectionHeader";

interface Props {
  competitors?: any[];
}

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

export default function CompetitorDeepAnalysis({ competitors }: Props) {
  if (!competitors || competitors.length === 0) return null;

  return (
    <section className="max-w-4xl mx-auto px-4 py-10">
      <div className="card-premium p-6 space-y-6">
        <SectionHeader
          icon={<span className="text-lg">🔬</span>}
          title="Análisis Profundo de Competidores"
          subtitle={`${competitors.length} competidores analizados en detalle`}
          badge="v7"
        />

        <div className="space-y-4">
          {competitors.map((comp, i) => (
            <motion.div
              key={comp.name + i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-3"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h4 className="text-white font-semibold">{comp.name}</h4>
                  {comp.handle && (
                    <span className="text-xs text-kreoon">{comp.handle}</span>
                  )}
                </div>
                <div className="flex gap-4 text-right text-sm">
                  {comp.followers != null && (
                    <div>
                      <p className="text-white font-bold">{formatNumber(comp.followers)}</p>
                      <p className="text-xs text-gray-500">seguidores</p>
                    </div>
                  )}
                  {comp.engagement_rate != null && (
                    <div>
                      <p className="text-white font-bold">{comp.engagement_rate}%</p>
                      <p className="text-xs text-gray-500">ER</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Posting frequency */}
              {comp.posting_frequency && (
                <p className="text-xs text-gray-500">Frecuencia: {comp.posting_frequency}</p>
              )}

              {/* Strengths & Weaknesses */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {comp.strengths && comp.strengths.length > 0 && (
                  <div className="space-y-1.5">
                    <p className="text-xs font-semibold text-green-400 uppercase tracking-wider">Fortalezas</p>
                    <ul className="space-y-1">
                      {comp.strengths.map((s: string, j: number) => (
                        <li key={j} className="flex items-start gap-1.5 text-xs text-gray-300">
                          <span className="text-green-400 mt-0.5 flex-shrink-0">+</span>
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {comp.weaknesses && comp.weaknesses.length > 0 && (
                  <div className="space-y-1.5">
                    <p className="text-xs font-semibold text-red-400 uppercase tracking-wider">Debilidades</p>
                    <ul className="space-y-1">
                      {comp.weaknesses.map((w: string, j: number) => (
                        <li key={j} className="flex items-start gap-1.5 text-xs text-gray-300">
                          <span className="text-red-400 mt-0.5 flex-shrink-0">-</span>
                          <span>{w}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Dominant formats */}
              {comp.dominant_formats && comp.dominant_formats.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {comp.dominant_formats.map((f: string, j: number) => (
                    <span key={j} className="px-2 py-0.5 rounded-full bg-zinc-800 text-xs text-gray-400">
                      {f}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
