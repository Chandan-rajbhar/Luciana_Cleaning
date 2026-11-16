import React, { useState, useEffect } from 'react'
import { Home, Loader2, Mail, Video, X, ArrowRight } from 'lucide-react'
import { SERVICES } from '../data/services'
import { SheetBubbles } from './VisualEffects'
import HomeSizePriceWidget from './HomeSizePriceWidget'
import { calcPricingDetails } from '../data/bookingDraft'

const COUNTRY_CODES = [
  { code: '+1', label: 'US +1' },
  { code: '+1-CA', value: '+1', label: 'CA +1' },
  { code: '+44', label: 'UK +44' },
  { code: '+52', label: 'MX +52' },
  { code: '+55', label: 'BR +55' },
]

/**
 * Free Estimate bottom sheet matching the coral & cream UI:
 * - Cream sheet with grab handle
 * - Rounded inputs with 2px borders and coral focus
 * - Radio cards with coral selected state
 * - Support for selectedAddOns and requestedCleaner
 * - Coral "Submit Request" button leading to Booking Confirmed
 */
export default function EstimateSheet({
  isOpen,
  bookingDraft,
  onUpdateDraft,
  selectedServiceId,
  selectedAddOns = [],
  requestedCleaner = null,
  onClose,
  onSubmitSuccess,
  onTriggerLoading,
}) {
  const [serviceId, setServiceId] = useState(selectedServiceId || SERVICES[0].id)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState(
    bookingDraft?.zip ? `Fort Myers, FL ${bookingDraft.zip}` : 'Fort Myers'
  )
  const [countryCode, setCountryCode] = useState('+1')
  const [phone, setPhone] = useState('')
  const [estimateType, setEstimateType] = useState('In-Home Estimate')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (isOpen && selectedServiceId) {
      setServiceId(selectedServiceId)
    }
    if (isOpen) {
      setError('')
      setIsSubmitting(false)
      if (bookingDraft?.zip) {
        setCity(`Fort Myers, FL ${bookingDraft.zip}`)
      }
    }
  }, [isOpen, selectedServiceId, bookingDraft?.zip])

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!firstName.trim() || !lastName.trim()) {
      setError('Please enter your first and last name.')
      return
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Please enter a valid email address.')
      return
    }
    if (!address.trim() || !city.trim()) {
      setError('Please enter your street address and city.')
      return
    }
    if (phone.replace(/\D/g, '').length < 7) {
      setError('Please enter a valid cell phone number.')
      return
    }

    setError('')
    setIsSubmitting(true)
    onTriggerLoading?.(900)

    const chosenService = SERVICES.find((s) => s.id === serviceId) || SERVICES[0]
    const pricing = calcPricingDetails({
      bedrooms: bookingDraft?.bedrooms || 3,
      bathrooms: bookingDraft?.bathrooms || 2,
      frequency: bookingDraft?.frequency || 'One-time',
      addOns: selectedAddOns.length > 0 ? selectedAddOns : bookingDraft?.addOns || [],
      hourlyRate: chosenService.hourlyRate,
    })

    setTimeout(() => {
      setIsSubmitting(false)
      onSubmitSuccess({
        serviceId: chosenService.id,
        service: chosenService.title,
        date: 'Wed, Oct 15, 2025',
        time: estimateType === 'In-Home Estimate' ? '10:00 AM' : '02:00 PM',
        address: `${address.trim()}, ${city.trim()}`,
        totalEstimate: `$${pricing.finalPrice.toFixed(2)}`,
        customerName: `${firstName.trim()} ${lastName.trim()}`,
        selectedAddOns,
        requestedCleaner,
        bedrooms: bookingDraft?.bedrooms || 3,
        bathrooms: bookingDraft?.bathrooms || 2,
        frequency: bookingDraft?.frequency || 'One-time',
      })
    }, 650)
  }

  return (
    <div
      className="absolute inset-0 z-40 flex flex-col justify-end"
      role="dialog"
      aria-modal="true"
      aria-labelledby="estimate-sheet-title"
    >
      {/* Blurred dimmed backdrop inside phone frame */}
      <div
        onClick={onClose}
        className="animate-backdrop-in absolute inset-0 bg-black/45 backdrop-blur-xs"
        aria-hidden="true"
      />

      {/* Cream Bottom Sheet Panel: centered max 560px on tablet */}
      <div className="animate-sheet-up relative z-10 flex max-h-[90dvh] w-full max-w-[560px] mx-auto flex-col rounded-t-[28px] bg-[#FAF6F0] pb-[env(safe-area-inset-bottom)] md:pb-3 shadow-[0_-12px_40px_rgba(20,30,60,0.22)] overflow-hidden">
        <SheetBubbles />
        {/* Grab handle */}
        <div className="flex justify-center pt-3 pb-1" aria-hidden="true">
          <div className="h-1.5 w-10 rounded-full bg-gray-300" />
        </div>

        {/* Sheet Header */}
        <div className="flex items-start justify-between px-5 pt-2 pb-3 border-b border-[#EFE7DC]">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#EF5A78]">
              QUICK ESTIMATE
            </span>
            <h2
              id="estimate-sheet-title"
              className="mt-0.5 text-[18px] font-extrabold text-[#121A2B]"
            >
              Get Your Free Estimate
            </h2>
            <p className="text-[11.5px] font-medium text-[#7A8194]">
              Upfront quote for your Fort Myers residence
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close estimate form"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#7A8194] hover:text-[#121A2B] shadow-xs active:scale-[0.96] transition-all"
          >
            <X className="h-4 w-4 stroke-[2.4]" />
          </button>
        </div>

        {/* Scrollable Form */}
        <form
          onSubmit={handleSubmit}
          noValidate
          className="no-scrollbar flex-1 overflow-y-auto overflow-x-hidden px-5 py-4 pb-5 space-y-3.5 [overscroll-behavior:contain]"
        >
          {/* Service quick-select */}
          <div>
            <label className="block text-[11px] font-bold text-[#7A8194]">
              Select Service
            </label>
            <div className="mt-1.5 flex gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
              {SERVICES.map((item) => {
                const active = serviceId === item.id
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setServiceId(item.id)}
                    className={`shrink-0 rounded-full px-3.5 py-1.5 text-[11.5px] font-bold transition-all active:scale-[0.96] ${
                      active
                        ? 'bg-[#EF5A78] text-white shadow-xs'
                        : 'bg-white text-[#121A2B] border border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {item.title}
                  </button>
                )
              })}
            </div>

            {/* Selected Add-ons or Cleaner badge if present */}
            {(selectedAddOns.length > 0 || requestedCleaner) && (
              <div className="mt-2 flex flex-wrap items-center gap-1.5 pt-1">
                {requestedCleaner && (
                  <span className="inline-flex items-center rounded-full bg-[#E6F6EC] px-2.5 py-0.5 text-[10.5px] font-bold text-[#2E9E5B]">
                    Specialist: {requestedCleaner}
                  </span>
                )}
                {selectedAddOns.map((addon) => (
                  <span
                    key={addon}
                    className="inline-flex items-center rounded-full bg-[#FDE4EA] px-2.5 py-0.5 text-[10.5px] font-bold text-[#EF5A78]"
                  >
                    +{addon}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Feature 2: Home Size & Instant Price Stepper Slider */}
          <HomeSizePriceWidget
            draft={bookingDraft}
            onUpdateDraft={onUpdateDraft}
            hideBookButton={true}
            title="Home Size & Rate Calculation"
            subtitle="Calculates estimated hours and price for your quote"
            className="border-[#EAE3D8] shadow-xs"
          />

          {/* First & Last Name */}
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label htmlFor="est-first" className="block text-[11.5px] font-bold text-[#121A2B]">
                First Name *
              </label>
              <input
                id="est-first"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Luciana"
                className="mt-1 w-full rounded-xl border-2 border-[#EAE3D8] bg-white px-3 py-2 text-[16px] md:text-[13px] font-semibold text-[#121A2B] placeholder:text-gray-400 focus:border-[#EF5A78] focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label htmlFor="est-last" className="block text-[11.5px] font-bold text-[#121A2B]">
                Last Name *
              </label>
              <input
                id="est-last"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Silva"
                className="mt-1 w-full rounded-xl border-2 border-[#EAE3D8] bg-white px-3 py-2 text-[16px] md:text-[13px] font-semibold text-[#121A2B] placeholder:text-gray-400 focus:border-[#EF5A78] focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label htmlFor="est-email" className="block text-[11.5px] font-bold text-[#121A2B]">
              Email Address *
            </label>
            <div className="relative mt-1">
              <Mail className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                id="est-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@domain.com"
                className="w-full rounded-xl border-2 border-[#EAE3D8] bg-white py-2 pr-3 pl-9 text-[16px] md:text-[13px] font-semibold text-[#121A2B] placeholder:text-gray-400 focus:border-[#EF5A78] focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Address & City */}
          <div className="grid grid-cols-5 gap-2.5">
            <div className="col-span-3">
              <label htmlFor="est-address" className="block text-[11.5px] font-bold text-[#121A2B]">
                Address *
              </label>
              <input
                id="est-address"
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="123 Palm Ave"
                className="mt-1 w-full rounded-xl border-2 border-[#EAE3D8] bg-white px-3 py-2 text-[16px] md:text-[13px] font-semibold text-[#121A2B] placeholder:text-gray-400 focus:border-[#EF5A78] focus:outline-none transition-colors"
              />
            </div>

            <div className="col-span-2">
              <label htmlFor="est-city" className="block text-[11.5px] font-bold text-[#121A2B]">
                City *
              </label>
              <input
                id="est-city"
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Fort Myers"
                className="mt-1 w-full rounded-xl border-2 border-[#EAE3D8] bg-white px-3 py-2 text-[16px] md:text-[13px] font-semibold text-[#121A2B] placeholder:text-gray-400 focus:border-[#EF5A78] focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="est-phone" className="block text-[11.5px] font-bold text-[#121A2B]">
              Cell Phone *
            </label>
            <div className="mt-1 flex gap-2">
              <select
                aria-label="Country code"
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className="rounded-xl border-2 border-[#EAE3D8] bg-white px-2.5 py-2 text-[13px] font-bold text-[#121A2B] focus:border-[#EF5A78] focus:outline-none"
              >
                {COUNTRY_CODES.map((c) => (
                  <option key={c.code} value={c.value || c.code}>
                    {c.label}
                  </option>
                ))}
              </select>

              <input
                id="est-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(239) 000-0000"
                className="flex-1 rounded-xl border-2 border-[#EAE3D8] bg-white px-3 py-2 text-[16px] md:text-[13px] font-semibold text-[#121A2B] placeholder:text-gray-400 focus:border-[#EF5A78] focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Type of Estimate (Radio Cards) */}
          <div>
            <span className="block text-[11px] font-bold uppercase tracking-wider text-[#7A8194]">
              TYPE OF ESTIMATE *
            </span>
            <div className="mt-2 space-y-2">
              <label
                className={`flex cursor-pointer items-start gap-3 rounded-2xl border-2 p-3.5 transition-all ${
                  estimateType === 'In-Home Estimate'
                    ? 'border-[#EF5A78] bg-white shadow-xs'
                    : 'border-[#EAE3D8] bg-white/70 hover:bg-white'
                }`}
              >
                <input
                  type="radio"
                  name="estimateType"
                  value="In-Home Estimate"
                  checked={estimateType === 'In-Home Estimate'}
                  onChange={(e) => setEstimateType(e.target.value)}
                  className="mt-0.5 accent-[#EF5A78]"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <Home className="h-4 w-4 text-[#EF5A78]" />
                    <span className="text-[13px] font-extrabold text-[#121A2B]">
                      In-Home Walkthrough
                    </span>
                  </div>
                  <p className="mt-0.5 text-[11px] font-medium text-[#7A8194]">
                    Lead cleaner inspects layout in person (15 mins)
                  </p>
                </div>
              </label>

              <label
                className={`flex cursor-pointer items-start gap-3 rounded-2xl border-2 p-3.5 transition-all ${
                  estimateType === 'Virtual Estimate'
                    ? 'border-[#EF5A78] bg-white shadow-xs'
                    : 'border-[#EAE3D8] bg-white/70 hover:bg-white'
                }`}
              >
                <input
                  type="radio"
                  name="estimateType"
                  value="Virtual Estimate"
                  checked={estimateType === 'Virtual Estimate'}
                  onChange={(e) => setEstimateType(e.target.value)}
                  className="mt-0.5 accent-[#EF5A78]"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <Video className="h-4 w-4 text-[#3567C9]" />
                    <span className="text-[13px] font-extrabold text-[#121A2B]">
                      Virtual Video Walkthrough
                    </span>
                  </div>
                  <p className="mt-0.5 text-[11px] font-medium text-[#7A8194]">
                    Quick FaceTime or video tour from your phone
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Validation error */}
          {error && (
            <p className="rounded-xl bg-rose-50 px-3.5 py-2 text-[11.5px] font-bold text-rose-600">
              {error}
            </p>
          )}

          {/* Submit Action */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full bg-[#EF5A78] py-3.5 text-[14px] font-extrabold text-white shadow-[0_6px_20px_rgba(239,90,120,0.38)] hover:brightness-105 active:scale-[0.98] transition-all disabled:opacity-70 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Submitting Request...
                </>
              ) : (
                <>
                  <span>Submit Estimate Request</span>
                  <ArrowRight className="h-4 w-4 stroke-[2.4]" />
                </>
              )}
            </button>
            <p className="mt-2 text-center text-[10.5px] font-semibold text-[#7A8194]">
              Zero obligation • 100% upfront transparent rates
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
