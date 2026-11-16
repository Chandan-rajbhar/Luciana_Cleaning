import React, { useState } from 'react'
import {
  HelpCircle,
  ChevronDown,
  PhoneCall,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Clock,
  KeyRound,
  FileCheck,
  CreditCard,
} from 'lucide-react'

/**
 * Screen: Help & FAQ
 * - Accessible from SideMenu and Profile
 * - Accordion FAQ cards with smooth expand/collapse
 * - Quick contact options: Call dispatch, Message crew
 */
export default function HelpScreen({
  onNavigateContact,
  onOpenChat,
  onOpenCall,
  onShowToast,
}) {
  const [openFaq, setOpenFaq] = useState(0)

  const faqs = [
    {
      q: 'Do I need to provide cleaning supplies?',
      a: "No! Luciana's certified team brings all commercial hospital-grade, eco-friendly supplies, clean microfiber cloths, mops, and HEPA vacuums. If you prefer us to use a special product for your delicate surfaces, just leave it out with a note.",
      icon: Sparkles,
      iconBg: 'bg-[#FDE4EA]',
      iconFg: 'text-[#EF5A78]',
    },
    {
      q: 'What is your cancellation and rescheduling policy?',
      a: 'Free cancellation or rescheduling up to 24 hours prior to appointment time. Cleaners are reserved specifically for your slot. Cancellations within 24 hours may incur a small $25 dispatch fee.',
      icon: Clock,
      iconBg: 'bg-[#FFF1DE]',
      iconFg: 'text-[#D98A1E]',
    },
    {
      q: 'Are your cleaners bonded & insured?',
      a: 'Yes, 100%. Every Luciana specialist is thoroughly vetted, background-checked, insured, and backed by our 100% satisfaction guarantee. If anything is missed, we return within 24 hours free of charge.',
      icon: ShieldCheck,
      iconBg: 'bg-[#E6F6EC]',
      iconFg: 'text-[#2E9E5B]',
    },
    {
      q: 'How does home entry & keys work?',
      a: 'You can greet your cleaner at the door or leave lockbox, door code, or smart lock instructions in your booking notes. All codes are securely encrypted and deleted after the appointment.',
      icon: KeyRound,
      iconBg: 'bg-[#E6EEFB]',
      iconFg: 'text-[#3567C9]',
    },
    {
      q: 'How and when do I pay for my cleaning?',
      a: 'Payment is securely pre-authorized upon booking and only charged once your clean is completed and you are completely satisfied. We accept Apple Pay, Google Pay, and all major credit cards.',
      icon: CreditCard,
      iconBg: 'bg-[#F4F1FB]',
      iconFg: 'text-[#7E57C2]',
    },
    {
      q: 'What if I need special focus on specific areas?',
      a: 'You can add customizable notes (e.g., focus on oven interior, change bed linens, sanitize patio) in the booking note selector or message Luciana directly in the Chat tab before arrival.',
      icon: FileCheck,
      iconBg: 'bg-[#FDE4EA]',
      iconFg: 'text-[#EF5A78]',
    },
  ]

  return (
    <div className="flex flex-col text-[#121A2B] px-4 md:px-8 pt-3 md:pt-4 pb-[calc(var(--bar-h)+24px+env(safe-area-inset-bottom))] space-y-4 max-w-[720px] mx-auto w-full">
      {/* Intro Header Card */}
      <div className="relative overflow-hidden rounded-[24px] bg-white p-5 shadow-[0_4px_16px_rgba(20,30,60,0.06)] border border-[#F0EAE0] stagger-item">
        <div className="flex items-center gap-3.5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#FFF1DE] text-[#D98A1E] shadow-xs">
            <HelpCircle className="h-6 w-6 stroke-[2.2]" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#EF5A78]">
              HELP CENTER
            </span>
            <h2 className="text-[17px] font-extrabold text-[#121A2B] leading-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-[11.5px] font-medium text-[#7A8194]">
              Everything you need to know about our services
            </p>
          </div>
        </div>
      </div>

      {/* FAQ Accordion List */}
      <div className="space-y-3">
        {faqs.map((faq, index) => {
          const isOpen = openFaq === index
          const Icon = faq.icon
          return (
            <div
              key={faq.q}
              className="overflow-hidden rounded-[20px] bg-white border border-[#F0EAE0] shadow-[0_2px_10px_rgba(20,30,60,0.04)] transition-all"
            >
              <button
                type="button"
                onClick={() => setOpenFaq(isOpen ? null : index)}
                className="flex w-full items-center justify-between p-4 text-left cursor-pointer active:bg-[#FAF6F0]"
                aria-expanded={isOpen}
              >
                <div className="flex items-center gap-3 pr-2 min-w-0">
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${faq.iconBg} ${faq.iconFg}`}
                  >
                    <Icon className="h-4 w-4 stroke-[2.2]" />
                  </div>
                  <span className="text-[13.5px] font-bold text-[#121A2B] leading-snug">
                    {faq.q}
                  </span>
                </div>
                <ChevronDown
                  className={`h-4 w-4 shrink-0 text-[#7A8194] transition-transform duration-200 ${
                    isOpen ? 'rotate-180 text-[#EF5A78]' : ''
                  }`}
                />
              </button>
              {isOpen && (
                <div className="border-t border-[#F0EAE0] bg-[#FAF6F0]/60 px-4 py-3 text-[12px] font-medium leading-relaxed text-[#5A6275]">
                  {faq.a}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Still Have Questions Card */}
      <div className="rounded-[24px] bg-gradient-to-br from-white to-[#FAF6F0] p-5 border border-[#F0EAE0] shadow-[0_4px_16px_rgba(20,30,60,0.05)] text-center">
        <h3 className="text-[15px] font-extrabold text-[#121A2B]">
          Still have questions?
        </h3>
        <p className="mt-1 text-[12px] font-medium text-[#7A8194]">
          Our Fort Myers support team is available Mon-Sat, 8 AM - 6 PM.
        </p>
        <div className="mt-4 flex gap-2.5">
          <button
            type="button"
            onClick={onOpenChat}
            className="flex-1 flex items-center justify-center gap-1.5 rounded-full border border-[#F0EAE0] bg-white py-3 text-[12.5px] font-extrabold text-[#121A2B] shadow-xs hover:border-[#EF5A78] hover:text-[#EF5A78] active:scale-[0.98] transition-all cursor-pointer"
          >
            <MessageCircle className="h-4 w-4 stroke-[2.2] text-[#EF5A78]" />
            <span>Chat Crew</span>
          </button>
          <button
            type="button"
            onClick={onOpenCall}
            className="flex-1 flex items-center justify-center gap-1.5 rounded-full bg-[#EF5A78] py-3 text-[12.5px] font-extrabold text-white shadow-[0_4px_12px_rgba(239,90,120,0.3)] hover:brightness-105 active:scale-[0.98] transition-all cursor-pointer"
          >
            <PhoneCall className="h-4 w-4 stroke-[2.2]" />
            <span>Call (239) 555</span>
          </button>
        </div>
      </div>
    </div>
  )
}

