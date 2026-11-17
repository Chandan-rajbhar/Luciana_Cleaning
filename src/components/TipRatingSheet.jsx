import React, { useState } from 'react'
import { Star, X, Check, Loader2, CreditCard } from 'lucide-react'
import BottomSheet from './BottomSheet'

const COMPLIMENTS = [
  'Punctual',
  'Streak-free Floors',
  'Super Friendly',
  'Smells Fresh',
]

const RATING_LABELS = {
  1: 'Poor',
  2: 'Fair',
  3: 'Good',
  4: 'Great',
  5: 'Excellent',
}

const TIP_OPTIONS = ['No Tip', '$10', '$15', '$20', 'Custom']

/**
 * Feature 5: Post-Clean Tip & Rating Sheet
 * - Renders via portal using shared BottomSheet into app shell (#sheet-portal)
 * - (a) Fixed top with drag handle, cleaner avatar, name, "POST-CLEAN REVIEW", and close button
 * - (b) Scrollable middle area with 5 bouncing stars, compliments, tip options, and optional notes
 * - (c) Fixed footer with Submit button, white bg, top border, and 1rem + env(safe-area-inset-bottom)
 * - The Submit button is ALWAYS fully visible without scrolling
 * - Bottom nav is hidden smoothly while sheet is open
 */
