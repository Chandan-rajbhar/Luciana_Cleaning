import React, { useState } from 'react'
import {
  Calendar,
  Clock,
  MapPin,
  MessageCircle,
  Phone,
  RotateCcw,
  Sparkles,
  ChevronRight,
} from 'lucide-react'
import { INITIAL_BOOKINGS } from '../data/services'

/**
 * Screen: My Bookings
 * Opened from MoreSheet or Profile.
 * Tabs: Upcoming & Past with booking cards.
 */
export default function MyBookingsScreen({
  bookings = INITIAL_BOOKINGS,
  onOpenSchedule,
  onOpenChat,
  onOpenCall,
  onShowToast,
}) {
  const [activeTab, setActiveTab] = useState('upcoming')

  return (
    <div className="flex flex-col text-[#121A2B] px-4 pt-3 pb-[calc(var(--bar-h)+16px+env(safe-area-inset-bottom))] space-y-4">
      {/* 1. Tab Switcher Pills */}
      <div className="flex rounded-2xl bg-white p-1 shadow-[0_2px_8px_rgba(20,30,60,0.04)] border border-[#F0EAE0] stagger-item">
        <button
          type="button"
          onClick={() => setActiveTab('upcoming')}
          className={`flex-1 rounded-xl py-2 text-center text-[12.5px] font-extrabold transition-all ${
            activeTab === 'upcoming'
              ? 'bg-[#EF5A78] text-white shadow-[0_2px_8px_rgba(239,90,120,0.3)]'
              : 'text-[#7A8194] hover:text-[#121A2B]'
          }`}
        >
          Upcoming ({bookings.upcoming.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('past')}
          className={`flex-1 rounded-xl py-2 text-center text-[12.5px] font-extrabold transition-all ${
            activeTab === 'past'
              ? 'bg-[#EF5A78] text-white shadow-[0_2px_8px_rgba(239,90,120,0.3)]'
              : 'text-[#7A8194] hover:text-[#121A2B]'
          }`}
        >
          Past Visits ({bookings.past.length})
        </button>
      </div>

      {/* 2. Upcoming Bookings Content */}
      {activeTab === 'upcoming' && (
        <div className="space-y-3">
          {bookings.upcoming.map((b) => (
            <div
              key={b.id}
              className="overflow-hidden rounded-[24px] bg-white p-4.5 shadow-[0_4px_16px_rgba(20,30,60,0.06)] border border-[#F0EAE0] stagger-item"
            >
              {/* Header row: Service, image & status */}
              <div className="flex items-start justify-between gap-3 pb-3 border-b border-gray-100">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-[14px]">
                    <img
                      src={b.image}
                      alt={b.serviceTitle}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <span className="block text-[10px] font-extrabold text-[#EF5A78]">
                      REF: #{b.id}
                    </span>
                    <h3 className="truncate text-[14px] font-extrabold text-[#121A2B]">
                      {b.serviceTitle}
                    </h3>
                    <span className="text-[11.5px] font-semibold text-[#7A8194]">
                      {b.rate}
                    </span>
                  </div>
                </div>

                <span className="inline-flex items-center gap-1 rounded-full bg-[#E6F6EC] px-2.5 py-1 text-[10.5px] font-bold text-[#2E9E5B] shrink-0">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#2E9E5B] animate-pulse" />
                  {b.status}
                </span>
              </div>

              {/* Date & Location Details */}
              <div className="mt-3 grid grid-cols-2 gap-2 text-[11.5px]">
                <div className="rounded-xl bg-[#FAF6F0] p-2.5">
                  <span className="flex items-center gap-1 font-bold text-[#7A8194] text-[10px] uppercase">
                    <Calendar className="h-3 w-3 text-[#D98A1E]" />
                    Date &amp; Time
                  </span>
                  <p className="mt-0.5 font-extrabold text-[#121A2B]">
                    {b.date}
                  </p>
                  <p className="font-semibold text-[#EF5A78] text-[11px]">
                    {b.time}
                  </p>
                </div>

                <div className="rounded-xl bg-[#FAF6F0] p-2.5">
                  <span className="flex items-center gap-1 font-bold text-[#7A8194] text-[10px] uppercase">
                    <MapPin className="h-3 w-3 text-[#3567C9]" />
                    Service Area
                  </span>
                  <p className="mt-0.5 font-extrabold text-[#121A2B] truncate">
                    Fort Myers, FL
                  </p>
                  <p className="font-semibold text-[#7A8194] text-[11px] truncate">
                    Residential Home
                  </p>
                </div>
              </div>

              {/* Cleaner Specialist row */}
              <div className="mt-3 flex items-center justify-between rounded-xl bg-[#FAF6F0] p-2.5">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 overflow-hidden rounded-full ring-1 ring-white">
                    <img
                      src="/images/cleaner-maria.jpg"
                      alt={b.cleaner}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <span className="block text-[11.5px] font-extrabold text-[#121A2B]">
                      {b.cleaner}
                    </span>
                    <span className="block text-[10px] font-medium text-[#7A8194]">
                      Assigned Lead Cleaner
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={onOpenCall}
                    aria-label="Call cleaner"
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#2E9E5B] shadow-xs active:scale-[0.94] transition-all"
                  >
                    <Phone className="h-3.5 w-3.5 stroke-[2.4]" />
                  </button>
                  <button
                    type="button"
                    onClick={onOpenChat}
                    aria-label="Chat cleaner"
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#EF5A78] shadow-xs active:scale-[0.94] transition-all"
                  >
                    <MessageCircle className="h-3.5 w-3.5 stroke-[2.4]" />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-3.5 flex gap-2">
                <button
                  type="button"
                  onClick={onOpenSchedule}
                  className="flex min-h-[44px] flex-1 items-center justify-center gap-1.5 rounded-full border border-[#F0EAE0] bg-white py-2.5 text-[12px] font-extrabold text-[#121A2B] hover:bg-gray-50 active:scale-[0.97] transition-all"
                >
                  <RotateCcw className="h-3.5 w-3.5 stroke-[2.4] text-[#7A8194]" />
                  Reschedule
                </button>
                <button
                  type="button"
                  onClick={onOpenChat}
                  className="flex min-h-[44px] flex-1 items-center justify-center gap-1.5 rounded-full bg-[#EF5A78] py-2.5 text-[12px] font-extrabold text-white shadow-[0_3px_10px_rgba(239,90,120,0.3)] hover:brightness-105 active:scale-[0.97] transition-all"
                >
                  <MessageCircle className="h-3.5 w-3.5 stroke-[2.4]" />
                  Chat Crew
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 3. Past Visits Content */}
      {activeTab === 'past' && (
        <div className="space-y-3">
          {bookings.past.map((p) => (
            <div
              key={p.id}
              className="rounded-[22px] bg-white p-4 shadow-[0_4px_16px_rgba(20,30,60,0.06)] border border-[#F0EAE0] stagger-item"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-[12px]">
                    <img
                      src={p.image}
                      alt={p.serviceTitle}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <h4 className="truncate text-[13.5px] font-extrabold text-[#121A2B]">
                      {p.serviceTitle}
                    </h4>
                    <p className="text-[11px] font-medium text-[#7A8194]">
                      {p.date} • {p.totalPaid}
                    </p>
                  </div>
                </div>

                <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-[10px] font-bold text-[#7A8194]">
                  {p.status}
                </span>
              </div>

              <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-2.5">
                <span className="text-[11px] font-semibold text-[#7A8194]">
                  Cleaner: {p.cleaner}
                </span>

                <button
                  type="button"
                  onClick={() => {
                    onShowToast(`Selected ${p.serviceTitle} for re-booking`)
                    onOpenSchedule()
                  }}
                  className="flex items-center gap-1 text-[11.5px] font-extrabold text-[#EF5A78] hover:underline active:scale-[0.97] transition-transform"
                >
                  <Sparkles className="h-3.5 w-3.5 stroke-[2.4]" />
                  Book Again
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

