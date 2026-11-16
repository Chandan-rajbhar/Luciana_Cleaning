import React from 'react'
import {
  ChevronLeft,
  Download,
  Check,
  Star,
  Phone,
  MessageCircle,
  Calendar,
} from 'lucide-react'
import { CLEANER_SPECIALIST, SERVICES } from '../data/services'
import { SparklesGroup } from './VisualEffects'
import { useViewport } from '../hooks/useViewportMode'

/**
 * Screen 4: Booking Confirmed (Success)
 * - Header: Back button, "Booking Confirmed", download icon.
 * - Coral circular check icon with soft ring, "Booking Confirmed!", "BOOKING REF: #LC-84920".
 * - Service card: Photo, title, price chip, two-box row (Date & Time, Location).
 * - Assigned Specialist row: Avatar, "Luciana R. ★ 4.9", round buttons for Call and Chat (opens Chat screen).
 * - Price summary: Duration, Hourly Rate, Total Paid / Authorized with Apple Pay & $72.00 coral bold.
 * - Sticky coral "Add to Calendar" button + "Back to Home" link.
 */
export default function SuccessScreen({
  bookingData,
  isDetails = false,
  onBack,
  onBackHome,
  onOpenChat,
  onOpenCall,
  onShowToast,
}) {
  const { isTablet } = useViewport()
  const currentService =
    SERVICES.find((s) => s.id === bookingData?.serviceId) || SERVICES[0]

  const dateText = bookingData?.date || 'Wed, Oct 15, 2025'
  const timeText = bookingData?.time || '10:00 AM'
  const addressText = bookingData?.address || '123 McGregor Blvd, Fort Myers, FL'
  const totalPaid = bookingData?.totalPaid || currentService.totalAuthorized || '$72.00'

  return (
    <div className="flex h-full flex-col text-[#121A2B]">
      {/* 2. Scrollable Body (scrolls under sticky AppHeader) */}
      <div className={`flex-1 overflow-y-auto no-scrollbar ${isTablet ? 'px-8 pt-4 space-y-5' : 'px-4 pt-3 space-y-4'} pb-[calc(var(--bar-h)+16px+env(safe-area-inset-bottom))] [overscroll-behavior:contain]`}>
        <div className="max-w-[720px] mx-auto w-full space-y-4">
        {/* Top Hero Confirmation Card */}
        <div className="stagger-item relative overflow-hidden rounded-[24px] bg-white p-6 text-center shadow-[0_4px_16px_rgba(20,30,60,0.06)]">
          {/* Subtle top gradient accent */}
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#EF5A78] via-[#F5A623] to-[#EF5A78]" />

          {/* Coral circular check with soft ring + pop-rotate + gold sparkles */}
          <div className="relative mx-auto inline-block">
            <div className="animate-pop-rotate mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#FDE4EA] ring-8 ring-[#FDE4EA]/60">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#EF5A78] text-white shadow-md">
                <Check className="h-6 w-6 stroke-[3]" />
              </div>
            </div>
            <SparklesGroup />
          </div>

          <h2 className="mt-4 text-[20px] font-extrabold text-[#121A2B]">
            {isDetails ? 'Booking Details' : 'Booking Confirmed!'}
          </h2>
          <p className="mt-1 text-[12px] font-medium leading-relaxed text-[#7A8194]">
            {isDetails
              ? 'Scheduled cleaning with Luciana Certified Team in Fort Myers.'
              : 'Your cleaning is scheduled with Luciana Certified Team in Fort Myers.'}
          </p>

          <div className="mt-3.5 inline-block">
            <span className="rounded-full bg-[#FDE4EA] px-3.5 py-1 text-[11px] font-extrabold text-[#EF5A78]">
              BOOKING REF: #{bookingData?.id || 'LC-84920'}
            </span>
          </div>
        </div>

        {/* Service Card with Two-Box Row */}
        <div className="stagger-item rounded-[20px] bg-white p-4 shadow-[0_4px_16px_rgba(20,30,60,0.06)]">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-[14px]">
                <img
                  src={currentService.image}
                  alt={currentService.title}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="min-w-0">
                <h3 className="truncate text-[14px] font-extrabold text-[#121A2B]">
                  {currentService.title}
                </h3>
                <p className="text-[11.5px] font-medium text-[#7A8194]">
                  By Luciana Certified Crew
                </p>
              </div>
            </div>

            <span className="rounded-full bg-[#FDE4EA] px-2.5 py-1 text-[11px] font-bold text-[#EF5A78]">
              ${currentService.hourlyRate}/h
            </span>
          </div>

          {/* Two-box row: Date & Time and Location */}
          <div className="mt-3 grid grid-cols-2 gap-2.5">
            <div className="rounded-xl bg-[#FAF6F0] p-2.5">
              <span className="block text-[9.5px] font-bold uppercase tracking-[0.1em] text-[#7A8194]">
                DATE &amp; TIME
              </span>
              <span className="mt-1 block text-[11.5px] font-bold text-[#121A2B] leading-tight">
                {dateText}
              </span>
              <span className="block text-[11px] font-semibold text-[#EF5A78]">
                {timeText} - 1:30 PM
              </span>
            </div>

            <div className="rounded-xl bg-[#FAF6F0] p-2.5">
              <span className="block text-[9.5px] font-bold uppercase tracking-[0.1em] text-[#7A8194]">
                LOCATION
              </span>
              <span className="mt-1 block text-[11.5px] font-bold text-[#121A2B] leading-tight truncate">
                {addressText}
              </span>
              <span className="block text-[11px] font-medium text-[#7A8194]">
                Residential
              </span>
            </div>
          </div>
        </div>

        {/* Entry & Pet Notes Row (Feature 4) */}
        {(bookingData?.notes?.length > 0 || bookingData?.customNotes) && (
          <div className="stagger-item rounded-[20px] bg-white p-4 shadow-[0_4px_16px_rgba(20,30,60,0.06)] border border-[#F0EAE0]">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#EF5A78]">
                ENTRY &amp; PET INSTRUCTIONS
              </span>
              <span className="rounded-full bg-[#E6F6EC] px-2 py-0.5 text-[9.5px] font-bold text-[#2E9E5B]">
                Transmitted to Crew
              </span>
            </div>

            {bookingData?.notes?.length > 0 && (
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {bookingData.notes.map((note) => (
                  <span
                    key={note}
                    className="inline-flex items-center rounded-full bg-[#FAF6F0] px-3 py-1 text-[11px] font-bold text-[#121A2B] border border-[#F0EAE0]"
                  >
                    {note}
                  </span>
                ))}
              </div>
            )}

            {bookingData?.customNotes && (
              <p className="mt-2 text-[12px] font-medium leading-relaxed text-[#7A8194] bg-[#FAF6F0]/60 p-2.5 rounded-xl border border-gray-100">
                "{bookingData.customNotes}"
              </p>
            )}
          </div>
        )}

        {/* Assigned Specialist Row */}
        <div className="stagger-item flex items-center justify-between rounded-[20px] bg-white p-4 shadow-[0_4px_16px_rgba(20,30,60,0.06)]">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="h-11 w-11 overflow-hidden rounded-full ring-2 ring-white shadow-xs">
                <img
                  src={CLEANER_SPECIALIST.image}
                  alt={CLEANER_SPECIALIST.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-[#2E9E5B] ring-2 ring-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-[13.5px] font-extrabold text-[#121A2B]">
                  {CLEANER_SPECIALIST.name}
                </h3>
                <span className="inline-flex items-center gap-0.5 rounded-full bg-[#FFF1DE] px-1.5 py-0.2 text-[9.5px] font-bold text-[#D98A1E]">
                  <Star className="h-2.5 w-2.5 fill-[#D98A1E] text-[#D98A1E]" />
                  {CLEANER_SPECIALIST.rating}
                </span>
              </div>
              <p className="text-[11px] font-medium text-[#7A8194]">
                Assigned Lead Specialist
              </p>
            </div>
          </div>

          {/* Action buttons: Call and Chat */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onOpenCall}
              aria-label="Call Specialist"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E6F6EC] text-[#2E9E5B] hover:bg-[#d8f2e1] active:scale-[0.95] transition-all"
            >
              <Phone className="h-4 w-4 stroke-[2.3]" />
            </button>
            <button
              type="button"
              onClick={onOpenChat}
              aria-label="Chat with Specialist"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FDE4EA] text-[#EF5A78] hover:bg-[#fcd5df] active:scale-[0.95] transition-all"
            >
              <MessageCircle className="h-4 w-4 stroke-[2.3]" />
            </button>
          </div>
        </div>

        {/* Price Summary */}
        <div className="stagger-item rounded-[20px] bg-white p-4 shadow-[0_4px_16px_rgba(20,30,60,0.06)] space-y-2.5">
          <div className="flex items-center justify-between text-[12px]">
            <span className="font-medium text-[#7A8194]">Estimated Duration</span>
            <span className="font-bold text-[#121A2B]">
              {bookingData?.hours ? `${bookingData.hours.toFixed(1)} Hours` : '3.0 Hours'}{' '}
              {bookingData?.bedrooms && `(${bookingData.bedrooms} Bed, ${bookingData.bathrooms} Bath)`}
            </span>
          </div>

          <div className="flex items-center justify-between text-[12px]">
            <span className="font-medium text-[#7A8194]">Frequency Plan</span>
            <span className="font-bold text-[#121A2B]">
              {bookingData?.frequency || 'One-time clean'}
            </span>
          </div>

          {bookingData?.savings > 0 && (
            <div className="flex items-center justify-between text-[12px]">
              <span className="font-medium text-[#2E9E5B]">Recurring Savings</span>
              <span className="font-bold text-[#2E9E5B]">-${bookingData.savings.toFixed(2)}</span>
            </div>
          )}

          <div className="flex items-center justify-between text-[12px]">
            <span className="font-medium text-[#7A8194]">Hourly Rate</span>
            <span className="font-bold text-[#121A2B]">${currentService.hourlyRate}.00 / hr</span>
          </div>

          <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[13px]">
            <span className="font-bold text-[#121A2B]">
              Total Paid / Authorized <span className="font-normal text-[#7A8194] text-[11px]">(Apple Pay •• 4291)</span>
            </span>
            <span className="text-[17px] font-extrabold text-[#EF5A78]">
              {totalPaid}
            </span>
          </div>
        </div>
        </div>
      </div>

      {/* 3. Sticky Bottom Bar */}
      <div className="sticky bottom-0 z-20 border-t border-[#F0EAE0] bg-white p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] md:pb-4 text-center shadow-[0_-4px_16px_rgba(20,30,60,0.05)]">
        <div className="max-w-[720px] mx-auto w-full space-y-2">
          <button
            type="button"
            onClick={() => onShowToast('Scheduled event saved to Apple Calendar')}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-[#EF5A78] px-6 py-3.5 text-[14px] font-extrabold text-white shadow-[0_4px_16px_rgba(239,90,120,0.38)] hover:brightness-105 active:scale-[0.97] transition-all"
          >
            <Calendar className="h-4 w-4 stroke-[2.4]" />
            Add to Calendar
          </button>

          <button
            type="button"
            onClick={onBackHome}
            className="inline-block py-1 text-[12px] font-bold text-[#7A8194] hover:text-[#121A2B] transition-colors cursor-pointer"
          >
            {isDetails ? 'Back to Bookings' : 'Back to Home'}
          </button>
        </div>
      </div>
    </div>
  )
}
