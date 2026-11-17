import React, { useState, useEffect } from 'react'
import {
  Sparkles,
  Wrench,
  Shirt,
  Paintbrush,
  Droplets,
  Star,
  ChevronRight,
  ShieldCheck,
  ArrowRight,
  Copy,
  Calendar,
  Home,
  Snowflake,
  Flame,
  AppWindow,
  CheckCircle2,
  Check,
  X,
  Clock,
  RotateCcw,
} from 'lucide-react'
import { SERVICES } from '../data/services'
import { SparklesGroup, SheetBubbles } from './VisualEffects'
import ZipChecker from './ZipChecker'
import BeforeAfterSlider from './BeforeAfterSlider'
import HomeSizePriceWidget from './HomeSizePriceWidget'
import CleanerProfileSheet from './CleanerProfileSheet'
import { useViewport } from '../hooks/useViewportMode'

const ADD_ONS_DATA = [
  {
    id: 'fridge',
    name: 'Inside Fridge',
    price: '+$25',
    value: 'Inside Fridge (+$25)',
    Icon: Snowflake,
    bg: 'bg-[#E0F2FE]',
    fg: 'text-[#0284C7]',
  },
  {
    id: 'oven',
    name: 'Inside Oven',
    price: '+$30',
    value: 'Inside Oven (+$30)',
    Icon: Flame,
    bg: 'bg-[#FFEDD5]',
    fg: 'text-[#EA580C]',
  },
  {
    id: 'windows',
    name: 'Windows',
    price: '+$40',
    value: 'Windows (+$40)',
    Icon: AppWindow,
    bg: 'bg-[#E6EEFB]',
    fg: 'text-[#3567C9]',
  },
  {
    id: 'laundry',
    name: 'Laundry',
    price: '+$20',
    value: 'Laundry (+$20)',
    Icon: Shirt,
    bg: 'bg-[#FDE4EA]',
    fg: 'text-[#EF5A78]',
  },
]

const CLEANERS_DATA = [
  {
    id: 'maria',
    name: 'Maria S.',
    rating: '4.9',
    reviews: 142,
    experience: '6+ years in Fort Myers',
    specialty: 'Deep sanitization & allergen reduction',
    image: '/images/cleaner-maria.jpg',
  },
  {
    id: 'sofia',
    name: 'Sofia L.',
    rating: '4.8',
    reviews: 118,
    experience: '5+ years in Lee County',
    specialty: 'Detail dusting & delicate Florida furnishings',
    image: '/images/cleaner-sofia.jpg',
  },
  {
    id: 'elena',
    name: 'Elena M.',
    rating: '4.9',
    reviews: 164,
    experience: '7+ years in Fort Myers',
    specialty: 'Kitchen degreasing & stainless steel polishing',
    image: '/images/cleaner-elena.jpg',
  },
  {
    id: 'camila',
    name: 'Camila R.',
    rating: '4.9',
    reviews: 95,
    experience: '4+ years in Cape Coral',
    specialty: 'Eco-friendly solutions & pet-safe sanitizing',
    image: '/images/cleaner-camila.jpg',
  },
]

/**
 * Screen 1: Home Screen
 * - Sticky header sits above
 * - Hero banner
 * - Category row (small icons, none selected by default)
 * - Two-card Recommended row with "See all" link
 * - 1. Offer banner (15% off with code FRESH15)
 * - 2. Your next clean (empty state by default)
 * - 3. How it works (3-step timeline)
 * - 4. Why choose us (animated 3-column stats strip)
 * - 5. Add-ons (2x2 grid with toggle checks, carries to estimate)
 * - 6. Meet our cleaners (horizontal scroll 72px photos + in-frame sheet)
 * - Bottom padding ~110px
 */
