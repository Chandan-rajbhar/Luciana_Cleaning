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
import HomeScreen from './components/HomeScreen'
import ServicesScreen from './components/ServicesScreen'
import ServiceDetailScreen from './components/ServiceDetailScreen'
import ScheduleScreen from './components/ScheduleScreen'
import SuccessScreen from './components/SuccessScreen'
import ChatScreen from './components/ChatScreen'
import NotificationsScreen from './components/NotificationsScreen'
import ProfileScreen from './components/ProfileScreen'
import BookingsScreen from './components/BookingsScreen'
import AboutScreen from './components/AboutScreen'
import ContactScreen from './components/ContactScreen'
import HelpScreen from './components/HelpScreen'
import SettingsScreen from './components/SettingsScreen'
import SplashScreen from './components/SplashScreen'
import SideMenu from './components/SideMenu'
import EstimateSheet from './components/EstimateSheet'
import CallDialog from './components/CallDialog'
import AmbientBackground from './components/AmbientBackground'
import SheetContext from './context/SheetContext'
import { TopProgressBar } from './components/VisualEffects'
import { DEFAULT_BOOKING_DRAFT } from './data/bookingDraft'
import { useViewport } from './hooks/useViewportMode'

/**
 * Root Application: Luciana Cleaning Services
 * - Warm coral & cream design system (#FAF6F0, #EF5A78, #121A2B, #7A8194)
 * - Shared sticky AppHeader & TabBar (content slides, headers remain persistent)
 * - Single realistic phone frame (390x844) on desktop, full-screen on mobile
 */
