import React, { useState, useEffect } from 'react'

/**
 * Reusable AmbientBackground component
 * - Placed behind content on every screen (z-index: 0, pointer-events: none)
 * - 3 soft blurred glow blobs on cream background (#FAF6F0) with slow drift
 * - 5 floating outlined bubbles (2px coral border at 35% max opacity, no fill)
 *   rising over 6s with staggered delays
 * - Positioned in the outer 15% edges on text-heavy screens (Chat, forms, Calendar)
 * - Mobile performance: 3 bubbles and reduced blur
 * - Pauses animations when tab is hidden
 */
export default function AmbientBackground({ isTextHeavy = false }) {
  const [isPaused, setIsPaused] = useState(false)

  // Pause animations when browser tab is hidden to save GPU & battery
  useEffect(() => {
    const handleVisibility = () => {
      setIsPaused(document.visibilityState === 'hidden')
    }
    document.addEventListener('visibilitychange', handleVisibility)
    return () => document.removeEventListener('visibilitychange', handleVisibility)
  }, [])

  // Bubble configurations: sizes (14-56px), delays, durations
  // On text-heavy screens or side corridors, bubbles stay in outer 15% margins
  const bubbles = [
    {
      id: 1,
      size: 26,
      left: isTextHeavy ? '5%' : '8%',
      delay: '0s',
      duration: '6s',
      mobile: true,
    },
    {
      id: 2,
      size: 46,
      right: isTextHeavy ? '6%' : '10%',
      delay: '1.3s',
      duration: '6.2s',
      mobile: true,
    },
    {
      id: 3,
      size: 18,
      left: isTextHeavy ? '11%' : '14%',
      delay: '2.7s',
      duration: '5.8s',
      mobile: true,
    },
    {
      id: 4,
      size: 52,
      right: isTextHeavy ? '12%' : '86%',
      delay: '3.9s',
      duration: '6.4s',
      mobile: false, // Desktop only to preserve mobile 60fps
    },
    {
      id: 5,
      size: 32,
      left: isTextHeavy ? '3%' : '6%',
      delay: '4.8s',
      duration: '6.1s',
      mobile: false, // Desktop only to preserve mobile 60fps
    },
  ]

  return (
    <div
      aria-hidden="true"
      style={{
        animationPlayState: isPaused ? 'paused' : 'running',
      }}
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden bg-[#FAF6F0] select-none"
    >
      {/* Blob A: Top-left, 420px, radial #FDC9D4, 0.55 opacity, drifts 9s */}
      <div
        style={{
          width: '420px',
          height: '420px',
          background: 'radial-gradient(circle, #FDC9D4 0%, transparent 70%)',
          animationPlayState: isPaused ? 'paused' : 'running',
        }}
        className="animate-blob-a absolute -top-[140px] -left-[140px] rounded-full opacity-55 blur-[28px] md:blur-[50px] transform-gpu will-change-transform"
      />

      {/* Blob B: Bottom-right, 380px, radial #FFE2A8, 0.5 opacity, drifts 11s */}
      <div
        style={{
          width: '380px',
          height: '380px',
          background: 'radial-gradient(circle, #FFE2A8 0%, transparent 70%)',
          animationPlayState: isPaused ? 'paused' : 'running',
        }}
        className="animate-blob-b absolute -bottom-[120px] -right-[120px] rounded-full opacity-50 blur-[30px] md:blur-[55px] transform-gpu will-change-transform"
      />

      {/* Blob C: Right side, 260px, radial #D6E6F8, 0.5 opacity, drifts 8s */}
      <div
        style={{
          width: '260px',
          height: '260px',
          background: 'radial-gradient(circle, #D6E6F8 0%, transparent 70%)',
          animationPlayState: isPaused ? 'paused' : 'running',
        }}
        className="animate-blob-c absolute top-[38%] -right-[80px] rounded-full opacity-50 blur-[24px] md:blur-[42px] transform-gpu will-change-transform"
      />

      {/* 5 Floating Outlined Bubbles (14-56px, 2px coral border at 35% max opacity, no fill) */}
      <div className="absolute inset-0 overflow-hidden">
        {bubbles.map((b) => (
          <div
            key={b.id}
            style={{
              width: `${b.size}px`,
              height: `${b.size}px`,
              left: b.left,
              right: b.right,
              bottom: '-60px',
              animationDelay: b.delay,
              animationDuration: b.duration,
              animationPlayState: isPaused ? 'paused' : 'running',
            }}
            className={`animate-bubble absolute rounded-full border-2 border-[#EF5A78]/35 bg-transparent ${
              b.mobile ? 'block' : 'hidden md:block'
            }`}
          />
        ))}
      </div>
    </div>
  )
}