export default function HomeScreen({
  bookingDraft,
  onUpdateDraft,
  onBookThisSize,
  onSelectService,
  onViewAllServices,
  onOpenSchedule,
  onOpenEstimate,
  onNavigateBookings,
  onShowToast,
  onTriggerLoading,
  booking = null,
}) {
  const { isTablet, isLandscape } = useViewport()
  const [selectedAddOns, setSelectedAddOns] = useState(bookingDraft?.addOns || [])
  const [activeCleaner, setActiveCleaner] = useState(null)

  useEffect(() => {
    if (bookingDraft?.addOns) {
      setSelectedAddOns(bookingDraft.addOns)
    }
  }, [bookingDraft?.addOns])

  // Animated stat counters for "Why choose us"
  const [countHomes, setCountHomes] = useState(0)
  const [countRating, setCountRating] = useState('0.0')
  const [countSat, setCountSat] = useState(0)

  useEffect(() => {
    const duration = 1200
    const steps = 28
    const interval = duration / steps
    let step = 0

    const timer = setInterval(() => {
      step++
      const progress = Math.min(step / steps, 1)
      const eased = 1 - Math.pow(1 - progress, 2)

      setCountHomes(Math.round(eased * 500))
      setCountRating((eased * 4.9).toFixed(1))
      setCountSat(Math.round(eased * 100))

      if (progress >= 1) clearInterval(timer)
    }, interval)

    return () => clearInterval(timer)
  }, [])

  const categories = [
    { id: 'cleaning', label: 'Cleaning', Icon: Sparkles },
    { id: 'repairing', label: 'Repairing', Icon: Wrench },
    { id: 'laundry', label: 'Laundry', Icon: Shirt },
    { id: 'painting', label: 'Painting', Icon: Paintbrush },
    { id: 'washing', label: 'Washing', Icon: Droplets },
  ]

  const handleToggleAddOn = (addonValue) => {
    setSelectedAddOns((prev) => {
      const exists = prev.includes(addonValue)
      const updated = exists ? prev.filter((a) => a !== addonValue) : [...prev, addonValue]
      onShowToast(exists ? `Removed ${addonValue}` : `Added ${addonValue}`)
      onUpdateDraft?.({ addOns: updated })
      return updated
    })
  }

  const handleCopyCode = () => {
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText('FRESH15').catch(() => {})
    }
    onShowToast('Code copied')
  }

  // 1. Offer Banner Block
  const offerBannerBlock = (
    <div
      style={{
        background:
          'linear-gradient(135deg, #EF5A78 0%, #F2766B 55%, #F5A623 100%)',
        boxShadow: '0 12px 28px rgba(239,90,120,0.28)',
      }}
      className="stagger-item relative min-h-[170px] overflow-hidden rounded-[24px] p-5 h-full flex flex-col justify-between"
    >
      {/* Layer 0: Background Photo with multiply blend and 0.35 opacity */}
      <img
        src="/images/hero-living-room.jpg"
        alt="Clean modern living room"
        onError={(e) => {
          e.currentTarget.style.display = 'none'
        }}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: 0.35,
          mixBlendMode: 'multiply',
          zIndex: 0,
        }}
      />

      {/* Layer 1: Dark readability overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          pointerEvents: 'none',
          background:
            'linear-gradient(90deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.15) 100%)',
        }}
      />

      {/* Layer 2: Banner Content */}
      <div
        style={{ position: 'relative', zIndex: 2 }}
        className="flex h-full flex-col justify-between"
      >
        <div>
          <span
            style={{ backgroundColor: 'rgba(0,0,0,0.35)' }}
            className="inline-flex items-center rounded-full border border-white/40 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white"
          >
            NEW CLIENT OFFER
          </span>

          <h3
            style={{ textShadow: '0 1px 6px rgba(0,0,0,0.35)' }}
            className="mt-2.5 text-[22px] font-bold leading-tight text-white"
          >
            15% off your first clean
          </h3>

          <p
            style={{ textShadow: '0 1px 6px rgba(0,0,0,0.35)' }}
            className="mt-1 text-[13px] text-white/90"
          >
            Use code <strong className="font-bold text-white">FRESH15</strong>
          </p>
        </div>

        <div className="mt-4 flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => onOpenEstimate(SERVICES[0].id, selectedAddOns)}
            className="rounded-full bg-white px-4 py-2 text-[12px] font-extrabold text-[#EF5A78] shadow-md hover:bg-white/95 active:scale-[0.97] transition-all cursor-pointer"
          >
            Claim Offer
          </button>

          <button
            type="button"
            onClick={handleCopyCode}
            style={{ backgroundColor: 'rgba(255,255,255,0.25)' }}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/40 px-3.5 py-2 text-[11px] font-bold text-white hover:bg-white/35 active:scale-[0.97] transition-all cursor-pointer backdrop-blur-xs"
          >
            <Copy className="h-3.5 w-3.5 stroke-[2.2] text-white" />
            <span>Copy code</span>
          </button>
        </div>
      </div>
    </div>
  )

  // 2. Your Next Clean Block
  const yourNextCleanBlock = (
    <div className="stagger-item rounded-[20px] bg-white p-4 shadow-[0_4px_16px_rgba(20,30,60,0.06)] border-l-4 border-l-[#EF5A78] border border-gray-100/60">
      <span className="block text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#EF5A78]">
        YOUR NEXT CLEAN
      </span>

      {booking ? (
        <div>
          <div className="mt-1 flex items-baseline justify-between">
            <h4 className="text-[15px] font-extrabold text-[#121A2B]">
              {booking.date} • {booking.time}
            </h4>
          </div>
          <p className="text-[12px] font-medium text-[#7A8194]">
            {booking.serviceTitle}
          </p>

          <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-2.5">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 overflow-hidden rounded-full ring-1 ring-white">
                <img
                  src="/images/cleaner-maria.jpg"
                  alt="Maria"
                  className="h-full w-full object-cover"
                />
              </div>
              <span className="text-[12px] font-bold text-[#121A2B]">
                Maria
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onOpenSchedule}
                className="rounded-full border border-[#F0EAE0] px-3 py-1 text-[11px] font-bold text-[#121A2B] hover:bg-gray-50 active:scale-[0.97] transition-all cursor-pointer"
              >
                Reschedule
              </button>
              <button
                type="button"
                onClick={() => {
                  if (onNavigateBookings) {
                    onNavigateBookings()
                  } else {
                    onShowToast('Booking Ref #LC-84920 is confirmed')
                  }
                }}
                className="rounded-full bg-[#EF5A78] px-3.5 py-1 text-[11px] font-bold text-white shadow-xs active:scale-[0.97] transition-all cursor-pointer"
              >
                Details
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-1.5 flex items-center justify-between gap-3">
          <div>
            <h4 className="text-[15px] font-extrabold text-[#121A2B]">
              No visits yet
            </h4>
            <p className="text-[11.5px] font-medium text-[#7A8194]">
              Schedule your home clean in under 60 seconds.
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenSchedule}
            className="shrink-0 rounded-full bg-[#EF5A78] px-3.5 py-2 text-[11.5px] font-extrabold text-white shadow-[0_3px_10px_rgba(239,90,120,0.3)] hover:brightness-105 active:scale-[0.97] transition-all cursor-pointer whitespace-nowrap"
          >
            Book your first clean
          </button>
        </div>
      )}
    </div>
  )

  // 3. How It Works Block
  const howItWorksBlock = (
    <div className="stagger-item flex flex-col justify-between h-full">
      <h3 className={`${isTablet ? 'text-[22px]' : 'text-[19px]'} font-extrabold text-[#121A2B]`}>
        How it works
      </h3>

      <div className="relative mt-3.5 rounded-[20px] bg-white p-4.5 shadow-[0_4px_16px_rgba(20,30,60,0.06)] border border-[#F0EAE0] flex-1 flex flex-col justify-center">
        {/* Connecting line behind icons */}
        <div
          className="absolute top-[38px] left-[18%] right-[18%] h-0.5 bg-gray-200"
          aria-hidden="true"
        />

        <div className="relative z-10 grid grid-cols-3 gap-2 text-center">
          {/* Step 1: Book */}
          <div className="flex flex-col items-center">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#FDE4EA] text-[#EF5A78] shadow-xs ring-4 ring-white">
              <Calendar className="h-5 w-5 stroke-[2.3]" />
            </div>
            <h4 className="mt-2 text-[13px] font-extrabold text-[#121A2B]">
              Book
            </h4>
            <p className="mt-0.5 text-[10.5px] font-medium leading-tight text-[#7A8194]">
              Choose time &amp; options
            </p>
          </div>

          {/* Step 2: We clean */}
          <div className="flex flex-col items-center">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#FFF1DE] text-[#D98A1E] shadow-xs ring-4 ring-white">
              <Sparkles className="h-5 w-5 stroke-[2.3]" />
            </div>
            <h4 className="mt-2 text-[13px] font-extrabold text-[#121A2B]">
              We clean
            </h4>
            <p className="mt-0.5 text-[10.5px] font-medium leading-tight text-[#7A8194]">
              Certified pros sanitize
            </p>
          </div>

          {/* Step 3: Enjoy */}
          <div className="flex flex-col items-center">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#E6F6EC] text-[#2E9E5B] shadow-xs ring-4 ring-white">
              <Home className="h-5 w-5 stroke-[2.3]" />
            </div>
            <h4 className="mt-2 text-[13px] font-extrabold text-[#121A2B]">
              Enjoy
            </h4>
            <p className="mt-0.5 text-[10.5px] font-medium leading-tight text-[#7A8194]">
              Relax in fresh home
            </p>
          </div>
        </div>
      </div>
    </div>
  )

  // 4. Why Choose Us Block
  const whyChooseUsBlock = (
    <div className="stagger-item rounded-[20px] bg-white p-5 shadow-[0_4px_16px_rgba(20,30,60,0.06)] border border-[#F0EAE0] flex flex-col justify-center h-full">
      <div className="grid grid-cols-3 divide-x divide-gray-100 text-center">
        {/* Stat 1 */}
        <div className="px-1">
          <span className="block text-[22px] font-extrabold text-[#EF5A78]">
            {countHomes}+
          </span>
          <span className="mt-0.5 block text-[11px] font-semibold text-[#7A8194]">
            Homes cleaned
          </span>
        </div>

        {/* Stat 2 */}
        <div className="px-1">
          <span className="block text-[22px] font-extrabold text-[#D98A1E]">
            {countRating}
          </span>
          <span className="mt-0.5 block text-[11px] font-semibold text-[#7A8194]">
            Average rating
          </span>
        </div>

        {/* Stat 3 */}
        <div className="px-1">
          <span className="block text-[22px] font-extrabold text-[#2E9E5B]">
            {countSat}%
          </span>
          <span className="mt-0.5 block text-[11px] font-semibold text-[#7A8194]">
            Satisfaction
          </span>
        </div>
      </div>
    </div>
  )

  // 5. Instant Price Widget Block
  const priceWidgetBlock = (
    <div className="stagger-item h-full flex flex-col justify-center">
      <HomeSizePriceWidget
        draft={bookingDraft}
        onUpdateDraft={onUpdateDraft}
        onBookThisSize={onBookThisSize}
        title="Get an instant price"
        subtitle="Choose your home size for certified Florida cleaning rates"
      />
    </div>
  )

  return (
    <div className={`text-[#121A2B] ${isTablet ? 'px-8 pt-4 space-y-6 max-w-full' : 'px-5 pt-3 space-y-6'} select-none pb-[calc(var(--bar-h)+16px+env(safe-area-inset-bottom))]`}>
      {/* Feature 7: Fort Myers Zip Code Service Checker */}
      <div className="stagger-item">
        <ZipChecker
          currentZip={bookingDraft?.zip}
          onZipChange={(newZip) => onUpdateDraft?.({ zip: newZip })}
          onShowToast={onShowToast}
        />
      </div>

      {/* 1. Hero Banner */}
      <div className={`stagger-item relative overflow-hidden rounded-[24px] bg-[#E8F3FA] ${isTablet ? 'h-[280px] p-8' : 'p-5'} shadow-[0_4px_16px_rgba(20,30,60,0.04)]`}>
        <div className={`relative z-10 ${isTablet ? 'max-w-[55%] flex flex-col justify-center h-full' : 'max-w-[58%]'}`}>
          <h2 className={`${isTablet ? 'text-[24px]' : 'text-[20px]'} font-extrabold leading-[1.25] text-[#121A2B]`}>
            What service do you need?
          </h2>

          <div className="mt-4 flex flex-col items-start gap-2.5">
            <div className="relative inline-block">
              <button
                type="button"
                onClick={() => onSelectService(SERVICES[0].id)}
                className="inline-flex items-center gap-1.5 rounded-full bg-[#EF5A78] px-5 py-2.5 text-[12.5px] font-extrabold text-white shadow-[0_4px_14px_rgba(239,90,120,0.35)] hover:brightness-105 active:scale-[0.96] transition-all cursor-pointer"
              >
                Get Started
                <ArrowRight className="h-3.5 w-3.5 stroke-[2.4]" />
              </button>
              <SparklesGroup />
            </div>

            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-[10.5px] font-bold text-[#3567C9] shadow-2xs backdrop-blur-xs">
              <ShieldCheck className="h-3.5 w-3.5 text-[#3567C9]" />
              Bonded &amp; Insured
            </span>
          </div>
        </div>

        {/* Cut-out photo of maid with cleaning supplies on right with pop-rotate entrance */}
        <div className={`animate-pop-rotate absolute -right-2 -bottom-2 ${isTablet ? 'h-[280px] w-[340px] rounded-tl-[48px]' : 'h-[155px] w-[145px] rounded-tl-[36px]'} overflow-hidden`}>
          <img
            src="/images/deep-cleaning.jpg"
            alt="Maid cleaning"
            className="h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#E8F3FA] via-transparent to-transparent" />
        </div>
      </div>

      {/* 2. Category Section (30% smaller icons, evenly spaced, opens Services screen) */}
      <div className="stagger-item">
        <div className="flex items-center justify-between">
          <h3 className={`${isTablet ? 'text-[22px]' : 'text-[17px]'} font-extrabold text-[#121A2B]`}>
            Category
          </h3>
          <button
            type="button"
            onClick={() => onViewAllServices('all')}
            className="text-[12.5px] font-bold text-[#EF5A78] hover:underline cursor-pointer"
          >
            See all
          </button>
        </div>

        <div className="mt-3 flex items-start justify-between">
          {categories.map(({ id, label, Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => onViewAllServices(id)}
              aria-label={`View ${label} services`}
              className="group flex min-h-[44px] min-w-[48px] flex-col items-center justify-center p-1 active:scale-[0.95] transition-transform duration-150 cursor-pointer focus:outline-none"
            >
              <div className="relative">
                <div className="flex h-[39px] w-[39px] items-center justify-center rounded-full border border-[#F0EAE0] bg-white text-[#7A8194] shadow-2xs group-hover:text-[#121A2B] group-hover:border-gray-300 transition-colors duration-150">
                  <Icon className="h-[17px] w-[17px] stroke-[1.9] text-[#7A8194] group-hover:text-[#121A2B] transition-colors duration-150" />
                </div>
              </div>
              <span className={`mt-[6px] ${isTablet ? 'text-[12px]' : 'text-[11px]'} font-semibold text-[#7A8194] leading-tight group-hover:text-[#121A2B] transition-colors duration-150`}>
                {label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 3. Recommended Section (3 cards per row on tablet, 2 on phone) */}
      <div className="stagger-item">
        <div className="flex items-center justify-between">
          <h3 className={`${isTablet ? 'text-[22px]' : 'text-[17px]'} font-extrabold text-[#121A2B]`}>
            Recommended
          </h3>
          <button
            type="button"
            onClick={() => onViewAllServices('all')}
            className="flex items-center gap-0.5 text-[13px] font-bold text-[#EF5A78] hover:underline cursor-pointer"
          >
            <span>See all</span>
            <ChevronRight className="h-3.5 w-3.5 stroke-[2.4]" />
          </button>
        </div>

        <div className={`mt-3.5 grid ${isTablet ? 'grid-cols-3 gap-4' : 'grid-cols-2 gap-3'}`}>
          {SERVICES.slice(0, isTablet ? 3 : 2).map((service) => (
            <div
              key={service.id}
              onClick={() => onSelectService(service.id)}
              className="group flex flex-col justify-between rounded-[20px] bg-white p-2.5 shadow-[0_4px_16px_rgba(20,30,60,0.06)] hover:shadow-[0_6px_20px_rgba(20,30,60,0.09)] active:scale-[0.97] transition-all cursor-pointer"
            >
              <div>
                {/* Photo with overlaid rating and discount chips */}
                <div
                  className={`relative ${isTablet ? 'h-[140px]' : 'h-[110px]'} w-full overflow-hidden rounded-[14px] bg-gradient-to-br ${service.fallback}`}
                >
                  <img
                    src={service.image}
                    alt={service.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />

                  {/* Overlaid rating chip at top-left */}
                  <span className="absolute top-2 left-2 inline-flex items-center gap-0.5 rounded-full bg-[#FFF1DE]/95 px-1.5 py-0.5 text-[10px] font-bold text-[#D98A1E] shadow-2xs backdrop-blur-xs">
                    <Star className="h-2.5 w-2.5 fill-[#D98A1E] text-[#D98A1E]" />
                    {service.rating}
                  </span>

                  {/* Overlaid discount chip at top-right */}
                  {service.discount && (
                    <span className="absolute top-2 right-2 inline-flex items-center rounded-full bg-[#FDE4EA]/95 px-1.5 py-0.5 text-[10px] font-bold text-[#EF5A78] shadow-2xs backdrop-blur-xs">
                      {service.discount}
                    </span>
                  )}
                </div>

                {/* Bold title with fixed 2-line min-height so cards align */}
                <h4 className={`mt-2.5 min-h-[36px] flex items-start ${isTablet ? 'text-[16px]' : 'text-[14px]'} font-extrabold leading-[1.25] text-[#121A2B]`}>
                  {service.title}
                </h4>

                {/* Gray 11px subtitle on one line */}
                <p className="mt-0.5 truncate text-[11px] font-medium text-[#7A8194]">
                  {service.subtitle}
                </p>
              </div>

              {/* Bottom row: Price on left and View > on right */}
              <div className="mt-3 flex items-center justify-between pt-2 border-t border-gray-100">
                <div className="flex items-baseline gap-0.5">
                  <span className={`${isTablet ? 'text-[16px]' : 'text-[15px]'} font-extrabold text-[#EF5A78]`}>
                    ${service.hourlyRate}
                  </span>
                  <span className="text-[11px] font-semibold text-[#7A8194]">
                    /h
                  </span>
                </div>

                <div className="flex items-center gap-0.5 text-[11.5px] font-extrabold text-[#EF5A78]">
                  <span>View</span>
                  <ChevronRight className="h-3 w-3 stroke-[2.4]" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Landscape 2-column or Portrait 1-column grouping for Offer & How it works */}
      {isTablet && isLandscape ? (
        <div className="grid grid-cols-2 gap-5 items-stretch">
          {offerBannerBlock}
          {howItWorksBlock}
        </div>
      ) : (
        <>
          {offerBannerBlock}
          {yourNextCleanBlock}
          {howItWorksBlock}
        </>
      )}

      {/* Your Next Clean in landscape */}
      {isTablet && isLandscape && yourNextCleanBlock}

      {/* Feature 1: Before & After Clean Slider */}
      <div className="stagger-item">
        <BeforeAfterSlider
          scene="kitchen"
          title="See the difference"
          subtitle="Swipe to reveal the deep clean shine"
        />
      </div>

      {/* Landscape 2-column or Portrait 1-column grouping for Why choose us & Instant price widget */}
      {isTablet && isLandscape ? (
        <div className="grid grid-cols-2 gap-5 items-stretch">
          {whyChooseUsBlock}
          {priceWidgetBlock}
        </div>
      ) : (
        <>
          {whyChooseUsBlock}
          {priceWidgetBlock}
        </>
      )}

      {/* SECTION 5: Add-ons (4-column grid on tablet, 2x2 grid on phone) */}
      <div className="stagger-item">
        <div className="flex items-center justify-between">
          <h3 className={`${isTablet ? 'text-[22px]' : 'text-[17px]'} font-extrabold text-[#121A2B]`}>
            Add-ons
          </h3>
          <span className="text-[11.5px] font-medium text-[#7A8194]">
            {selectedAddOns.length > 0
              ? `${selectedAddOns.length} selected`
              : 'Tap to customize'}
          </span>
        </div>

        <div className={`mt-3 grid ${isTablet ? 'grid-cols-4 gap-3.5' : 'grid-cols-2 gap-2.5'}`}>
          {ADD_ONS_DATA.map(({ id, name, price, value, Icon, bg, fg }) => {
            const isSelected = selectedAddOns.includes(value)
            return (
              <div
                key={id}
                onClick={() => handleToggleAddOn(value)}
                className={`group flex cursor-pointer items-center justify-between rounded-[20px] p-3 shadow-xs active:scale-[0.97] transition-all border ${
                  isSelected
                    ? 'border-[#EF5A78] bg-[#FDE4EA]/35 shadow-[0_2px_10px_rgba(239,90,120,0.18)]'
                    : 'border-[#F0EAE0] bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${bg} ${fg}`}
                  >
                    <Icon className="h-4.5 w-4.5 stroke-[2.2]" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="truncate text-[12.5px] font-extrabold text-[#121A2B]">
                      {name}
                    </h4>
                    <span className="text-[11.5px] font-extrabold text-[#EF5A78]">
                      {price}
                    </span>
                  </div>
                </div>

                {/* Check circle indicator */}
                <div
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full transition-all ${
                    isSelected
                      ? 'bg-[#EF5A78] text-white shadow-2xs'
                      : 'border border-gray-300 bg-white'
                  }`}
                >
                  {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* SECTION 6: Meet Our Cleaners (1 row without scroll on tablet, horizontal scroll on mobile) */}
      <div className="stagger-item">
        <h3 className={`${isTablet ? 'text-[22px]' : 'text-[17px]'} font-extrabold text-[#121A2B]`}>
          Meet our cleaners
        </h3>

        <div className={`mt-3 ${isTablet ? 'grid grid-cols-4 gap-4 overflow-x-visible' : 'flex gap-3 overflow-x-auto no-scrollbar pb-1 -mx-5 px-5'}`}>
          {CLEANERS_DATA.map((cleaner) => (
            <button
              key={cleaner.id}
              type="button"
              onClick={() => setActiveCleaner(cleaner)}
              className={`flex ${isTablet ? 'w-full flex-col items-center justify-center rounded-2xl bg-white p-3 border border-[#F0EAE0] shadow-xs' : 'shrink-0 flex-col items-center'} active:scale-[0.96] transition-transform cursor-pointer focus:outline-none`}
            >
              <div className="relative h-[72px] w-[72px] overflow-hidden rounded-full ring-2 ring-white shadow-md">
                <img
                  src={cleaner.image}
                  alt={cleaner.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <span className="mt-1.5 text-[12px] font-extrabold text-[#121A2B]">
                {cleaner.name}
              </span>
              <span className="flex items-center gap-0.5 text-[11px] font-bold text-[#D98A1E]">
                <Star className="h-3 w-3 fill-[#D98A1E] text-[#D98A1E]" />
                {cleaner.rating}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* In-Frame Cleaner Profile Bottom Sheet (Portaled via BottomSheet) */}
      <CleanerProfileSheet
        cleaner={activeCleaner}
        isOpen={Boolean(activeCleaner)}
        onClose={() => setActiveCleaner(null)}
        onRequestCleaner={(cleanerName) => {
          setActiveCleaner(null)
          onShowToast(`${cleanerName} requested for your next clean!`)
          onOpenEstimate(SERVICES[0].id, selectedAddOns, cleanerName)
        }}
      />
    </div>
  )
}
