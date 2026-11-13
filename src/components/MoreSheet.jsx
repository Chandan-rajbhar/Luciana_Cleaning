import React from 'react'
import {
  Calendar,
  Info,
  PhoneCall,
  HelpCircle,
  Settings,
  ChevronRight,
  X,
} from 'lucide-react'
import { SheetBubbles } from './VisualEffects'

/**
 * In-frame bottom sheet triggered by the "More" tab.
 * Contains rows for: My Bookings, About Us, Contact, Help, and Settings.
 */
export default function MoreSheet({ isOpen, onClose, onNavigate }) {
  if (!isOpen) return null

  const items = [
    {
      id: 'my-bookings',
      title: 'My Bookings',
      desc: 'View upcoming visits & clean history',
      Icon: Calendar,
      iconBg: 'bg-[#FDE4EA]',
      iconFg: 'text-[#EF5A78]',
    },
    {
      id: 'about',
      title: 'About Us',
      desc: 'Our Fort Myers crew & values',
      Icon: Info,
      iconBg: 'bg-[#E6EEFB]',
      iconFg: 'text-[#3567C9]',
    },
    {
      id: 'contact',
      title: 'Contact & Support',
      desc: 'Call (239) 555-0189 or message dispatch',
      Icon: PhoneCall,
      iconBg: 'bg-[#E6F6EC]',
      iconFg: 'text-[#2E9E5B]',
    },
    {
      id: 'help',
      title: 'Help & FAQ',
      desc: 'Cancellation policy, supplies & keys',
      Icon: HelpCircle,
      iconBg: 'bg-[#FFF1DE]',
      iconFg: 'text-[#D98A1E]',
    },
    {
      id: 'settings',
      title: 'Settings',
      desc: 'Notifications, language & preferences',
      Icon: Settings,
      iconBg: 'bg-[#F4F1FB]',
      iconFg: 'text-[#7E57C2]',
    },
  ]

  return (
    <div
      className="absolute inset-0 z-40 flex flex-col justify-end"
      role="dialog"
      aria-modal="true"
      aria-labelledby="more-sheet-title"
    >
      <div
        onClick={onClose}
        className="animate-backdrop-in absolute inset-0 bg-black/45 backdrop-blur-xs"
        aria-hidden="true"
      />

      <div className="animate-sheet-up relative z-10 w-full rounded-t-[28px] bg-white p-5 pb-[calc(1.5rem+env(safe-area-inset-bottom))] md:pb-6 shadow-[0_-12px_40px_rgba(20,30,60,0.18)] overflow-hidden">
        <SheetBubbles />
        {/* Grab handle */}
        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-gray-200" aria-hidden="true" />

        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div>
            <h2 id="more-sheet-title" className="text-[17px] font-extrabold text-[#121A2B]">
              More Options
            </h2>
            <p className="text-[11.5px] font-medium text-[#7A8194]">
              Luciana Cleaning Services • Fort Myers
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FAF6F0] text-[#7A8194] hover:text-[#121A2B] active:scale-[0.96] transition-all"
          >
            <X className="h-4 w-4 stroke-[2.4]" />
          </button>
        </div>

        <div className="mt-3 space-y-2">
          {items.map(({ id, title, desc, Icon, iconBg, iconFg }) => (
            <button
              key={id}
              type="button"
              onClick={() => onNavigate(id)}
              className="flex w-full items-center justify-between gap-3.5 rounded-2xl p-3 text-left hover:bg-[#FAF6F0]/80 active:scale-[0.985] transition-all"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${iconBg} ${iconFg}`}
                >
                  <Icon className="h-5 w-5 stroke-[2.2]" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-[13.5px] font-extrabold text-[#121A2B]">
                    {title}
                  </h3>
                  <p className="truncate text-[11px] font-medium text-[#7A8194]">
                    {desc}
                  </p>
                </div>
              </div>

              <ChevronRight className="h-4 w-4 shrink-0 text-[#7A8194]" />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
