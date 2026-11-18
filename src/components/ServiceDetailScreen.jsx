import React, { useState } from 'react'
import {
  Heart,
  Star,
  CheckCircle2,
  ShieldCheck,
  Clock,
  ArrowRight,
  Leaf,
} from 'lucide-react'
import { SERVICES } from '../data/services'
import BeforeAfterSlider from './BeforeAfterSlider'
import FrequencyToggle from './FrequencyToggle'
import RoomAccordion from './RoomAccordion'
import { FREQUENCY_OPTIONS } from '../data/bookingDraft'
import { useViewport } from '../hooks/useViewportMode'
// 
/**
 * Screen 2: Service Detail
 * Content scrolls under shared sticky AppHeader.
 * - 1. Photo banner with discount badge, rating, Verified Host badge, and heart toggle.
 * - 2. Before & After clean slider (Feature 1, scene varies by service: kitchen on Deep Cleaning, living room on Whole Home)
 * - 3. Title, subtitle, price & duration.
 * - 4. Frequency toggle with animated strikethrough & recurring savings (Feature 3)
 * - 5. 3 feature cards (100% Satisfaction, Bonded & Insured, Eco-Friendly).
 * - 6. About This Service.
 * - 7. Room-by-room checklist accordion (Feature 6, replacing flat checklist).
 * - 8. Sticky bottom action bar with synchronized rate + wide coral "Book Now >" button.
 */
