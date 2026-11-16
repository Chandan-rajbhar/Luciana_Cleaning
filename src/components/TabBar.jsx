import React from 'react'
import {
  Home,
  Brush,
  CalendarPlus,
  CalendarCheck,
  MessageCircle,
} from 'lucide-react'
import { useViewport } from '../hooks/useViewportMode'

/**
 * Bottom Navigation Bar (4-Tab Layout with Raised Center Action Button)
 * - 4 Side Tabs:
 *     1. Home (Home icon) + "Home"
 *     2. Services (Brush icon) + "Services"
 *     [Center: Raised 64px Coral Circle with CalendarPlus icon, opens Schedule]
 *     3. Bookings (CalendarCheck icon) + "Bookings"
 *     4. Chat (MessageCircle icon) + "Chat"
 * - All side icons: 24x24px (26px on tablet), 1.75px stroke, sharing the same baseline
 * - Active: Coral (#EF5A78), label bold
 * - Inactive: Gray (#8A8FA3), label medium
 * - Press state: scale 0.92 on icon (150ms transition)
 * - Active pop: animate-tab-pop (200ms)
 * - Badges: optional count badge on Bookings, dot on Chat
 * - Tablet: full width bar fixed at bottom, tab group centered at max-w-[640px], 26px icons, 12px labels
 */
export default function TabBar({
  activeTab = 'home',
  onSelectTab,
  onCenterClick,
  upcomingCount = 0,
  hasUnreadChat = false,
  className = '',
  style,
}) {
  const { isTablet } = useViewport()

  const iconClass = isTablet ? 'h-[26px] w-[26px]' : 'h-[24px] w-[24px]'
  const labelClass = isTablet ? 'text-[12px]' : 'text-[11px]'

  return (
    <nav
      aria-label="App navigation"
      style={style}
      className={`relative z-20 w-full shrink-0 rounded-t-[28px] bg-white border-t border-[#F0EAE0] pb-[env(safe-area-inset-bottom)] md:pb-[14px] shadow-[0_-6px_24px_rgba(20,30,60,0.06)] select-none ${className}`}
    >
      <div
        className={`flex ${
          isTablet ? 'h-[72px] max-w-[640px] px-6' : 'h-[66px] px-3'
        } mx-auto items-center justify-between`}
      >
        {/* Tab 1: Home */}
        <button
          type="button"
          onClick={() => onSelectTab('home')}
          aria-label="Home"
          className={`flex min-h-[44px] min-w-[56px] flex-col items-center justify-center rounded-2xl transition-transform duration-150 active:scale-[0.92] cursor-pointer ${
            activeTab === 'home'
              ? 'text-[#EF5A78]'
              : 'text-[#8A8FA3] hover:text-[#121A2B]'
          }`}
        >
          <div className={`relative flex ${isTablet ? 'h-[26px] w-[26px]' : 'h-[24px] w-[24px]'} items-center justify-center`}>
            <Home
              className={`${iconClass} transition-transform ${
                activeTab === 'home' ? 'animate-tab-pop' : ''
              }`}
              strokeWidth={1.75}
            />
          </div>
          <span
            className={`mt-1 ${labelClass} leading-none ${
              activeTab === 'home' ? 'font-bold text-[#EF5A78]' : 'font-medium text-[#8A8FA3]'
            }`}
          >
            Home
          </span>
        </button>

        {/* Tab 2: Services */}
        <button
          type="button"
          onClick={() => onSelectTab('services')}
          aria-label="Services"
          className={`flex min-h-[44px] min-w-[56px] flex-col items-center justify-center rounded-2xl transition-transform duration-150 active:scale-[0.92] cursor-pointer ${
            activeTab === 'services'
              ? 'text-[#EF5A78]'
              : 'text-[#8A8FA3] hover:text-[#121A2B]'
          }`}
        >
          <div className={`relative flex ${isTablet ? 'h-[26px] w-[26px]' : 'h-[24px] w-[24px]'} items-center justify-center`}>
            <Brush
              className={`${iconClass} transition-transform ${
                activeTab === 'services' ? 'animate-tab-pop' : ''
              }`}
              strokeWidth={1.75}
            />
          </div>
          <span
            className={`mt-1 ${labelClass} leading-none ${
              activeTab === 'services' ? 'font-bold text-[#EF5A78]' : 'font-medium text-[#8A8FA3]'
            }`}
          >
            Services
          </span>
        </button>

        {/* Center: Raised 64px Coral Circle (opens Schedule / Select Date & Time) */}
        <div className="flex flex-col items-center justify-center">
          <button
            type="button"
            onClick={onCenterClick}
            aria-label="Select Date & Time"
            className="-mt-[26px] flex h-16 w-16 items-center justify-center rounded-full bg-[#EF5A78] text-white ring-[5px] ring-white shadow-[0_10px_26px_rgba(239,90,120,0.48)] hover:brightness-105 active:scale-[0.92] transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#EF5A78] cursor-pointer"
          >
            <CalendarPlus className="h-7 w-7 text-white stroke-[2.2]" />
          </button>
        </div>

        {/* Tab 3: Bookings */}
        <button
          type="button"
          onClick={() => onSelectTab('bookings')}
          aria-label="Bookings"
          className={`flex min-h-[44px] min-w-[56px] flex-col items-center justify-center rounded-2xl transition-transform duration-150 active:scale-[0.92] cursor-pointer ${
            activeTab === 'bookings'
              ? 'text-[#EF5A78]'
              : 'text-[#8A8FA3] hover:text-[#121A2B]'
          }`}
        >
          <div className={`relative flex ${isTablet ? 'h-[26px] w-[26px]' : 'h-[24px] w-[24px]'} items-center justify-center`}>
            <CalendarCheck
              className={`${iconClass} transition-transform ${
                activeTab === 'bookings' ? 'animate-tab-pop' : ''
              }`}
              strokeWidth={1.75}
            />
            {upcomingCount > 0 && (
              <span className="absolute -top-1 -right-1.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#EF5A78] px-1 text-[9.5px] font-bold text-white shadow-xs">
                {upcomingCount}
              </span>
            )}
          </div>
          <span
            className={`mt-1 ${labelClass} leading-none ${
              activeTab === 'bookings' ? 'font-bold text-[#EF5A78]' : 'font-medium text-[#8A8FA3]'
            }`}
          >
            Bookings
          </span>
        </button>

        {/* Tab 4: Chat */}
        <button
          type="button"
          onClick={() => onSelectTab('chat')}
          aria-label="Chat"
          className={`flex min-h-[44px] min-w-[56px] flex-col items-center justify-center rounded-2xl transition-transform duration-150 active:scale-[0.92] cursor-pointer ${
            activeTab === 'chat'
              ? 'text-[#EF5A78]'
              : 'text-[#8A8FA3] hover:text-[#121A2B]'
          }`}
        >
          <div className={`relative flex ${isTablet ? 'h-[26px] w-[26px]' : 'h-[24px] w-[24px]'} items-center justify-center`}>
            <MessageCircle
              className={`${iconClass} transition-transform ${
                activeTab === 'chat' ? 'animate-tab-pop' : ''
              }`}
              strokeWidth={1.75}
            />
            {hasUnreadChat && (
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-[#EF5A78] ring-2 ring-white" />
            )}
          </div>
          <span
            className={`mt-1 ${labelClass} leading-none ${
              activeTab === 'chat' ? 'font-bold text-[#EF5A78]' : 'font-medium text-[#8A8FA3]'
            }`}
          >
            Chat
          </span>
        </button>
      </div>
    </nav>
  )
}
