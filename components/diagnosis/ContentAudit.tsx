"use client";

import { motion } from "framer-motion";
import SectionHeader from "@/components/report/shared/SectionHeader";
import type { BrandAnalyzedPost } from "@/types/report";

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

interface Props {
  posts: BrandAnalyzedPost[];
}

export default function ContentAudit({ posts }: Props) {
  if (posts.length === 0) {
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
          subtitle={`${posts.length} publicación${posts.length > 1 ? "es" : ""} analizada${posts.length > 1 ? "s" : ""}`}
          badge="AI"
        />

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
      </div>
    </section>
  );
}
