import React from 'react'
import {
  Home,
  Brush,
  CalendarPlus,
  CalendarCheck,
  MessageCircle,
} from 'lucide-react'

/**
 * Floating Pill Bottom Navigation Bar:
 * - Floating white pill bar: absolute inside the app shell, left and right 10px,
 *   bottom max(12px, env(safe-area-inset-bottom)), fully rounded, white background,
 *   1px light border, padding 6px, z-index 40.
 * - Five equal tabs: Home, Services, Book, Bookings, Chat.
 *   (Raised circular center button removed; Book is an equal tab with CalendarPlus icon)
 * - Each tab: icon 20px on top, label 11px below, flex-1, min-w-0, min tap target 44px.
 * - Active tab: soft rounded pill background (theme primary at ~15% opacity) with icon and
 *   label in theme primary color (AA contrast compliant across themes).
 * - Inactive tabs: muted gray.
 * - Animation: 200ms background and color transition, respecting prefers-reduced-motion.
 * - Bookings unread badge: small primary-colored circle with white number and white ring.
 * - Accessibility: role="tablist", role="tab", aria-selected, aria-label.
 */
const TABS = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'services', label: 'Services', icon: Brush },
  { id: 'book', label: 'Book', icon: CalendarPlus },
  { id: 'bookings', label: 'Bookings', icon: CalendarCheck },
  { id: 'chat', label: 'Chat', icon: MessageCircle },
]

export default function TabBar({
  activeTab = 'home',
  onSelectTab,
  onCenterClick,
  upcomingCount = 0,
  hasUnreadChat = false,
  className = '',
  style,
}) {
  const isTabActive = (tabId) => {
    if (tabId === 'book') {
      return activeTab === 'book' || activeTab === 'schedule'
    }
    return activeTab === tabId
  }

  const handleTabClick = (tabId) => {
    if (tabId === 'book') {
      if (onSelectTab) onSelectTab('book')
      else if (onCenterClick) onCenterClick()
      return
    }
    if (onSelectTab) onSelectTab(tabId)
  }

  return (
    <nav
      role="tablist"
      aria-label="Bottom Navigation"
      style={{
        bottom: 'max(12px, env(safe-area-inset-bottom, 12px))',
        ...style,
      }}
      className={`absolute left-[10px] right-[10px] max-w-[580px] mx-auto z-40 rounded-full bg-white border border-[var(--border-color,#F0EAE0)] p-[6px] shadow-[0_4px_24px_rgba(20,30,60,0.08)] pointer-events-auto select-none ${className}`}
    >
      <div className="flex items-center justify-between w-full gap-1">
        {TABS.map((tab) => {
          const Icon = tab.icon
          const isActive = isTabActive(tab.id)

          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-label={tab.label}
              tabIndex={isActive ? 0 : -1}
              onClick={() => handleTabClick(tab.id)}
              className="group relative flex flex-1 min-w-0 min-h-[44px] flex-col items-center justify-center rounded-full py-1.5 px-0.5 cursor-pointer select-none transition-all duration-200 motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--primary,#EF5A78)]"
              style={{
                backgroundColor: isActive
                  ? 'var(--primary-tint, #FDE3E9)'
                  : 'transparent',
                color: isActive
                  ? 'var(--primary-text, var(--primary, #EF5A78))'
                  : 'var(--text-muted, #8A8FA3)',
              }}
            >
              {/* Icon 20px on top */}
              <div className="relative flex h-5 w-5 items-center justify-center">
                <Icon
                  className="h-5 w-5 shrink-0 transition-transform duration-200 group-active:scale-90 motion-reduce:transition-none"
                  strokeWidth={2}
                  style={{
                    color: isActive
                      ? 'var(--primary, #EF5A78)'
                      : 'currentColor',
                  }}
                />

                {/* Bookings unread badge: small primary-colored circle with white number and white ring */}
                {tab.id === 'bookings' && upcomingCount > 0 && (
                  <span
                    className="absolute -top-1 -right-2 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full text-[9px] font-bold text-white ring-2 ring-white shadow-xs select-none"
                    style={{ backgroundColor: 'var(--primary, #EF5A78)' }}
                    aria-label={`${upcomingCount} upcoming bookings`}
                  >
                    {upcomingCount}
                  </span>
                )}

                {/* Optional Chat indicator */}
                {tab.id === 'chat' && hasUnreadChat && (
                  <span
                    className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full ring-2 ring-white"
                    style={{ backgroundColor: 'var(--primary, #EF5A78)' }}
                    aria-label="Unread messages"
                  />
                )}
              </div>

              {/* Label 11px below */}
              <span
                className={`mt-0.5 text-[11px] leading-tight select-none text-center truncate max-w-full whitespace-nowrap ${
                  isActive ? 'font-bold' : 'font-semibold'
                }`}
              >
                {tab.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