export default function ServiceDetailScreen({
  serviceId,
  bookingDraft,
  onUpdateDraft,
  onBookNow,
  onShowToast,
}) {
  const { isTablet, isLandscape } = useViewport()
  const [isLiked, setIsLiked] = useState(false)
  const service = SERVICES.find((s) => s.id === serviceId) || SERVICES[0]

  const handleToggleLike = () => {
    setIsLiked((prev) => !prev)
    onShowToast(isLiked ? 'Removed from saved' : 'Saved to favorites')
  }

  // Frequency discount calculation
  const currentFrequency = bookingDraft?.frequency || 'One-time'
  const freqObj = FREQUENCY_OPTIONS.find((f) => f.id === currentFrequency) || FREQUENCY_OPTIONS[0]
  const discountRate = freqObj.discount || 0
  const isRecurring = discountRate > 0
  const discountedHourlyRate = (service.hourlyRate * (1 - discountRate)).toFixed(2)

  // Scene determination: kitchen for kitchen deep cleaning, living room for others
  const sliderScene =
    service.id === 'kitchen-deep-cleaning' || service.id.includes('kitchen')
      ? 'kitchen'
      : 'living'

  // Photo banner block
  const photoBanner = (
    <div
      className={`animate-pop-rotate stagger-item relative w-full overflow-hidden rounded-[24px] bg-slate-900 shadow-[0_6px_20px_rgba(20,30,60,0.08)] ${isTablet
          ? isLandscape
            ? 'h-[240px]'
            : 'h-[360px]'
          : 'aspect-[16/10]'
        }`}
    >
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
        className="absolute top-3.5 right-3.5 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur-xs active:scale-[0.93] transition-all cursor-pointer"
      >
        <Heart
          className={`h-4 w-4 ${isLiked ? 'fill-[#EF5A78] text-[#EF5A78]' : 'text-[#EF5A78]'
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
  )

  // Title, subtitle & price block
  const titleAndPrice = (
    <div className="stagger-item">
      <h2 className={`${isTablet ? 'text-[24px]' : 'text-[21px]'} font-bold text-[#121A2B] leading-tight`}>
        {service.title}
      </h2>
      <p className="mt-1 text-[12px] font-medium text-[#7A8194] truncate">
        By Luciana Certified Team · Fort Myers, FL
      </p>

      <div className="mt-2.5 flex items-center justify-between gap-3">
        <div className="flex items-baseline gap-1.5 min-w-0">
          {isRecurring ? (
            <div className="flex items-baseline gap-1.5 min-w-0">
              <span className="text-[14px] font-bold text-[#8A8FA3] line-through">
                ${service.hourlyRate}
              </span>
              <span className="text-[24px] font-extrabold text-[var(--primary)] transition-colors duration-200">
                ${discountedHourlyRate}
              </span>
              <span className="text-[13px] font-semibold text-[#7A8194]">
                /hour
              </span>
            </div>
          ) : (
            <div className="flex items-baseline gap-1 min-w-0">
              <span className="text-[24px] font-extrabold text-[var(--primary)] transition-colors duration-200">
                ${service.hourlyRate}
              </span>
              <span className="text-[13px] font-semibold text-[#7A8194]">
                /hour
              </span>
            </div>
          )}
        </div>

        <span className="shrink-0 whitespace-nowrap inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[11.5px] font-bold text-[#121A2B] shadow-[0_2px_8px_rgba(20,30,60,0.06)] border border-[#F0EAE0]">
          <Clock className="h-3.5 w-3.5 text-[var(--primary)]" />
          {service.duration}
        </span>
      </div>
    </div>
  )

  // 3 feature cards block
  const featureCards = (
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
  )

  // About this service card block
  const aboutCard = (
    <div className="stagger-item rounded-[22px] bg-white p-4.5 shadow-[0_4px_16px_rgba(20,30,60,0.06)] border border-[#F0EAE0]">
      <h3 className={`${isTablet ? 'text-[16px]' : 'text-[14.5px]'} font-extrabold text-[#121A2B]`}>
        About This Service
      </h3>
      <p className="mt-1.5 text-[12.5px] font-medium leading-relaxed text-[#7A8194]">
        {service.about}
      </p>
    </div>
  )

  // Slider block: "See the difference"
  const sliderBlock = (
    <BeforeAfterSlider
      scene={sliderScene}
      title="See the difference"
      subtitle={
        sliderScene === 'kitchen'
          ? 'Gas stovetop & counters degreased spotless'
          : 'Living room organized, dusted & polished'
      }
    />
  )

  return (
    <div className="flex h-full flex-col text-[#121A2B]">
      {/* 1. Scrollable Content (scrolls under sticky header) */}
      <div className={`flex-1 overflow-y-auto no-scrollbar ${isTablet ? 'px-8 pt-4 space-y-5' : 'px-4 pt-3 space-y-4'} pb-5 [overscroll-behavior:none]`}>
        {isTablet && isLandscape ? (
          /* Landscape 2-column layout: Left (photo, title, frequency, features, about), Right (What's Included with slider) */
          <div className="grid grid-cols-2 gap-6 items-start">
            <div className="space-y-4">
              {photoBanner}
              {titleAndPrice}
              <FrequencyToggle
                draft={bookingDraft}
                onFrequencyChange={(freq) => onUpdateDraft?.({ frequency: freq })}
                showPriceSummary={true}
                hourlyRate={service.hourlyRate}
              />
              {featureCards}
              {aboutCard}
            </div>

            <div className="space-y-4">
              <RoomAccordion topContent={sliderBlock} />
            </div>
          </div>
        ) : (
          /* Portrait single-column layout: Photo -> Title/Price -> Frequency -> What's Included (Header -> Slider -> Full Rooms list: Kitchen, Bathrooms, Living, Bedrooms) -> Features -> About */
          <div className={`${isTablet ? 'max-w-[720px] mx-auto' : ''} space-y-4`}>
            {photoBanner}
            {titleAndPrice}
            <FrequencyToggle
              draft={bookingDraft}
              onFrequencyChange={(freq) => onUpdateDraft?.({ frequency: freq })}
              showPriceSummary={true}
              hourlyRate={service.hourlyRate}
            />
            <RoomAccordion topContent={sliderBlock} />
            {featureCards}
            {aboutCard}
          </div>
        )}
      </div>

      {/* 8. Bottom Action Bar (flex item pinned at bottom) */}
      <div className="shrink-0 z-20 w-full border-t border-[#F0EAE0] bg-white px-5 py-3.5 pb-[calc(0.9rem+env(safe-area-inset-bottom))] shadow-[0_-6px_24px_rgba(20,30,60,0.08)]">
        <div className="flex items-center justify-between gap-4 max-w-[720px] mx-auto w-full">
          <div>
            <span className="block text-[10px] font-bold uppercase tracking-[0.14em] text-[#7A8194]">
              TOTAL RATE
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-[20px] font-extrabold text-[var(--primary)] transition-colors duration-200">
                ${isRecurring ? discountedHourlyRate : service.hourlyRate}
              </span>
              <span className="text-[12px] font-semibold text-[#7A8194]">
                /h
              </span>
              <span className="ml-1.5 rounded-full bg-[#E6EEFB] px-2 py-0.5 text-[9.5px] font-bold text-[#3567C9]">
                {isRecurring ? `${freqObj.badge}` : 'Top Rated'}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onBookNow(service.id)}
            className="flex min-h-[46px] flex-1 max-w-[210px] items-center justify-center gap-2 rounded-full bg-[var(--primary)] px-6 py-3 text-[13.5px] font-extrabold text-white shadow-[0_6px_20px_rgba(239,90,120,0.4)] hover:brightness-105 active:scale-[0.97] transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)] cursor-pointer"
          >
            <span>Book Now</span>
            <ArrowRight className="h-4 w-4 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </div>
  )
}
