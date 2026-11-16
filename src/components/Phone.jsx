import React, { useEffect, useState } from 'react'
import { useViewport } from '../hooks/useViewportMode'
import StatusBar from './StatusBar'

/**
 * Desktop Phone Frame:
 * Renders ONLY on desktop with a mouse (>=1025px not touch-first, or >1366px).
 * Centers a realistic 390x844 phone inside a 48px-radius hardware bezel,
 * scaled to fit the window height so it never causes outer page scroll.
 */
function DesktopPhoneFrame({ children }) {
  const OUTER_W = 414 // 390 + 12px bezel left + 12px bezel right
  const OUTER_H = 868 // 844 + 12px bezel top + 12px bezel bottom

  const [scale, setScale] = useState(1)

  useEffect(() => {
    const updateScale = () => {
      const vw = window.innerWidth
      const vh = window.innerHeight
      const maxScaleH = (vh - 32) / OUTER_H
      const maxScaleW = (vw - 32) / OUTER_W
      const s = Math.max(0.55, Math.min(1, maxScaleH, maxScaleW))
      setScale(s)
    }

    updateScale()
    window.addEventListener('resize', updateScale)
    return () => window.removeEventListener('resize', updateScale)
  }, [])

  const outerStyle = {
    width: `${Math.round(OUTER_W * scale)}px`,
    height: `${Math.round(OUTER_H * scale)}px`,
  }

  const bezelStyle = {
    width: `${OUTER_W}px`,
    height: `${OUTER_H}px`,
    transform: `scale(${scale})`,
    transformOrigin: 'top center',
  }

  return (
    <div className="relative flex h-[100dvh] w-full items-center justify-center overflow-hidden bg-[#0B1A33] bg-[radial-gradient(ellipse_at_85%_85%,_#1F1538_0%,_#0D1B36_50%,_#0B1A33_100%)] select-none">
      {/* Soft coral radial glow behind the phone on desktop */}
      <div
        className="pointer-events-none fixed inset-0 flex items-center justify-center overflow-hidden"
        aria-hidden="true"
      >
        <div className="h-[620px] w-[620px] rounded-full bg-[#EF5A78]/18 blur-[140px]" />
      </div>

      {/* Frame wrapper */}
      <div style={outerStyle} className="relative shrink-0 mx-auto flex items-center justify-center">
        {/* Hardware Bezel */}
        <div
          style={bezelStyle}
          className="relative h-full w-full rounded-[48px] bg-[#0D1526] p-[12px] shadow-[0_30px_90px_rgba(0,0,0,0.75),0_0_80px_rgba(239,90,120,0.2)] ring-1 ring-white/15"
        >
          {/* Subtle metallic side buttons */}
          <div
            className="absolute top-[116px] -left-[3px] h-7 w-[3px] rounded-l-sm bg-neutral-600"
            aria-hidden="true"
          />
          <div
            className="absolute top-[164px] -left-[3px] h-12 w-[3px] rounded-l-sm bg-neutral-600"
            aria-hidden="true"
          />
          <div
            className="absolute top-[224px] -left-[3px] h-12 w-[3px] rounded-l-sm bg-neutral-600"
            aria-hidden="true"
          />
          <div
            className="absolute top-[184px] -right-[3px] h-16 w-[3px] rounded-r-sm bg-neutral-600"
            aria-hidden="true"
          />

          {/* 390x844 phone screen */}
          <div className="relative flex h-[844px] w-[390px] flex-col overflow-hidden rounded-[38px] bg-[#FAF6F0] text-[#121A2B] select-text ring-1 ring-black/60">
            {/* Stationary Simulated Status Bar (desktop frame only) */}
            <StatusBar bg="bg-[#FAF6F0]" />

            <div className="relative flex-1 h-full w-full overflow-hidden flex flex-col">
              {children}
            </div>

            {/* Stationary desktop Home Indicator */}
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 z-50 flex h-[18px] items-center justify-center pb-1"
              aria-hidden="true"
            >
              <div className="h-[4px] w-[128px] rounded-full bg-[#121A2B]/20" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Full-Screen Shell:
 * Rendered on Phones (<768px) and Tablets/iPads.
 * Fills 100vw x 100dvh edge-to-edge with no phone frame, no bezel, no margin,
 * no scale transform, and border-radius: 0.
 */
function FullScreenShell({ children }) {
  return (
    <div className="relative h-[100dvh] h-screen w-full w-screen max-w-full overflow-hidden bg-[#FAF6F0] text-[#121A2B] select-text flex flex-col m-0 p-0 rounded-none">
      {children}
    </div>
  )
}

/**
 * Single responsive wrapper component:
 * Switches cleanly between DesktopPhoneFrame and FullScreenShell with zero leftover styles.
 */
export default function Phone({ children }) {
  const { isDesktop } = useViewport()

  if (isDesktop) {
    return <DesktopPhoneFrame>{children}</DesktopPhoneFrame>
  }

  return <FullScreenShell>{children}</FullScreenShell>
}
