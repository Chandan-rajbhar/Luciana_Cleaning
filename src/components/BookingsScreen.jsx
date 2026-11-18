import React, { useState } from 'react'
import {
  Calendar,
  Clock,
  MapPin,
  MessageCircle,
  Sparkles,
  RotateCcw,
  Star,
  CheckCircle2,
  CalendarPlus,
  CalendarCheck,
  ChevronRight,
  Check,
} from 'lucide-react'
import { INITIAL_BOOKINGS } from '../data/services'
import TipRatingSheet from './TipRatingSheet'
import { useViewport } from '../hooks/useViewportMode'

/**
 * Screen: Bookings
 * Opened from the bottom navigation bar "Bookings" tab.
 * Tabs:
 *   - Upcoming (default): Booking cards with assigned cleaner, live status line, Reschedule & Details buttons, and Chat icon button.
 *   - Past: Completed clean cards with "Completed" chip, price, Rebook button and Rate link.
 *   - Empty states for both tabs with a coral "Book a clean" button.
 */
export default function BookingsScreen({
  bookings = INITIAL_BOOKINGS,
  onOpenSchedule,
  onOpenChat,
  onOpenDetails,
  onShowToast,
  onTriggerLoading,
}) {
  const { isTablet } = useViewport()
  const [activeTab, setActiveTab] = useState('upcoming')
  const [activeRatingBooking, setActiveRatingBooking] = useState(null)
  const [ratedBookings, setRatedBookings] = useState({})

  const upcomingList = bookings?.upcoming || []
  const pastList = bookings?.past || []

  return (
    <div className={`flex flex-col text-[#121A2B] ${isTablet ? 'px-8 pt-4 space-y-5' : 'px-4 pt-3 space-y-4'} pb-2`}>
      {/* 1. Two Segmented Tabs under Header */}
      <div className="flex rounded-2xl bg-white p-1 shadow-[0_2px_8px_rgba(20,30,60,0.04)] border border-[#F0EAE0] stagger-item">
        <button
          type="button"
          onClick={() => setActiveTab('upcoming')}
          className={`flex-1 rounded-xl py-2.5 text-center text-[13px] font-extrabold transition-all cursor-pointer ${
            activeTab === 'upcoming'
              ? 'bg-[#EF5A78] text-white shadow-[0_2px_8px_rgba(239,90,120,0.3)]'
              : 'text-[#8A8FA3] hover:text-[#121A2B]'
          }`}
        >
          Upcoming ({upcomingList.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('past')}
          className={`flex-1 rounded-xl py-2.5 text-center text-[13px] font-extrabold transition-all cursor-pointer ${
            activeTab === 'past'
              ? 'bg-[#EF5A78] text-white shadow-[0_2px_8px_rgba(239,90,120,0.3)]'
              : 'text-[#8A8FA3] hover:text-[#121A2B]'
          }`}
        >
          Past ({pastList.length})
        </button>
      </div>

      {/* 2. Upcoming Cleans Tab */}
      {activeTab === 'upcoming' && (
        <div className={isTablet ? 'grid grid-cols-2 gap-4 space-y-0' : 'space-y-3.5'}>
          {upcomingList.length === 0 ? (
            /* Empty state for Upcoming */
            <div className="flex flex-col items-center justify-center rounded-[24px] bg-white p-8 text-center shadow-[0_4px_16px_rgba(20,30,60,0.06)] border border-[#F0EAE0] stagger-item">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#FDE4EA] text-[#EF5A78]">
                <CalendarPlus className="h-8 w-8 stroke-[1.8]" />
              </div>
              <h3 className="mt-4 text-[16px] font-extrabold text-[#121A2B]">
                No upcoming cleans yet
              </h3>
              <p className="mt-1 text-[12.5px] font-medium leading-relaxed text-[#7A8194] max-w-[260px]">
                Schedule your next home refresh in under 60 seconds with our certified crew.
              </p>
              <button
                type="button"
                onClick={onOpenSchedule}
                className="mt-5 flex items-center gap-2 rounded-full bg-[#EF5A78] px-6 py-2.5 text-[13px] font-extrabold text-white shadow-[0_4px_14px_rgba(239,90,120,0.35)] hover:brightness-105 active:scale-[0.97] transition-all cursor-pointer"
              >
                <Sparkles className="h-4 w-4" />
                Book a clean
              </button>
            </div>
          ) : (
            upcomingList.map((b) => (
              <div
                key={b.id}
                onClick={() => onOpenDetails?.(b)}
                className="group relative cursor-pointer overflow-hidden rounded-[24px] bg-white p-4.5 shadow-[0_4px_16px_rgba(20,30,60,0.06)] border border-[#F0EAE0] hover:border-[#EF5A78]/30 active:scale-[0.985] transition-all stagger-item"
              >
                {/* Header Row: Service Photo, Title, Date & Status Chip */}
                <div className="flex items-start justify-between gap-3 pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative h-13 w-13 shrink-0 overflow-hidden rounded-[14px]">
                      <img
                        src={b.image || '/images/deep-cleaning.jpg'}
                        alt={b.serviceTitle}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <span className="block text-[10px] font-extrabold tracking-wider text-[#EF5A78]">
                        REF #{b.id}
                      </span>
                      <h3 className="truncate text-[14.5px] font-extrabold text-[#121A2B]">
                        {b.serviceTitle}
                      </h3>
                      <div className="flex items-center gap-1.5 text-[11.5px] font-semibold text-[#7A8194] mt-0.5">
                        <Calendar className="h-3.5 w-3.5 text-[#EF5A78] shrink-0" />
                        <span className="truncate">{b.date} • {b.time}</span>
                      </div>
                    </div>
                  </div>

                  {/* Status chip */}
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold shrink-0 ${
                      b.status === 'On the way'
                        ? 'bg-[#FFF4E5] text-[#D98A1E] border border-[#D98A1E]/20'
                        : 'bg-[#E6F6EC] text-[#2E9E5B] border border-[#2E9E5B]/20'
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        b.status === 'On the way'
                          ? 'bg-[#D98A1E] animate-pulse'
                          : 'bg-[#2E9E5B] animate-pulse'
                      }`}
                    />
                    {b.status || 'Confirmed'}
                  </span>
                </div>

                {/* Live Status Line (text only — no map or tracker) */}
                <div className="mt-3 flex items-center gap-2 rounded-xl bg-[#FAF6F0] px-3 py-2 text-[11.5px] font-semibold text-[#121A2B]">
                  <span className="h-2 w-2 rounded-full bg-[#2E9E5B] shrink-0 animate-ping" />
                  <p className="truncate">
                    Cleaner arriving today, {b.time} • Prep supplies ready
                  </p>
                </div>

                {/* Assigned Cleaner Row with Chat Crew Icon Button */}
                <div className="mt-3 flex items-center justify-between rounded-xl bg-[#FAF6F0]/60 p-2.5">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="h-7 w-7 shrink-0 overflow-hidden rounded-full ring-1 ring-white">
                      <img
                        src="/images/cleaner-maria.jpg"
                        alt={b.cleaner || 'Luciana R.'}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <span className="block text-[12px] font-extrabold text-[#121A2B] truncate">
                        Assigned: {b.cleaner || 'Luciana R.'}
                      </span>
                      <span className="block text-[10px] font-medium text-[#7A8194]">
                        Lead Cleaning Specialist ★ 4.9
                      </span>
                    </div>
                  </div>

                  {/* Chat Crew Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      onOpenChat?.(b)
                    }}
                    aria-label="Chat crew"
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#EF5A78] shadow-xs hover:bg-[#FDE4EA] active:scale-[0.93] transition-all cursor-pointer"
                  >
                    <MessageCircle className="h-4 w-4 stroke-[2.2]" />
                  </button>
                </div>

                {/* Card Action Buttons: Outline Reschedule + Coral Details */}
                <div className="mt-3.5 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      onOpenSchedule?.(b)
                    }}
                    className="flex min-h-[40px] flex-1 items-center justify-center gap-1.5 rounded-full border border-[#F0EAE0] bg-white py-2 text-[12px] font-extrabold text-[#121A2B] hover:bg-gray-50 active:scale-[0.97] transition-all cursor-pointer"
                  >
                    <RotateCcw className="h-3.5 w-3.5 stroke-[2.4] text-[#8A8FA3]" />
                    Reschedule
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      onOpenDetails?.(b)
                    }}
                    className="flex min-h-[40px] flex-1 items-center justify-center gap-1 rounded-full bg-[#EF5A78] py-2 text-[12px] font-extrabold text-white shadow-[0_3px_10px_rgba(239,90,120,0.3)] hover:brightness-105 active:scale-[0.97] transition-all cursor-pointer"
                  >
                    Details
                    <ChevronRight className="h-3.5 w-3.5 stroke-[2.4]" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* 3. Past Cleans Tab */}
      {activeTab === 'past' && (
        <div className={isTablet ? 'grid grid-cols-2 gap-4 space-y-0' : 'space-y-3.5'}>
          {pastList.length === 0 ? (
            /* Empty state for Past */
            <div className="flex flex-col items-center justify-center rounded-[24px] bg-white p-8 text-center shadow-[0_4px_16px_rgba(20,30,60,0.06)] border border-[#F0EAE0] stagger-item">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-[#8A8FA3]">
                <CalendarCheck className="h-8 w-8 stroke-[1.8]" />
              </div>
              <h3 className="mt-4 text-[16px] font-extrabold text-[#121A2B]">
                No past bookings
              </h3>
              <p className="mt-1 text-[12.5px] font-medium leading-relaxed text-[#7A8194] max-w-[260px]">
                Your completed clean receipts and service history will appear here.
              </p>
              <button
                type="button"
                onClick={onOpenSchedule}
                className="mt-5 flex items-center gap-2 rounded-full bg-[#EF5A78] px-6 py-2.5 text-[13px] font-extrabold text-white shadow-[0_4px_14px_rgba(239,90,120,0.35)] hover:brightness-105 active:scale-[0.97] transition-all cursor-pointer"
              >
                <Sparkles className="h-4 w-4" />
                Book a clean
              </button>
            </div>
          ) : (
            pastList.map((p) => (
              <div
                key={p.id}
                onClick={() => onOpenDetails?.(p)}
                className="group relative cursor-pointer overflow-hidden rounded-[22px] bg-white p-4 shadow-[0_4px_16px_rgba(20,30,60,0.06)] border border-[#F0EAE0] hover:border-[#EF5A78]/30 active:scale-[0.985] transition-all stagger-item"
              >
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-[13px]">
                      <img
                        src={p.image || '/images/hero-living-room.jpg'}
                        alt={p.serviceTitle}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <h4 className="truncate text-[14px] font-extrabold text-[#121A2B]">
                        {p.serviceTitle}
                      </h4>
                      <p className="text-[11.5px] font-medium text-[#7A8194]">
                        {p.date} • <span className="font-bold text-[#121A2B]">{p.totalPaid}</span>
                      </p>
                    </div>
                  </div>

                  {/* Status Chips: Rated & Completed */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    {ratedBookings[p.id] && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#E6F6EC] px-2.5 py-1 text-[10.5px] font-extrabold text-[#2E9E5B] border border-[#2E9E5B]/25">
                        <Check className="h-3 w-3 stroke-[3]" />
                        Rated
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#FAF6F0] px-2.5 py-1 text-[10.5px] font-bold text-[#7A8194] border border-[#F0EAE0]">
                      <CheckCircle2 className="h-3 w-3 text-[#2E9E5B]" />
                      Completed
                    </span>
                  </div>
                </div>

                {/* Bottom Row: Cleaner Specialist, Rate/Tip again link and Rebook button */}
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[11.5px] font-medium text-[#7A8194]">
                      Cleaner: <strong className="text-[#121A2B]">{p.cleaner || 'Luciana R.'}</strong>
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        setActiveRatingBooking(p)
                      }}
                      className="ml-2 text-[11.5px] font-extrabold text-[#EF5A78] hover:underline active:scale-95 transition-all cursor-pointer"
                    >
                      {ratedBookings[p.id] ? 'Tip again' : 'Rate'}
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      onShowToast?.(`Selected ${p.serviceTitle} for re-booking`)
                      onOpenSchedule?.(p)
                    }}
                    className="flex items-center gap-1.5 rounded-full bg-[#EF5A78] px-3.5 py-1.5 text-[11.5px] font-extrabold text-white shadow-xs hover:brightness-105 active:scale-[0.96] transition-all cursor-pointer"
                  >
                    <Sparkles className="h-3 w-3" />
                    Rebook
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Feature 5: Post-Clean Tip & Rating Sheet */}
      <TipRatingSheet
        isOpen={Boolean(activeRatingBooking)}
        bookingItem={activeRatingBooking}
        onClose={() => setActiveRatingBooking(null)}
        onSubmitRating={(data) => {
          setRatedBookings((prev) => ({ ...prev, [data.bookingId]: data }))
        }}
        onShowToast={onShowToast}
        onTriggerLoading={onTriggerLoading}
      />
    </div>
  )
}

