import React, { useState } from 'react'

/**
 * BrandLogo Component:
 * Circular Luciana Cleaning Services brand mark with feather duster, vacuum & sparkles.
 * - Round badge: border-radius: 50%, overflow: hidden, background: #000
 * - Image: width: 100%, height: 100%, object-fit: contain, padding: 2px (prevents distortion & black square corners)
 * - Coral ring: box-shadow: 0 0 0 1.5px #EF5A78, 0 4px 10px rgba(239,90,120,0.25)
 * - Explicit width & height to eliminate layout shift
 * - Eager loading & async decoding
 * - Fallback: coral circle with bold white "L" if image fails to load
 */
export default function BrandLogo({
  size = 36,
  className = '',
  ring = true,
  alt = 'Luciana Cleaning Services logo',
}) {
  const [hasError, setHasError] = useState(false)

  const paddingPx = size >= 120 ? 8 : size >= 44 ? 3 : 2

  if (hasError) {
    return (
      <div
        className={`flex shrink-0 items-center justify-center rounded-full bg-[#EF5A78] text-white font-extrabold select-none ${className}`}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          fontSize: `${Math.round(size * 0.42)}px`,
          boxShadow: ring
            ? '0 0 0 1.5px #EF5A78, 0 4px 10px rgba(239,90,120,0.25)'
            : undefined,
        }}
        aria-label={alt}
      >
        L
      </div>
    )
  }

  return (
    <div
      className={`relative shrink-0 overflow-hidden select-none bg-black ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '50%',
        boxShadow: ring
          ? '0 0 0 1.5px #EF5A78, 0 4px 10px rgba(239,90,120,0.25)'
          : undefined,
      }}
    >
      <img
        src="/images/luciana-logo.png"
        alt={alt}
        width={size}
        height={size}
        loading="eager"
        decoding="async"
        onError={() => setHasError(true)}
        className="h-full w-full object-contain"
        style={{
          padding: `${paddingPx}px`,
        }}
      />
    </div>
  )
}

