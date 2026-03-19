"use client";

import { motion } from "framer-motion";

export default function DiagnosisFooter() {
  return (
    <footer className="max-w-4xl mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-center space-y-4"
      >
        <div className="divider-kreoon mb-8" />

        <p className="text-sm text-gray-500">
          Diagnóstico generado automáticamente por
        </p>
        <div className="flex items-center justify-center gap-2">
          <span className="text-2xl font-bold text-gradient-kreoon">Kreoon</span>
          <span className="badge-ai text-xs px-2 py-0.5 rounded-full">AI</span>
        </div>
        <p className="text-xs text-gray-600">
          Contenido que convierte · kreoon.com
        </p>

        <div className="flex items-center justify-center gap-4 pt-4 text-xs text-gray-600">
          <a
            href="https://calendar.app.google/UTBr9omSPTanpmE86"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-kreoon transition-colors"
          >
            Agendar consultoría
          </a>
          <span>·</span>
          <a
            href="https://www.instagram.com/kreoon.co"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-kreoon transition-colors"
          >
            @kreoon.co
          </a>
        </div>
      </motion.div>
    </footer>
  );
}
