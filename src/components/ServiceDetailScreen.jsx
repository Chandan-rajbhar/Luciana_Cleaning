import React, { useState } from 'react'
import {
  Heart,
  Star,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  Clock,
  ArrowRight,
  Leaf,
} from 'lucide-react'
import { SERVICES } from '../data/services'

/**
 * Screen 2: Service Detail
 * Content scrolls under shared sticky AppHeader.
 * - Large photo banner with discount badge, rating, Verified Host badge, and heart toggle.
 * - Title, location, rate, duration.
 * - 3 feature cards (100% Satisfaction, Bonded & Insured, Eco-Friendly).
 * - "About This Service" & "What's Included" with "5 Steps Guarantee".
 * - Sticky bottom action bar: Total Rate + wide coral "Book Now >" button.
 */
export default function ServiceDetailScreen({
  serviceId,
  onBookNow,
  onShowToast,
}) {
  const [isLiked, setIsLiked] = useState(false)
  const service = SERVICES.find((s) => s.id === serviceId) || SERVICES[0]

  const handleToggleLike = () => {
    setIsLiked((prev) => !prev)
    onShowToast(isLiked ? 'Removed from saved' : 'Saved to favorites')
  }

  return (
    <div className="flex h-full flex-col text-[#121A2B]">
      {/* 1. Scrollable Content (scrolls under sticky header) */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 pt-3 space-y-4 pb-[calc(var(--bar-h)+16px+env(safe-area-inset-bottom))] [overscroll-behavior:contain]">
        {/* Large Photo Banner */}
        <div className="animate-pop-rotate stagger-item relative aspect-[16/10] w-full overflow-hidden rounded-[24px] bg-slate-900 shadow-[0_6px_20px_rgba(20,30,60,0.08)]">
          <img
            src={service.image}
            alt={service.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

          {/* Top-left discount badge */}
          {service.discount && (
            <span className="absolute top-3.5 left-3.5 rounded-full bg-[#EF5A78] px-3 py-1 text-[11px] font-extrabold text-white shadow-sm">
              {service.discount}
            </span>
          )}

          {/* Top-right heart button */}
          <button
            type="button"
            onClick={handleToggleLike}
            aria-label="Save service"
            className="absolute top-3.5 right-3.5 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur-xs active:scale-[0.93] transition-all"
          >
            <Heart
              className={`h-4 w-4 ${
                isLiked ? 'fill-[#EF5A78] text-[#EF5A78]' : 'text-[#EF5A78]'
              } stroke-[2.4]`}
            />
          </button>

          {/* Bottom chips */}
          <div className="absolute inset-x-3.5 bottom-3.5 flex items-center justify-between">
            <span className="inline-flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold text-[#121A2B] shadow-xs backdrop-blur-xs">
              <Star className="h-3.5 w-3.5 fill-[#D98A1E] text-[#D98A1E]" />
              {service.rating} ({service.reviewsCount} reviews)
            </span>

            <span className="inline-flex items-center gap-1 rounded-full bg-[#2E9E5B] px-3 py-1 text-[11px] font-bold text-white shadow-xs">
              <CheckCircle2 className="h-3.5 w-3.5 stroke-[2.4]" />
              Verified Host
            </span>
          </div>
        </div>

        {/* Title, Subtitle & Price */}
        <div className="stagger-item">
          <h2 className="text-[20px] font-extrabold text-[#121A2B] leading-tight">
            {service.title}
          </h2>
          <p className="mt-1 text-[12px] font-medium text-[#7A8194]">
            {service.subtitle} • {service.location}
          </p>

          <div className="mt-2.5 flex items-center justify-between">
            <div className="flex items-baseline gap-1">
              <span className="text-[24px] font-extrabold text-[#EF5A78]">
                ${service.hourlyRate}
              </span>
              <span className="text-[13px] font-semibold text-[#7A8194]">
                /hour
              </span>
            </div>

            <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[11.5px] font-bold text-[#121A2B] shadow-[0_2px_8px_rgba(20,30,60,0.06)] border border-[#F0EAE0]">
              <Clock className="h-3.5 w-3.5 text-[#EF5A78]" />
              {service.duration}
            </span>
          </div>
        </div>

        {/* 3 Equal Feature Cards */}
        <div className="stagger-item grid grid-cols-3 gap-2">
          <div className="flex flex-col items-center rounded-2xl bg-white p-3 text-center shadow-[0_2px_10px_rgba(20,30,60,0.04)] border border-[#F0EAE0]">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E6F6EC] text-[#2E9E5B]">
              <CheckCircle2 className="h-4 w-4 stroke-[2.4]" />
            </div>
            <span className="mt-2 text-[11px] font-extrabold text-[#121A2B] leading-tight">
              100%
            </span>
            <span className="text-[9.5px] font-medium text-[#7A8194]">
              Satisfaction
            </span>
          </div>

          <div className="flex flex-col items-center rounded-2xl bg-white p-3 text-center shadow-[0_2px_10px_rgba(20,30,60,0.04)] border border-[#F0EAE0]">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E6EEFB] text-[#3567C9]">
              <ShieldCheck className="h-4 w-4 stroke-[2.4]" />
            </div>
            <span className="mt-2 text-[11px] font-extrabold text-[#121A2B] leading-tight">
              Bonded &amp;
            </span>
            <span className="text-[9.5px] font-medium text-[#7A8194]">
              Insured
            </span>
          </div>

          <div className="flex flex-col items-center rounded-2xl bg-white p-3 text-center shadow-[0_2px_10px_rgba(20,30,60,0.04)] border border-[#F0EAE0]">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FDE4EA] text-[#EF5A78]">
              <Leaf className="h-4 w-4 stroke-[2.4]" />
            </div>
            <span className="mt-2 text-[11px] font-extrabold text-[#121A2B] leading-tight">
              Eco-Safe
            </span>
            <span className="text-[9.5px] font-medium text-[#7A8194]">
              Non-Toxic
            </span>
          </div>
        </div>

        {/* About This Service */}
        <div className="stagger-item rounded-[22px] bg-white p-4.5 shadow-[0_4px_16px_rgba(20,30,60,0.06)] border border-[#F0EAE0]">
          <h3 className="text-[14.5px] font-extrabold text-[#121A2B]">
            About This Service
          </h3>
          <p className="mt-1.5 text-[12.5px] font-medium leading-relaxed text-[#7A8194]">
            {service.about}
          </p>
        </div>

        {/* What's Included */}
        <div className="stagger-item rounded-[22px] bg-white p-4.5 shadow-[0_4px_16px_rgba(20,30,60,0.06)] border border-[#F0EAE0]">
          <div className="flex items-center justify-between pb-2 border-b border-gray-100">
            <h3 className="text-[14.5px] font-extrabold text-[#121A2B]">
              What&apos;s Included
            </h3>
            <span className="rounded-full bg-[#FDE4EA] px-2.5 py-0.5 text-[10.5px] font-bold text-[#EF5A78]">
              5 Steps Guarantee
            </span>
          </div>

          <ul className="mt-3 space-y-2">
            {service.included.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-[12px]">
                <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#E6F6EC] text-[#2E9E5B]">
                  <CheckCircle2 className="h-3 w-3 stroke-[3]" />
                </div>
                <span className="font-semibold text-[#121A2B]">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 2. Sticky Bottom Action Bar (hidden TabBar here) */}
      <div className="sticky bottom-0 z-20 w-full border-t border-[#F0EAE0] bg-white px-5 py-3.5 pb-[calc(0.9rem+env(safe-area-inset-bottom))] shadow-[0_-6px_24px_rgba(20,30,60,0.08)]">
        <div className="flex items-center justify-between gap-4">
          <div>
            <span className="block text-[10px] font-bold uppercase tracking-[0.14em] text-[#7A8194]">
              TOTAL RATE
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-[20px] font-extrabold text-[#EF5A78]">
                ${service.hourlyRate}
              </span>
              <span className="text-[12px] font-semibold text-[#7A8194]">
                /h
              </span>
              <span className="ml-1.5 rounded-full bg-[#E6EEFB] px-2 py-0.5 text-[9.5px] font-bold text-[#3567C9]">
                Top Rated
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onBookNow(service.id)}
            className="flex min-h-[46px] flex-1 max-w-[210px] items-center justify-center gap-2 rounded-full bg-[#EF5A78] px-6 py-3 text-[13.5px] font-extrabold text-white shadow-[0_6px_20px_rgba(239,90,120,0.4)] hover:brightness-105 active:scale-[0.97] transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#EF5A78]"
          >
            <span>Book Now</span>
            <ArrowRight className="h-4 w-4 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </div>
  )
}
