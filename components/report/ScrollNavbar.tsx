"use client";

import { useEffect, useRef, useState } from "react";

interface ScrollNavbarProps {
  activeSection: string;
}

interface NavLink {
  id: string;
  label: string;
}

const NAV_LINKS: NavLink[] = [
  { id: "resumen",    label: "Resumen"    },
  { id: "visual",     label: "Visual"     },
  { id: "estrategia", label: "Estrategia" },
  { id: "veredicto",  label: "Veredicto"  },
  { id: "replica",    label: "Réplica"    },
  { id: "produccion", label: "Producción" },
  { id: "metricas",   label: "Métricas"   },
];

export default function ScrollNavbar({ activeSection }: ScrollNavbarProps) {
  const [visible, setVisible] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    function onScroll() {
      // Reveal after scrolling past approx one viewport height (hero)
      setVisible(window.scrollY > window.innerHeight * 0.6);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // run once on mount in case page is already scrolled
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function handleClick(id: string) {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  return (
    <nav
      ref={navRef}
      aria-label="Navegación de secciones"
      className={[
        "fixed top-0 left-0 right-0 z-50",
        "transition-all duration-300 ease-in-out",
        visible
          ? "translate-y-0 opacity-100 pointer-events-auto"
          : "-translate-y-full opacity-0 pointer-events-none",
      ].join(" ")}
    >
      <div
        className="backdrop-blur-md border-b border-purple-500/30"
        style={{ backgroundColor: "rgba(12, 12, 12, 0.92)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-12 flex items-center justify-between gap-4">

          {/* Left: brand */}
          <span className="text-purple-500 font-extrabold tracking-[0.2em] text-sm shrink-0 select-none">
            KREOON
          </span>

          {/* Right: nav links — horizontally scrollable on mobile */}
          <div className="flex-1 overflow-x-auto scrollbar-none min-w-0">
            <ul className="flex items-center gap-1 w-max ml-auto pr-1">
              {NAV_LINKS.map(({ id, label }) => {
                const isActive = activeSection === id;
                return (
                  <li key={id}>
                    <button
                      onClick={() => handleClick(id)}
                      className={[
                        "relative px-3 py-1 text-xs sm:text-sm font-medium whitespace-nowrap",
                        "transition-colors duration-150 rounded",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500",
                        isActive
                          ? "text-purple-500"
                          : "text-gray-400 hover:text-white",
                      ].join(" ")}
                    >
                      {label}
                      {/* Active underline */}
                      {isActive && (
                        <span
                          className="absolute bottom-0 left-3 right-3 h-px bg-purple-500 rounded-full"
                          aria-hidden="true"
                        />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

        </div>
      </div>
    </nav>
  );
}
