import React, { useEffect, useRef, useState } from 'react'
import {
  X,
  Home,
  Brush,
  CalendarCheck,
  MessageCircle,
  Bell,
  Info,
  PhoneCall,
  HelpCircle,
  Settings,
  ChevronRight,
  Gift,
  Phone,
  LogOut,
} from 'lucide-react'
import { USER_PROFILE, BUSINESS_PHONE } from '../data/services'
import BrandLogo from './BrandLogo'
import { useViewport } from '../hooks/useViewportMode'

/**
 * SideMenu Drawer:
 * - Slides in from the LEFT edge of the phone frame directly beneath the hamburger button
 * - Width 82% of screen (max 320px), 28px right radius (rounded-r-[28px]), flush square left corners
 * - Soft shadow falling to the right: shadow-[12px_0_40px_rgba(18,26,43,0.25)]
 * - Rendered strictly inside phone frame container (position: absolute, overflow: hidden on desktop; fixed on mobile)
 * - Backdrop blur with rgba(18,26,43,0.45) overlay on remaining right side
 * - Gestures: Swipe-left on panel closes, Escape key closes, overlay tap closes, auto-closes on item selection
 * - Content: Profile block, 9 menu items (min 52px tall, line-height 1.3), referral promo card, sticky footer
 */
export default function SideMenu({
  isOpen = false,
  onClose,
  currentScreen = 'home',
  onSelectScreen,
  onOpenCall,
  onShowToast,
  user = USER_PROFILE,
  hasUnreadNotifications = false,
  hasUnreadChat = false,
}) {
  const { isTablet, isDesktop } = useViewport()
  const [avatarError, setAvatarError] = useState(false)
  const closeButtonRef = useRef(null)
  const touchStartXRef = useRef(0)
  const touchStartYRef = useRef(0)

  // Auto-focus close button when opened for accessibility
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        closeButtonRef.current?.focus()
      }, 50)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose?.()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  // Touch handlers: Swipe LEFT on the panel closes it
  const handleTouchStart = (e) => {
    touchStartXRef.current = e.touches[0].clientX
    touchStartYRef.current = e.touches[0].clientY
  }

  const handleTouchEnd = (e) => {
    const diffX = e.changedTouches[0].clientX - touchStartXRef.current
    const diffY = Math.abs(e.changedTouches[0].clientY - touchStartYRef.current)
    // Swiped left by at least 50px with low vertical movement
    if (diffX < -50 && diffY < 100) {
      onClose?.()
    }
  }

  const menuItems = [
    {
      id: 'home',
      label: 'Home',
      icon: Home,
      iconBg: 'bg-[#FDE4EA]',
      iconFg: 'text-[#EF5A78]',
      screen: 'home',
    },
    {
      id: 'services',
      label: 'Services',
      icon: Brush,
      iconBg: 'bg-[#FFF1DE]',
      iconFg: 'text-[#D98A1E]',
      screen: 'services',
    },
    {
      id: 'bookings',
      label: 'Bookings',
      icon: CalendarCheck,
      iconBg: 'bg-[#E6F6EC]',
      iconFg: 'text-[#2E9E5B]',
      screen: 'bookings',
    },
    {
      id: 'chat',
      label: 'Chat',
      icon: MessageCircle,
      iconBg: 'bg-[#E6EEFB]',
      iconFg: 'text-[#3567C9]',
      screen: 'chat',
      badge: hasUnreadChat,
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      iconBg: 'bg-[#FDE4EA]',
      iconFg: 'text-[#EF5A78]',
      screen: 'notifications',
      dot: hasUnreadNotifications,
    },
    {
      id: 'about',
      label: 'About Us',
      icon: Info,
      iconBg: 'bg-[#E6EEFB]',
      iconFg: 'text-[#3567C9]',
      screen: 'about',
    },
    {
      id: 'contact',
      label: 'Contact & Support',
      icon: PhoneCall,
      iconBg: 'bg-[#E6F6EC]',
      iconFg: 'text-[#2E9E5B]',
      screen: 'contact',
    },
    {
      id: 'help',
      label: 'Help & FAQ',
      icon: HelpCircle,
      iconBg: 'bg-[#FFF1DE]',
      iconFg: 'text-[#D98A1E]',
      screen: 'help',
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      iconBg: 'bg-[#F4F1FB]',
      iconFg: 'text-[#7E57C2]',
      screen: 'settings',
    },
  ]

  const handleItemClick = (screen) => {
    onClose?.()
    onSelectScreen?.(screen)
  }

  const handleSharePromo = () => {
    const promoCode = 'LUC-CLEAN20'
    const shareUrl = `https://lucianacleaning.com/refer?code=${promoCode}`
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(shareUrl).catch(() => {})
    }
    onShowToast?.('Referral link copied! Give $20, get $20.')
  }

  const handleLogout = () => {
    onClose?.()
    onShowToast?.('Logged out successfully.')
  }

  if (!isOpen) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Navigation menu"
      className={`${isDesktop ? 'absolute' : 'fixed'} inset-0 z-50 flex justify-start overflow-hidden select-none`}
    >
      {/* 1. Dimmed blurred overlay covering remaining right side */}
      <div
        onClick={onClose}
        className="animate-backdrop-in absolute inset-0 bg-[#121A2B]/45 backdrop-blur-[3px] transition-opacity cursor-pointer"
        aria-hidden="true"
      />

      {/* 2. Sliding Panel (from LEFT edge: 360px on tablet, 82% max 320px on mobile/desktop) */}
      <aside
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className={`animate-drawer-in relative z-10 flex h-full ${
          isTablet ? 'w-[360px] max-w-[360px]' : 'w-[82%] max-w-[320px]'
        } flex-col bg-white rounded-r-[28px] rounded-l-none shadow-[12px_0_40px_rgba(18,26,43,0.25)] overflow-hidden`}
      >
        {/* Profile Block at Top */}
        <div className="relative border-b border-[#F0EAE0] bg-gradient-to-b from-[#FAF6F0] to-white p-4 pt-5 shrink-0">
          {/* Close (X) button at top-right of panel */}
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="absolute top-3.5 right-3.5 flex h-10 w-10 min-h-[44px] min-w-[44px] items-center justify-center rounded-full bg-white text-[#121A2B] shadow-[0_2px_8px_rgba(20,30,60,0.06)] border border-[#F0EAE0] hover:text-[#EF5A78] active:scale-90 transition-all cursor-pointer"
          >
            <X className="h-5 w-5 stroke-[2.4]" />
          </button>

          {/* Profile User Info */}
          <div className="flex items-center gap-3.5 pr-8">
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full ring-[3px] ring-[#FDE4EA] bg-gradient-to-br from-[#EF5A78] to-[#F5A623] shadow-xs flex items-center justify-center text-white font-extrabold text-[18px]">
              {!avatarError && user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name || 'User'}
                  onError={() => setAvatarError(true)}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span>MS</span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-[16px] font-extrabold text-[#121A2B] truncate leading-tight">
                {user?.name || 'Mark Sanders'}
              </h2>
              <p className="text-[12px] font-medium text-[#7A8194] truncate">
                {user?.email || 'mark.sanders@example.com'}
              </p>
              <button
                type="button"
                onClick={() => handleItemClick('profile')}
                className="mt-1 text-[12px] font-extrabold text-[#EF5A78] hover:underline flex items-center gap-0.5 cursor-pointer"
              >
                <span>View profile</span>
                <ChevronRight className="h-3.5 w-3.5 stroke-[2.5]" />
              </button>
            </div>
          </div>
        </div>

        {/* Scrollable Navigation List (scrolls smoothly between profile block and sticky footer) */}
        <div className="no-scrollbar flex-1 overflow-y-auto px-3 pt-2.5 pb-4 space-y-1">
          {menuItems.map((item, index) => {
            const Icon = item.icon
            const isActive =
              currentScreen === item.screen ||
              (item.screen === 'services' && currentScreen === 'detail') ||
              (item.screen === 'bookings' &&
                ['bookings', 'my-bookings', 'booking-details'].includes(
                  currentScreen
                ))

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleItemClick(item.screen)}
                style={{ animationDelay: `${index * 40}ms` }}
                className={`flex h-[52px] min-h-[52px] w-full items-center justify-between px-3 rounded-[16px] text-left transition-all active:scale-[0.98] cursor-pointer ${
                  isActive
                    ? 'bg-[#FDE4EA] text-[#EF5A78] font-extrabold'
                    : 'text-[#121A2B] hover:bg-[#FAF6F0] font-bold'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors ${
                      isActive
                        ? 'bg-[#EF5A78] text-white shadow-xs'
                        : `${item.iconBg} ${item.iconFg}`
                    }`}
                  >
                    <Icon className="h-[18px] w-[18px] stroke-[2.2]" />
                  </div>
                  <span className="text-[14px] leading-[1.3] truncate">
                    {item.label}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {item.badge && (
                    <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#EF5A78] px-1 text-[10px] font-extrabold text-white">
                      1
                    </span>
                  )}
                  {item.dot && (
                    <span className="h-2 w-2 rounded-full bg-[#EF5A78] ring-2 ring-white" />
                  )}
                  <ChevronRight
                    className={`h-4 w-4 stroke-[2.2] ${
                      isActive ? 'text-[#EF5A78]' : 'text-[#A0A5B5]'
                    }`}
                  />
                </div>
              </button>
            )
          })}

          {/* Divider */}
          <div className="pt-2 pb-1">
            <div className="h-px bg-[#F0EAE0]" />
          </div>

          {/* Coral-tinted Promo Referral Card (Inside scroll area with 16px bottom padding) */}
          <div className="rounded-[20px] bg-gradient-to-br from-[#FDE4EA] via-[#FFF1DE] to-[#FDE4EA] p-3.5 border border-[#FAD0DC] shadow-xs">
            <div className="flex items-start gap-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#EF5A78] text-white shadow-xs">
                <Gift className="h-4 w-4 stroke-[2.4]" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-[12.5px] font-extrabold text-[#121A2B] leading-tight">
                  Invite a friend, give $20, get $20
                </h3>
                <p className="mt-0.5 text-[11px] font-medium leading-normal text-[#7A8194]">
                  Share your referral link to save on your next clean.
                </p>
                <button
                  type="button"
                  onClick={handleSharePromo}
                  className="mt-2.5 inline-flex items-center gap-1 rounded-full bg-[#EF5A78] px-3.5 py-1.5 text-[11.5px] font-extrabold text-white shadow-[0_2px_8px_rgba(239,90,120,0.3)] hover:brightness-105 active:scale-95 transition-all cursor-pointer"
                >
                  <span>Share link</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Footer Area */}
        <div className="border-t border-[#F0EAE0] bg-[#FAF6F0]/90 p-3.5 pb-[max(14px,env(safe-area-inset-bottom))] space-y-2 shrink-0">
          {/* Call us row */}
          <button
            type="button"
            onClick={() => {
              onClose?.()
              onOpenCall?.()
            }}
            className="flex w-full items-center justify-between rounded-xl px-2 py-1.5 text-[13px] font-bold text-[#121A2B] hover:text-[#EF5A78] hover:bg-white/60 transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-[#EF5A78]" />
              <span>Call us {BUSINESS_PHONE}</span>
            </span>
            <ChevronRight className="h-3.5 w-3.5 text-[#A0A5B5]" />
          </button>

          {/* Log out row */}
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-2 rounded-xl px-2 py-1.5 text-[12.5px] font-bold text-[#7A8194] hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            <span>Log out</span>
          </button>

          {/* App Brand & Version */}
          <div className="flex items-center justify-center gap-3 pt-1">
            <BrandLogo size={44} alt="Luciana Cleaning Services logo" />
            <div className="text-left">
              <p className="text-[13px] font-extrabold text-[#121A2B] leading-tight">
                Luciana Cleaning
              </p>
              <p className="text-[10.5px] font-medium text-[#7A8194]">
                v1.0 • Fort Myers, FL
              </p>
            </div>
          </div>
        </div>
      </aside>
    </div>
  )
}
