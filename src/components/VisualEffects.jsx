import React from 'react'

/**
 * Top loading progress bar
 * - 5px tall, fills along top edge under status bar/header over given duration
 * - Coral-to-gold gradient with soft coral track (#FDE4EA)
 * - Non-blocking (pointer-events: none)
 */
export function TopProgressBar({ isActive, duration = 300, barKey = 0 }) {
  if (!isActive) return null

  return (
    <div
      key={barKey}
      className="pointer-events-none absolute top-[58px] left-0 right-0 z-40 h-[5px] w-full overflow-hidden bg-[#FDE4EA]/75 select-none"
      role="progressbar"
      aria-hidden="true"
    >
      <div
        style={{ animationDuration: `${duration}ms` }}
        className="h-full w-full bg-gradient-to-r from-[#EF5A78] via-[#F2766B] to-[#F5A623] rounded-r-full animate-progress-fill"
      />
    </div>
  )
}

/**
 * Gold twinkling sparkles (✦)
 * - 2 or 3 gold sparkles that twinkle (scale and rotate with a fade over 1.8s loop)
 */
export function SparklesGroup({ className = '' }) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-visible ${className}`}
      aria-hidden="true"
    >
      <span className="absolute -top-1.5 -right-2 text-[14px] text-[#F5A623] animate-sparkle-1 select-none font-serif leading-none">
        ✦
      </span>
      <span className="absolute -bottom-1 -left-2.5 text-[11px] text-[#F5A623] animate-sparkle-2 select-none font-serif leading-none">
        ✦
      </span>
      <span className="absolute top-1/2 -right-3.5 text-[9px] text-[#F5A623] animate-sparkle-3 select-none font-serif leading-none">
        ✦
      </span>
    </div>
  )
}

/**
 * Bubbles floating up from the top edge of a bottom sheet
 * - 3 subtle outlined coral bubbles that float up when a sheet opens
 */
export function SheetBubbles() {
  return (
    <div
      className="pointer-events-none absolute -top-4 inset-x-0 h-10 overflow-visible z-20 select-none"
      aria-hidden="true"
    >
      <span
        style={{ left: '22%' }}
        className="absolute bottom-0 h-4 w-4 rounded-full border-2 border-[#EF5A78]/35 animate-sheet-bubble-1"
      />
      <span
        style={{ left: '50%' }}
        className="absolute bottom-0 h-5 w-5 rounded-full border-2 border-[#EF5A78]/35 animate-sheet-bubble-2"
      />
      <span
        style={{ left: '78%' }}
        className="absolute bottom-0 h-3.5 w-3.5 rounded-full border-2 border-[#EF5A78]/35 animate-sheet-bubble-3"
      />
    </div>
  )
}

