import React from 'react'
import { Bell, ChevronLeft, Menu, Pencil } from 'lucide-react'
import BrandLogo from './BrandLogo'
import { useViewport } from '../hooks/useViewportMode'

/**
 * Sticky Unified Header:
 * - 64px tall, cream background (#FAF6F0), blur and soft border on scroll
 * - Strict 3-column grid (44px 1fr 44px) so title is geometrically centered
 * - Main screens (Home, Services, Bookings):
 *     Left: 40px round white button with 3-bar hamburger icon (Menu, 20px, dark navy)
 *     Center: "Luciana Cleaning" in bold 17px navy with coral sparkle logo mark
 *     Right: 40px round white button with notification bell (Bell, 20px) & coral unread dot
 * - Inner screens:
 *     Left: 40px round Back button (ChevronLeft)
 *     Center: Centered bold 17px screen title
 *     Right: 40px round Edit button (Pencil) on Profile; 40px round notification bell on others
 */
export default function AppHeader({
  currentScreen = 'home',
  title,
  onBack,
  onOpenMenu,
  onOpenNotifications,
  onEditProfile,
  onLogoClick,
  hasUnreadNotifications = false,
  isScrolled = false,
}) {
  const { isTablet } = useViewport()

  const innerScreens = [
    'detail',
    'schedule',
    'success',
    'booking-details',
    'notifications',
    'profile',
    'about',
    'contact',
    'help',
    'settings',
  ]

  const isInnerScreen = innerScreens.includes(currentScreen)

  const screenTitles = {
    detail: 'Service Detail',
    schedule: 'Select Date & Time',
    success: 'Booking Confirmed',
    'booking-details': 'Booking Details',
    notifications: 'Notifications',
    profile: 'Profile',
    bookings: 'Bookings',
    'my-bookings': 'Bookings',
    about: 'About Us',
    contact: 'Contact & Support',
    help: 'Help & FAQ',
    settings: 'Settings',
  }

  const displayTitle = title || screenTitles[currentScreen] || 'Luciana Cleaning'
  const isNotificationsActive = currentScreen === 'notifications'

  return (
    <header
      className={`sticky top-0 z-30 w-full shrink-0 transition-colors duration-200 select-none ${
        isScrolled
          ? 'bg-[#FAF6F0]/90 backdrop-blur-md border-b border-[#F0EAE0] shadow-[0_2px_12px_rgba(20,30,60,0.04)]'
          : 'bg-[#FAF6F0] border-b border-transparent'
      }`}
    >
      <div
        className={`grid grid-cols-[44px_1fr_44px] items-center ${
          isTablet ? 'h-[72px] px-8' : 'h-[64px] px-4'
        }`}
      >
        {/* Left Column (44px wide): Hamburger on Main Screens, Back Arrow on Inner Screens */}
        <div className="flex items-center justify-start">
          {isInnerScreen ? (
            <button
              type="button"
              onClick={onBack}
              aria-label="Go back"
              className={`flex ${
                isTablet ? 'h-11 w-11' : 'h-10 w-10'
              } min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-[#F0EAE0] bg-white text-[#121A2B] shadow-[0_2px_8px_rgba(20,30,60,0.05)] active:scale-[0.92] transition-transform hover:text-[#EF5A78] cursor-pointer`}
            >
              <ChevronLeft className="h-5 w-5 stroke-[2.4]" />
            </button>
          ) : (
            <button
              type="button"
              onClick={onOpenMenu}
              aria-label="Open menu"
              className={`flex ${
                isTablet ? 'h-11 w-11' : 'h-10 w-10'
              } min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-[#F0EAE0] bg-white text-[#121A2B] shadow-[0_2px_8px_rgba(20,30,60,0.05)] active:scale-[0.92] transition-transform hover:text-[#EF5A78] cursor-pointer`}
            >
              <Menu className="h-5 w-5 stroke-[2.2]" />
            </button>
          )}
        </div>

        {/* Center Column (1fr): Company Name or Screen Title Geometrically Centered */}
        <div className="flex items-center justify-center min-w-0 text-center px-1">
          {isInnerScreen ? (
            <h1
              className={`${
                isTablet ? 'text-[19px]' : 'text-[17px]'
              } font-extrabold text-[#121A2B] truncate leading-tight`}
            >
              {displayTitle}
            </h1>
          ) : (
            <button
              type="button"
              onClick={onLogoClick}
              aria-label="Luciana Cleaning Home"
              className="flex items-center justify-center gap-2 active:scale-[0.98] transition-transform cursor-pointer"
            >
              <BrandLogo size={isTablet ? 40 : 36} alt="Luciana Cleaning Services logo" />
              <span
                className={`${
                  isTablet ? 'text-[19px]' : 'text-[17px]'
                } font-extrabold text-[#121A2B] whitespace-nowrap leading-tight tracking-tight`}
              >
                Luciana Cleaning
              </span>
            </button>
          )}
        </div>

        {/* Right Column (44px wide): Edit Pencil on Profile, Bell on other screens */}
        <div className="flex items-center justify-end">
          {currentScreen === 'profile' ? (
            <button
              type="button"
              onClick={onEditProfile}
              aria-label="Edit profile"
              className={`flex ${
                isTablet ? 'h-11 w-11' : 'h-10 w-10'
              } min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-[#F0EAE0] bg-white text-[#121A2B] shadow-[0_2px_8px_rgba(20,30,60,0.05)] active:scale-[0.92] transition-transform hover:text-[#EF5A78] cursor-pointer`}
            >
              <Pencil className="h-4.5 w-4.5 stroke-[2.2]" />
            </button>
          ) : (
            <button
              type="button"
              onClick={onOpenNotifications}
              aria-label="Notifications"
              className={`relative flex ${
                isTablet ? 'h-11 w-11' : 'h-10 w-10'
              } min-h-[44px] min-w-[44px] items-center justify-center rounded-full border bg-white shadow-[0_2px_8px_rgba(20,30,60,0.05)] active:scale-[0.92] transition-transform cursor-pointer ${
                isNotificationsActive
                  ? 'border-[#EF5A78] bg-[#FDE4EA] text-[#EF5A78]'
                  : 'border-[#F0EAE0] text-[#121A2B] hover:text-[#EF5A78]'
              }`}
            >
              <Bell className="h-5 w-5 stroke-[2.2]" />
              {hasUnreadNotifications && !isNotificationsActive && (
                <span className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-[#EF5A78] ring-2 ring-white" />
              )}
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
