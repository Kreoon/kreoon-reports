export default function CTABanner() {
  return (
    <section className="w-full bg-[#0a0a0f] border-t border-purple-500/20 py-14 px-6">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Headline */}
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-2xl md:text-3xl font-bold text-white leading-snug">
            ¿Quieres análisis como este{" "}
            <span className="text-[#a855f7]">para tu marca?</span>
          </h2>
          <p className="mt-2 text-gray-400 text-base">
            Agenda una sesión estratégica gratuita y te ayudamos a identificar oportunidades reales de crecimiento.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col items-center gap-4 shrink-0">
          {/* Primary CTA → Google Calendar */}
          <a
            href="https://calendar.app.google/UTBr9omSPTanpmE86"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#7c3aed] text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:shadow-[0_0_18px_rgba(124,58,237,0.45)] hover:bg-[#6d28d9] transition-all duration-200"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            Agendar consulta gratis
          </a>

          {/* Secondary: Instagram */}
          <a
            href="https://instagram.com/alexemprendee"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-[#a855f7] transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden="true">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
            </svg>
            @alexemprendee
          </a>
        </div>
      </div>
    </section>
  );
}
