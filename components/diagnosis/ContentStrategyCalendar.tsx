"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import SectionHeader from "@/components/report/shared/SectionHeader";

interface Props {
  contentStrategy?: any;
}

const FORMAT_COLORS: Record<string, string> = {
  reel: "bg-pink-400/10 text-pink-400 border-pink-400/20",
  carousel: "bg-blue-400/10 text-blue-400 border-blue-400/20",
  stories: "bg-yellow-400/10 text-yellow-400 border-yellow-400/20",
  static: "bg-gray-400/10 text-gray-400 border-gray-400/20",
};

export default function ContentStrategyCalendar({ contentStrategy }: Props) {
  const [showAll, setShowAll] = useState(false);

  if (!contentStrategy) return null;

  const { pillars, calendar_30d, format_mix, best_times } = contentStrategy;
  const hasData = pillars || calendar_30d || format_mix;
  if (!hasData) return null;

  const calendarItems = calendar_30d || [];
  const visibleItems = showAll ? calendarItems : calendarItems.slice(0, 10);

  return (
    <section className="max-w-4xl mx-auto px-4 py-10 space-y-6">
      {/* Content Pillars */}
      {pillars && pillars.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="card-premium p-6 space-y-4"
        >
          <SectionHeader
            icon={<span className="text-lg">🏛️</span>}
            title="Pilares de Contenido"
            subtitle="Estructura estratégica recomendada"
            badge="v7"
          />
          <div className="space-y-3">
            {pillars.map((pillar: any, i: number) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-zinc-900 border border-zinc-800 rounded-xl p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-white font-semibold text-sm">{pillar.name}</h4>
                  <span className="text-kreoon font-bold text-sm">{pillar.percentage}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-zinc-800 overflow-hidden mb-2">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-kreoon to-purple-400"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${pillar.percentage}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                  />
                </div>
                <p className="text-xs text-gray-400">{pillar.description}</p>
                {pillar.example_posts && pillar.example_posts.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {pillar.example_posts.map((ex: string, j: number) => (
                      <span key={j} className="text-xs px-2 py-1 rounded bg-zinc-800/60 text-gray-400 italic">
                        &quot;{ex}&quot;
                      </span>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Format Mix */}
      {format_mix && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="card-premium p-6 space-y-4"
        >
          <SectionHeader
            icon={<span className="text-lg">🎨</span>}
            title="Mix de Formatos"
            subtitle="Distribución recomendada de formatos"
          />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {Object.entries(format_mix).map(([key, val]: [string, any]) => (
              <div key={key} className="bg-zinc-800/60 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-white">{val.percentage}%</p>
                <p className="text-xs text-kreoon font-semibold capitalize mt-1">{key}</p>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">{val.why}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Best Times */}
      {best_times && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="card-premium p-6 space-y-3"
        >
          <SectionHeader
            icon={<span className="text-lg">⏰</span>}
            title="Mejores Horarios"
            subtitle="Cuándo publicar para máximo alcance"
          />
          <div className="flex flex-wrap gap-3">
            {best_times.days && best_times.days.length > 0 && (
              <div className="bg-zinc-800/40 rounded-xl p-3">
                <p className="text-xs text-gray-500 mb-1">Días</p>
                <p className="text-sm text-white font-medium capitalize">{best_times.days.join(", ")}</p>
              </div>
            )}
            {best_times.hours && best_times.hours.length > 0 && (
              <div className="bg-zinc-800/40 rounded-xl p-3">
                <p className="text-xs text-gray-500 mb-1">Horas</p>
                <p className="text-sm text-white font-medium">{best_times.hours.join(", ")}</p>
              </div>
            )}
          </div>
          {best_times.reason && (
            <p className="text-xs text-gray-400">{best_times.reason}</p>
          )}
        </motion.div>
      )}

      {/* Calendar 30d */}
      {calendarItems.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="card-premium p-6 space-y-4"
        >
          <SectionHeader
            icon={<span className="text-lg">📅</span>}
            title="Calendario de 30 Días"
            subtitle={`${calendarItems.length} publicaciones planificadas`}
            badge="v7"
          />

          <div className="space-y-2">
            {visibleItems.map((item: any, i: number) => {
              const formatClass = FORMAT_COLORS[item.format?.toLowerCase()] || FORMAT_COLORS.static;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.03 }}
                  className="flex items-center gap-3 bg-zinc-900/60 border border-zinc-800/50 rounded-lg p-3"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center">
                    <span className="text-white font-bold text-sm">D{item.day}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-200 line-clamp-1">{item.idea}</p>
                    <p className="text-xs text-gray-500">{item.pillar}</p>
                  </div>
                  <span className={`flex-shrink-0 text-xs px-2 py-0.5 rounded-full border capitalize ${formatClass}`}>
                    {item.format}
                  </span>
                </motion.div>
              );
            })}
          </div>

          {calendarItems.length > 10 && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="w-full py-2 text-sm text-kreoon hover:text-kreoon/80 transition-colors"
            >
              {showAll ? "Ver menos" : `Ver las ${calendarItems.length} publicaciones`}
            </button>
          )}
        </motion.div>
      )}
    </section>
  );
}
