"use client";

import { motion } from "framer-motion";
import SectionHeader from "@/components/report/shared/SectionHeader";
import type { BrandCompetitor, BrandAdEntry } from "@/types/report";

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

interface Props {
  competitors: BrandCompetitor[];
  competitorInsights: string;
  adInsights: string;
  adLibrary: { brand_ads: BrandAdEntry[]; competitor_ads: BrandAdEntry[] };
}

export default function CompetitorAnalysis({ competitors, competitorInsights, adInsights, adLibrary }: Props) {
  const hasCompetitors = competitors && competitors.length > 0;
  const hasAds = adLibrary && (adLibrary.brand_ads?.length > 0 || adLibrary.competitor_ads?.length > 0);

  if (!hasCompetitors && !competitorInsights) return null;

  return (
    <section id="competitors" className="max-w-4xl mx-auto px-4 py-10">
      <div className="card-premium p-6 space-y-8">
        <SectionHeader
          icon={<span className="text-lg">⚔️</span>}
          title="Análisis Competitivo"
          subtitle={`${competitors?.length || 0} competidores analizados`}
          badge="AI"
        />

        {/* Competitor insights summary */}
        {competitorInsights && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="bg-zinc-800/40 rounded-xl p-4 border-l-4 border-kreoon"
          >
            <p className="text-sm text-gray-300 leading-relaxed">{competitorInsights}</p>
          </motion.div>
        )}

        {/* Competitor cards */}
        {hasCompetitors && (
          <div className="space-y-4">
            {competitors.map((comp, i) => (
              <motion.div
                key={comp.username + i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-zinc-900 border border-zinc-800 rounded-xl p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="text-white font-semibold">{comp.name}</h4>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-800 text-gray-400 capitalize">
                        {comp.platform}
                      </span>
                    </div>
                    <a
                      href={comp.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-kreoon hover:underline"
                    >
                      @{comp.username} →
                    </a>
                  </div>

                  <div className="flex gap-4 text-right text-sm">
                    {comp.followers !== undefined && (
                      <div>
                        <p className="text-white font-bold">{formatNumber(comp.followers)}</p>
                        <p className="text-xs text-gray-500">seguidores</p>
                      </div>
                    )}
                    {comp.engagement_rate !== undefined && (
                      <div>
                        <p className="text-white font-bold">{comp.engagement_rate}%</p>
                        <p className="text-xs text-gray-500">ER</p>
                      </div>
                    )}
                    {comp.posts_per_week !== undefined && (
                      <div>
                        <p className="text-white font-bold">{comp.posts_per_week}</p>
                        <p className="text-xs text-gray-500">posts/sem</p>
                      </div>
                    )}
                  </div>
                </div>

                <p className="text-xs text-gray-400 mt-3 leading-relaxed">
                  {comp.why_successful}
                </p>

                {/* Top posts */}
                {comp.top_posts && comp.top_posts.length > 0 && (
                  <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                    {comp.top_posts.slice(0, 3).map((post, j) => (
                      <a
                        key={j}
                        href={post.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-shrink-0 w-48 bg-zinc-800 rounded-lg p-2 text-xs hover:border-kreoon/30 border border-transparent transition-colors"
                      >
                        <p className="text-gray-300 line-clamp-2">{post.caption?.slice(0, 80) || "Sin caption"}</p>
                        <div className="flex gap-2 mt-1 text-gray-500">
                          {post.views !== undefined && <span>👁 {formatNumber(post.views)}</span>}
                          {post.likes !== undefined && <span>❤️ {formatNumber(post.likes)}</span>}
                        </div>
                      </a>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}

        {/* Ad Library insights */}
        {(adInsights || hasAds) && (
          <>
            <div className="divider-kreoon" />
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                📢 Análisis de Anuncios
              </h3>

              {adInsights && (
                <div className="bg-zinc-800/40 rounded-xl p-4 border-l-4 border-yellow-500/50">
                  <p className="text-sm text-gray-300 leading-relaxed">{adInsights}</p>
                </div>
              )}

              {hasAds && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    ...(adLibrary.brand_ads || []).map(a => ({ ...a, _type: "Tu marca" })),
                    ...(adLibrary.competitor_ads || []).map(a => ({ ...a, _type: "Competidor" })),
                  ].map((ad, i) => (
                    <div key={i} className="bg-zinc-900 rounded-lg p-3 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-white">{ad.brand}</span>
                        <span className={`px-1.5 py-0.5 rounded text-[10px] ${
                          ad.status === 'active'
                            ? 'bg-green-400/10 text-green-400'
                            : 'bg-zinc-700 text-gray-400'
                        }`}>
                          {ad.status === 'active' ? 'Activo' : 'Sin ads'}
                        </span>
                      </div>
                      <p className="text-gray-400 line-clamp-3">{ad.ad_text.slice(0, 200)}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
