"use client";

import { motion } from "framer-motion";
import SectionHeader from "@/components/report/shared/SectionHeader";
import type { BrandServiceProposal } from "@/types/report";

interface Props {
  proposal: BrandServiceProposal;
  brandName: string;
}

export default function ServiceProposal({ proposal, brandName }: Props) {
  return (
    <section id="proposal" className="max-w-4xl mx-auto px-4 py-10">
      <div className="card-premium p-6 space-y-6">
        <SectionHeader
          icon={<span className="text-lg">🚀</span>}
          title="Propuesta de Servicios"
          subtitle={`Soluciones recomendadas para ${brandName}`}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {proposal.packages.map((pkg, i) => {
            const isRecommended = pkg.name === proposal.recommended;
            return (
              <motion.div
                key={pkg.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`relative rounded-xl p-5 space-y-4 ${
                  isRecommended
                    ? "bg-kreoon/5 border-2 border-kreoon/40"
                    : "bg-zinc-900 border border-zinc-800"
                }`}
              >
                {/* Recommended badge */}
                {isRecommended && (
                  <div className="absolute -top-3 left-4 px-3 py-0.5 rounded-full bg-kreoon text-white text-xs font-bold">
                    ⭐ Recomendado
                  </div>
                )}

                <div>
                  <h4 className="text-white font-bold text-lg">{pkg.name}</h4>
                  <p className="text-sm text-gray-400 mt-1">{pkg.description}</p>
                </div>

                {/* Price */}
                <div className="text-2xl font-bold text-kreoon">
                  {pkg.price_range}
                </div>

                {/* Ideal for */}
                <p className="text-xs text-gray-500 italic">
                  Ideal para: {pkg.ideal_for}
                </p>

                {/* Includes */}
                <ul className="space-y-1.5">
                  {pkg.includes.map((item, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm">
                      <span className="text-kreoon mt-0.5">✓</span>
                      <span className="text-gray-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>

        {/* Pricing note */}
        {proposal.pricing_note && (
          <p className="text-xs text-gray-500 text-center mt-4">
            {proposal.pricing_note}
          </p>
        )}

        {/* CTA */}
        <div className="text-center pt-4">
          <a
            href="https://calendar.app.google/UTBr9omSPTanpmE86"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-kreoon hover:bg-kreoon/90 text-white font-semibold transition-colors"
          >
            Agendar consultoría →
          </a>
        </div>
      </div>
    </section>
  );
}
