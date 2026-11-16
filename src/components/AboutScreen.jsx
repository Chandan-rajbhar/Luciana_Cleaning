import React from 'react'
import { ChevronLeft, Award, ShieldCheck, Sparkles, Heart, ArrowRight } from 'lucide-react'
import { CLEANER_SPECIALIST } from '../data/services'

/**
 * Screen: About Us
 * - Header: Back button, centered title "About Us", heart button.
 * - Warm introduction card with specialist photo and mission.
 * - 3 Value cards with tinted icons: Honest & Transparent, Experienced Professionals, Eco-Friendly & Improving.
 * - Maid Service Promise card with coral action button.
 */
export default function AboutScreen({ onBack, onBookClean }) {
  const values = [
    {
      title: 'Honest & Transparent',
      desc: 'Upfront rates, zero hidden fees, and respect for your sanctuary.',
      Icon: ShieldCheck,
      bg: 'bg-[#FDE4EA]',
      fg: 'text-[#EF5A78]',
    },
    {
      title: 'Experienced Professionals',
      desc: 'Certified maids trained to strict 5-star hospital-grade standards.',
      Icon: Award,
      bg: 'bg-[#FFF1DE]',
      fg: 'text-[#D98A1E]',
    },
    {
      title: 'Always Improving',
      desc: 'Non-toxic eco solutions that protect Florida families and pets.',
      Icon: Sparkles,
      bg: 'bg-[#E6EEFB]',
      fg: 'text-[#3567C9]',
    },
  ]

  return (
    <div className="flex flex-col text-[#121A2B] px-4 md:px-8 pt-3 md:pt-4 pb-[calc(var(--bar-h)+24px+env(safe-area-inset-bottom))] space-y-5 max-w-[720px] mx-auto w-full">
      {/* Intro Card */}
      <div className="relative overflow-hidden rounded-[24px] bg-white p-5 shadow-[0_4px_16px_rgba(20,30,60,0.06)] stagger-item">
          <div className="flex items-center gap-3.5">
            <div className="h-14 w-14 shrink-0 overflow-hidden rounded-full ring-2 ring-[#FDE4EA] animate-pop-rotate">
              <img
                src={CLEANER_SPECIALIST.image}
                alt="Luciana"
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#EF5A78]">
                EST. FORT MYERS, FL
              </span>
              <h2 className="text-[17px] font-extrabold text-[#121A2B]">
                Why Choose Luciana?
              </h2>
              <p className="text-[11.5px] font-medium text-[#7A8194]">
                Dedicated home care across Lee County &amp; Cape Coral.
              </p>
            </div>
          </div>
        </div>

        {/* 3 Value Cards */}
        <div className="space-y-3">
          {values.map(({ title, desc, Icon, bg, fg }) => (
            <div
              key={title}
              className="flex items-start gap-3.5 rounded-[20px] bg-white p-4 shadow-[0_4px_16px_rgba(20,30,60,0.06)] stagger-item"
            >
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${bg} ${fg}`}
              >
                <Icon className="h-5 w-5 stroke-[2.2]" />
              </div>
              <div className="min-w-0">
                <h3 className="text-[14px] font-extrabold text-[#121A2B]">{title}</h3>
                <p className="mt-1 text-[12px] font-medium leading-relaxed text-[#7A8194]">
                  {desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Promise Card */}
        <div className="rounded-[24px] bg-white p-5 text-center shadow-[0_4px_16px_rgba(20,30,60,0.06)] border border-[#F0EAE0] stagger-item">
          <span className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#D98A1E]">
            MAID SERVICE PROMISE
          </span>

          <p className="mt-2 text-[13px] font-medium leading-relaxed text-[#121A2B]">
            &ldquo;We treat every residence in Fort Myers like it&apos;s our very own family&apos;s home.&rdquo;
          </p>

          <button
            type="button"
            onClick={onBookClean}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-[#EF5A78] px-5 py-3 text-[13.5px] font-extrabold text-white shadow-[0_4px_14px_rgba(239,90,120,0.35)] hover:brightness-105 active:scale-[0.97] transition-all"
          >
            Book a Clean Today
            <ArrowRight className="h-4 w-4 stroke-[2.4]" />
          </button>
        </div>
    </div>
  )
}
