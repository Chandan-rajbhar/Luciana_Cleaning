import React, { useCallback, useEffect, useRef, useState } from 'react'
import { CheckCircle2, AlertCircle } from 'lucide-react'
import {
  BUSINESS_PHONE,
  SERVICES,
  INITIAL_NOTIFICATIONS,
  INITIAL_BOOKINGS,
  USER_PROFILE,
} from './data/services'
import Phone from './components/Phone'
import StatusBar from './components/StatusBar'
import AppHeader from './components/AppHeader'
import TabBar from './components/TabBar'
import MoreSheet from './components/MoreSheet'
import HomeScreen from './components/HomeScreen'
import ServicesScreen from './components/ServicesScreen'
import ServiceDetailScreen from './components/ServiceDetailScreen'
import ScheduleScreen from './components/ScheduleScreen'
import SuccessScreen from './components/SuccessScreen'
import ChatScreen from './components/ChatScreen'
import NotificationsScreen from './components/NotificationsScreen'
import ProfileScreen from './components/ProfileScreen'
import MyBookingsScreen from './components/MyBookingsScreen'
import AboutScreen from './components/AboutScreen'
import ContactScreen from './components/ContactScreen'
import EstimateSheet from './components/EstimateSheet'
import CallDialog from './components/CallDialog'
import AmbientBackground from './components/AmbientBackground'
import { TopProgressBar } from './components/VisualEffects'

/**
 * Root Application: Luciana Cleaning Services
 * - Warm coral & cream design system (#FAF6F0, #EF5A78, #121A2B, #7A8194)
 * - Shared sticky AppHeader & TabBar (content slides, headers remain persistent)
 * - Single realistic phone frame (390x844) on desktop, full-screen on mobile
 */
