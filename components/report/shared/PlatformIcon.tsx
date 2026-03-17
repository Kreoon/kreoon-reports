// ── PlatformIcon ──────────────────────────────────────
// Inline SVG icons for all supported social platforms.
// No "use client" needed — purely presentational.

import type { Platform } from '@/types/report';

interface PlatformIconProps {
  platform: Platform;
  size?: number;
  className?: string;
}

// ── Icon paths / content ─────────────────────────────
const icons: Record<Platform, (size: number) => React.ReactElement> = {
  instagram: (size) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Instagram"
    >
      {/* Outer rounded square */}
      <rect
        x="2"
        y="2"
        width="20"
        height="20"
        rx="5.5"
        stroke="currentColor"
        strokeWidth="1.8"
        fill="none"
      />
      {/* Inner circle */}
      <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.8" fill="none" />
      {/* Dot */}
      <circle cx="17.5" cy="6.5" r="1.1" fill="currentColor" />
    </svg>
  ),

  tiktok: (size) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="TikTok"
    >
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.97a8.18 8.18 0 004.79 1.54V7.06a4.85 4.85 0 01-1.02-.37z" />
    </svg>
  ),

  youtube: (size) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="YouTube"
    >
      {/* Rounded rectangle */}
      <rect
        x="2"
        y="5"
        width="20"
        height="14"
        rx="4"
        stroke="currentColor"
        strokeWidth="1.8"
        fill="none"
      />
      {/* Play triangle */}
      <path
        d="M10 8.5L16 12L10 15.5V8.5Z"
        fill="currentColor"
      />
    </svg>
  ),

  twitter: (size) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="X / Twitter"
    >
      {/* X logo */}
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),

  linkedin: (size) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="LinkedIn"
    >
      {/* Outer box */}
      <rect
        x="2"
        y="2"
        width="20"
        height="20"
        rx="4"
        stroke="currentColor"
        strokeWidth="1.8"
        fill="none"
      />
      {/* "in" letterform */}
      <circle cx="7.5" cy="7.5" r="1.2" fill="currentColor" />
      <line
        x1="7.5"
        y1="10.5"
        x2="7.5"
        y2="17"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M11 10.5V17M11 13.5C11 11.5 17 10.5 17 13.5V17"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),

  facebook: (size) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Facebook"
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.8" fill="none" />
      <path
        d="M13.5 8H15V5.5H13.5C11.57 5.5 10 7.07 10 9V10.5H8.5V13H10V19H12.5V13H14.5L15 10.5H12.5V9C12.5 8.45 12.95 8 13.5 8Z"
        fill="currentColor"
      />
    </svg>
  ),
};

// ── Platform brand colors ─────────────────────────────
export const PLATFORM_COLORS: Record<Platform, string> = {
  instagram: '#E1306C',
  tiktok: '#010101',
  youtube: '#FF0000',
  twitter: '#000000',
  linkedin: '#0A66C2',
  facebook: '#1877F2',
};

export const PLATFORM_LABELS: Record<Platform, string> = {
  instagram: 'Instagram',
  tiktok: 'TikTok',
  youtube: 'YouTube',
  twitter: 'X / Twitter',
  linkedin: 'LinkedIn',
  facebook: 'Facebook',
};

// ── Component ─────────────────────────────────────────
export default function PlatformIcon({
  platform,
  size = 24,
  className = '',
}: PlatformIconProps) {
  const renderIcon = icons[platform];

  if (!renderIcon) {
    // Fallback: generic globe
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className={className}
        aria-label={platform}
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20" />
      </svg>
    );
  }

  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center ${className}`}
      role="img"
      aria-label={PLATFORM_LABELS[platform] ?? platform}
    >
      {renderIcon(size)}
    </span>
  );
}
