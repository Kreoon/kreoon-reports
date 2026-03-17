"use client";

import { motion } from "framer-motion";

interface SectionHeaderProps {
  id?: string;
  icon?: React.ReactNode;
  title: string;
  subtitle?: string;
  badge?: string;
}

export default function SectionHeader({ id, icon, title, subtitle, badge }: SectionHeaderProps) {
  return (
    <motion.div
      id={id}
      initial={{ opacity: 0, y: -10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="flex items-start gap-3 mb-6"
    >
      {icon && (
        <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-kreoon/10 flex items-center justify-center text-kreoon">
          {icon}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h2>
          {badge && (
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-kreoon/10 text-kreoon">
              {badge}
            </span>
          )}
        </div>
        {subtitle && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{subtitle}</p>
        )}
      </div>
    </motion.div>
  );
}
