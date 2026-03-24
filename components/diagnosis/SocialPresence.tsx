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

function isLikelyVerified(profile: BrandSocialProfile): boolean {
  if (profile.verified === true) return true;
  if (profile.verified === false) return false;
  // Heuristic: profiles with concrete metrics (followers > 0, engagement, posts_per_week) are likely from Apify
  const hasMetrics = (profile.followers !== undefined && profile.followers > 0) ||
    (profile.engagement_rate !== undefined && profile.engagement_rate > 0) ||
    (profile.posts_per_week !== undefined && profile.posts_per_week > 0);
  return hasMetrics;
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

  const verified = profiles.filter(isLikelyVerified);
  const unverified = profiles.filter(p => !isLikelyVerified(p));

  return (
    <section id="social" className="max-w-4xl mx-auto px-4 py-10">
      <div className="card-premium p-6 space-y-6">
        <SectionHeader
          icon={<span className="text-lg">🌐</span>}
          title="Presencia en Redes Sociales"
          subtitle={`${verified.length} plataforma${verified.length !== 1 ? "s" : ""} verificada${verified.length !== 1 ? "s" : ""}${unverified.length > 0 ? ` + ${unverified.length} por confirmar` : ""}`}
        />

        {/* Verified profiles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {verified.map((profile, i) => (
            <ProfileCard key={`${profile.platform}-${profile.username}`} profile={profile} index={i} isVerified />
          ))}
        </div>

        {/* Unverified profiles - dimmed */}
        {unverified.length > 0 && (
          <>
            <div className="flex items-center gap-2 pt-2">
              <div className="h-px flex-1 bg-zinc-800" />
              <span className="text-xs text-gray-500">Perfiles por confirmar</span>
              <div className="h-px flex-1 bg-zinc-800" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 opacity-60">
              {unverified.map((profile, i) => (
                <ProfileCard key={`${profile.platform}-${profile.username}`} profile={profile} index={i + verified.length} isVerified={false} />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

function ProfileCard({ profile, index, isVerified }: { profile: BrandSocialProfile; index: number; isVerified: boolean }) {
  return (
    <motion.a
      href={profile.url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="group relative overflow-hidden rounded-xl bg-zinc-900 border border-zinc-800 p-5 hover:border-kreoon/40 transition-all"
    >
      {/* Gradient top bar */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${PLATFORM_COLORS[profile.platform] || "from-gray-500 to-gray-600"}`} />

      <div className="flex items-center gap-3 mb-4">
        <span className="text-2xl">{PLATFORM_ICONS[profile.platform] || "🔗"}</span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-white capitalize">{profile.platform}</p>
            {isVerified ? (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-green-900/50 text-green-400 border border-green-800/30">Verificado</span>
            ) : (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-zinc-800 text-gray-500 border border-zinc-700">Sin verificar</span>
            )}
          </div>
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
  );
}
