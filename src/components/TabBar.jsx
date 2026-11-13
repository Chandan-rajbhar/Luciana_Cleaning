import React from 'react'
import { Home, Sparkles, MessageCircle, MoreHorizontal, ScanLine } from 'lucide-react'

/**
 * Bottom Navigation Bar (Section 2)
 * - White bar with 28px top radius, soft shadow, home indicator
 * - 4 side items:
 *     1. Home (house icon) + "Home"
 *     2. Services (sparkles icon) + "Services" (replaces bag/cart)
 *     3. [Center raised 64px coral scan button, opens schedule]
 *     4. Chat (message bubble icon) + "Chat"
 *     5. More ("..." icon) + "More"
 * - Active icon & label: Coral (#EF5A78); Inactive: Gray (#7A8194)
 * - Tiny 10px label under each side icon
 * - Touch targets >= 44px
 */
export default function TabBar({
  activeTab = 'home',
  onSelectTab,
  onCenterClick,
  onOpenMore,
  className = '',
  style,
}) {
  const tabs = [
    { id: 'home', label: 'Home', Icon: Home },
    { id: 'services', label: 'Services', Icon: Sparkles },
    { id: 'chat', label: 'Chat', Icon: MessageCircle },
    { id: 'more', label: 'More', Icon: MoreHorizontal },
  ]

  return (
    <nav
      aria-label="App navigation"
      style={style}
      className={`relative z-20 w-full shrink-0 rounded-t-[28px] bg-white border-t border-[#F0EAE0] pb-[env(safe-area-inset-bottom)] md:pb-[14px] shadow-[0_-6px_24px_rgba(20,30,60,0.06)] select-none ${className}`}
    >
      <div className="flex h-[66px] items-center justify-between px-3">
        {/* Tab 1: Home */}
        <button
          type="button"
          onClick={() => onSelectTab('home')}
          aria-label="Home"
          className={`flex min-h-[44px] min-w-[56px] flex-col items-center justify-center rounded-2xl transition-all active:scale-[0.93] ${
            activeTab === 'home'
              ? 'text-[#EF5A78]'
              : 'text-[#7A8194] hover:text-[#121A2B]'
          }`}
        >
          <div className="flex h-[24px] w-[24px] items-center justify-center">
            <Home
              className={`h-[22px] w-[22px] ${
                activeTab === 'home' ? 'stroke-[2.2]' : 'stroke-[1.8]'
              }`}
            />
          </div>
          <span
            className={`mt-1 text-[11px] leading-none ${
              activeTab === 'home' ? 'font-extrabold text-[#EF5A78]' : 'font-semibold text-[#7A8194]'
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
          className={`group flex min-h-[44px] min-w-[56px] flex-col items-center justify-center rounded-2xl transition-all active:scale-[0.93] ${
            activeTab === 'services'
              ? 'text-[#EF5A78]'
              : 'text-[#7A8194] hover:text-[#121A2B]'
          }`}
        >
          <div className="flex h-[24px] w-[24px] items-center justify-center">
            <span
              aria-hidden="true"
              className="inline-block h-[24px] w-[24px] bg-current transition-colors"
              style={{
                maskImage: 'url(/images/services-broom-cropped.png)',
                WebkitMaskImage: 'url(/images/services-broom-cropped.png)',
                maskSize: 'contain',
                WebkitMaskSize: 'contain',
                maskRepeat: 'no-repeat',
                WebkitMaskRepeat: 'no-repeat',
                maskPosition: 'center',
                WebkitMaskPosition: 'center',
              }}
            />
          </div>
          <span
            className={`mt-1 text-[11px] leading-none ${
              activeTab === 'services' ? 'font-extrabold text-[#EF5A78]' : 'font-semibold text-[#7A8194]'
            }`}
          >
            Services
          </span>
        </button>

        {/* Raised Center 64px Coral Button (opens Schedule) */}
        <div className="flex flex-col items-center justify-center">
          <button
            type="button"
            onClick={onCenterClick}
            aria-label="Select Date & Time"
            className="-mt-7 flex h-16 w-16 items-center justify-center rounded-full bg-[#EF5A78] text-white ring-4 ring-white shadow-[0_10px_26px_rgba(239,90,120,0.48)] hover:brightness-105 active:scale-[0.93] transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#EF5A78]"
          >
            <ScanLine className="h-7 w-7 stroke-[2.3]" />
          </button>
        </div>

        {/* Tab 3: Chat */}
        <button
          type="button"
          onClick={() => onSelectTab('chat')}
          aria-label="Chat"
          className={`flex min-h-[44px] min-w-[56px] flex-col items-center justify-center rounded-2xl transition-all active:scale-[0.93] ${
            activeTab === 'chat'
              ? 'text-[#EF5A78]'
              : 'text-[#7A8194] hover:text-[#121A2B]'
          }`}
        >
          <div className="flex h-[24px] w-[24px] items-center justify-center">
            <MessageCircle
              className={`h-[22px] w-[22px] ${
                activeTab === 'chat' ? 'stroke-[2.2]' : 'stroke-[1.8]'
              }`}
            />
          </div>
          <span
            className={`mt-1 text-[11px] leading-none ${
              activeTab === 'chat' ? 'font-extrabold text-[#EF5A78]' : 'font-semibold text-[#7A8194]'
            }`}
          >
            Chat
          </span>
        </button>

        {/* Tab 4: More */}
        <button
          type="button"
          onClick={onOpenMore}
          aria-label="More"
          className={`flex min-h-[44px] min-w-[56px] flex-col items-center justify-center rounded-2xl transition-all active:scale-[0.93] ${
            activeTab === 'more'
              ? 'text-[#EF5A78]'
              : 'text-[#7A8194] hover:text-[#121A2B]'
          }`}
        >
          <div className="flex h-[24px] w-[24px] items-center justify-center">
            <MoreHorizontal
              className={`h-[22px] w-[22px] ${
                activeTab === 'more' ? 'stroke-[2.2]' : 'stroke-[1.8]'
              }`}
            />
          </div>
          <span
            className={`mt-1 text-[11px] leading-none ${
              activeTab === 'more' ? 'font-extrabold text-[#EF5A78]' : 'font-semibold text-[#7A8194]'
            }`}
          >
            More
          </span>
        </button>
      </div>
    </nav>
  )
}
