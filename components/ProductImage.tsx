'use client';
import Image from 'next/image';

/* ─── branded placeholder shown when no image is available ─── */
export function ProductPlaceholder({ dark = false }: { dark?: boolean }) {
  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: dark ? '#0e0e0e' : 'var(--cream-2)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: 10,
    }}>
      {/* Minimal bottle silhouette */}
      <svg viewBox="0 0 48 72" width="36" height="54" style={{ opacity: 0.25 }}>
        <rect x="17" y="0" width="14" height="8" rx="2" fill="currentColor" />
        <path d="M12 8 C8 16 6 24 6 36 C6 56 12 68 24 68 C36 68 42 56 42 36 C42 24 40 16 36 8 Z"
              fill="currentColor" />
      </svg>
      <span style={{
        fontSize: 8, letterSpacing: '0.22em', textTransform: 'uppercase',
        color: dark ? 'rgba(201,169,97,0.5)' : 'var(--mute)',
        fontFamily: 'var(--sans)', textAlign: 'center', lineHeight: 1.4,
      }}>Image{'\n'}coming soon</span>
    </div>
  );
}

interface Props {
  src?: string;
  alt: string;
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
  loading?: 'lazy' | 'eager';
  style?: React.CSSProperties;
  className?: string;
  onError?: () => void;
  dark?: boolean;
}

/**
 * Drop-in replacement for next/image on product photos.
 * • Empty/undefined src  → branded placeholder
 * • data: / blob: URL    → plain <img> (bypasses next/image restriction)
 * • Regular /path        → next/image (with CDN optimisation)
 */
export default function ProductImage({
  src, alt, fill = false, sizes, priority, loading, style, className, onError, dark = false,
}: Props) {
  const isEmpty  = !src || src.trim() === '';
  const isDataUrl = src?.startsWith('data:') || src?.startsWith('blob:');

  if (isEmpty) {
    return fill
      ? <ProductPlaceholder dark={dark} />
      : <div style={{ position: 'relative', width: '100%', height: '100%', ...style }}><ProductPlaceholder dark={dark} /></div>;
  }

  if (isDataUrl) {
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        style={{
          ...(fill ? { position: 'absolute', inset: 0, width: '100%', height: '100%' } : {}),
          objectFit: 'cover', objectPosition: 'center',
          ...style,
        }}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      sizes={sizes}
      priority={priority}
      loading={loading}
      style={style}
      className={className}
      onError={onError}
    />
  );
}