export default function TipRatingSheet({
  isOpen,
  bookingItem,
  onClose,
  onSubmitRating,
  onShowToast,
  onTriggerLoading,
}) {
  const [stars, setStars] = useState(5)
  const [activeBounceIdx, setActiveBounceIdx] = useState(null)
  const [selectedCompliments, setSelectedCompliments] = useState(['Streak-free Floors', 'Smells Fresh'])
  const [tipSelection, setTipSelection] = useState('$15')
  const [customTip, setCustomTip] = useState('25')
  const [notes, setNotes] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [validationError, setValidationError] = useState('')

  if (!isOpen || !bookingItem) return null

  const cleanerName = bookingItem.cleaner || 'Maria S.'
  const cleanerImage = bookingItem.cleanerImage || '/images/cleaner-maria.jpg'

  const handleStarClick = (rating) => {
    setStars(rating)
    setValidationError('')
    setActiveBounceIdx(rating)
    setTimeout(() => setActiveBounceIdx(null), 300)
  }

  const toggleCompliment = (tag) => {
    setSelectedCompliments((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
  }

  const getEffectiveTipAmount = () => {
    if (tipSelection === 'No Tip') return 0
    if (tipSelection === 'Custom') {
      const num = parseFloat(customTip) || 0
      return Math.max(num, 0)
    }
    return parseFloat(tipSelection.replace('$', '')) || 0
  }

  const effectiveTip = getEffectiveTipAmount()

  const handleSubmit = (paymentType = 'card') => {
    if (stars < 1) {
      setValidationError('Please select at least 1 star rating.')
      return
    }

    setValidationError('')
    setIsProcessing(true)
    onTriggerLoading?.(900)

    setTimeout(() => {
      setIsProcessing(false)
      const message =
        effectiveTip > 0
          ? `Thanks! Your $${effectiveTip} tip for ${cleanerName} was sent.`
          : `Thanks! Your ${stars}-star rating for ${cleanerName} was saved.`
      onShowToast?.(message)
      onSubmitRating?.({
        bookingId: bookingItem.id,
        stars,
        compliments: selectedCompliments,
        tip: effectiveTip,
        paymentType,
        notes: notes.trim(),
      })
      onClose?.()
    }, 900)
  }

  // (a) Fixed Header
  const headerContent = (
    <div className="flex items-start justify-between">
      <div className="flex items-center gap-3">
        <div className="relative h-13 w-13 shrink-0 overflow-hidden rounded-full ring-2 ring-[#EF5A78]/30 shadow-md">
          <img
            src={cleanerImage}
            alt={cleanerName}
            className="h-full w-full object-cover"
          />
        </div>
        <div>
          <span className="block text-[10px] font-extrabold uppercase tracking-wider text-[#EF5A78]">
            POST-CLEAN REVIEW
          </span>
          <h3
            id="rating-sheet-title"
            className="text-[16px] font-extrabold text-[#121A2B]"
          >
            How was your clean?
          </h3>
          <p className="text-[11.5px] font-medium text-[#7A8194]">
            With {cleanerName} • {bookingItem.serviceTitle}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onClose}
        aria-label="Close rating sheet"
        className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#7A8194] shadow-xs active:scale-95 transition-all cursor-pointer"
      >
        <X className="h-4 w-4 stroke-[2.4]" />
      </button>
    </div>
  )

  // (c) Fixed Footer: Submit Button is ALWAYS fully visible without scrolling
  const footerContent = (
    <div>
      {effectiveTip === 0 ? (
        <button
          type="button"
          disabled={isProcessing}
          onClick={() => handleSubmit('none')}
          className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full bg-[#EF5A78] py-3 text-[13.5px] font-extrabold text-white shadow-[0_6px_20px_rgba(239,90,120,0.38)] hover:brightness-105 active:scale-[0.97] transition-all cursor-pointer"
        >
          {isProcessing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Submitting review...</span>
            </>
          ) : (
            <span>Submit review</span>
          )}
        </button>
      ) : (
        <div className="grid grid-cols-2 gap-2.5">
          {/* Apple Pay Button */}
          <button
            type="button"
            disabled={isProcessing}
            onClick={() => handleSubmit('apple-pay')}
            className="flex min-h-[48px] items-center justify-center gap-1.5 rounded-full bg-black py-3 text-[13px] font-extrabold text-white shadow-md hover:bg-neutral-900 active:scale-[0.97] transition-all cursor-pointer"
          >
            {isProcessing ? (
              <Loader2 className="h-4 w-4 animate-spin text-white" />
            ) : (
              <>
                <span className="text-[14px]">Pay</span>
                <span className="text-[12px] opacity-90">${effectiveTip}</span>
              </>
            )}
          </button>

          {/* Pay with Card Button */}
          <button
            type="button"
            disabled={isProcessing}
            onClick={() => handleSubmit('card')}
            className="flex min-h-[48px] items-center justify-center gap-1.5 rounded-full border border-gray-300 bg-white py-3 text-[12.5px] font-extrabold text-[#121A2B] shadow-xs hover:bg-gray-50 active:scale-[0.97] transition-all cursor-pointer"
          >
            {isProcessing ? (
              <Loader2 className="h-4 w-4 animate-spin text-[#EF5A78]" />
            ) : (
              <>
                <CreditCard className="h-4 w-4 stroke-[2.2] text-[#EF5A78]" />
                <span>Pay ${effectiveTip}</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  )

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title="How was your clean?"
      ariaLabel="Post-clean review and tip sheet"
      header={headerContent}
      footer={footerContent}
      contentClassName="px-5 py-3.5 space-y-4"
    >
      {/* 5 Animated Bouncing Stars */}
      <div className="flex flex-col items-center justify-center rounded-2xl bg-white p-4 shadow-xs border border-[#F0EAE0]">
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((starNum) => {
            const isFilled = starNum <= stars
            const isBouncingThis = activeBounceIdx === starNum
            return (
              <button
                key={starNum}
                type="button"
                onClick={() => handleStarClick(starNum)}
                aria-label={`Rate ${starNum} stars`}
                style={{
                  animation: isBouncingThis
                    ? 'popRotate 250ms cubic-bezier(0.34, 1.56, 0.64, 1)'
                    : 'none',
                }}
                className="flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center p-1 active:scale-90 transition-transform cursor-pointer focus:outline-none"
              >
                <Star
                  className={`h-7 w-7 transition-colors duration-150 ${
                    isFilled
                      ? 'fill-[#F5A623] text-[#F5A623]'
                      : 'text-gray-300 hover:text-gray-400'
                  }`}
                />
              </button>
            )
          })}
        </div>

        <span className="mt-2 text-[14px] font-extrabold text-[#121A2B]">
          {stars > 0 ? RATING_LABELS[stars] : 'Select a rating'}
        </span>

        {validationError && (
          <p className="mt-1 text-[11px] font-bold text-[#EA580C]">
            {validationError}
          </p>
        )}
      </div>

      {/* Compliment Tags */}
      <div>
        <label className="block text-[11.5px] font-bold text-[#7A8194] mb-2">
          What went well?
        </label>
        <div className="flex flex-wrap gap-2">
          {COMPLIMENTS.map((tag) => {
            const isSelected = selectedCompliments.includes(tag)
            return (
              <button
                key={tag}
                type="button"
                onClick={() => toggleCompliment(tag)}
                className={`flex min-h-[38px] items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[11.5px] font-bold transition-all cursor-pointer ${
                  isSelected
                    ? 'border border-[#EF5A78] bg-[#FDE4EA] text-[#EF5A78]'
                    : 'border border-gray-200 bg-white text-[#7A8194] hover:text-[#121A2B]'
                }`}
              >
                <span>{tag}</span>
                {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
              </button>
            )
          })}
        </div>
      </div>

      {/* Tip Options in One Row */}
      <div>
        <label className="block text-[11.5px] font-bold text-[#7A8194] mb-2">
          Add a tip for {cleanerName} (100% goes to your cleaner)
        </label>
        <div className="grid grid-cols-5 gap-1.5 rounded-2xl bg-white p-1.5 border border-[#F0EAE0]">
          {TIP_OPTIONS.map((opt) => {
            const isSelected = tipSelection === opt
            return (
              <button
                key={opt}
                type="button"
                onClick={() => setTipSelection(opt)}
                className={`flex min-h-[44px] items-center justify-center rounded-xl text-[12px] font-bold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#EF5A78] text-white shadow-xs scale-[1.02]'
                    : 'text-[#7A8194] hover:text-[#121A2B] hover:bg-gray-50'
                }`}
              >
                {opt}
              </button>
            )
          })}
        </div>

        {/* Custom Tip Input if selected */}
        {tipSelection === 'Custom' && (
          <div className="mt-2.5 flex items-center gap-2 rounded-2xl bg-white p-3 border border-[#EF5A78] animate-pop-in">
            <span className="text-[14px] font-bold text-[#121A2B]">$</span>
            <input
              type="number"
              min="1"
              step="1"
              value={customTip}
              onChange={(e) => setCustomTip(e.target.value)}
              placeholder="Enter custom tip amount"
              className="w-full bg-transparent text-[14px] font-bold text-[#121A2B] focus:outline-none"
            />
          </div>
        )}
      </div>

      {/* Tip Summary Line */}
      {effectiveTip > 0 && (
        <div className="flex items-center justify-between rounded-xl bg-white p-3 text-[12.5px] font-semibold text-[#121A2B] border border-[#F0EAE0]">
          <span>Tip for {cleanerName}:</span>
          <span className="text-[14px] font-extrabold text-[#EF5A78]">
            ${effectiveTip.toFixed(2)}
          </span>
        </div>
      )}

      {/* Optional Note for Cleaner */}
      <div>
        <label className="block text-[11.5px] font-bold text-[#7A8194] mb-1.5">
          Note for {cleanerName} (optional)
        </label>
        <textarea
          rows={2}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Anything else you'd like to share..."
          className="w-full rounded-2xl border border-[#F0EAE0] bg-white p-3 text-[12.5px] font-medium text-[#121A2B] placeholder:text-[#A0A5B5] focus:border-[#EF5A78] focus:outline-none resize-none"
        />
      </div>
    </BottomSheet>
  )
}
