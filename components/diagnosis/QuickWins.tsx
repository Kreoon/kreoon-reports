"use client";

import { motion } from "framer-motion";
import SectionHeader from "@/components/report/shared/SectionHeader";

interface Props {
  quickWins?: { action: string; expected_impact: string }[];
  stealWorthyIdeas?: string[];
}

export default function QuickWins({ quickWins, stealWorthyIdeas }: Props) {
  if ((!quickWins || quickWins.length === 0) && (!stealWorthyIdeas || stealWorthyIdeas.length === 0)) return null;

  return (
    <section className="max-w-4xl mx-auto px-4 py-10">
      <div className="card-premium p-6 space-y-6">
        {quickWins && quickWins.length > 0 && (
          <>
            <SectionHeader
              icon={<span className="text-lg">⚡</span>}
              title="Quick Wins"
              subtitle="Acciones inmediatas de alto impacto"
              badge={`${quickWins.length}`}
            />
            <div className="space-y-3">
              {quickWins.map((qw, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 hover:border-kreoon/30 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-yellow-400/10 flex items-center justify-center">
                      <span className="text-yellow-400 font-bold text-sm">{i + 1}</span>
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm text-white font-medium">{qw.action}</p>
                      <p className="text-xs text-gray-400">{qw.expected_impact}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}

        {stealWorthyIdeas && stealWorthyIdeas.length > 0 && (
          <>
            {quickWins && quickWins.length > 0 && <div className="divider-kreoon" />}
            <SectionHeader
              icon={<span className="text-lg">💎</span>}
              title="Ideas para Implementar"
              subtitle="Estrategias probadas del sector"
            />
            <div className="space-y-2">
              {stealWorthyIdeas.map((idea, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="flex items-start gap-3 bg-zinc-800/40 rounded-lg p-3"
                >
                  <span className="text-kreoon mt-0.5 flex-shrink-0">→</span>
                  <p className="text-sm text-gray-300">{idea}</p>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
