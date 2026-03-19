interface ReportFooterProps {
  reportId: string;
  generatedDate: string;
}

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
  </svg>
);

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.27 8.27 0 004.84 1.56V6.82a4.85 4.85 0 01-1.07-.13z" />
  </svg>
);

const GlobeIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
  </svg>
);

export default function ReportFooter({ reportId, generatedDate }: ReportFooterProps) {
  return (
    <footer className="w-full bg-[#1a1a24] border-t-2 border-[#7c3aed]">
      {/* ── Main grid ── */}
      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">

        {/* ── Column 1: Alexander Cast ── */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 rounded-full bg-[#7c3aed] flex items-center justify-center shrink-0">
              <span className="text-white font-bold text-xl tracking-wide">AC</span>
            </div>
            <div>
              <p className="text-white font-bold text-lg leading-tight">Alexander Cast</p>
              <p className="text-[#7c3aed] text-sm">Estratega Digital y de Contenido</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <a href="https://instagram.com/alexemprendee" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-white/60 hover:text-[#7c3aed] transition-colors">
              <InstagramIcon className="w-5 h-5" />
            </a>
          </div>

          <a
            href="https://calendar.app.google/UTBr9omSPTanpmE86"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#7c3aed] text-sm font-medium hover:underline inline-flex items-center gap-1"
          >
            → Agendar consultoría 1:1
          </a>
        </div>

        {/* ── Column 2: UGC Colombia ── */}
        <div className="flex flex-col gap-3 md:border-x md:border-[#2e2e2e] md:px-8">
          <div>
            <p className="text-white font-bold text-xl">UGC Colombia</p>
            <p className="text-[#7c3aed] text-sm">Agencia de Creadores</p>
          </div>
          <p className="text-white/50 text-sm leading-relaxed">
            Conectamos marcas con creators auténticos para generar contenido que convierte.
          </p>
          <a
            href="https://instagram.com/agenciaugccolombia"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-white/60 hover:text-[#7c3aed] text-sm transition-colors"
          >
            <InstagramIcon className="w-4 h-4 shrink-0" />
            @agenciaugccolombia
          </a>
        </div>

        {/* ── Column 3: Kreoon ── */}
        <div className="flex flex-col gap-3">
          <div>
            <p className="text-2xl font-bold tracking-tight">
              <span className="text-white">Kre</span>
              <span className="text-[#7c3aed]">oo</span>
              <span className="text-white">n</span>
            </p>
            <p className="text-[#7c3aed] text-sm">Plataforma de Contenido</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {["Análisis", "Estrategia", "Producción"].map((pill) => (
              <span key={pill} className="text-xs text-[#7c3aed] bg-[#7c3aed]/10 px-3 py-1 rounded-full font-medium">
                {pill}
              </span>
            ))}
          </div>

          <a
            href="https://kreoon.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-[#7c3aed] text-sm font-medium hover:underline mt-1"
          >
            <GlobeIcon className="w-4 h-4" />
            kreoon.com
          </a>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="bg-[#141414] border-t border-[#333]">
        <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <p className="font-mono text-xs text-gray-500">
            Generado por Jarvis AI — Powered by Kreoon
          </p>
          <p className="font-mono text-xs text-gray-500">
            Fecha: {generatedDate}
          </p>
          <div className="flex flex-col items-center sm:items-end gap-0.5">
            <p className="font-mono text-xs text-gray-500">ID: {reportId}</p>
            <p className="text-[10px] text-gray-500 italic">Este análisis fue creado con IA</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
