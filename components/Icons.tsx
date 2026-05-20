import React from 'react';

type IconProps = React.SVGProps<SVGSVGElement>;

export const Icon = {
  Bag: (p: IconProps) => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.4" {...p}>
      <path d="M5 8h14l-1.2 12.2a1 1 0 0 1-1 .8H7.2a1 1 0 0 1-1-.8L5 8z"/>
      <path d="M9 8V6.5a3 3 0 0 1 6 0V8" />
    </svg>
  ),
  Search: (p: IconProps) => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.4" {...p}>
      <circle cx="11" cy="11" r="6.5"/>
      <path d="M16 16l4.5 4.5"/>
    </svg>
  ),
  User: (p: IconProps) => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.4" {...p}>
      <circle cx="12" cy="8" r="3.5"/>
      <path d="M5 20c1.5-3.5 4-5 7-5s5.5 1.5 7 5"/>
    </svg>
  ),
  Menu: (p: IconProps) => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.4" {...p}>
      <path d="M3 7h18M3 12h18M3 17h18"/>
    </svg>
  ),
  Close: (p: IconProps) => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.4" {...p}>
      <path d="M5 5l14 14M19 5L5 19"/>
    </svg>
  ),
  Plus: (p: IconProps) => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.4" {...p}>
      <path d="M12 5v14M5 12h14"/>
    </svg>
  ),
  Minus: (p: IconProps) => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.4" {...p}>
      <path d="M5 12h14"/>
    </svg>
  ),
  Arrow: (p: IconProps) => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.4" {...p}>
      <path d="M5 12h14M14 6l6 6-6 6"/>
    </svg>
  ),
  ArrowL: (p: IconProps) => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.4" {...p}>
      <path d="M19 12H5M10 6l-6 6 6 6"/>
    </svg>
  ),
  Heart: (p: IconProps) => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.4" {...p}>
      <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>
    </svg>
  ),
  Check: (p: IconProps) => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" {...p}>
      <path d="M5 12l4 4 10-10"/>
    </svg>
  ),
  Star: (p: IconProps) => (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" {...p}>
      <path d="M12 2l2.9 6.5 7.1.7-5.3 4.8 1.6 7-6.3-3.7-6.3 3.7 1.6-7L2 9.2l7.1-.7z"/>
    </svg>
  ),
  Phone: (p: IconProps) => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.4" {...p}>
      <path d="M6 4h3l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v3a2 2 0 0 1-2 2A14 14 0 0 1 4 6a2 2 0 0 1 2-2z"/>
    </svg>
  ),
  Pin: (p: IconProps) => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.4" {...p}>
      <path d="M12 22s7-6.5 7-12a7 7 0 0 0-14 0c0 5.5 7 12 7 12z"/>
      <circle cx="12" cy="10" r="2.5"/>
    </svg>
  ),
  IG: (p: IconProps) => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.4" {...p}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="4"/>
      <circle cx="12" cy="12" r="4"/>
      <circle cx="17.2" cy="6.8" r="0.8" fill="currentColor"/>
    </svg>
  ),
  Sparkle: (p: IconProps) => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" {...p}>
      <path d="M12 2l1.6 6.4L20 10l-6.4 1.6L12 18l-1.6-6.4L4 10l6.4-1.6z"/>
    </svg>
  ),
  Filter: (p: IconProps) => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.4" {...p}>
      <path d="M4 6h16M7 12h10M10 18h4"/>
    </svg>
  ),
  Dashboard: (p: IconProps) => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.4" {...p}>
      <rect x="3" y="3" width="8" height="8"/><rect x="13" y="3" width="8" height="5"/>
      <rect x="13" y="10" width="8" height="11"/><rect x="3" y="13" width="8" height="8"/>
    </svg>
  ),
  Box: (p: IconProps) => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.4" {...p}>
      <path d="M3 8l9-4 9 4-9 4-9-4z"/><path d="M3 8v8l9 4 9-4V8"/><path d="M12 12v8"/>
    </svg>
  ),
  Tag: (p: IconProps) => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.4" {...p}>
      <path d="M3 12l9-9h8v8l-9 9z"/><circle cx="16" cy="8" r="1.4"/>
    </svg>
  ),
};

export function Wordmark({ size = 28, mono = false }: { size?: number; mono?: boolean }) {
  const color = mono ? "currentColor" : "#A8893F";
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 0, lineHeight: 1 }}>
      <svg viewBox="0 0 320 60" height={size} style={{ overflow: "visible" }}>
        <defs>
          <linearGradient id="wm-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#e0c481" />
            <stop offset="50%" stopColor="#A8893F" />
            <stop offset="100%" stopColor="#7e6624" />
          </linearGradient>
        </defs>
        <text x="0" y="44" fontFamily="'Pinyon Script', 'Allura', cursive" fontSize="56"
              fill={mono ? "currentColor" : "url(#wm-grad)"}>Scents</text>
        <text x="138" y="44" fontFamily="'Cormorant Garamond', serif" fontStyle="italic"
              fontSize="22" letterSpacing="2" fill={color} opacity="0.85">by</text>
        <text x="172" y="44" fontFamily="'Pinyon Script', 'Allura', cursive" fontSize="56"
              fill={mono ? "currentColor" : "url(#wm-grad)"}>DajaaB</text>
      </svg>
    </span>
  );
}

export function Monogram({ size = 40, mono = false }: { size?: number; mono?: boolean }) {
  return (
    <svg viewBox="0 0 60 60" width={size} height={size}>
      <defs>
        <linearGradient id="mono-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#e0c481" />
          <stop offset="100%" stopColor="#7e6624" />
        </linearGradient>
      </defs>
      <circle cx="30" cy="30" r="28" fill="none" stroke={mono ? "currentColor" : "#A8893F"} strokeWidth="0.8" />
      <text x="30" y="42" textAnchor="middle" fontFamily="'Pinyon Script', cursive" fontSize="38"
            fill={mono ? "currentColor" : "url(#mono-grad)"}>Sd</text>
    </svg>
  );
}
