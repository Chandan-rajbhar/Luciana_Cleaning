import React from 'react'
import { ShieldCheck, X } from 'lucide-react'
import BottomSheet from './BottomSheet'

/**
 * Cleaner Profile Bottom Sheet:
 * - Uses shared BottomSheet with portal into #sheet-portal
 * - (a) Fixed top with grab handle, cleaner avatar, name, vetted badge, experience, close button
 * - (b) Scrollable middle area with specialty card and certifications
 * - (c) Fixed footer with "Request {cleaner.name}" button, safe area padding
 * - The Request button is ALWAYS fully visible without scrolling
 */
export default function CleanerProfileSheet({
  cleaner,
  isOpen = false,
  onClose,
  onRequestCleaner,
}) {
  if (!cleaner) return null

  const headerContent = (
    <div className="flex items-start justify-between">
      <div className="flex items-center gap-3">
        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full ring-3 ring-[#FDE4EA] shadow-md">
          <img
            src={cleaner.image}
            alt={cleaner.name}
            className="h-full w-full object-cover"
          />
        </div>
        <div>
          <h4
            id="cleaner-sheet-title"
            className="text-[17px] font-extrabold text-[#121A2B]"
          >
            {cleaner.name}
          </h4>
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#2E9E5B]">
            <ShieldCheck className="h-3.5 w-3.5 stroke-[2.4]" />
            Vetted and background checked
          </span>
          <p className="text-[11px] font-semibold text-[#7A8194] mt-0.5">
            {cleaner.experience} • {cleaner.cleans} cleans
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onClose}
        aria-label="Close cleaner sheet"
        className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#7A8194] shadow-xs active:scale-[0.94] transition-all cursor-pointer"
      >
        <X className="h-4 w-4 stroke-[2.4]" />
      </button>
    </div>
  )

  const footerContent = (
    <div className="space-y-1.5">
      <button
        type="button"
        onClick={() => onRequestCleaner?.(cleaner.name)}
        className="flex min-h-[46px] w-full items-center justify-center gap-2 rounded-full bg-[#EF5A78] py-3 text-[13.5px] font-extrabold text-white shadow-[0_6px_20px_rgba(239,90,120,0.38)] hover:brightness-105 active:scale-[0.97] transition-all cursor-pointer"
      >
        Request {cleaner.name}
      </button>
      <p className="text-center text-[10.5px] font-semibold text-[#7A8194]">
        100% Satisfaction Guaranteed • Certified Specialist
      </p>
    </div>
  )

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title={cleaner.name}
      ariaLabel={`Profile details for cleaner ${cleaner.name}`}
      header={headerContent}
      footer={footerContent}
      contentClassName="px-5 py-4 space-y-3.5"
    >
      {/* Specialty Card */}
      <div className="rounded-2xl bg-white p-3.5 shadow-xs border border-gray-100">
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#EF5A78]">
          SPECIALTY
        </span>
        <p className="mt-0.5 text-[12px] font-medium leading-relaxed text-[#121A2B]">
          {cleaner.specialty}. Certified in hospital-grade non-toxic sanitizing for Florida residences.
        </p>
      </div>

      {/* Certification Highlights */}
      <div className="rounded-2xl bg-white p-3.5 shadow-xs border border-gray-100">
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#EF5A78]">
          STANDARDS &amp; TRAINING
        </span>
        <ul className="mt-1 space-y-1.5 text-[11.5px] font-medium text-[#121A2B]">
          <li className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#EF5A78]" />
            50+ point room-by-room checklist
          </li>
          <li className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#EF5A78]" />
            Eco-friendly non-toxic supplies
          </li>
          <li className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#EF5A78]" />
            Pet-safe and allergen-conscious sanitation
          </li>
        </ul>
      </div>
    </BottomSheet>
  )
}