export default function App() {
  const { isTablet, isDesktop, isPhone, isLandscape, device } = useViewport()

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
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isEstimateOpen, setIsEstimateOpen] = useState(false)
  const [estimateServiceId, setEstimateServiceId] = useState(SERVICES[0].id)
  const [selectedAddOns, setSelectedAddOns] = useState([])
  const [requestedCleaner, setRequestedCleaner] = useState(null)
  const [isCallOpen, setIsCallOpen] = useState(false)

  // Track any open portal bottom sheets so bottom nav bar slides down and hides smoothly
  const [activeSheetCount, setActiveSheetCount] = useState(0)

  const registerSheet = useCallback(() => {
    setActiveSheetCount((c) => c + 1)
    let cleanedUp = false
    return () => {
      if (!cleanedUp) {
        cleanedUp = true
        setActiveSheetCount((c) => Math.max(0, c - 1))
      }
    }
  }, [])

  const isAnySheetOpen = activeSheetCount > 0 || isEstimateOpen || isCallOpen || isMenuOpen

  // Shared booking-draft state for all 7 interactive features
  const [bookingDraft, setBookingDraft] = useState(DEFAULT_BOOKING_DRAFT)

  const handleUpdateDraft = useCallback((updates) => {
    setBookingDraft((prev) => ({ ...prev, ...updates }))
  }, [])

  // Global user profile state (synced with SideMenu, AppHeader & ProfileScreen)
  const [userProfile, setUserProfile] = useState({
    ...USER_PROFILE,
    memberSince: 'October 2025',
  })
  const [isEditingProfile, setIsEditingProfile] = useState(false)

  const handleUpdateProfile = useCallback((updatedData) => {
    setUserProfile((prev) => ({ ...prev, ...updatedData }))
  }, [])

  // Active bookings state
  const [bookings, setBookings] = useState(INITIAL_BOOKINGS)
  const [bookingSummary, setBookingSummary] = useState(INITIAL_BOOKINGS.upcoming[0])

  // In-frame toast notification
  const [toast, setToast] = useState(null)
  const [isIntroActive, setIsIntroActive] = useState(true)
  const [tapsLocked, setTapsLocked] = useState(true)
  const toastTimerRef = useRef(null)
  const toastExitTimerRef = useRef(null)
  const scrollContainerRef = useRef(null)
  const homeScrollRef = useRef(0)

  // App-open intro rise animation: 700ms rise starting at 150ms, taps locked for 300ms
  useEffect(() => {
    const tapTimer = setTimeout(() => {
      setTapsLocked(false)
    }, 300)

    const introTimer = setTimeout(() => {
      setIsIntroActive(false)
    }, 860)

    return () => {
      clearTimeout(tapTimer)
      clearTimeout(introTimer)
    }
  }, [])

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

      setIsMenuOpen(false)
      setIsEstimateOpen(false)
      setIsEditingProfile(false)
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
    setIsMenuOpen(false)
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
      duration: summary.hours ? `${summary.hours.toFixed(1)} Hours` : '3.0 Hours',
      hours: summary.hours,
      bedrooms: summary.bedrooms || bookingDraft.bedrooms,
      bathrooms: summary.bathrooms || bookingDraft.bathrooms,
      frequency: summary.frequency || bookingDraft.frequency,
      notes: summary.notes || bookingDraft.notes,
      customNotes: summary.customNotes || bookingDraft.customNotes,
      savings: summary.savings,
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

  // Hide bottom tab bar on screens that have their own sticky action buttons or dedicated full views
  const hideTabBar = ['detail', 'schedule', 'success', 'booking-details', 'profile', 'splash'].includes(currentScreen)

  // Active bottom tab calculation
  const activeTab =
    currentScreen === 'home'
      ? 'home'
      : currentScreen === 'services' || currentScreen === 'detail'
      ? 'services'
      : currentScreen === 'schedule'
      ? 'book'
      : ['bookings', 'my-bookings', 'success', 'booking-details'].includes(currentScreen)
      ? 'bookings'
      : currentScreen === 'chat'
      ? 'chat'
      : null

  const animClass =
    transitionDir === 'forward'
      ? 'animate-screen-forward'
      : transitionDir === 'back'
      ? 'animate-screen-back'
      : 'animate-screen-fade'

  return (
    <SheetContext.Provider value={{ registerSheet, isAnySheetOpen }}>
      <Phone>
        {/* Stationary App Shell Container: fixed from frame 0 */}
        <div
          id="app-shell"
          className={`relative z-10 flex-1 h-full w-full overflow-hidden bg-[#FAF6F0] text-[#121A2B] flex flex-col ${
            isIntroActive ? 'app-intro-active' : ''
          }`}
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

        {/* Unified App Header (shrink-0 in flex column; hidden on Chat & Splash) */}
        {currentScreen !== 'chat' && currentScreen !== 'splash' && (
          <div className="shrink-0 z-30 relative w-full">
            <AppHeader
              currentScreen={currentScreen}
              onBack={handleBack}
              onOpenMenu={() => setIsMenuOpen(true)}
              onOpenNotifications={() =>
                navigateTo('notifications', { dir: 'forward' })
              }
              onEditProfile={() => setIsEditingProfile((prev) => !prev)}
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
          <div className="shrink-0 z-30 relative w-full pointer-events-none">
            <TopProgressBar
              isActive={progressActive}
              duration={progressDuration}
              barKey={progressKey}
            />
          </div>
        )}

        {/* Screen Content Wrapper: flex-1 min-h-0 in flex column */}
        <div
          className={`relative z-10 flex-1 min-h-0 w-full flex flex-col ${
            isIntroActive ? 'overflow-hidden' : ''
          }`}
        >
          {/* Scrollable Screen Viewport */}
          <main
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className={`no-scrollbar relative z-10 flex-1 min-h-0 w-full overflow-x-hidden ${
              isMenuOpen || ['chat', 'detail', 'schedule', 'success', 'splash'].includes(currentScreen)
                ? 'overflow-hidden flex flex-col'
                : 'overflow-y-auto pb-28'
            } [overscroll-behavior:contain]`}
          >
            <div
              key={transitionKey}
              className={`${
                isIntroActive
                  ? 'animate-content-rise'
                  : animClass
              } ${
                tapsLocked ? 'pointer-events-none' : ''
              } ${
                ['chat', 'detail', 'schedule', 'success', 'splash'].includes(currentScreen)
                  ? 'h-full flex flex-col'
                  : 'w-full'
              } relative z-10`}
            >
                  {/* Screen 1: Home & Discovery */}
                  {currentScreen === 'home' && (
                    <HomeScreen
                      bookingDraft={bookingDraft}
                      onUpdateDraft={handleUpdateDraft}
                      onBookThisSize={() =>
                        navigateTo('schedule', {
                          serviceId: currentServiceId,
                          dir: 'forward',
                        })
                      }
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
                      onNavigateBookings={() =>
                        navigateTo('bookings', { dir: 'forward' })
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
                      bookingDraft={bookingDraft}
                      onUpdateDraft={handleUpdateDraft}
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
                      bookingDraft={bookingDraft}
                      onUpdateDraft={handleUpdateDraft}
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

                  {/* Screen 8: Profile Screen (Dedicated Profile Details Only) */}
                  {currentScreen === 'profile' && (
                    <ProfileScreen
                      user={userProfile}
                      onUpdateProfile={handleUpdateProfile}
                      isEditing={isEditingProfile}
                      setIsEditing={setIsEditingProfile}
                      onShowToast={showToast}
                    />
                  )}

                  {/* Screen 9: Bookings Screen (Section 4) */}
                  {(currentScreen === 'bookings' || currentScreen === 'my-bookings') && (
                    <BookingsScreen
                      bookings={bookings}
                      onOpenSchedule={() =>
                        navigateTo('schedule', {
                          serviceId: SERVICES[0].id,
                          dir: 'forward',
                        })
                      }
                      onOpenChat={() => navigateTo('chat', { dir: 'forward' })}
                      onOpenDetails={(bookingItem) => {
                        setBookingSummary(bookingItem)
                        navigateTo('booking-details', { dir: 'forward' })
                      }}
                      onShowToast={showToast}
                      onTriggerLoading={triggerProgress}
                    />
                  )}

                  {/* Screen: Booking Details (styled like Booking Confirmed) */}
                  {currentScreen === 'booking-details' && (
                    <SuccessScreen
                      bookingData={bookingSummary}
                      isDetails={true}
                      onBack={handleBack}
                      onBackHome={() =>
                        navigateTo('bookings', { dir: 'back' })
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

                  {/* Screen 12: Help & FAQ */}
                  {currentScreen === 'help' && (
                    <HelpScreen
                      onNavigateContact={() =>
                        navigateTo('contact', { dir: 'forward' })
                      }
                      onOpenChat={() => navigateTo('chat', { dir: 'forward' })}
                      onOpenCall={() => setIsCallOpen(true)}
                      onShowToast={showToast}
                    />
                  )}

                  {/* Screen 13: App Settings */}
                  {currentScreen === 'settings' && (
                    <SettingsScreen
                      onShowToast={showToast}
                      onResetDemo={() => showToast('Demo preferences updated.')}
                    />
                  )}

                  {/* Screen: Splash Screen */}
                  {currentScreen === 'splash' && (
                    <SplashScreen
                      onFinish={() =>
                        navigateTo('home', { dir: 'fade', reset: true })
                      }
                    />
                  )}
                </div>
              </main>
            </div>

            {/* Bottom Navigation Bar (Floating Pill) - slides down & fades out when any sheet opens */}
            {!hideTabBar && (
              <div
                className={`absolute bottom-0 inset-x-0 z-40 pointer-events-none transition-all duration-300 ease-out motion-reduce:transition-none ${
                  isAnySheetOpen
                    ? 'translate-y-28 opacity-0'
                    : 'translate-y-0 opacity-100'
                }`}
              >
                <TabBar
                  activeTab={activeTab}
                  onSelectTab={(tabId) => {
                    if (tabId === 'home') {
                      navigateTo('home', { dir: 'fade', reset: true })
                    } else if (tabId === 'services') {
                      navigateTo('services', { category: 'all', dir: 'fade' })
                    } else if (tabId === 'book' || tabId === 'schedule') {
                      navigateTo('schedule', {
                        serviceId: currentServiceId,
                        dir: 'forward',
                      })
                    } else if (tabId === 'bookings') {
                      navigateTo('bookings', { dir: 'fade' })
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
                  upcomingCount={bookings?.upcoming?.length || 0}
                  hasUnreadChat={false}
                />
              </div>
            )}

            {/* In-Frame Side Menu Drawer (Slides in from Left) */}
              <SideMenu
                isOpen={isMenuOpen}
                onClose={() => setIsMenuOpen(false)}
                currentScreen={currentScreen}
                onSelectScreen={(screen) => {
                  if (screen === 'home') {
                    navigateTo('home', { dir: 'fade', reset: true })
                  } else if (screen === 'services') {
                    navigateTo('services', { category: 'all', dir: 'forward' })
                  } else {
                    navigateTo(screen, { dir: 'forward' })
                  }
                }}
                onOpenCall={() => setIsCallOpen(true)}
                onShowToast={showToast}
                user={userProfile}
                hasUnreadNotifications={hasUnreadNotifications}
                hasUnreadChat={false}
              />

              {/* In-Frame Free Estimate Bottom Sheet */}
              <EstimateSheet
                isOpen={isEstimateOpen}
                bookingDraft={bookingDraft}
                onUpdateDraft={handleUpdateDraft}
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

              {/* Dedicated Portal Mount for BottomSheets strictly inside App Shell */}
              <div
                id="sheet-portal"
                className="absolute inset-0 z-[60] pointer-events-none overflow-hidden"
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
                    maxWidth: isTablet ? 'min(420px, calc(100% - 48px))' : 'calc(100% - 32px)',
                    boxSizing: 'border-box',
                  }}
                  className={`pointer-events-none ${
                    isDesktop ? 'absolute' : 'fixed'
                  } z-[100] flex items-center justify-center gap-2.5 rounded-[16px] bg-[#121A2B]/95 px-4 py-3 text-white shadow-[0_8px_30px_rgba(0,0,0,0.35)] ring-1 ring-white/10 backdrop-blur-md ${
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
        </Phone>
    </SheetContext.Provider>
  )
}
