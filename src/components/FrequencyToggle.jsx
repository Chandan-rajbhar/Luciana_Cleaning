import React from 'react'
import { Sparkles, Check } from 'lucide-react'
import { FREQUENCY_OPTIONS, calcPricingDetails } from '../data/bookingDraft'

/**
 * Feature 3: Frequency & Recurring Savings Toggle
 * - 4-option horizontal switcher: One-time, Weekly (Save 20%), Bi-weekly (Save 15%), Monthly (Save 10%)
 * - 300ms animated coral strikethrough across regular price + slide-up green discounted price
 * - "Cancel anytime" assurance pill and "You save $XX.XX per clean" calculation
 * - Fully synchronized with the shared booking draft
 */
export default function FrequencyToggle({
  draft,
  onFrequencyChange,
  showPriceSummary = true,
  className = '',
}) {
  const currentFrequency = draft?.frequency || 'One-time'
  const pricing = calcPricingDetails({
    bedrooms: draft?.bedrooms || 3,
    bathrooms: draft?.bathrooms || 2,
    frequency: currentFrequency,
    addOns: draft?.addOns || [],
  })

  const isRecurring = pricing.isRecurring

  return (
    <div
      className={`stagger-item rounded-[22px] bg-white p-4 shadow-[0_4px_16px_rgba(20,30,60,0.06)] border border-[#F0EAE0] ${className}`}
    >
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-[14.5px] font-extrabold text-[#121A2B]">Frequency</h3>
          <p className="text-[11px] font-medium text-[#7A8194]">
            Recurring visits include locked-in discount pricing
          </p>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-[#FDE4EA] px-2.5 py-1 text-[10.5px] font-bold text-[#EF5A78]">
          Cancel anytime
        </span>
      </div>

      {/* 4 horizontal pills inside an isolated scroll track */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 -mx-1 px-1">
        {FREQUENCY_OPTIONS.map((opt) => {
          const isSelected = currentFrequency === opt.id
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onFrequencyChange?.(opt.id)}
              aria-pressed={isSelected}
              className={`group relative flex min-h-[44px] shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 text-[12px] font-extrabold transition-all duration-200 cursor-pointer ${
                isSelected
                  ? 'bg-[#EF5A78] text-white shadow-[0_3px_12px_rgba(239,90,120,0.35)] scale-[1.02]'
                  : 'bg-[#FAF6F0] text-[#7A8194] border border-[#F0EAE0] hover:text-[#121A2B] hover:border-gray-300'
              }`}
            >
              <span>{opt.label}</span>
              {opt.badge && (
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[9.5px] font-extrabold transition-colors ${
                    isSelected
                      ? 'bg-white/25 text-white'
                      : 'bg-[#E6F6EC] text-[#2E9E5B]'
                  }`}
                >
                  {opt.badge}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Animated price savings row */}
      {showPriceSummary && (
        <div className="mt-3.5 pt-3 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isRecurring ? (
              <div className="flex items-baseline gap-2">
                {/* Regular base price with 300ms animated coral strikethrough line */}
                <div className="relative inline-block text-[14px] font-bold text-[#8A8FA3]">
                  <span>${pricing.basePrice.toFixed(2)}</span>
                  <div
                    style={{
                      animation: 'strikeLine 300ms cubic-bezier(0.4, 0, 0.2, 1) forwards',
                    }}
                    className="absolute top-1/2 left-0 right-0 h-[2px] bg-[#EF5A78] -translate-y-1/2"
                  />
                </div>

                {/* Green discounted price with slide-up */}
                <span className="text-[17px] font-extrabold text-[#2E9E5B] animate-pop-in">
                  ${pricing.discountedBase.toFixed(2)}
                </span>
                <span className="text-[11px] font-semibold text-[#7A8194]">/clean</span>
              </div>
            ) : (
              <div className="flex items-baseline gap-1">
                <span className="text-[17px] font-extrabold text-[#EF5A78]">
                  ${pricing.basePrice.toFixed(2)}
                </span>
                <span className="text-[11px] font-semibold text-[#7A8194]">/clean</span>
              </div>
            )}
          </div>

          {/* Savings calculation pill */}
          {isRecurring ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#E6F6EC] px-2.5 py-1 text-[11px] font-extrabold text-[#2E9E5B] animate-pop-in">
              <Sparkles className="h-3 w-3 stroke-[2.4]" />
              You save ${pricing.savings.toFixed(2)} per clean
            </span>
          ) : (
            <span className="text-[11px] font-medium text-[#8A8FA3]">
              Standard rate
            </span>
          )}
        </div>
      )}
    </div>
  )
}

