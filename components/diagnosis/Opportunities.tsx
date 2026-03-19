"use client";

import { motion } from "framer-motion";
import SectionHeader from "@/components/report/shared/SectionHeader";
import type { BrandOpportunity } from "@/types/report";

const IMPACT_CONFIG = {
  high: { label: "Alto impacto", color: "text-green-400 bg-green-400/10 border-green-400/20" },
  medium: { label: "Impacto medio", color: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20" },
  low: { label: "Impacto bajo", color: "text-gray-400 bg-gray-400/10 border-gray-400/20" },
};

interface Props {
  opportunities: BrandOpportunity[];
}

export default function Opportunities({ opportunities }: Props) {
  if (opportunities.length === 0) return null;

  return (
    <section id="opportunities" className="max-w-4xl mx-auto px-4 py-10">
      <div className="card-premium p-6 space-y-6">
        <SectionHeader
          icon={<span className="text-lg">💡</span>}
          title="Oportunidades Identificadas"
          subtitle="Recomendaciones priorizadas por impacto"
          badge={`${opportunities.length}`}
        />

        <div className="space-y-4">
          {opportunities.map((opp, i) => {
            const impact = IMPACT_CONFIG[opp.impact] || IMPACT_CONFIG.medium;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-kreoon/30 transition-colors"
              >
                <div className="flex items-start gap-4">
                  {/* Priority number */}
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-kreoon/10 flex items-center justify-center">
                    <span className="text-kreoon font-bold text-lg">{opp.priority}</span>
                  </div>

                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-white font-semibold">{opp.title}</h4>
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${impact.color}`}>
                        {impact.label}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 leading-relaxed">
                      {opp.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