export default function App() {
  // Navigation stack for fluid native mobile screen transitions
  const [navStack, setNavStack] = useState([
    { screen: 'home', serviceId: SERVICES[0].id, category: 'all' },
  ])
  const [transitionDir, setTransitionDir] = useState('fade')
  const [transitionKey, setTransitionKey] = useState(0)

  // Notifications state (controls header bell unread dot)
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS)

  // Scroll detection for sticky header backdrop-blur & border
  const [isScrolled, setIsScrolled] = useState(false)

  // Interactive sheet & modal states (strictly inside the phone frame)
  const [isMoreOpen, setIsMoreOpen] = useState(false)
  const [isEstimateOpen, setIsEstimateOpen] = useState(false)
  const [estimateServiceId, setEstimateServiceId] = useState(SERVICES[0].id)
  const [selectedAddOns, setSelectedAddOns] = useState([])
  const [requestedCleaner, setRequestedCleaner] = useState(null)
  const [isCallOpen, setIsCallOpen] = useState(false)

  // Active bookings state
  const [bookings, setBookings] = useState(INITIAL_BOOKINGS)
  const [bookingSummary, setBookingSummary] = useState(INITIAL_BOOKINGS.upcoming[0])

  // In-frame toast notification & app-open entrance animation
  const [toast, setToast] = useState(null)
  const [slideSettled, setSlideSettled] = useState(false)
  const toastTimerRef = useRef(null)
  const toastExitTimerRef = useRef(null)
  const scrollContainerRef = useRef(null)
  const homeScrollRef = useRef(0)

  // Loading progress bar state (thin 5px coral-to-gold sweep)
  const [progressActive, setProgressActive] = useState(false)
  const [progressDuration, setProgressDuration] = useState(300)
  const [progressKey, setProgressKey] = useState(0)
  const progressTimerRef = useRef(null)

  const triggerProgress = useCallback((duration = 300) => {
    if (progressTimerRef.current) clearTimeout(progressTimerRef.current)
    setProgressDuration(duration)
    setProgressKey((k) => k + 1)
    setProgressActive(true)
    progressTimerRef.current = setTimeout(() => {
      setProgressActive(false)
    }, duration + 60)
  }, [])

  // Trigger 300ms loading sweep on screen navigation transitions
  useEffect(() => {
    if (transitionKey > 0) {
      triggerProgress(300)
    }
  }, [transitionKey, triggerProgress])

  const currentEntry = navStack[navStack.length - 1]
  const currentScreen = currentEntry.screen
  const currentServiceId = currentEntry.serviceId || SERVICES[0].id
  const currentCategory = currentEntry.category || 'all'

  // Scroll listener for the header glass effect & home scroll tracking
  const handleScroll = (e) => {
    const scrollTop = e.currentTarget.scrollTop
    setIsScrolled(scrollTop > 10)
    if (currentScreen === 'home') {
      homeScrollRef.current = scrollTop
    }
  }

  // Reset scroll or restore Home scroll position on navigation change
  useEffect(() => {
    setIsScrolled(false)
    if (scrollContainerRef.current) {
      if (currentScreen === 'home') {
        scrollContainerRef.current.scrollTo({
          top: homeScrollRef.current,
          behavior: 'auto',
        })
      } else {
        scrollContainerRef.current.scrollTo({ top: 0, behavior: 'auto' })
      }
    }
  }, [transitionKey, currentScreen])

  const showToast = useCallback((message, tone = 'success') => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current)
    if (toastExitTimerRef.current) clearTimeout(toastExitTimerRef.current)
    setToast({ id: Date.now(), message, tone, isExiting: false })
    toastTimerRef.current = setTimeout(() => {
      setToast((prev) => (prev ? { ...prev, isExiting: true } : null))
      toastExitTimerRef.current = setTimeout(() => {
        setToast(null)
      }, 250)
    }, 2000)
  }, [])

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current)
      if (toastExitTimerRef.current) clearTimeout(toastExitTimerRef.current)
    }
  }, [])

  const navigateTo = useCallback(
    (screen, options = {}) => {
      const {
        serviceId = currentEntry.serviceId || SERVICES[0].id,
        category = 'all',
        dir = 'forward',
        reset = false,
      } = options

      setIsMoreOpen(false)
      setIsEstimateOpen(false)
      setTransitionDir(dir)
      setTransitionKey((k) => k + 1)

      if (reset) {
        setNavStack([{ screen, serviceId, category }])
      } else {
        setNavStack((prev) => {
          const top = prev[prev.length - 1]
          if (
            top.screen === screen &&
            top.serviceId === serviceId &&
            top.category === category
          ) {
            return prev
          }
          return [...prev, { screen, serviceId, category }]
        })
      }
    },
    [currentEntry.serviceId]
  )

  const handleBack = useCallback(() => {
    setIsMoreOpen(false)
    setIsEstimateOpen(false)
    if (navStack.length <= 1) {
      navigateTo('home', { dir: 'back', reset: true })
      return
    }
    setTransitionDir('back')
    setTransitionKey((k) => k + 1)
    setNavStack((prev) => prev.slice(0, -1))
  }, [navStack.length, navigateTo])

  const openEstimate = useCallback((serviceId, addOns = [], cleaner = null) => {
    setEstimateServiceId(serviceId || SERVICES[0].id)
    if (addOns) setSelectedAddOns(addOns)
    if (cleaner) setRequestedCleaner(cleaner)
    setIsMoreOpen(false)
    setIsCallOpen(false)
    setIsEstimateOpen(true)
  }, [])

  const handleConfirmSchedule = (summary) => {
    const newBooking = {
      id: `LC-${Math.floor(10000 + Math.random() * 90000)}`,
      serviceId: summary.serviceId,
      serviceTitle: summary.serviceTitle,
      date: summary.date,
      time: summary.time,
      duration: '3.0 Hours',
      address: summary.address,
      rate: summary.rate,
      totalPaid: summary.totalPaid || '$72.00',
      cleaner: 'Luciana R.',
      status: 'Confirmed',
      image:
        SERVICES.find((s) => s.id === summary.serviceId)?.image ||
        '/images/deep-cleaning.jpg',
    }

    setBookingSummary(newBooking)
    setBookings((prev) => ({
      ...prev,
      upcoming: [newBooking, ...prev.upcoming],
    }))

    // Add confirmed notification
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        type: 'booking',
        title: 'Your booking is confirmed',
        message: `${summary.serviceTitle} on ${summary.date} at ${summary.time}.`,
        time: 'Just now',
        unread: true,
      },
      ...prev,
    ])

    setIsEstimateOpen(false)
    navigateTo('success', { dir: 'forward' })
  }

  const handleEstimateSuccess = (summary) => {
    handleConfirmSchedule({
      serviceId: summary.serviceId,
      serviceTitle: summary.service,
      date: summary.date,
      time: summary.time,
      address: summary.address,
      rate: summary.rate || '$24/h',
      totalPaid: summary.totalEstimate || '$72.00',
    })
  }

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })))
    showToast('All notifications marked as read.')
  }

  const handleSelectNotification = (item) => {
    // Mark this notification as read
    setNotifications((prev) =>
      prev.map((n) => (n.id === item.id ? { ...n, unread: false } : n))
    )

    if (item.type === 'booking') {
      navigateTo('my-bookings', { dir: 'forward' })
    } else if (item.type === 'message') {
      navigateTo('chat', { dir: 'forward' })
    } else if (item.type === 'promo') {
      navigateTo('services', { dir: 'forward' })
    }
  }

  // Has unread notifications flag
  const hasUnreadNotifications = notifications.some((n) => n.unread)

  // Hide bottom tab bar on screens that have their own sticky action buttons
  const hideTabBar = ['detail', 'schedule', 'success'].includes(currentScreen)

  // Active bottom tab calculation
  const activeTab =
    currentScreen === 'home'
      ? 'home'
      : currentScreen === 'services'
      ? 'services'
      : currentScreen === 'chat'
      ? 'chat'
      : ['my-bookings', 'about', 'contact'].includes(currentScreen)
      ? 'more'
      : 'home'

  const animClass =
    transitionDir === 'forward'
      ? 'animate-screen-forward'
      : transitionDir === 'back'
      ? 'animate-screen-back'
      : 'animate-screen-fade'

  return (
    <div className="relative flex h-[100dvh] w-screen items-center justify-center overflow-hidden bg-[#0B1A33] bg-[radial-gradient(ellipse_at_85%_85%,_#1F1538_0%,_#0D1B36_50%,_#0B1A33_100%)]">
      {/* Soft coral radial glow behind the phone (desktop only) */}
      <div
        className="pointer-events-none fixed inset-0 hidden md:flex items-center justify-center overflow-hidden"
        aria-hidden="true"
      >
        <div className="h-[620px] w-[620px] rounded-full bg-[#EF5A78]/18 blur-[140px]" />
      </div>

      {/* Single Responsive Shell: 100vw on mobile, 390x844 frame on desktop */}
      <div className="relative z-10 flex w-full justify-center md:w-auto">
        <Phone>
          {/* Stationary Simulated Status Bar (desktop frame only — never moves) */}
          <StatusBar bg="bg-[#FAF6F0]" />

          {/* Viewport for app-open slide-up animation */}
          <div className="relative flex-1 overflow-hidden bg-[#FAF6F0]">
            {/* Sliding App Content (translateY(100%) to 0, 600ms, 150ms delay) */}
            <div
              onAnimationEnd={(e) => {
                if (e.target === e.currentTarget) setSlideSettled(true)
              }}
              style={{ willChange: slideSettled ? 'auto' : 'transform' }}
              className="animate-app-open relative z-10 h-full w-full overflow-hidden bg-[#FAF6F0] text-[#121A2B]"
            >
              {/* Persistent Ambient Background at app-shell level as sibling of scroll area */}
              <div
                className="absolute inset-0 overflow-hidden pointer-events-none z-0"
                aria-hidden="true"
              >
                <AmbientBackground
                  isTextHeavy={['chat', 'schedule', 'contact', 'profile'].includes(currentScreen)}
                />
              </div>

              {/* Sticky Unified App Header (hidden on Chat screen) */}
              {currentScreen !== 'chat' && (
                <div className="absolute top-0 inset-x-0 z-30">
                  <AppHeader
                    currentScreen={currentScreen}
                    onBack={handleBack}
                    onOpenNotifications={() =>
                      navigateTo('notifications', { dir: 'forward' })
                    }
                    onOpenProfile={() =>
                      navigateTo('profile', { dir: 'forward' })
                    }
                    onLogoClick={() =>
                      navigateTo('home', { dir: 'fade', reset: true })
                    }
                    hasUnreadNotifications={hasUnreadNotifications}
                    isScrolled={isScrolled}
                  />
                  {/* Loading progress bar sweeps under sticky header */}
                  <TopProgressBar
                    isActive={progressActive}
                    duration={progressDuration}
                    barKey={progressKey}
                  />
                </div>
              )}

              {/* Top progress bar for Chat screen */}
              {currentScreen === 'chat' && (
                <div className="absolute top-0 inset-x-0 z-30 pointer-events-none">
                  <TopProgressBar
                    isActive={progressActive}
                    duration={progressDuration}
                    barKey={progressKey}
                  />
                </div>
              )}

              {/* Scrollable Screen Viewport */}
              <main
                ref={scrollContainerRef}
                onScroll={handleScroll}
                style={{
                  paddingTop: currentScreen !== 'chat' ? 'var(--header-h)' : 0,
                }}
                className={`no-scrollbar relative z-10 h-full w-full overflow-x-hidden ${
                  ['chat', 'detail', 'schedule', 'success'].includes(currentScreen)
                    ? 'overflow-hidden flex flex-col'
                    : 'overflow-y-auto'
                } [overscroll-behavior:contain]`}
              >
                <div
                  key={transitionKey}
                  className={`${animClass} ${
                    ['chat', 'detail', 'schedule', 'success'].includes(currentScreen)
                      ? 'h-full flex flex-col'
                      : 'w-full'
                  } relative z-10`}
                >
                  {/* Screen 1: Home & Discovery */}
                  {currentScreen === 'home' && (
                    <HomeScreen
                      onSelectService={(serviceId) =>
                        navigateTo('detail', { serviceId, dir: 'forward' })
                      }
                      onViewAllServices={(category = 'all') =>
                        navigateTo('services', { category, dir: 'forward' })
                      }
                      onOpenSchedule={() =>
                        navigateTo('schedule', {
                          serviceId: SERVICES[0].id,
                          dir: 'forward',
                        })
                      }
                      onOpenEstimate={(serviceId, addOns, cleaner) =>
                        openEstimate(serviceId, addOns, cleaner)
                      }
                      onShowToast={showToast}
                      onTriggerLoading={triggerProgress}
                    />
                  )}

                  {/* Screen 2: Services Screen (Section 3) */}
                  {currentScreen === 'services' && (
                    <ServicesScreen
                      initialCategory={currentCategory}
                      onSelectService={(serviceId) =>
                        navigateTo('detail', { serviceId, dir: 'forward' })
                      }
                      onTriggerLoading={triggerProgress}
                    />
                  )}

                  {/* Screen 3: Service Detail */}
                  {currentScreen === 'detail' && (
                    <ServiceDetailScreen
                      serviceId={currentServiceId}
                      onBookNow={(serviceId) =>
                        navigateTo('schedule', { serviceId, dir: 'forward' })
                      }
                      onShowToast={showToast}
                    />
                  )}

                  {/* Screen 4: Select Date & Time (Schedule) */}
                  {currentScreen === 'schedule' && (
                    <ScheduleScreen
                      serviceId={currentServiceId}
                      onBack={handleBack}
                      onConfirmSchedule={handleConfirmSchedule}
                      onShowToast={showToast}
                      onTriggerLoading={triggerProgress}
                    />
                  )}

                  {/* Screen 5: Booking Confirmed (Success) */}
                  {currentScreen === 'success' && (
                    <SuccessScreen
                      bookingData={bookingSummary}
                      onBack={handleBack}
                      onBackHome={() =>
                        navigateTo('home', { dir: 'back', reset: true })
                      }
                      onOpenChat={() => navigateTo('chat', { dir: 'forward' })}
                      onOpenCall={() => setIsCallOpen(true)}
                      onShowToast={showToast}
                    />
                  )}

                  {/* Screen 6: Chat Screen */}
                  {currentScreen === 'chat' && (
                    <ChatScreen
                      onBack={handleBack}
                      onCallClick={() => setIsCallOpen(true)}
                      onTriggerLoading={triggerProgress}
                    />
                  )}

                  {/* Screen 7: Notifications Screen (Section 4) */}
                  {currentScreen === 'notifications' && (
                    <NotificationsScreen
                      notifications={notifications}
                      onMarkAllAsRead={handleMarkAllAsRead}
                      onSelectNotification={handleSelectNotification}
                    />
                  )}

                  {/* Screen 8: Profile Screen (Section 4) */}
                  {currentScreen === 'profile' && (
                    <ProfileScreen
                      user={USER_PROFILE}
                      onNavigateBookings={() =>
                        navigateTo('my-bookings', { dir: 'forward' })
                      }
                      onShowToast={showToast}
                    />
                  )}

                  {/* Screen 9: My Bookings Screen (Section 4) */}
                  {currentScreen === 'my-bookings' && (
                    <MyBookingsScreen
                      bookings={bookings}
                      onOpenSchedule={() =>
                        navigateTo('schedule', {
                          serviceId: SERVICES[0].id,
                          dir: 'forward',
                        })
                      }
                      onOpenChat={() => navigateTo('chat', { dir: 'forward' })}
                      onOpenCall={() => setIsCallOpen(true)}
                      onShowToast={showToast}
                    />
                  )}

                  {/* Screen 10: About Us */}
                  {currentScreen === 'about' && (
                    <AboutScreen
                      onBack={handleBack}
                      onBookClean={() =>
                        navigateTo('schedule', {
                          serviceId: SERVICES[0].id,
                          dir: 'forward',
                        })
                      }
                    />
                  )}

                  {/* Screen 11: Contact & Support */}
                  {currentScreen === 'contact' && (
                    <ContactScreen
                      onBack={handleBack}
                      onOpenCallDialog={() => setIsCallOpen(true)}
                      onOpenChat={() => navigateTo('chat', { dir: 'forward' })}
                      onShowToast={showToast}
                    />
                  )}
                </div>
              </main>

              {/* Bottom Navigation Bar (Section 2: hidden on Detail, Schedule, Success) */}
              {!hideTabBar && (
                <div className="absolute bottom-0 inset-x-0 z-30">
                  <TabBar
                    activeTab={activeTab}
                    onSelectTab={(tabId) => {
                      if (tabId === 'home') {
                        navigateTo('home', { dir: 'fade', reset: true })
                      } else if (tabId === 'services') {
                        navigateTo('services', { dir: 'fade' })
                      } else if (tabId === 'chat') {
                        navigateTo('chat', { dir: 'fade' })
                      }
                    }}
                    onCenterClick={() =>
                      navigateTo('schedule', {
                        serviceId: currentServiceId,
                        dir: 'forward',
                      })
                    }
                    onOpenMore={() => setIsMoreOpen(true)}
                  />
                </div>
              )}

              {/* In-Frame "More" Bottom Sheet (Section 2) */}
              <MoreSheet
                isOpen={isMoreOpen}
                onClose={() => setIsMoreOpen(false)}
                onNavigate={(routeId) => {
                  setIsMoreOpen(false)
                  if (routeId === 'help') {
                    showToast('Support & Dispatch: (239) 555-0189 • 7am-7pm')
                  } else if (routeId === 'settings') {
                    showToast('Settings: SMS & Push alerts enabled.')
                  } else {
                    navigateTo(routeId, { dir: 'forward' })
                  }
                }}
              />

              {/* In-Frame Free Estimate Bottom Sheet */}
              <EstimateSheet
                isOpen={isEstimateOpen}
                selectedServiceId={estimateServiceId}
                selectedAddOns={selectedAddOns}
                requestedCleaner={requestedCleaner}
                onClose={() => setIsEstimateOpen(false)}
                onSubmitSuccess={handleEstimateSuccess}
                onTriggerLoading={triggerProgress}
              />

              {/* In-Frame Call Confirmation Dialog */}
              <CallDialog
                isOpen={isCallOpen}
                onClose={() => setIsCallOpen(false)}
                onConfirmCall={() => {
                  setIsCallOpen(false)
                  showToast(`Dialing ${BUSINESS_PHONE}...`)
                }}
              />

              {/* In-Frame Toast Notification */}
              {toast && (
                <div
                  key={toast.id}
                  role="status"
                  aria-live="polite"
                  style={{
                    top: 'calc(var(--header-h) + 12px + env(safe-area-inset-top, 0px))',
                    left: 16,
                    right: 16,
                    margin: '0 auto',
                    width: 'fit-content',
                    maxWidth: 'calc(100% - 32px)',
                    boxSizing: 'border-box',
                  }}
                  className={`pointer-events-none fixed md:absolute z-[100] flex items-center justify-center gap-2.5 rounded-[16px] bg-[#121A2B]/95 px-4 py-3 text-white shadow-[0_8px_30px_rgba(0,0,0,0.35)] ring-1 ring-white/10 backdrop-blur-md ${
                    toast.isExiting ? 'animate-toast-out' : 'animate-toast-in'
                  }`}
                >
                  {toast.tone === 'error' ? (
                    <AlertCircle className="h-4 w-4 shrink-0 text-[#D98A1E]" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-[#EF5A78]" />
                  )}
                  <span className="text-center text-[13px] font-semibold leading-snug text-white [word-break:break-word] whitespace-normal">
                    {toast.message}
                  </span>
                </div>
              )}
            </div>
          </div>
        </Phone>
      </div>
    </div>
  )
}
