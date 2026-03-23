"use client";

import { motion } from "framer-motion";
import SectionHeader from "@/components/report/shared/SectionHeader";

interface Props {
  avatarIdeal?: any;
  buyerPersona?: any;
  brandIdentity?: any;
  marketPosition?: any;
}

export default function AvatarBuyerPersona({ avatarIdeal, buyerPersona, brandIdentity, marketPosition }: Props) {
  if (!avatarIdeal && !buyerPersona && !brandIdentity && !marketPosition) return null;

  return (
    <section className="max-w-4xl mx-auto px-4 py-10 space-y-6">
      {/* Brand Identity */}
      {brandIdentity && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="card-premium p-6 space-y-4"
        >
          <SectionHeader
            icon={<span className="text-lg">🏷️</span>}
            title="Identidad de Marca"
            subtitle="Arquetipo y tono de comunicación"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {brandIdentity.archetype && (
              <div className="bg-zinc-800/40 rounded-xl p-4 border-l-4 border-kreoon">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Arquetipo</p>
                <p className="text-sm text-gray-200">{brandIdentity.archetype}</p>
              </div>
            )}
            {brandIdentity.differentiator && (
              <div className="bg-zinc-800/40 rounded-xl p-4 border-l-4 border-purple-500/50">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Diferenciador</p>
                <p className="text-sm text-gray-200">{brandIdentity.differentiator}</p>
              </div>
            )}
            {brandIdentity.current_tone && (
              <div className="bg-zinc-800/40 rounded-xl p-4">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Tono actual</p>
                <p className="text-sm text-gray-300">{brandIdentity.current_tone}</p>
              </div>
            )}
            {brandIdentity.recommended_tone && (
              <div className="bg-zinc-800/40 rounded-xl p-4">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Tono recomendado</p>
                <p className="text-sm text-green-300">{brandIdentity.recommended_tone}</p>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Market Position */}
      {marketPosition && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="card-premium p-6 space-y-4"
        >
          <SectionHeader
            icon={<span className="text-lg">📍</span>}
            title="Posición en el Mercado"
            subtitle="Ubicación actual y objetivo"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {marketPosition.current_position && (
              <div className="bg-zinc-800/40 rounded-xl p-4">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Posición actual</p>
                <p className="text-sm text-gray-300">{marketPosition.current_position}</p>
              </div>
            )}
            {marketPosition.ideal_position && (
              <div className="bg-zinc-800/40 rounded-xl p-4">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Posición ideal</p>
                <p className="text-sm text-green-300">{marketPosition.ideal_position}</p>
              </div>
            )}
            {marketPosition.niche_size && (
              <div className="bg-zinc-800/40 rounded-xl p-4">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Tamaño del nicho</p>
                <p className="text-sm text-gray-300">{marketPosition.niche_size}</p>
              </div>
            )}
          </div>
          {marketPosition.market_trends && marketPosition.market_trends.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs text-gray-500 uppercase tracking-wider">Tendencias del mercado</p>
              <div className="flex flex-wrap gap-2">
                {marketPosition.market_trends.map((trend: string, i: number) => (
                  <span key={i} className="px-3 py-1.5 rounded-full bg-zinc-800 border border-zinc-700 text-sm text-gray-300">
                    {trend}
                  </span>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Buyer Persona */}
      {buyerPersona && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="card-premium p-6 space-y-4"
        >
          <SectionHeader
            icon={<span className="text-lg">👤</span>}
            title="Buyer Persona"
            subtitle={buyerPersona.name ? `${buyerPersona.name}, ${buyerPersona.age || ""} años` : "Tu cliente ideal"}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {buyerPersona.occupation && (
              <div className="bg-zinc-800/40 rounded-xl p-4">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Ocupación</p>
                <p className="text-sm text-gray-200">{buyerPersona.occupation}</p>
              </div>
            )}
            {buyerPersona.how_discovers_brands && (
              <div className="bg-zinc-800/40 rounded-xl p-4">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Cómo descubre marcas</p>
                <p className="text-sm text-gray-200">{buyerPersona.how_discovers_brands}</p>
              </div>
            )}
          </div>
          {buyerPersona.daily_routine && (
            <div className="bg-zinc-800/40 rounded-xl p-4">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Rutina diaria</p>
              <p className="text-sm text-gray-300 leading-relaxed">{buyerPersona.daily_routine}</p>
            </div>
          )}
          {buyerPersona.decision_factors && buyerPersona.decision_factors.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs text-gray-500 uppercase tracking-wider">Factores de decisión</p>
              <div className="flex flex-wrap gap-2">
                {buyerPersona.decision_factors.map((f: string, i: number) => (
                  <span key={i} className="px-3 py-1.5 rounded-full bg-kreoon/10 border border-kreoon/20 text-sm text-kreoon">
                    {f}
                  </span>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Avatar Ideal */}
      {avatarIdeal && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="card-premium p-6 space-y-4"
        >
          <SectionHeader
            icon={<span className="text-lg">🎯</span>}
            title="Avatar del Cliente Ideal"
            subtitle="Perfil psicográfico y demográfico"
          />
          {avatarIdeal.demographics && (
            <div className="bg-zinc-800/40 rounded-xl p-4 border-l-4 border-kreoon">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Demografía</p>
              <p className="text-sm text-gray-200">{avatarIdeal.demographics}</p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {avatarIdeal.pain_points && avatarIdeal.pain_points.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-red-400 uppercase tracking-wider">Dolores</p>
                <ul className="space-y-1.5">
                  {avatarIdeal.pain_points.map((p: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                      <span className="text-red-400 mt-0.5 flex-shrink-0">✗</span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {avatarIdeal.desires && avatarIdeal.desires.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-green-400 uppercase tracking-wider">Deseos</p>
                <ul className="space-y-1.5">
                  {avatarIdeal.desires.map((d: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                      <span className="text-green-400 mt-0.5 flex-shrink-0">✓</span>
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {avatarIdeal.objections && avatarIdeal.objections.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-yellow-400 uppercase tracking-wider">Objeciones</p>
                <ul className="space-y-1.5">
                  {avatarIdeal.objections.map((o: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                      <span className="text-yellow-400 mt-0.5 flex-shrink-0">!</span>
                      <span>{o}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {avatarIdeal.buying_triggers && avatarIdeal.buying_triggers.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-blue-400 uppercase tracking-wider">Gatillos de compra</p>
                <ul className="space-y-1.5">
                  {avatarIdeal.buying_triggers.map((t: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                      <span className="text-blue-400 mt-0.5 flex-shrink-0">→</span>
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {avatarIdeal.platforms && avatarIdeal.platforms.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs text-gray-500 uppercase tracking-wider">Plataformas donde está</p>
              <div className="flex flex-wrap gap-2">
                {avatarIdeal.platforms.map((p: string, i: number) => (
                  <span key={i} className="px-3 py-1.5 rounded-full bg-zinc-800 border border-zinc-700 text-sm text-gray-300">
                    {p}
                  </span>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </section>
  );
}
