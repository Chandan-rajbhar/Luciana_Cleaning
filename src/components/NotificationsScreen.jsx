import React from 'react'
import {
  Calendar,
  MessageCircle,
  Tag,
  ShieldCheck,
  CheckCheck,
  BellOff,
  ChevronRight,
} from 'lucide-react'

/**
 * Screen: Notifications
 * Opened via the header Bell icon.
 * Features:
 * - "Mark all as read" link (clears unread state and header bell dot)
 * - Row items with tinted round icon, one-line message, time, and coral unread dot
 */
export default function NotificationsScreen({
  notifications = [],
  onMarkAllAsRead,
  onSelectNotification,
}) {
  const getIconInfo = (type) => {
    switch (type) {
      case 'booking':
        return { Icon: Calendar, bg: 'bg-[#E6F6EC]', fg: 'text-[#2E9E5B]' }
      case 'message':
        return { Icon: MessageCircle, bg: 'bg-[#FDE4EA]', fg: 'text-[#EF5A78]' }
      case 'promo':
        return { Icon: Tag, bg: 'bg-[#FFF1DE]', fg: 'text-[#D98A1E]' }
      case 'safety':
      default:
        return { Icon: ShieldCheck, bg: 'bg-[#E6EEFB]', fg: 'text-[#3567C9]' }
    }
  }

  const unreadCount = notifications.filter((n) => n.unread).length

  return (
    <div className="flex flex-col text-[#121A2B] px-4 md:px-8 pt-3 md:pt-4 pb-[calc(var(--bar-h)+24px+env(safe-area-inset-bottom))] max-w-[720px] mx-auto w-full">
      {/* Action Header Sub-bar */}
      <div className="flex items-center justify-between py-2 stagger-item">
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-extrabold text-[#121A2B]">
            All Activity
          </span>
          {unreadCount > 0 && (
            <span className="rounded-full bg-[#FDE4EA] px-2 py-0.5 text-[10px] font-extrabold text-[#EF5A78]">
              {unreadCount} new
            </span>
          )}
        </div>

        {unreadCount > 0 && (
          <button
            type="button"
            onClick={onMarkAllAsRead}
            className="flex items-center gap-1 text-[11.5px] font-extrabold text-[#EF5A78] hover:underline active:scale-[0.96] transition-transform"
          >
            <CheckCheck className="h-3.5 w-3.5 stroke-[2.4]" />
            Mark all as read
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="mt-2 space-y-2.5">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-[24px] bg-white p-8 text-center shadow-[0_4px_16px_rgba(20,30,60,0.05)]">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#FAF6F0] text-[#7A8194]">
              <BellOff className="h-6 w-6 stroke-[1.8]" />
            </div>
            <h3 className="mt-3 text-[15px] font-extrabold text-[#121A2B]">
              No notifications yet
            </h3>
            <p className="mt-1 text-[12px] font-medium text-[#7A8194]">
              We will notify you about booking confirmations, crew arrival, and discounts.
            </p>
          </div>
        ) : (
          notifications.map((item) => {
            const { Icon, bg, fg } = getIconInfo(item.type)
            return (
              <div
                key={item.id}
                onClick={() => onSelectNotification(item)}
                className={`group flex cursor-pointer items-start gap-3 rounded-[20px] bg-white p-3.5 shadow-[0_4px_16px_rgba(20,30,60,0.05)] transition-all active:scale-[0.985] stagger-item ${
                  item.unread ? 'ring-1 ring-[#EF5A78]/25' : ''
                }`}
              >
                {/* Tinted Round Icon */}
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${bg} ${fg} mt-0.5`}
                >
                  <Icon className="h-5 w-5 stroke-[2.2]" />
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <h4 className="text-[13px] font-extrabold text-[#121A2B] truncate">
                      {item.title}
                    </h4>
                    <span className="text-[10px] font-semibold text-[#7A8194] shrink-0">
                      {item.time}
                    </span>
                  </div>

                  <p className="mt-0.5 text-[11.5px] font-medium text-[#7A8194] line-clamp-2 leading-relaxed">
                    {item.message}
                  </p>
                </div>

                {/* Unread Coral Dot */}
                <div className="flex h-5 w-5 shrink-0 items-center justify-center">
                  {item.unread ? (
                    <span className="h-2.5 w-2.5 rounded-full bg-[#EF5A78] ring-2 ring-[#FDE4EA]" />
                  ) : (
                    <ChevronRight className="h-3.5 w-3.5 text-gray-300 group-hover:text-gray-400" />
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

