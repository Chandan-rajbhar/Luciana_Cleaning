import React, { useEffect, useRef } from 'react'
import { useViewport } from '../hooks/useViewportMode'
import StatusBar from './StatusBar'

/**
 * Desktop Phone Frame:
 * Renders ONLY on desktop with a mouse (>=1025px not touch-first, or >1366px).
 * - Full-viewport stage: position fixed, inset 0, flex, center, overflow hidden
 * - Scaled frame: flex: none so it never shrinks, scaled with CSS transform: scale(var(--frame-scale, 0.85)) and transform-origin center
 * - Inner screen: exactly 390x844 (unchanged)
 * - Auto-fit: scale = min(0.88, (window.innerHeight - 40) / frameHeight), measured from real total frame height including bezel
 */
function DesktopPhoneFrame({ children }) {
  const frameRef = useRef(null)

  useEffect(() => {
    const updateScale = () => {
      // Real total height of the frame including bezel (measure it, don't guess)
      const frameHeight = frameRef.current?.offsetHeight || 868
      const scale = Math.min(0.88, (window.innerHeight - 40) / frameHeight)
      document.documentElement.style.setProperty('--frame-scale', scale.toFixed(4))
    }

    updateScale()
    window.addEventListener('resize', updateScale)
    return () => window.removeEventListener('resize', updateScale)
  }, [])

  return (
    <div className="desktop-phone-stage fixed inset-0 flex items-center justify-center overflow-hidden bg-[#0B1A33] bg-[radial-gradient(ellipse_at_85%_85%,_#1F1538_0%,_#0D1B36_50%,_#0B1A33_100%)] select-none">
      {/* Soft coral radial glow behind the phone on desktop */}
      <div
        className="pointer-events-none fixed inset-0 flex items-center justify-center overflow-hidden"
        aria-hidden="true"
      >
        <div className="h-[620px] w-[620px] rounded-full bg-[#EF5A78]/18 blur-[140px]" />
      </div>

      {/* Hardware Bezel & Scaled Frame (flex: none so it never shrinks) */}
      <div
        ref={frameRef}
        style={{
          transform: 'scale(var(--frame-scale, 0.85))',
          transformOrigin: 'center',
        }}
        className="desktop-phone-frame relative flex-none w-[414px] h-[868px] rounded-[48px] bg-[#0D1526] p-[12px] shadow-[0_30px_90px_rgba(0,0,0,0.75),0_0_80px_rgba(239,90,120,0.2)] ring-1 ring-white/15"
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

        {/* 390x844 phone screen (inner layout & breakpoints strictly preserved) */}
        <div className="relative flex h-[844px] w-[390px] flex-col overflow-hidden rounded-[38px] bg-[#FAF6F0] text-[#121A2B] select-text ring-1 ring-black/60">
          {/* Stationary Simulated Status Bar with Dynamic Island notch */}
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
  )
}

/**
 * Full-Screen Shell:
 * Rendered on Phones (<768px) and Tablets/iPads.
 * Uses 100% height / var(--app-h, 100%) edge-to-edge with no phone frame, no bezel, no margin,
 * no scale transform, no vh/dvh dependency, and border-radius: 0.
 */
function FullScreenShell({ children }) {
  return (
    <div
      style={{ height: 'var(--app-h, 100%)' }}
      className="relative h-full w-full max-w-full overflow-hidden bg-[#FAF6F0] text-[#121A2B] select-text flex flex-col m-0 p-0 rounded-none"
    >
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
