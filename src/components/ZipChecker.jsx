import React, { useState, useEffect } from 'react'
import { MapPin, CheckCircle2, AlertCircle, X } from 'lucide-react'
import { FORT_MYERS_ZIPS } from '../data/bookingDraft'

/**
 * Feature 7: Fort Myers Zip Code Service Checker Pill
 * - Placed directly below the header on the Home screen
 * - 48px pill input, 16px font (prevents iOS auto-zoom)
 * - Instant validation upon typing 5 digits
 * - Green success message if served; soft orange message with "Notify me" link if not
 * - Clear (x) button to reset
 */
export default function ZipChecker({ currentZip = '', onZipChange, onShowToast }) {
  const [zip, setZip] = useState(currentZip || '')
  const [status, setStatus] = useState(
    currentZip && currentZip.length === 5 && FORT_MYERS_ZIPS.includes(currentZip)
      ? 'served'
      : 'idle'
  )

  useEffect(() => {
    if (currentZip !== undefined && currentZip !== zip) {
      setZip(currentZip || '')
      if (currentZip && currentZip.length === 5) {
        setStatus(FORT_MYERS_ZIPS.includes(currentZip) ? 'served' : 'unserved')
      } else {
        setStatus('idle')
      }
    }
  }, [currentZip])

  const handleChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 5)
    setZip(raw)

    if (raw.length === 5) {
      const isServed = FORT_MYERS_ZIPS.includes(raw)
      setStatus(isServed ? 'served' : 'unserved')
      if (isServed && onZipChange) {
        onZipChange(raw)
      }
    } else {
      setStatus('idle')
      if (onZipChange && zip.length === 5) {
        onZipChange('')
      }
    }
  }

  const handleClear = () => {
    setZip('')
    setStatus('idle')
    if (onZipChange) {
      onZipChange('')
    }
  }

  const handleNotifyMe = (e) => {
    e.preventDefault()
    onShowToast?.("We'll let you know when we expand to your zip!")
  }

  const borderColor =
    status === 'served'
      ? 'border-[#2E9E5B] ring-1 ring-[#2E9E5B]/20'
      : status === 'unserved'
      ? 'border-[#EA580C] ring-1 ring-[#EA580C]/20'
      : 'border-[#F0EAE0] focus-within:border-[#EF5A78] focus-within:ring-2 focus-within:ring-[#EF5A78]/20'

  return (
    <div className="stagger-item w-full">
      <div
        className={`relative flex h-12 w-full items-center rounded-full bg-white px-4 shadow-[0_2px_12px_rgba(20,30,60,0.05)] transition-all duration-200 border ${borderColor}`}
      >
        <MapPin
          className={`h-4.5 w-4.5 shrink-0 stroke-[2.2] transition-colors ${
            status === 'served'
              ? 'text-[#2E9E5B]'
              : status === 'unserved'
              ? 'text-[#EA580C]'
              : 'text-[#EF5A78]'
          }`}
        />

        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={5}
          value={zip}
          onChange={handleChange}
          placeholder="Enter your zip code (e.g. 33901)"
          aria-label="Service area zip code"
          className="ml-2.5 flex-1 bg-transparent text-[16px] font-semibold text-[#121A2B] placeholder:text-[#8A8FA3] placeholder:font-normal focus:outline-none"
        />

        {zip.length > 0 && (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Clear zip code"
            className="flex h-7 w-7 items-center justify-center rounded-full text-[#8A8FA3] hover:text-[#121A2B] hover:bg-gray-100 active:scale-90 transition-all cursor-pointer"
          >
            <X className="h-4 w-4 stroke-[2.2]" />
          </button>
        )}
      </div>

      {/* Validation feedback pill */}
      {status === 'served' && (
        <div className="mt-2 flex items-center gap-1.5 rounded-full bg-[#E6F6EC] px-3.5 py-1.5 text-[11.5px] font-bold text-[#2E9E5B] border border-[#2E9E5B]/25 animate-pop-in">
          <CheckCircle2 className="h-3.5 w-3.5 shrink-0 stroke-[2.5]" />
          <span>✓ Great news! Luciana's crew services your neighborhood.</span>
        </div>
      )}

      {status === 'unserved' && (
        <div className="mt-2 flex items-center justify-between rounded-full bg-[#FFF4E5] px-3.5 py-1.5 text-[11.5px] font-bold text-[#EA580C] border border-[#EA580C]/25 animate-pop-in">
          <div className="flex items-center gap-1.5 min-w-0">
            <AlertCircle className="h-3.5 w-3.5 shrink-0 stroke-[2.5]" />
            <span className="truncate">We don't cover that area yet.</span>
          </div>
          <button
            type="button"
            onClick={handleNotifyMe}
            className="ml-2 shrink-0 text-[11.5px] font-extrabold text-[#EF5A78] underline hover:brightness-95 active:scale-95 cursor-pointer"
          >
            Notify me
          </button>
        </div>
      )}
    </div>
  )
}

