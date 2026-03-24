"use client";

import { motion } from "framer-motion";
import SectionHeader from "@/components/report/shared/SectionHeader";
import type { BrandAnalyzedPost } from "@/types/report";

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

interface ContentAuditV7 {
  whats_working?: { insight: string; evidence: string }[];
  whats_failing?: { insight: string; evidence: string }[];
  featured_posts?: any[];
  scores_detail?: Record<string, { score: number; justification: string }>;
  ad_analysis?: {
    has_ads?: boolean;
    summary?: string;
    recommendation?: string;
  };
}

interface Props {
  posts: BrandAnalyzedPost[];
  contentAudit?: ContentAuditV7;
}

function InsightList({ items, type }: { items: { insight: string; evidence: string }[]; type: "working" | "failing" }) {
  const isWorking = type === "working";
  return (
    <div className="space-y-3">
      <h4 className={`text-sm font-semibold ${isWorking ? "text-green-400" : "text-red-400"}`}>
        {isWorking ? "Lo que funciona" : "Lo que necesita mejorar"}
      </h4>
      {items.map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: isWorking ? -10 : 10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.05 }}
          className={`rounded-lg border p-3 ${
            isWorking
              ? "bg-green-950/20 border-green-800/30"
              : "bg-red-950/20 border-red-800/30"
          }`}
        >
          <p className="text-sm text-white font-medium">{item.insight}</p>
          {item.evidence && (
            <p className="text-xs text-gray-400 mt-1">{item.evidence}</p>
          )}
        </motion.div>
      ))}
    </div>
  );
}

export default function ContentAudit({ posts, contentAudit }: Props) {
  const hasV7Data = contentAudit && (
    (contentAudit.whats_working && contentAudit.whats_working.length > 0) ||
    (contentAudit.whats_failing && contentAudit.whats_failing.length > 0)
  );
  const hasPosts = posts.length > 0;

  if (!hasPosts && !hasV7Data) {
    return (
      <section className="max-w-4xl mx-auto px-4 py-10">
        <div className="card-premium p-6">
          <SectionHeader
            icon={<span className="text-lg">📋</span>}
            title="Auditoría de Contenido"
            subtitle="No se pudieron analizar publicaciones"
          />
          <p className="text-gray-400 text-sm">
            Los perfiles no tenían contenido accesible para análisis automático.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="content-audit" className="max-w-4xl mx-auto px-4 py-10">
      <div className="card-premium p-6 space-y-6">
        <SectionHeader
          icon={<span className="text-lg">📋</span>}
          title="Auditoría de Contenido"
          subtitle={hasPosts
            ? `${posts.length} publicación${posts.length > 1 ? "es" : ""} analizada${posts.length > 1 ? "s" : ""}`
            : "Análisis de contenido por IA"
          }
          badge="AI"
        />

        {/* V7: Insights - whats_working / whats_failing */}
        {hasV7Data && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {contentAudit!.whats_working && contentAudit!.whats_working.length > 0 && (
              <InsightList items={contentAudit!.whats_working} type="working" />
            )}
            {contentAudit!.whats_failing && contentAudit!.whats_failing.length > 0 && (
              <InsightList items={contentAudit!.whats_failing} type="failing" />
            )}
          </div>
        )}

        {/* V7: Scores detail */}
        {contentAudit?.scores_detail && Object.keys(contentAudit.scores_detail).length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {Object.entries(contentAudit.scores_detail).map(([key, val]) => (
              <div key={key} className="rounded-lg bg-zinc-900 border border-zinc-800 p-3">
                <p className="text-xs text-gray-400 capitalize">{key.replace(/_/g, " ")}</p>
                <p className={`text-lg font-bold ${val.score >= 7 ? "text-green-400" : val.score >= 4 ? "text-yellow-400" : "text-red-400"}`}>
                  {val.score}/10
                </p>
                {val.justification && (
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{val.justification}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* V7: Ad analysis */}
        {contentAudit?.ad_analysis && contentAudit.ad_analysis.summary && (
          <div className="rounded-lg bg-zinc-900 border border-zinc-800 p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm">📢</span>
              <h4 className="text-sm font-semibold text-white">Análisis de Anuncios</h4>
              {contentAudit.ad_analysis.has_ads !== undefined && (
                <span className={`text-xs px-2 py-0.5 rounded-full ${contentAudit.ad_analysis.has_ads ? "bg-green-900/50 text-green-400" : "bg-zinc-800 text-gray-400"}`}>
                  {contentAudit.ad_analysis.has_ads ? "Activos" : "Sin anuncios"}
                </span>
              )}
            </div>
            <p className="text-sm text-gray-300">{contentAudit.ad_analysis.summary}</p>
            {contentAudit.ad_analysis.recommendation && (
              <p className="text-xs text-kreoon mt-2">{contentAudit.ad_analysis.recommendation}</p>
            )}
          </div>
        )}

        {/* Post cards grid */}
        {hasPosts && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {posts.map((post, i) => (
              <motion.div
                key={post.url + i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="relative rounded-xl bg-zinc-900 border border-zinc-800 overflow-hidden group"
              >
                {/* Thumbnail or placeholder */}
                <div className="aspect-[9/16] max-h-48 bg-zinc-800 relative overflow-hidden">
                  {post.thumbnail_url ? (
                    <img
                      src={post.thumbnail_url}
                      alt=""
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl text-zinc-600">
                      {post.platform === "instagram" ? "📸" : post.platform === "tiktok" ? "🎵" : "▶️"}
                    </div>
                  )}

                  {/* Score badge */}
                  {post.score !== undefined && post.score > 0 && (
                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-sm text-xs font-bold text-white">
                      {post.score}
                    </div>
                  )}

                  {/* Platform badge */}
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-sm text-xs text-gray-300 capitalize">
                    {post.platform}
                  </div>
                </div>

                <div className="p-3 space-y-2">
                  {/* Caption */}
                  <p className="text-xs text-gray-300 line-clamp-2">
                    {post.caption || "Sin caption"}
                  </p>

                  {/* Metrics */}
                  <div className="flex flex-wrap gap-2 text-xs text-gray-400">
                    {post.views !== undefined && (
                      <span>👁 {formatNumber(post.views)}</span>
                    )}
                    {post.likes !== undefined && (
                      <span>❤️ {formatNumber(post.likes)}</span>
                    )}
                    {post.comments !== undefined && (
                      <span>💬 {post.comments}</span>
                    )}
                  </div>

                  {/* Date */}
                  {post.published_at && (
                    <p className="text-xs text-gray-500">{post.published_at}</p>
                  )}

                  {/* Link */}
                  <a
                    href={post.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-kreoon hover:underline"
                  >
                    Ver original →
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
