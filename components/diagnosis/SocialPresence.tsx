"use client";

import { motion } from "framer-motion";
import SectionHeader from "@/components/report/shared/SectionHeader";
import type { BrandSocialProfile } from "@/types/report";

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

const PLATFORM_COLORS: Record<string, string> = {
  instagram: "from-pink-500 to-purple-500",
  tiktok: "from-cyan-400 to-pink-500",
  youtube: "from-red-500 to-red-600",
  linkedin: "from-blue-600 to-blue-700",
  twitter: "from-blue-400 to-blue-500",
  facebook: "from-blue-500 to-blue-600",
};

const PLATFORM_ICONS: Record<string, string> = {
  instagram: "📸",
  tiktok: "🎵",
  youtube: "▶️",
  linkedin: "💼",
  twitter: "🐦",
  facebook: "📘",
};

interface Props {
  profiles: BrandSocialProfile[];
}

export default function SocialPresence({ profiles }: Props) {
  if (profiles.length === 0) {
    return (
      <section className="max-w-4xl mx-auto px-4 py-10">
        <div className="card-premium p-6">
          <SectionHeader
            icon={<span className="text-lg">🌐</span>}
            title="Presencia Digital"
            subtitle="No se encontraron perfiles de redes sociales"
          />
          <p className="text-gray-400 text-sm">
            No pudimos identificar perfiles activos en redes sociales. Esto será revisado durante la consultoría.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="social" className="max-w-4xl mx-auto px-4 py-10">
      <div className="card-premium p-6 space-y-6">
        <SectionHeader
          icon={<span className="text-lg">🌐</span>}
          title="Presencia en Redes Sociales"
          subtitle={`${profiles.length} plataforma${profiles.length > 1 ? "s" : ""} identificada${profiles.length > 1 ? "s" : ""}`}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {profiles.map((profile, i) => (
            <motion.a
              key={`${profile.platform}-${profile.username}`}
              href={profile.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group relative overflow-hidden rounded-xl bg-zinc-900 border border-zinc-800 p-5 hover:border-kreoon/40 transition-all"
            >
              {/* Gradient top bar */}
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${PLATFORM_COLORS[profile.platform] || "from-gray-500 to-gray-600"}`} />

              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">{PLATFORM_ICONS[profile.platform] || "🔗"}</span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white capitalize">{profile.platform}</p>
                  <p className="text-xs text-gray-400 truncate">@{profile.username}</p>
                </div>
              </div>

              <div className="space-y-2">
                {profile.followers !== undefined && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Seguidores</span>
                    <span className="text-white font-semibold">{formatNumber(profile.followers)}</span>
                  </div>
                )}
                {profile.posts_per_week !== undefined && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Posts/semana</span>
                    <span className="text-white font-semibold">{profile.posts_per_week}</span>
                  </div>
                )}
                {profile.engagement_rate !== undefined && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Engagement</span>
                    <span className={`font-semibold ${profile.engagement_rate >= 3 ? "text-green-400" : profile.engagement_rate >= 1 ? "text-yellow-400" : "text-red-400"}`}>
                      {profile.engagement_rate}%
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-3 text-xs text-gray-500 group-hover:text-kreoon transition-colors">
                Ver perfil →
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
