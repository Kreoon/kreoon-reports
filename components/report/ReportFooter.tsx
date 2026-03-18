interface ReportFooterProps {
  reportId: string;
  generatedDate: string;
}

/* ── Social icon paths ── */
const InstagramIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
  </svg>
);

const LinkedInIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.27 8.27 0 004.84 1.56V6.82a4.85 4.85 0 01-1.07-.13z" />
  </svg>
);

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

export default function ReportFooter({ reportId, generatedDate }: ReportFooterProps) {
  return (
    <footer className="w-full bg-[#1a1a24] border-t-2 border-[#7c3aed]">
      {/* ── Main grid ── */}
      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">

        {/* ── Column 1: Alexander Cast ── */}
        <div className="flex flex-col gap-4">
          {/* Avatar */}
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 rounded-full bg-[#7c3aed] flex items-center justify-center shrink-0">
              <span className="text-white font-bold text-xl tracking-wide">AC</span>
            </div>
            <div>
              <p className="text-white font-bold text-lg leading-tight">Alexander Cast</p>
              <p className="text-[#7c3aed] text-sm">Estratega Digital y de Contenido</p>
            </div>
          </div>

          {/* Social icons */}
          <div className="flex items-center gap-4">
            <a
              href="https://instagram.com/alexandercast"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram Alexander Cast"
              className="text-white/60 hover:text-[#7c3aed] transition-colors"
            >
              <InstagramIcon className="w-5 h-5" />
            </a>
            <a
              href="https://linkedin.com/in/alexandercast"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn Alexander Cast"
              className="text-white/60 hover:text-[#7c3aed] transition-colors"
            >
              <LinkedInIcon className="w-5 h-5" />
            </a>
            <a
              href="https://tiktok.com/@alexandercast"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok Alexander Cast"
              className="text-white/60 hover:text-[#7c3aed] transition-colors"
            >
              <TikTokIcon className="w-5 h-5" />
            </a>
          </div>

          {/* Consulting link */}
          <a
            href="https://wa.me/573132947776"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#7c3aed] text-sm font-medium hover:underline inline-flex items-center gap-1"
          >
            → Consultoría 1:1
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
          <div className="flex flex-col gap-2 mt-1">
            <a
              href="https://instagram.com/agenciaugccolombia"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-white/60 hover:text-[#7c3aed] text-sm transition-colors"
            >
              <InstagramIcon className="w-4 h-4 shrink-0" />
              @agenciaugccolombia
            </a>
            <a
              href="https://wa.me/573132947776"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-white/60 hover:text-[#7c3aed] text-sm transition-colors"
            >
              <WhatsAppIcon className="w-4 h-4 shrink-0" />
              WhatsApp
            </a>
          </div>
        </div>

        {/* ── Column 3: Kreoon ── */}
        <div className="flex flex-col gap-3">
          {/* Logotype with styled "oo" */}
          <div>
            <p className="text-2xl font-bold tracking-tight">
              <span className="text-white">Kre</span>
              <span className="text-[#7c3aed]">oo</span>
              <span className="text-white">n</span>
            </p>
            <p className="text-[#7c3aed] text-sm">Plataforma de Contenido</p>
          </div>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-2">
            {["Análisis", "Estrategia", "Producción"].map((pill) => (
              <span
                key={pill}
                className="text-xs text-[#7c3aed] bg-[#7c3aed]/10 px-3 py-1 rounded-full font-medium"
              >
                {pill}
              </span>
            ))}
          </div>

          {/* App link */}
          <a
            href="https://kreoon.app"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#7c3aed] text-sm font-medium hover:underline inline-flex items-center gap-1 mt-1"
          >
            → kreoon.app
          </a>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="bg-[#141414] border-t border-[#333]">
        <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          {/* Left */}
          <p className="font-mono text-xs text-gray-500">
            Generado por Jarvis AI — Powered by Kreoon
          </p>

          {/* Center */}
          <p className="font-mono text-xs text-gray-500">
            Fecha: {generatedDate}
          </p>

          {/* Right */}
          <div className="flex flex-col items-center sm:items-end gap-0.5">
            <p className="font-mono text-xs text-gray-500">ID: {reportId}</p>
            <p className="text-[10px] text-gray-500 italic">
              Este análisis fue creado con IA
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
