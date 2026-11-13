import React from 'react'
import { Wifi } from 'lucide-react'

/**
 * iOS-style status bar matching the warm cream and navy UI.
 * 9:41 time, centered Dynamic Island notch, cellular signal bars, Wi-Fi, and battery.
 */
export default function StatusBar({ bg = 'bg-[#FAF6F0]', light = false }) {
  const ink = light ? 'text-white' : 'text-[#121A2B]'
  const barBg = light ? 'bg-white' : 'bg-[#121A2B]'
  const barMuted = light ? 'bg-white/30' : 'bg-[#121A2B]/25'
  const borderCol = light ? 'border-white/60' : 'border-[#121A2B]/50'

  return (
    <div
      className={`relative z-30 hidden md:flex h-[44px] w-full shrink-0 items-center justify-between px-6 select-none ${bg} ${ink}`}
      aria-hidden="true"
    >
      {/* Time */}
      <span className="w-[54px] text-[14px] font-bold tracking-tight">9:41</span>

      {/* Dynamic Island */}
      <div className="flex h-[26px] w-[108px] items-center justify-between rounded-full bg-[#0D1526] px-2.5 shadow-sm ring-1 ring-white/10">
        <span className="h-2.5 w-2.5 rounded-full bg-[#1A2338]" />
        <span className="relative h-2.5 w-2.5 rounded-full bg-[#121C30]">
          <span className="absolute inset-[2.5px] rounded-full bg-[#2E3C5B]" />
        </span>
      </div>

      {/* Signal, WiFi, Battery */}
      <div className="flex w-[64px] items-center justify-end gap-1.5">
        <div className="flex items-end gap-[1.5px]" title="Signal">
          <span className={`h-[4px] w-[2.5px] rounded-[1px] ${barBg}`} />
          <span className={`h-[6.5px] w-[2.5px] rounded-[1px] ${barBg}`} />
          <span className={`h-[9px] w-[2.5px] rounded-[1px] ${barBg}`} />
          <span className={`h-[11px] w-[2.5px] rounded-[1px] ${barMuted}`} />
        </div>

        <Wifi className="h-[13px] w-[13px] stroke-[2.4]" />

        <div className="flex items-center gap-[1.5px]">
          <div className={`flex h-[11px] w-[21px] items-center rounded-[3.5px] border p-[1.5px] ${borderCol}`}>
            <div className={`h-full w-[82%] rounded-[1.5px] ${barBg}`} />
          </div>
          <div className={`h-[4.5px] w-[1.5px] rounded-r-full ${barMuted}`} />
        </div>
      </div>
    </div>
  )
}
