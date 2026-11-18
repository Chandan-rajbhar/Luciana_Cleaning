import React from 'react'
import { CheckCircle2 } from 'lucide-react'
import { calcPricingDetails, PRICING_CONFIG } from '../data/bookingDraft'

const FREQUENCY_OPTIONS = [
  { id: 'One-time', label: 'One-time', savingsText: 'Standard rate' },
  { id: 'Weekly', label: 'Weekly', savingsText: 'Save 20%' },
  { id: 'Bi-weekly', label: 'Bi-weekly', savingsText: 'Save 15%' },
  { id: 'Monthly', label: 'Monthly', savingsText: 'Save 10%' },
]

/**
 * Feature 3: Frequency & Recurring Savings Card
 * - Clean white card (rounded 22px, 14px padding)
 * - Header row: "Frequency" on left, plain "Cancel anytime" with check-circle icon on right
 * - Subtitle: "Recurring visits lock in a discount."
 * - 2x2 grid of equal buttons (grid-cols-2, gap 8px) with role="radiogroup" / role="radio"
 * - Selected: theme primary fill + white text; Unselected: very light primary tint
 * - Price summary below divider: "Total per clean", 28px bold total, struck price when discounted
 * - Full-width green savings row shown ONLY when discount is active
 */
export default function FrequencyToggle({
  draft,
  onFrequencyChange,
  showPriceSummary = true,
  className = '',
  hourlyRate,
}) {
  const currentFrequency = draft?.frequency || 'One-time'
  const pricing = calcPricingDetails({
    bedrooms: draft?.bedrooms || 3,
    bathrooms: draft?.bathrooms || 2,
    frequency: currentFrequency,
    addOns: draft?.addOns || [],
    hourlyRate: hourlyRate || draft?.hourlyRate || PRICING_CONFIG.defaultHourlyRate,
  })

  const isRecurring = pricing.isRecurring

  return (
    <div
      className={`stagger-item rounded-[22px] bg-white p-3.5 shadow-[0_4px_16px_rgba(20,30,60,0.06)] border border-[#F0EAE0] ${className}`}
    >
      {/* Header Row */}
      <div className="flex items-center justify-between">
        <h3 className="text-[15px] font-extrabold text-[#121A2B]">Frequency</h3>
        <span className="shrink-0 whitespace-nowrap inline-flex items-center gap-1 text-[11.5px] font-semibold text-[#7A8194]">
          <CheckCircle2 className="h-3.5 w-3.5 text-[#2E9E5B]" />
          Cancel anytime
        </span>
      </div>
      <p className="mt-0.5 text-[11.5px] font-medium text-[#7A8194]">
        Recurring visits lock in a discount.
      </p>

      {/* 2x2 Grid Options */}
      <div
        role="radiogroup"
        aria-label="Cleaning frequency"
        className="grid grid-cols-2 gap-2 mt-3"
      >
        {FREQUENCY_OPTIONS.map((opt) => {
          const isSelected = currentFrequency === opt.id
          return (
            <button
              key={opt.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => onFrequencyChange?.(opt.id)}
              className={`group relative flex min-h-[52px] flex-col items-center justify-center rounded-2xl p-2.5 text-center transition-all duration-200 cursor-pointer motion-reduce:transition-none ${
                isSelected
                  ? 'bg-[var(--primary)] text-white shadow-[0_3px_12px_rgba(239,90,120,0.3)]'
                  : 'bg-[var(--primary)]/10 text-[#121A2B] hover:bg-[var(--primary)]/15 border border-[var(--primary)]/15 active:scale-[0.98]'
              }`}
            >
              <span
                className={`text-[13px] font-semibold leading-tight ${
                  isSelected ? 'text-white' : 'text-[#121A2B]'
                }`}
              >
                {opt.label}
              </span>
              <span
                className={`mt-0.5 text-[11px] leading-tight ${
                  isSelected ? 'text-white/85 font-medium' : 'text-[#7A8194] font-medium'
                }`}
              >
                {opt.savingsText}
              </span>
            </button>
          )
        })}
      </div>

      {/* Price summary below a divider */}
      {showPriceSummary && (
        <div className="mt-3 pt-3 border-t border-[#F0EAE0]">
          <div className="flex items-baseline justify-between">
            <span className="text-[11.5px] font-medium text-[#7A8194]">
              Total per clean
            </span>
            <div className="flex items-baseline gap-1.5">
              {isRecurring && (
                <span className="text-[14px] font-bold text-[#8A8FA3] line-through">
                  ${pricing.basePrice.toFixed(2)}
                </span>
              )}
              <span className="text-[28px] font-extrabold text-[#121A2B] leading-none">
                ${pricing.discountedBase.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Full-width green savings row (only when discount is active) */}
          {isRecurring && (
            <div className="mt-2.5 flex items-center justify-center gap-1.5 rounded-xl bg-[#E6F6EC] px-3 py-2 text-[12px] font-bold text-[#2E9E5B] w-full transition-all duration-200 motion-reduce:transition-none">
              <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-[#2E9E5B]" />
              <span>You save ${pricing.savings.toFixed(2)} per clean</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
