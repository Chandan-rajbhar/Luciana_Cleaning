import React, { useState } from 'react'
import {
  ChevronLeft,
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  ShieldCheck,
  ChevronRight,
  MessageCircle,
} from 'lucide-react'
import {
  BUSINESS_EMAIL,
  BUSINESS_LOCATION,
  BUSINESS_PHONE,
  BUSINESS_PHONE_RAW,
} from '../data/services'

/**
 * Screen: Contact & Support (Coral & Cream style)
 * Clean, modern layout matching the reference system:
 * - Header: circular back button, title "Contact & Support", green "Open Today" pill
 * - Quick contact action cards (Call, Email, Chat, Office)
 * - Fort Myers service coverage info card (no map / no live tracking)
 * - Interactive inquiry form with coral submit button triggering an in-frame toast
 */
export default function ContactScreen({
  onBack,
  onOpenCallDialog,
  onOpenChat,
  onShowToast,
}) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const handleCopyEmail = () => {
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(BUSINESS_EMAIL).catch(() => {})
    }
    onShowToast(`Copied ${BUSINESS_EMAIL}`)
  }

  const handleSend = (e) => {
    e.preventDefault()
    if (!name.trim() || !message.trim()) {
      onShowToast('Please fill in your name and message.', 'error')
      return
    }
    setName('')
    setEmail('')
    setMessage('')
    onShowToast("Message sent! Luciana's team will reply shortly.")
  }

  return (
    <div className="flex flex-col text-[#121A2B] px-4 md:px-8 pt-3 md:pt-4 pb-[calc(var(--bar-h)+24px+env(safe-area-inset-bottom))] space-y-5 max-w-[720px] mx-auto w-full">
      {/* Direct Contact Cards */}
      <div className="divide-y divide-gray-100 rounded-[24px] bg-white px-5 py-1 shadow-[0_4px_16px_rgba(20,30,60,0.06)] stagger-item">
          {/* Call Row */}
          <div className="flex items-center justify-between gap-3 py-3.5">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#FDE4EA] text-[#EF5A78]">
                <Phone className="h-4 w-4 stroke-[2.3]" />
              </div>
              <div className="min-w-0">
                <span className="block text-[9.5px] font-bold uppercase tracking-[0.14em] text-[#7A8194]">
                  CALL DIRECT
                </span>
                <span className="block text-[13.5px] font-extrabold text-[#121A2B]">
                  {BUSINESS_PHONE}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onOpenCallDialog}
              className="shrink-0 rounded-full bg-[#EF5A78] px-4 py-1.5 text-[12px] font-extrabold text-white shadow-[0_3px_10px_rgba(239,90,120,0.35)] hover:brightness-105 active:scale-[0.96] transition-all"
            >
              Call
            </button>
          </div>

          {/* Chat Row */}
          <div className="flex items-center justify-between gap-3 py-3.5">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#E6F6EC] text-[#2E9E5B]">
                <MessageCircle className="h-4 w-4 stroke-[2.3]" />
              </div>
              <div className="min-w-0">
                <span className="block text-[9.5px] font-bold uppercase tracking-[0.14em] text-[#7A8194]">
                  LIVE CREW CHAT
                </span>
                <span className="block text-[13.5px] font-extrabold text-[#121A2B]">
                  Luciana R. • Lead Cleaner
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onOpenChat}
              className="shrink-0 rounded-full bg-[#2E9E5B] px-4 py-1.5 text-[12px] font-extrabold text-white shadow-[0_3px_10px_rgba(46,158,91,0.3)] hover:brightness-105 active:scale-[0.96] transition-all"
            >
              Chat
            </button>
          </div>

          {/* Email Row */}
          <button
            type="button"
            onClick={handleCopyEmail}
            className="flex w-full items-center justify-between gap-3 py-3.5 text-left hover:opacity-85 active:scale-[0.99] transition-all"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#FFF1DE] text-[#D98A1E]">
                <Mail className="h-4 w-4 stroke-[2.3]" />
              </div>
              <div className="min-w-0">
                <span className="block text-[9.5px] font-bold uppercase tracking-[0.14em] text-[#7A8194]">
                  EMAIL US
                </span>
                <span className="block truncate text-[13px] font-bold text-[#121A2B]">
                  {BUSINESS_EMAIL}
                </span>
              </div>
            </div>
            <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[10.5px] font-semibold text-[#7A8194]">
              Copy
            </span>
          </button>

          {/* Office Location Row */}
          <div className="flex items-center gap-3 py-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#E6EEFB] text-[#3567C9]">
              <MapPin className="h-4 w-4 stroke-[2.3]" />
            </div>
            <div className="min-w-0">
              <span className="block text-[9.5px] font-bold uppercase tracking-[0.14em] text-[#7A8194]">
                DISPATCH HUB
              </span>
              <span className="block text-[13px] font-bold text-[#121A2B]">
                {BUSINESS_LOCATION}
              </span>
            </div>
          </div>
        </div>

        {/* Clean Service Coverage Card (No Map Graphic) */}
        <div className="rounded-[24px] bg-white p-5 shadow-[0_4px_16px_rgba(20,30,60,0.06)] border border-[#F0EAE0] stagger-item">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#FDE4EA] text-[#EF5A78]">
                <MapPin className="h-4 w-4 stroke-[2.4]" />
              </span>
              <h2 className="text-[14.5px] font-extrabold text-[#121A2B]">
                Service Coverage Area
              </h2>
            </div>
            <span className="rounded-full bg-[#E6EEFB] px-2.5 py-0.5 text-[10.5px] font-bold text-[#3567C9]">
              Lee County
            </span>
          </div>

          <p className="mt-2 text-[12px] font-medium leading-relaxed text-[#7A8194]">
            Prompt residential &amp; commercial cleaning throughout Fort Myers, Cape Coral, Estero, Bonita Springs, and Sanibel.
          </p>

          <div className="mt-3.5 grid grid-cols-2 gap-2 border-t border-gray-100 pt-3">
            <div className="rounded-xl bg-[#FAF6F0] p-2.5">
              <div className="flex items-center gap-1.5 text-[10.5px] font-bold uppercase text-[#7A8194]">
                <Clock className="h-3.5 w-3.5 text-[#D98A1E]" />
                Operating Hours
              </div>
              <p className="mt-0.5 text-[12px] font-extrabold text-[#121A2B]">
                Mon–Sat: 7am–7pm
              </p>
            </div>

            <div className="rounded-xl bg-[#FAF6F0] p-2.5">
              <div className="flex items-center gap-1.5 text-[10.5px] font-bold uppercase text-[#7A8194]">
                <ShieldCheck className="h-3.5 w-3.5 text-[#2E9E5B]" />
                Guaranteed
              </div>
              <p className="mt-0.5 text-[12px] font-extrabold text-[#121A2B]">
                Bonded &amp; Insured
              </p>
            </div>
          </div>
        </div>

        {/* Quick Message Form */}
        <div className="rounded-[24px] bg-white p-5 shadow-[0_4px_16px_rgba(20,30,60,0.06)] stagger-item">
          <span className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#EF5A78]">
            DIRECT INQUIRY
          </span>
          <h2 className="mt-0.5 text-[15px] font-extrabold text-[#121A2B]">
            Send Us a Message
          </h2>
          <p className="mt-0.5 text-[11.5px] font-medium text-[#7A8194]">
            Need a custom schedule or specific request? We respond within 15 minutes.
          </p>

          <form onSubmit={handleSend} className="mt-3.5 space-y-2.5">
            <input
              type="text"
              aria-label="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Name *"
              className="w-full rounded-xl border border-gray-200 bg-[#FAF6F0]/70 px-3.5 py-2.5 text-[13px] font-medium text-[#121A2B] placeholder:text-[#7A8194] focus:border-[#EF5A78] focus:bg-white focus:outline-none transition-all"
            />
            <input
              type="email"
              aria-label="Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address (optional)"
              className="w-full rounded-xl border border-gray-200 bg-[#FAF6F0]/70 px-3.5 py-2.5 text-[13px] font-medium text-[#121A2B] placeholder:text-[#7A8194] focus:border-[#EF5A78] focus:bg-white focus:outline-none transition-all"
            />
            <textarea
              rows={2}
              aria-label="Your Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="How can we help your home? *"
              className="w-full resize-none rounded-xl border border-gray-200 bg-[#FAF6F0]/70 px-3.5 py-2.5 text-[13px] font-medium text-[#121A2B] placeholder:text-[#7A8194] focus:border-[#EF5A78] focus:bg-white focus:outline-none transition-all"
            />
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-full bg-[#EF5A78] py-3 text-[13px] font-extrabold text-white shadow-[0_4px_14px_rgba(239,90,120,0.35)] hover:brightness-105 active:scale-[0.97] transition-all"
            >
              <Send className="h-3.5 w-3.5 stroke-[2.4]" />
              Send Message
            </button>
          </form>
        </div>
    </div>
  )
}
