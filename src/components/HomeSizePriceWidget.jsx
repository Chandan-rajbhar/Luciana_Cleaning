import React, { useState, useEffect, useRef } from 'react'
import { Clock, ArrowRight, Sparkles } from 'lucide-react'
import {
  calcBookingHours,
  calcPricingDetails,
  PRICING_CONFIG,
} from '../data/bookingDraft'

const BEDROOM_STEPS = [
  { value: 1, label: '1' },
  { value: 2, label: '2' },
  { value: 3, label: '3' },
  { value: 4, label: '4+' },
]

const BATHROOM_STEPS = [
  { value: 1, label: '1' },
  { value: 2, label: '2' },
  { value: 3, label: '3+' },
]

/**
 * Feature 2: Home Size and Instant Price Widget
 * - Segmented stepper sliders for Bedrooms (1, 2, 3, 4+) & Bathrooms (1, 2, 3+)
 * - 44px touch targets on stepper buttons and tracks
 * - Dynamic counting animation for estimated hours and price (400ms ease-out) with bounce
 * - "Book this size" button triggering quick scheduler with prefilled draft
 */
export default function HomeSizePriceWidget({
  draft,
  onUpdateDraft,
  onBookThisSize,
  title = 'Get an instant price',
  subtitle = 'Choose your home size for certified Florida cleaning rates',
  hideBookButton = false,
  className = '',
}) {
  const currentBedrooms = draft?.bedrooms || 3
  const currentBathrooms = draft?.bathrooms || 2
  const currentFrequency = draft?.frequency || 'One-time'
  const currentAddOns = draft?.addOns || []

  // Pricing calculation
  const pricing = calcPricingDetails({
    bedrooms: currentBedrooms,
    bathrooms: currentBathrooms,
    frequency: currentFrequency,
    addOns: currentAddOns,
  })

  // Animated counters for smooth ticking up/down
  const [displayHours, setDisplayHours] = useState(pricing.hours)
  const [displayPrice, setDisplayPrice] = useState(pricing.finalPrice)
  const [isBouncing, setIsBouncing] = useState(false)
  const prevPricingRef = useRef({ hours: pricing.hours, price: pricing.finalPrice })

  useEffect(() => {
    const prev = prevPricingRef.current
    const targetHours = pricing.hours
    const targetPrice = pricing.finalPrice

    if (prev.hours !== targetHours || prev.price !== targetPrice) {
      setIsBouncing(true)
      const bounceTimer = setTimeout(() => setIsBouncing(false), 380)

      const startHours = prev.hours
      const startPrice = prev.price
      const duration = 400
      const startTime = performance.now()

      const step = (now) => {
        const elapsed = now - startTime
        const progress = Math.min(elapsed / duration, 1)
        // ease-out quad
        const ease = 1 - Math.pow(1 - progress, 2)

        const nextH = startHours + (targetHours - startHours) * ease
        const nextP = startPrice + (targetPrice - startPrice) * ease

        setDisplayHours(Math.round(nextH * 10) / 10)
        setDisplayPrice(Math.round(nextP))

        if (progress < 1) {
          requestAnimationFrame(step)
        } else {
          setDisplayHours(targetHours)
          setDisplayPrice(targetPrice)
          prevPricingRef.current = { hours: targetHours, price: targetPrice }
        }
      }

      const animId = requestAnimationFrame(step)
      return () => {
        cancelAnimationFrame(animId)
        clearTimeout(bounceTimer)
      }
    }
  }, [pricing.hours, pricing.finalPrice])

  const handleSelectBedrooms = (val) => {
    if (onUpdateDraft) {
      onUpdateDraft({ bedrooms: val })
    }
  }

  const handleSelectBathrooms = (val) => {
    if (onUpdateDraft) {
      onUpdateDraft({ bathrooms: val })
    }
  }

  return (
    <div
      className={`stagger-item rounded-[24px] bg-white p-5 shadow-[0_4px_20px_rgba(20,30,60,0.06)] border border-[#F0EAE0] ${className}`}
    >
      {title && (
        <div className="flex items-center justify-between pb-3.5 border-b border-gray-100">
          <div>
            <h3 className="text-[17px] font-extrabold text-[#121A2B]">{title}</h3>
            {subtitle && (
              <p className="mt-0.5 text-[11.5px] font-medium text-[#7A8194]">
                {subtitle}
              </p>
            )}
          </div>
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#FDE4EA] text-[#EF5A78]">
            <Sparkles className="h-4 w-4" />
          </span>
        </div>
      )}

      {/* Stepper 1: Bedrooms */}
      <div className="mt-4">
        <div className="flex items-center justify-between">
          <label className="text-[13px] font-bold text-[#121A2B]">
            Bedrooms
          </label>
          <span className="text-[12px] font-extrabold text-[#EF5A78]">
            {currentBedrooms} {currentBedrooms === 1 ? 'Bed' : 'Beds'}
          </span>
        </div>

        {/* 4-step segmented track */}
        <div className="mt-2 grid grid-cols-4 gap-1.5 rounded-2xl bg-[#FAF6F0] p-1.5 border border-[#F0EAE0]">
          {BEDROOM_STEPS.map((s) => {
            const isSelected = currentBedrooms === s.value
            return (
              <button
                key={s.value}
                type="button"
                onClick={() => handleSelectBedrooms(s.value)}
                aria-pressed={isSelected}
                className={`flex min-h-[44px] items-center justify-center rounded-xl text-[13px] font-bold transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-[#EF5A78] text-white shadow-[0_2px_10px_rgba(239,90,120,0.35)] scale-[1.02]'
                    : 'text-[#7A8194] hover:text-[#121A2B] hover:bg-white/60 active:scale-95'
                }`}
              >
                {s.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Stepper 2: Bathrooms */}
      <div className="mt-4">
        <div className="flex items-center justify-between">
          <label className="text-[13px] font-bold text-[#121A2B]">
            Bathrooms
          </label>
          <span className="text-[12px] font-extrabold text-[#EF5A78]">
            {currentBathrooms} {currentBathrooms === 1 ? 'Bath' : 'Baths'}
          </span>
        </div>

        {/* 3-step segmented track */}
        <div className="mt-2 grid grid-cols-3 gap-1.5 rounded-2xl bg-[#FAF6F0] p-1.5 border border-[#F0EAE0]">
          {BATHROOM_STEPS.map((s) => {
            const isSelected = currentBathrooms === s.value
            return (
              <button
                key={s.value}
                type="button"
                onClick={() => handleSelectBathrooms(s.value)}
                aria-pressed={isSelected}
                className={`flex min-h-[44px] items-center justify-center rounded-xl text-[13px] font-bold transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-[#EF5A78] text-white shadow-[0_2px_10px_rgba(239,90,120,0.35)] scale-[1.02]'
                    : 'text-[#7A8194] hover:text-[#121A2B] hover:bg-white/60 active:scale-95'
                }`}
              >
                {s.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Result row: Duration & Large Price */}
      <div className="mt-5 flex items-center justify-between rounded-2xl bg-[#FAF6F0]/80 p-3.5 border border-[#F0EAE0]">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#D98A1E] shadow-2xs">
            <Clock className="h-4 w-4" />
          </div>
          <div>
            <span className="block text-[10px] font-bold uppercase tracking-wider text-[#7A8194]">
              EST. TIME
            </span>
            <span className="text-[13px] font-extrabold text-[#121A2B]">
              Est. {displayHours.toFixed(1)} hrs
            </span>
          </div>
        </div>

        <div className="text-right">
          <span className="block text-[10px] font-bold uppercase tracking-wider text-[#7A8194]">
            INSTANT ESTIMATE
          </span>
          <div className="flex items-baseline justify-end gap-1">
            <span
              className={`text-[24px] font-extrabold text-[#EF5A78] transition-transform duration-200 ${
                isBouncing ? 'scale-110' : 'scale-100'
              }`}
            >
              ${displayPrice}
            </span>
            <span className="text-[12px] font-semibold text-[#7A8194]">
              /clean
            </span>
          </div>
        </div>
      </div>

      {/* "Book this size" Coral Button */}
      {!hideBookButton && onBookThisSize && (
        <button
          type="button"
          onClick={() => onBookThisSize(pricing)}
          className="mt-4 flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full bg-[#EF5A78] px-5 py-3 text-[13.5px] font-extrabold text-white shadow-[0_6px_18px_rgba(239,90,120,0.35)] hover:brightness-105 active:scale-[0.97] transition-all cursor-pointer"
        >
          <span>Book this size</span>
          <ArrowRight className="h-4 w-4 stroke-[2.4]" />
        </button>
      )}
    </div>
  )
}

