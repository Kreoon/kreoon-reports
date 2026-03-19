"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check, ChevronDown, ExternalLink, Music, Calendar, AtSign, Hash, MessageCircle, ThumbsUp } from "lucide-react";

interface TopComment {
  user: string;
  text: string;
  likes: number;
}

interface ContentMetadataSectionProps {
  caption?: string;
  hashtags?: string[];
  mentions?: string[];
  topComments?: TopComment[];
  soundUsed?: string;
  publishedAt?: string;
  originalUrl?: string;
}

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

export default function ContentMetadataSection({
  caption,
  hashtags,
  mentions,
  topComments,
  soundUsed,
  publishedAt,
  originalUrl,
}: ContentMetadataSectionProps) {
  const [copied, setCopied] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);

  const hasContent =
    caption ||
    (hashtags && hashtags.length > 0) ||
    (mentions && mentions.length > 0) ||
    (topComments && topComments.length > 0) ||
    soundUsed ||
    publishedAt;

  if (!hasContent) return null;

  const handleCopy = async () => {
    if (!caption) return;
    try {
      await navigator.clipboard.writeText(caption);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <section className="w-full max-w-4xl mx-auto px-4 py-10 sm:py-14">
      <div className="card-premium p-6 sm:p-8 space-y-6">
        {/* Header */}
        <div>
          <p className="text-xs uppercase tracking-widest text-purple-500 font-semibold mb-1">
            Contenido original
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Metadata del Post</h2>
        </div>

        {/* Caption */}
        {caption && (
          <div className="rounded-xl border border-white/10 bg-white/[0.03] overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/10 bg-white/5">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Caption</span>
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-purple-400 hover:bg-purple-500/10 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? "Copiado" : "Copiar"}
              </button>
            </div>
            <div className="px-4 py-3">
              <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">{caption}</p>
            </div>
          </div>
        )}

        {/* Hashtags */}
        {hashtags && hashtags.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Hash className="w-4 h-4 text-purple-400" />
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Hashtags</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {hashtags.map((tag, i) => (
                <span
                  key={i}
                  className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-purple-500/10 border border-purple-500/20 text-purple-300"
                >
                  #{tag.replace(/^#/, "")}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Mentions */}
        {mentions && mentions.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <AtSign className="w-4 h-4 text-blue-400" />
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Menciones</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {mentions.map((mention, i) => (
                <span
                  key={i}
                  className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/10 border border-blue-500/20 text-blue-300"
                >
                  @{mention.replace(/^@/, "")}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Top Comments */}
        {topComments && topComments.length > 0 && (
          <div className="space-y-2">
            <button
              onClick={() => setCommentsOpen((p) => !p)}
              className="w-full flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Top Comentarios ({topComments.length})
                </span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${commentsOpen ? "rotate-180" : ""}`}
              />
            </button>
            <AnimatePresence initial={false}>
              {commentsOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="space-y-2 pt-1">
                    {topComments.map((comment, i) => (
                      <div
                        key={i}
                        className="rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 flex items-start gap-3"
                      >
                        <div className="flex-1 min-w-0">
                          <span className="text-xs font-semibold text-purple-400">@{comment.user}</span>
                          <p className="text-sm text-gray-300 mt-0.5 leading-relaxed">{comment.text}</p>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-500 flex-shrink-0">
                          <ThumbsUp className="w-3 h-3" />
                          {formatNumber(comment.likes)}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Sound + Published date + Original link */}
        {(soundUsed || publishedAt || originalUrl) && (
          <>
            <div className="divider-glow" />
            <div className="flex flex-wrap items-center gap-4">
              {soundUsed && (
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Music className="w-4 h-4 text-purple-400 flex-shrink-0" />
                  <span className="truncate max-w-[200px]">{soundUsed}</span>
                </div>
              )}
              {publishedAt && (
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Calendar className="w-4 h-4 text-purple-400 flex-shrink-0" />
                  <span>
                    {new Date(publishedAt).toLocaleDateString("es-CO", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
              )}
              {originalUrl && (
                <a
                  href={originalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-purple-400 hover:text-purple-300 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Ver post original
                </a>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
