import React from 'react'
import { Bell, ChevronLeft, MapPin, User } from 'lucide-react'
import { CLEANER_SPECIALIST } from '../data/services'

/**
 * Sticky Unified Header (present on every screen directly under the status bar)
 * - Cream background (#FAF6F0) with backdrop blur and border/shadow after scrolling
 * - Main screens (Home, Services, Chat):
 *     Left: avatar, "Luciana Cleaning", "Fort Myers, Florida" + Pin
 *     Right: 40px Bell button (with coral unread dot) + 40px Profile button
 * - Inner screens:
 *     Left: 36px round Back button
 *     Center: Centered bold screen title
 *     Right: 36px Bell & Profile buttons (active coral state on their respective screen)
 */
export default function AppHeader({
  currentScreen = 'home',
  title,
  onBack,
  onOpenNotifications,
  onOpenProfile,
  onLogoClick,
  hasUnreadNotifications = false,
  isScrolled = false,
}) {
  const isMainScreen = ['home', 'services', 'chat'].includes(currentScreen)

  const screenTitles = {
    detail: 'Service Detail',
    schedule: 'Select Date & Time',
    success: 'Booking Confirmed',
    notifications: 'Notifications',
    profile: 'Profile',
    'my-bookings': 'My Bookings',
    about: 'About Us',
    contact: 'Contact & Support',
  }

  const displayTitle = title || screenTitles[currentScreen] || 'Luciana Cleaning'

  const isNotificationsActive = currentScreen === 'notifications'
  const isProfileActive = currentScreen === 'profile'

  return (
    <header
      className={`sticky top-0 z-30 w-full shrink-0 transition-colors duration-200 select-none ${
        isScrolled
          ? 'bg-[#FAF6F0]/90 backdrop-blur-md border-b border-[#F0EAE0] shadow-[0_2px_12px_rgba(20,30,60,0.04)]'
          : 'bg-[#FAF6F0] border-b border-transparent'
      }`}
    >
      <div className="flex h-[58px] items-center justify-between px-4">
        {isMainScreen ? (
          <>
            {/* Main Screen Left: Avatar + Title & Location (+ Back arrow on Services) */}
            <div className="flex items-center gap-2 min-w-0">
              {currentScreen === 'services' && (
                <button
                  type="button"
                  onClick={onBack}
                  aria-label="Back to Home"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#F0EAE0] bg-white text-[#121A2B] shadow-[0_2px_8px_rgba(20,30,60,0.05)] active:scale-[0.94] transition-all hover:text-[#EF5A78] cursor-pointer"
                >
                  <ChevronLeft className="h-5 w-5 stroke-[2.4]" />
                </button>
              )}
              <button
                type="button"
                onClick={onLogoClick}
                className="flex items-center gap-2 text-left active:scale-[0.98] transition-transform min-w-0"
              >
                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full ring-2 ring-white shadow-xs">
                  <img
                    src={CLEANER_SPECIALIST.image}
                    alt="Luciana Cleaning"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <h1 className="text-[15px] font-extrabold text-[#121A2B] leading-tight truncate">
                    Luciana Cleaning
                  </h1>
                  <p className="flex items-center gap-1 text-[11px] font-semibold text-[#7A8194]">
                    <MapPin className="h-3.5 w-3.5 text-[#D98A1E] shrink-0" />
                    <span className="truncate">Fort Myers, Florida</span>
                  </p>
                </div>
              </button>
            </div>

            {/* Main Screen Right: Two 40px Round White Buttons */}
            <div className="flex items-center gap-2">
              {/* Notification Bell */}
              <button
                type="button"
                onClick={onOpenNotifications}
                aria-label="Notifications"
                className={`relative flex h-10 w-10 items-center justify-center rounded-full border bg-white shadow-[0_2px_8px_rgba(20,30,60,0.05)] active:scale-[0.94] transition-all ${
                  isNotificationsActive
                    ? 'border-[#EF5A78] bg-[#FDE4EA] text-[#EF5A78]'
                    : 'border-[#F0EAE0] text-[#121A2B] hover:text-[#EF5A78]'
                }`}
              >
                <Bell className="h-[18px] w-[18px] stroke-[2.2]" />
                {hasUnreadNotifications && !isNotificationsActive && (
                  <span className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-[#EF5A78] ring-2 ring-white" />
                )}
              </button>

              {/* Profile User Icon */}
              <button
                type="button"
                onClick={onOpenProfile}
                aria-label="Profile"
                className={`flex h-10 w-10 items-center justify-center rounded-full border bg-white shadow-[0_2px_8px_rgba(20,30,60,0.05)] active:scale-[0.94] transition-all ${
                  isProfileActive
                    ? 'border-[#EF5A78] bg-[#FDE4EA] text-[#EF5A78]'
                    : 'border-[#F0EAE0] text-[#121A2B] hover:text-[#EF5A78]'
                }`}
              >
                <User className="h-[18px] w-[18px] stroke-[2.2]" />
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Inner Screen Left: 36px Round Back Button */}
            <div className="flex w-[80px] items-center justify-start">
              <button
                type="button"
                onClick={onBack}
                aria-label="Go back"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[#F0EAE0] bg-white text-[#121A2B] shadow-[0_2px_8px_rgba(20,30,60,0.05)] hover:bg-gray-50 active:scale-[0.94] transition-all"
              >
                <ChevronLeft className="h-5 w-5 stroke-[2.4]" />
              </button>
            </div>

            {/* Inner Screen Center: Bold Title */}
            <div className="flex-1 text-center min-w-0 px-1">
              <h1 className="text-[15.5px] font-extrabold text-[#121A2B] truncate leading-tight">
                {displayTitle}
              </h1>
            </div>

            {/* Inner Screen Right: 36px Bell & Profile Buttons */}
            <div className="flex w-[80px] items-center justify-end gap-1.5">
              {/* Notification Bell (36px) */}
              <button
                type="button"
                onClick={onOpenNotifications}
                aria-label="Notifications"
                className={`relative flex h-9 w-9 items-center justify-center rounded-full border shadow-[0_2px_6px_rgba(20,30,60,0.04)] active:scale-[0.94] transition-all ${
                  isNotificationsActive
                    ? 'border-[#EF5A78] bg-[#FDE4EA] text-[#EF5A78]'
                    : 'border-[#F0EAE0] bg-white text-[#121A2B] hover:text-[#EF5A78]'
                }`}
              >
                <Bell className="h-4 w-4 stroke-[2.2]" />
                {hasUnreadNotifications && !isNotificationsActive && (
                  <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[#EF5A78] ring-2 ring-white" />
                )}
              </button>

              {/* Profile User Icon (36px) */}
              <button
                type="button"
                onClick={onOpenProfile}
                aria-label="Profile"
                className={`flex h-9 w-9 items-center justify-center rounded-full border shadow-[0_2px_6px_rgba(20,30,60,0.04)] active:scale-[0.94] transition-all ${
                  isProfileActive
                    ? 'border-[#EF5A78] bg-[#FDE4EA] text-[#EF5A78]'
                    : 'border-[#F0EAE0] bg-white text-[#121A2B] hover:text-[#EF5A78]'
                }`}
              >
                <User className="h-4 w-4 stroke-[2.2]" />
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  )
}
