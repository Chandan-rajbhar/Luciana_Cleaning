import React from 'react'
import {
  Calendar,
  Heart,
  CreditCard,
  MapPin,
  Settings,
  LogOut,
  ChevronRight,
  ShieldCheck,
  Phone,
} from 'lucide-react'
import { USER_PROFILE } from '../data/services'

/**
 * Screen: Profile
 * Opened via the header Profile icon.
 * Features:
 * - Large avatar, name, email & verified badge
 * - List of rows: My Bookings, Saved Services, Payment Methods, Addresses, Settings, Log Out
 */
export default function ProfileScreen({
  user = USER_PROFILE,
  onNavigateBookings,
  onShowToast,
}) {
  const profileRows = [
    {
      id: 'bookings',
      label: 'My Bookings',
      desc: 'Active & previous cleaning visits',
      Icon: Calendar,
      iconBg: 'bg-[#FDE4EA]',
      iconFg: 'text-[#EF5A78]',
      action: onNavigateBookings,
    },
    {
      id: 'saved',
      label: 'Saved Services',
      desc: '2 favorite packages in Fort Myers',
      Icon: Heart,
      iconBg: 'bg-[#FFF1DE]',
      iconFg: 'text-[#D98A1E]',
      action: () => onShowToast('2 services saved in your favorites.'),
    },
    {
      id: 'payment',
      label: 'Payment Methods',
      desc: 'Apple Pay •••• 4291 default',
      Icon: CreditCard,
      iconBg: 'bg-[#E6EEFB]',
      iconFg: 'text-[#3567C9]',
      action: () => onShowToast('Primary payment: Apple Pay (Connected)'),
    },
    {
      id: 'addresses',
      label: 'Service Addresses',
      desc: user.location,
      Icon: MapPin,
      iconBg: 'bg-[#E6F6EC]',
      iconFg: 'text-[#2E9E5B]',
      action: () => onShowToast(`Current address: ${user.location}`),
    },
    {
      id: 'settings',
      label: 'App Settings',
      desc: 'Notifications, SMS updates & language',
      Icon: Settings,
      iconBg: 'bg-[#F4F1FB]',
      iconFg: 'text-[#7E57C2]',
      action: () => onShowToast('Settings: SMS & Push notifications active.'),
    },
  ]

  return (
    <div className="flex flex-col text-[#121A2B] px-4 pt-3 pb-[calc(var(--bar-h)+16px+env(safe-area-inset-bottom))] space-y-4">
      {/* 1. Large Profile Card */}
      <div className="relative overflow-hidden rounded-[24px] bg-white p-5 shadow-[0_4px_16px_rgba(20,30,60,0.06)] border border-[#F0EAE0] stagger-item">
        <div className="flex items-center gap-4">
          <div className="relative h-18 w-18 shrink-0 overflow-hidden rounded-full ring-3 ring-[#FDE4EA] animate-pop-rotate">
            <img
              src={user.avatar}
              alt={user.name}
              className="h-full w-full object-cover"
            />
            <span
              className="absolute bottom-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-[#2E9E5B] text-white ring-2 ring-white"
              title="Verified Client"
            >
              <ShieldCheck className="h-3 w-3 stroke-[3]" />
            </span>
          </div>

          <div className="min-w-0 flex-1">
            <span className="rounded-full bg-[#FDE4EA] px-2.5 py-0.5 text-[10px] font-extrabold text-[#EF5A78]">
              PREFERRED CLIENT
            </span>
            <h2 className="mt-1 text-[18px] font-extrabold text-[#121A2B] truncate">
              {user.name}
            </h2>
            <p className="text-[12px] font-medium text-[#7A8194] truncate">
              {user.email}
            </p>
            <p className="flex items-center gap-1 text-[11px] font-semibold text-[#7A8194] mt-0.5">
              <Phone className="h-3 w-3 text-[#D98A1E]" />
              {user.phone}
            </p>
          </div>
        </div>
      </div>

      {/* 2. Menu Rows in White Card */}
      <div className="divide-y divide-gray-100 rounded-[24px] bg-white px-4 shadow-[0_4px_16px_rgba(20,30,60,0.06)] stagger-item">
        {profileRows.map(({ id, label, desc, Icon, iconBg, iconFg, action }) => (
          <button
            key={id}
            type="button"
            onClick={action}
            className="flex w-full items-center justify-between gap-3.5 py-3.5 text-left active:scale-[0.985] transition-all"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${iconBg} ${iconFg}`}
              >
                <Icon className="h-4.5 w-4.5 stroke-[2.2]" />
              </div>
              <div className="min-w-0">
                <span className="block text-[13.5px] font-extrabold text-[#121A2B]">
                  {label}
                </span>
                <span className="block truncate text-[11px] font-medium text-[#7A8194]">
                  {desc}
                </span>
              </div>
            </div>

            <ChevronRight className="h-4 w-4 shrink-0 text-gray-300" />
          </button>
        ))}

        {/* Log Out Row */}
        <button
          type="button"
          onClick={() => onShowToast('You are safely signed in as Mark Sanders.')}
          className="flex w-full items-center justify-between gap-3.5 py-3.5 text-left active:scale-[0.985] transition-all"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-rose-50 text-rose-500">
              <LogOut className="h-4.5 w-4.5 stroke-[2.2]" />
            </div>
            <div>
              <span className="block text-[13.5px] font-extrabold text-rose-500">
                Log Out
              </span>
              <span className="block text-[11px] font-medium text-[#7A8194]">
                Sign out on this device
              </span>
            </div>
          </div>
          <ChevronRight className="h-4 w-4 shrink-0 text-gray-300" />
        </button>
      </div>
    </div>
  )
}

