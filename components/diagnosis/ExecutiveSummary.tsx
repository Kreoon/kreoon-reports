"use client";

import { motion } from "framer-motion";
import SectionHeader from "@/components/report/shared/SectionHeader";

interface Props {
  summary?: string;
  contentAudit?: any;
}

export default function ExecutiveSummary({ summary, contentAudit }: Props) {
  const whatsWorking = contentAudit?.whats_working || [];
  const whatsFailing = contentAudit?.whats_failing || [];
  const adAnalysis = contentAudit?.ad_analysis;

  if (!summary && whatsWorking.length === 0 && whatsFailing.length === 0) return null;

  return (
    <section className="max-w-4xl mx-auto px-4 py-10">
      <div className="card-premium p-6 space-y-6">
        {/* Executive Summary */}
        {summary && (
          <>
            <SectionHeader
              icon={<span className="text-lg">📝</span>}
              title="Resumen Ejecutivo"
              subtitle="Visión general del diagnóstico"
              badge="v7"
            />
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="bg-zinc-800/40 rounded-xl p-5 border-l-4 border-kreoon"
            >
              <p className="text-sm text-gray-300 leading-relaxed">{summary}</p>
            </motion.div>
          </>
        )}

        {/* What's working vs failing */}
        {(whatsWorking.length > 0 || whatsFailing.length > 0) && (
          <>
            {summary && <div className="divider-kreoon" />}
            <SectionHeader
              icon={<span className="text-lg">🔍</span>}
              title="Auditoría de Contenido Detallada"
              subtitle="Lo que funciona y lo que necesita mejorar"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* What's working */}
              {whatsWorking.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-green-400 uppercase tracking-wider flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-400" />
                    Lo que funciona
                  </h4>
                  {whatsWorking.map((item: any, i: number) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="bg-green-400/5 border border-green-400/10 rounded-lg p-3"
                    >
                      <p className="text-sm text-gray-200 font-medium">{item.insight}</p>
                      {item.evidence && (
                        <p className="text-xs text-gray-500 mt-1">{item.evidence}</p>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}

              {/* What's failing */}
              {whatsFailing.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-red-400 uppercase tracking-wider flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-400" />
                    Lo que necesita mejorar
                  </h4>
                  {whatsFailing.map((item: any, i: number) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="bg-red-400/5 border border-red-400/10 rounded-lg p-3"
                    >
                      <p className="text-sm text-gray-200 font-medium">{item.insight}</p>
                      {item.evidence && (
                        <p className="text-xs text-gray-500 mt-1">{item.evidence}</p>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* Ad Analysis */}
        {adAnalysis && (
          <>
            <div className="divider-kreoon" />
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                <span>📢</span> Análisis de Publicidad
              </h4>
              <div className="bg-zinc-800/40 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`w-2 h-2 rounded-full ${adAnalysis.has_ads ? "bg-green-400" : "bg-yellow-400"}`} />
                  <span className="text-xs text-gray-400">
                    {adAnalysis.has_ads ? "Anuncios detectados" : "Sin anuncios activos"}
                  </span>
                </div>
                {adAnalysis.summary && (
                  <p className="text-sm text-gray-300 mb-2">{adAnalysis.summary}</p>
                )}
                {adAnalysis.recommendation && (
                  <p className="text-sm text-kreoon">{adAnalysis.recommendation}</p>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
