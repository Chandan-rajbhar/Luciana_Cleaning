import React, { useState, useMemo } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  ArrowRight,
} from 'lucide-react'
import { SERVICES, TIME_SLOTS } from '../data/services'
import FrequencyToggle from './FrequencyToggle'
import NotesChipsSelector from './NotesChipsSelector'
import { calcPricingDetails } from '../data/bookingDraft'
import { useViewport } from '../hooks/useViewportMode'

/**
 * Screen 3: Select Date & Time (Schedule)
 * Order:
 * 1. Service summary card (photo, title, crew badge, duration chip, rate)
 * 2. Calendar card (month title, available chip, date grid)
 * 3. Available Time Slots (EST Fort Myers chip, slot grid)
 * 4. Frequency pills (Feature 3: FrequencyToggle replacing existing frequency row)
 * 5. Service Location card with address field
 * 6. Notes for your cleaner card (Feature 4: NotesChipsSelector & textarea)
 * 7. Sticky bottom bar with synchronized estimate + coral "Confirm & Proceed >" button
 */
export default function ScheduleScreen({
  serviceId,
  bookingDraft,
  onUpdateDraft,
  onBack,
  onConfirmSchedule,
  onShowToast,
  onTriggerLoading,
}) {
  const { isTablet, isLandscape } = useViewport()
  const service = SERVICES.find((s) => s.id === serviceId) || SERVICES[0]

  // Calendar dates
  const today = useMemo(() => {
    const d = new Date()
    return new Date(d.getFullYear(), d.getMonth(), d.getDate())
  }, [])

  const [viewDate, setViewDate] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1))
  const [selectedDate, setSelectedDate] = useState(() => {
    const d = new Date(today)
    d.setDate(d.getDate() + 2) // default to upcoming day
    return d
  })

  const [selectedTime, setSelectedTime] = useState('10:00 AM')
  const [address, setAddress] = useState(
    `123 McGregor Blvd, Fort Myers, FL${bookingDraft?.zip ? ` ${bookingDraft.zip}` : ''}`
  )

  const monthYearLabel = viewDate.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  })

  const calendarDays = useMemo(() => {
    const year = viewDate.getFullYear()
    const month = viewDate.getMonth()
    const firstDay = new Date(year, month, 1).getDay()
    const totalDays = new Date(year, month + 1, 0).getDate()
    const cells = []

    for (let i = 0; i < firstDay; i++) {
      cells.push(null)
    }
    for (let d = 1; d <= totalDays; d++) {
      cells.push(new Date(year, month, d))
    }
    return cells
  }, [viewDate])

  const isSameDay = (d1, d2) =>
    d1 &&
    d2 &&
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()

  const handleNextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))
  }

  const handlePrevMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))
  }

  // Calculate synchronized pricing from shared draft
  const pricing = calcPricingDetails({
    bedrooms: bookingDraft?.bedrooms || 3,
    bathrooms: bookingDraft?.bathrooms || 2,
    frequency: bookingDraft?.frequency || 'One-time',
    addOns: bookingDraft?.addOns || [],
    hourlyRate: service.hourlyRate,
  })

  const handleProceed = () => {
    onTriggerLoading?.(900)
    const dateFormatted = selectedDate.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })

    setTimeout(() => {
      onConfirmSchedule({
        serviceId: service.id,
        serviceTitle: service.title,
        date: dateFormatted,
        time: selectedTime,
        address,
        frequency: bookingDraft?.frequency || 'One-time',
        bedrooms: bookingDraft?.bedrooms || 3,
        bathrooms: bookingDraft?.bathrooms || 2,
        notes: bookingDraft?.notes || [],
        customNotes: bookingDraft?.customNotes || '',
        addOns: bookingDraft?.addOns || [],
        hours: pricing.hours,
        rate: `$${service.hourlyRate}/h`,
        totalEstimate: `$${pricing.finalPrice.toFixed(2)}`,
        totalPaid: `$${pricing.finalPrice.toFixed(2)}`,
        savings: pricing.savings,
      })
    }, 400)
  }

  // Calendar Card Block
  const calendarCard = (
    <div className="stagger-item rounded-[20px] bg-white p-4 shadow-[0_4px_16px_rgba(20,30,60,0.06)] border border-[#F0EAE0] h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-2 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <h2 className="text-[15px] font-extrabold text-[#121A2B]">
              {monthYearLabel}
            </h2>
            <span className="rounded-full bg-[#E6F6EC] px-2 py-0.5 text-[10px] font-bold text-[#2E9E5B]">
              Available
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handlePrevMonth}
              aria-label="Previous Month"
              className="flex h-8 w-8 items-center justify-center rounded-full text-[#7A8194] hover:bg-gray-100 active:scale-[0.95] cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={handleNextMonth}
              aria-label="Next Month"
              className="flex h-8 w-8 items-center justify-center rounded-full text-[#7A8194] hover:bg-gray-100 active:scale-[0.95] cursor-pointer"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Weekday headers */}
        <div className="mt-3 grid grid-cols-7 text-center">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
            <span key={d} className="text-[11px] font-bold text-[#7A8194]">
              {d}
            </span>
          ))}
        </div>

        {/* Date grid */}
        <div className="mt-2 grid grid-cols-7 gap-y-1.5 text-center">
          {calendarDays.map((dateObj, idx) => {
            if (!dateObj) {
              return <div key={`empty-${idx}`} className="h-8" />
            }
            const isPast = dateObj < today
            const isSelected = isSameDay(dateObj, selectedDate)

            return (
              <div key={dateObj.toISOString()} className="flex justify-center">
                <button
                  type="button"
                  disabled={isPast}
                  onClick={() => setSelectedDate(dateObj)}
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-[12px] font-bold transition-all cursor-pointer ${
                    isPast
                      ? 'cursor-not-allowed text-gray-300'
                      : isSelected
                      ? 'bg-[#EF5A78] text-white shadow-[0_4px_12px_rgba(239,90,120,0.4)] scale-105'
                      : 'text-[#121A2B] hover:bg-[#FAF6F0] active:scale-[0.95]'
                  }`}
                >
                  {dateObj.getDate()}
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )

  // Time Slots Block
  const timeSlotsCard = (
    <div className="stagger-item rounded-[20px] bg-white p-4 shadow-[0_4px_16px_rgba(20,30,60,0.06)] border border-[#F0EAE0] h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[14.5px] font-extrabold text-[#121A2B]">
            Available Time Slots
          </h2>
          <span className="rounded-full bg-[#E6F6EC] px-2 py-0.5 text-[10px] font-bold text-[#2E9E5B]">
            EST (Fort Myers)
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {TIME_SLOTS.map(({ id, time }) => {
            const isSelected = selectedTime === time
            return (
              <button
                key={id}
                type="button"
                onClick={() => setSelectedTime(time)}
                className={`flex h-11 items-center justify-center rounded-xl text-[12.5px] font-bold transition-all active:scale-[0.96] cursor-pointer ${
                  isSelected
                    ? 'bg-[#EF5A78] text-white shadow-[0_4px_12px_rgba(239,90,120,0.35)]'
                    : 'border border-gray-200 bg-[#FAF6F0]/60 text-[#121A2B] hover:border-gray-300'
                }`}
              >
                {time}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex h-full flex-col text-[#121A2B]">
      {/* Scrollable Body (scrolls under sticky AppHeader) */}
      <div className={`flex-1 overflow-y-auto no-scrollbar ${isTablet ? 'px-8 pt-4 space-y-5' : 'px-4 pt-3 space-y-4'} pb-5 [overscroll-behavior:none]`}>
        <div className="max-w-[720px] mx-auto w-full space-y-4">
          {/* 1. Service Summary Card */}
          <div className="stagger-item flex items-center justify-between rounded-[20px] bg-white p-3.5 shadow-[0_4px_16px_rgba(20,30,60,0.06)] border border-[#F0EAE0]">
            <div className="flex items-center gap-3 min-w-0">
              <div className="animate-pop-rotate relative h-12 w-12 shrink-0 overflow-hidden rounded-[14px]">
                <img
                  src={service.image}
                  alt={service.title}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="min-w-0">
                <h3 className="truncate text-[14px] font-extrabold text-[#121A2B]">
                  {service.title}
                </h3>
                <p className="text-[11.5px] font-medium text-[#7A8194]">
                  Fort Myers Certified Crew
                </p>
                <div className="mt-1 flex items-center gap-1.5">
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#FAF6F0] px-2 py-0.5 text-[10px] font-bold text-[#7A8194]">
                    <Clock className="h-3 w-3 text-[#D98A1E]" />
                    Est. {pricing.hours.toFixed(1)} hrs ({bookingDraft?.bedrooms || 3} Bed, {bookingDraft?.bathrooms || 2} Bath)
                  </span>
                </div>
              </div>
            </div>

            <div className="text-right shrink-0 pl-2">
              <span className="text-[15px] font-extrabold text-[#EF5A78]">
                ${service.hourlyRate}/h
              </span>
            </div>
          </div>

          {/* 2 & 3: Calendar & Time Slots (side by side in landscape tablet, stacked in portrait) */}
          {isTablet && isLandscape ? (
            <div className="grid grid-cols-2 gap-4 items-stretch">
              {calendarCard}
              {timeSlotsCard}
            </div>
          ) : (
            <>
              {calendarCard}
              {timeSlotsCard}
            </>
          )}

          {/* 4. Feature 3: Frequency & Recurring Savings Toggle */}
          <FrequencyToggle
            draft={bookingDraft}
            onFrequencyChange={(freq) => onUpdateDraft?.({ frequency: freq })}
            showPriceSummary={true}
          />

          {/* 5. Service Location Card */}
          <div className="stagger-item rounded-[20px] bg-white p-4 shadow-[0_4px_16px_rgba(20,30,60,0.06)] border border-[#F0EAE0]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#7A8194]">
                SERVICE LOCATION
              </span>
              <span className="text-[11px] font-bold text-[#EF5A78]">Residential</span>
            </div>

            <div className="flex items-center gap-2.5 rounded-xl bg-[#FAF6F0] p-2.5 border border-gray-200">
              <MapPin className="h-4 w-4 shrink-0 text-[#EF5A78]" />
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-transparent text-[12.5px] font-semibold text-[#121A2B] focus:outline-none"
                placeholder="Enter your street address"
              />
            </div>
          </div>

          {/* 6. Feature 4: Quick-Tap Entry & Pet Notes Chips */}
          <NotesChipsSelector
            selectedChips={bookingDraft?.notes || []}
            notesText={bookingDraft?.customNotes || ''}
            onChange={({ chips, customNotes }) =>
              onUpdateDraft?.({ notes: chips, customNotes })
            }
          />
        </div>
      </div>

      {/* 7. Bottom Action Bar (flex item pinned at bottom) */}
      <div className="shrink-0 z-20 border-t border-[#F0EAE0] bg-white p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] md:pb-4 shadow-[0_-4px_16px_rgba(20,30,60,0.05)]">
        <div className="flex items-center justify-between gap-4 max-w-[720px] mx-auto w-full">
          <div>
            <span className="block text-[9.5px] font-bold uppercase tracking-[0.14em] text-[#7A8194]">
              TOTAL ESTIMATE
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-[20px] font-extrabold text-[#EF5A78]">
                ${pricing.finalPrice.toFixed(2)}
              </span>
              <span className="text-[11px] font-semibold text-[#7A8194]">
                /clean
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleProceed}
            className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#EF5A78] px-6 py-3.5 text-[14px] font-extrabold text-white shadow-[0_4px_16px_rgba(239,90,120,0.38)] hover:brightness-105 active:scale-[0.97] transition-all cursor-pointer"
          >
            Confirm &amp; Proceed
            <ArrowRight className="h-4 w-4 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </div>
  )
}
