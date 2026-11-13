import React, { useEffect, useState } from 'react'

/**
 * Single responsive shell wrapping the app content:
 * - Mobile (<768px): full-bleed 100vw x 100dvh native app (no bezel, no radius, no outer padding).
 * - Desktop (>=768px): realistic 390x844 phone inside a 48px-radius dark bezel,
 *   centered and scaled down with viewport height so it never triggers page scroll.
 */
export default function Phone({ children }) {
  const OUTER_W = 414 // 390 + 12px bezel left + 12px bezel right
  const OUTER_H = 868 // 844 + 12px bezel top + 12px bezel bottom

  const [viewport, setViewport] = useState(() => ({
    isDesktop: typeof window !== 'undefined' ? window.innerWidth >= 768 : true,
    scale: 1,
  }))

  useEffect(() => {
    const updateLayout = () => {
      const vw = window.innerWidth
      const vh = window.innerHeight
      const isDesktop = vw >= 768

      if (!isDesktop) {
        setViewport({ isDesktop: false, scale: 1 })
        return
      }

      const maxScaleH = (vh - 32) / OUTER_H
      const maxScaleW = (vw - 32) / OUTER_W
      const scale = Math.max(0.55, Math.min(1, maxScaleH, maxScaleW))
      setViewport({ isDesktop: true, scale })
    }

    updateLayout()
    window.addEventListener('resize', updateLayout)
    return () => window.removeEventListener('resize', updateLayout)
  }, [])

  const outerStyle = viewport.isDesktop
    ? {
        width: `${Math.round(OUTER_W * viewport.scale)}px`,
        height: `${Math.round(OUTER_H * viewport.scale)}px`,
      }
    : undefined

  const bezelStyle = viewport.isDesktop
    ? {
        width: `${OUTER_W}px`,
        height: `${OUTER_H}px`,
        transform: `scale(${viewport.scale})`,
        transformOrigin: 'top left',
      }
    : undefined

  return (
    <div
      style={outerStyle}
      className="relative h-[100dvh] w-screen shrink-0 md:mx-auto select-none"
    >
      {/* Hardware Bezel (Desktop >= 768px only) */}
      <div
        style={bezelStyle}
        className="relative h-full w-full md:rounded-[48px] md:bg-[#0D1526] md:p-[12px] md:shadow-[0_30px_90px_rgba(0,0,0,0.75),0_0_80px_rgba(239,90,120,0.2)] md:ring-1 md:ring-white/15"
      >
        {/* Subtle metallic side buttons — desktop only */}
        <div
          className="hidden md:block absolute top-[116px] -left-[3px] h-7 w-[3px] rounded-l-sm bg-neutral-600"
          aria-hidden="true"
        />
        <div
          className="hidden md:block absolute top-[164px] -left-[3px] h-12 w-[3px] rounded-l-sm bg-neutral-600"
          aria-hidden="true"
        />
        <div
          className="hidden md:block absolute top-[224px] -left-[3px] h-12 w-[3px] rounded-l-sm bg-neutral-600"
          aria-hidden="true"
        />
        <div
          className="hidden md:block absolute top-[184px] -right-[3px] h-16 w-[3px] rounded-r-sm bg-neutral-600"
          aria-hidden="true"
        />

        {/* App Viewport Container: 100vw x 100dvh on mobile; 390x844 on desktop */}
        <div className="relative flex h-full w-full md:h-[844px] md:w-[390px] flex-col overflow-hidden rounded-none md:rounded-[38px] bg-[#FAF6F0] text-[#121A2B] select-text md:ring-1 md:ring-black/60">
          {children}

          {/* Stationary desktop Home Indicator (never animates) */}
          <div
            className="hidden md:flex pointer-events-none absolute inset-x-0 bottom-0 z-50 h-[18px] items-center justify-center pb-1"
            aria-hidden="true"
          >
            <div className="h-[4px] w-[128px] rounded-full bg-[#121A2B]/20" />
          </div>
        </div>
      </div>
    </div>
  )
}
