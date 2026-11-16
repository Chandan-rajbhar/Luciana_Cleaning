import React, { useState, useRef, useEffect } from 'react'
import {
  ChevronLeft,
  Phone,
  CloudCheck,
  CheckCheck,
  Paperclip,
  Mic,
  Send,
  Lock,
} from 'lucide-react'
import {
  CLEANER_SPECIALIST,
  INITIAL_CHAT_MESSAGES,
  QUICK_REPLIES,
} from '../data/services'
import { useViewport } from '../hooks/useViewportMode'

/**
 * Screen: Chat Screen
 * - Sticky Contact Header (directly under status bar, compact 64px, white background)
 * - Back button (40px)
 * - 44px avatar of Luciana with green online dot
 * - "Luciana R." in bold navy 15px & "Lead Cleaning Specialist • Online" in 11px green (fully visible on one line)
 * - 40px green-tint circular call button (opens "Call Luciana?" sheet)
 * - Sticky booking strip with centered blue chip
 * - Message list scrolls between sticky header block and fixed bottom input bar
 * - Fixed quick-reply chips and input bar directly above the bottom navigation bar
 * - Auto-scrolls to latest message on screen open and after sending
 */
export default function ChatScreen({ onBack, onCallClick, onTriggerLoading }) {
  const { isTablet } = useViewport()
  const [messages, setMessages] = useState(INITIAL_CHAT_MESSAGES)
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)
  const messageListRef = useRef(null)

  const scrollToBottom = (behavior = 'smooth') => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior, block: 'end' })
    }
  }

  // Auto-scroll on initial mount
  useEffect(() => {
    const timer = setTimeout(() => {
      scrollToBottom('auto')
    }, 80)
    return () => clearTimeout(timer)
  }, [])

  // Auto-scroll on new message or typing state change
  useEffect(() => {
    scrollToBottom('smooth')
  }, [messages, isTyping])

  const handleSendMessage = (textToSend) => {
    const text = (textToSend || inputValue).trim()
    if (!text) return

    onTriggerLoading?.(600)

    const now = new Date()
    const timeStr = now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })

    const newMsg = {
      id: Date.now(),
      sender: 'user',
      text,
      time: timeStr,
      read: true,
    }

    setMessages((prev) => [...prev, newMsg])
    setInputValue('')

    // Auto-scroll after user sends
    setTimeout(() => scrollToBottom('smooth'), 50)

    // Show typing indicator and automatic friendly crew reply
    setIsTyping(true)
    setTimeout(() => {
      setIsTyping(false)
      const replyMsg = {
        id: Date.now() + 1,
        sender: 'luciana',
        text: 'Got it, thank you! We have that noted for our crew. See you very shortly!',
        time: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
      }
      setMessages((prev) => [...prev, replyMsg])
      setTimeout(() => scrollToBottom('smooth'), 50)
    }, 1400)
  }

  return (
    <div className="flex h-full w-full flex-col overflow-hidden text-[#121A2B] pb-[var(--bar-h)]">
      {/* 1. STICKY TOP HEADER BLOCK (Contact Header + Booking Strip) */}
      <div className="sticky top-0 z-20 w-full shrink-0 select-none shadow-[0_2px_12px_rgba(20,30,60,0.04)] bg-white">
        {/* Contact Header (white, compact 64px) */}
        <div className="flex h-[64px] items-center justify-between border-b border-[#F0EAE0] px-3 md:px-8 pt-[env(safe-area-inset-top)] md:pt-0 max-w-[720px] mx-auto w-full">
          {/* Left: 40px Circular White Back Button */}
          <button
            type="button"
            onClick={onBack}
            aria-label="Go back"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#F0EAE0] bg-white text-[#121A2B] shadow-2xs hover:bg-gray-50 active:scale-[0.93] transition-all cursor-pointer"
          >
            <ChevronLeft className="h-5 w-5 stroke-[2.4]" />
          </button>

          {/* Center-Left: 44px Avatar + Contact Info */}
          <div className="flex min-w-0 flex-1 items-center gap-2.5 pl-2 pr-1">
            {/* 44px round avatar of Luciana R. with green online dot */}
            <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full ring-2 ring-[#FDE4EA] animate-pop-rotate">
              <img
                src={CLEANER_SPECIALIST.image}
                alt={CLEANER_SPECIALIST.name}
                className="h-full w-full object-cover"
              />
              <span
                className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-[#2E9E5B] ring-2 ring-white"
                title="Online"
              />
            </div>

            {/* Name & Subtitle on two lines without clipping or truncating */}
            <div className="min-w-0 flex-1">
              <h1 className="text-[15px] font-extrabold leading-tight text-[#121A2B]">
                {CLEANER_SPECIALIST.name}
              </h1>
              <p className="text-[10.5px] font-semibold text-[#2E9E5B] leading-tight tracking-[-0.015em] whitespace-nowrap">
                Lead Cleaning Specialist • Online
              </p>
            </div>
          </div>

          {/* Right: 40px Green-Tint Circular Call Button */}
          <button
            type="button"
            onClick={onCallClick}
            aria-label="Call Luciana"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E6F6EC] text-[#2E9E5B] shadow-2xs hover:bg-[#d9f2e2] active:scale-[0.93] transition-all cursor-pointer"
          >
            <Phone className="h-[18px] w-[18px] stroke-[2.4]" />
          </button>
        </div>

        {/* Sticky Booking Strip */}
        <div className="border-b border-[#F0EAE0] bg-[#FAF6F0] py-2 text-center">
          <div className="max-w-[720px] mx-auto w-full">
            <span className="inline-block rounded-full bg-[#E6EEFB] px-3.5 py-1 text-[11px] font-bold text-[#3567C9]">
              Booking #LC-84920 • Wed, Oct 15, 10:00 AM
            </span>
          </div>
        </div>
      </div>

      {/* 2. SCROLLABLE MESSAGE THREAD (between sticky header block and fixed input) */}
      <div
        ref={messageListRef}
        className="no-scrollbar flex-1 overflow-y-auto overflow-x-hidden px-4 md:px-8 py-3 [overscroll-behavior:contain]"
      >
        <div className="max-w-[720px] mx-auto w-full space-y-3.5">
          {/* Date Pill */}
          <div className="flex justify-center pt-0.5 stagger-item">
            <span className="rounded-full bg-black/5 px-3 py-1 text-[11px] font-bold text-[#7A8194]">
              Today, October 15
            </span>
          </div>

          {/* Security Notice */}
          <div className="flex items-center gap-2 rounded-2xl bg-white/85 p-3 shadow-[0_2px_8px_rgba(20,30,60,0.04)] border border-[#F0EAE0] stagger-item">
            <Lock className="h-4 w-4 shrink-0 text-[#7A8194]" />
            <p className="text-[11px] font-medium leading-relaxed text-[#7A8194]">
              Direct channel with Luciana Cleaning Services. Both call and SMS are recorded for quality and safety.
            </p>
          </div>

          {/* Messages */}
          {messages.map((msg) => {
            if (msg.sender === 'luciana') {
              return (
                <div key={msg.id} className={`flex items-start gap-2 ${isTablet ? 'max-w-[70%]' : 'max-w-[86%]'} stagger-item`}>
                  <div className="h-7 w-7 shrink-0 overflow-hidden rounded-full ring-1 ring-black/10 mt-1">
                    <img
                      src={CLEANER_SPECIALIST.image}
                      alt="Luciana"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    {msg.isAttachment ? (
                      <div className="rounded-[20px] bg-white p-3.5 shadow-[0_4px_16px_rgba(20,30,60,0.05)] border border-gray-100">
                        {/* Sanitization Checklist Attachment Card */}
                        <div className="flex items-start gap-3 rounded-xl bg-[#F4F1FB] p-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#EAE4F8] text-[#7E57C2]">
                            <CloudCheck className="h-5 w-5 stroke-[2.2]" />
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-[12.5px] font-bold text-[#121A2B]">
                              {msg.title}
                            </h4>
                            <span className="inline-block text-[10.5px] font-bold text-[#2E9E5B]">
                              • {msg.tag}
                            </span>
                          </div>
                        </div>
                        <p className="mt-2.5 text-[12.5px] font-medium leading-relaxed text-[#121A2B]">
                          {msg.text}
                        </p>
                      </div>
                    ) : (
                      <div className="rounded-[20px] rounded-tl-sm bg-white p-3.5 text-[13px] font-medium leading-relaxed text-[#121A2B] shadow-[0_4px_16px_rgba(20,30,60,0.05)] border border-gray-100">
                        {msg.text}
                      </div>
                    )}
                    <span className="mt-1 block text-[10.5px] font-medium text-[#7A8194]">
                      {msg.time}
                    </span>
                  </div>
                </div>
              )
            }

            // Outgoing User Message (Coral bubble)
            return (
              <div key={msg.id} className={`flex flex-col items-end ml-auto ${isTablet ? 'max-w-[70%]' : 'max-w-[86%]'} stagger-item`}>
                <div className="rounded-[20px] rounded-tr-sm bg-[#EF5A78] p-3.5 text-[13px] font-medium leading-relaxed text-white shadow-[0_4px_16px_rgba(239,90,120,0.28)]">
                  {msg.text}
                </div>
                <div className="mt-1 flex items-center gap-1 text-[10.5px] font-medium text-[#7A8194]">
                  <span>{msg.time}</span>
                  <CheckCheck className="h-3.5 w-3.5 text-[#EF5A78]" />
                </div>
              </div>
            )
          })}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 shrink-0 overflow-hidden rounded-full ring-1 ring-black/10">
                <img
                  src={CLEANER_SPECIALIST.image}
                  alt="Luciana"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex items-center gap-1.5 rounded-full bg-white px-3.5 py-2 shadow-xs border border-gray-100">
                <span className="text-[11.5px] font-bold text-[#7A8194]">
                  Luciana is typing
                </span>
                <span className="h-1.5 w-1.5 rounded-full bg-[#EF5A78] animate-pulse" />
                <span className="h-1.5 w-1.5 rounded-full bg-[#EF5A78] animate-pulse delay-150" />
                <span className="h-1.5 w-1.5 rounded-full bg-[#EF5A78] animate-pulse delay-300" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* 3. FIXED BOTTOM QUICK REPLIES */}
      <div className="shrink-0 bg-[#FAF6F0] px-4 md:px-8 pt-1 pb-2">
        <div className="max-w-[720px] mx-auto w-full flex gap-2 overflow-x-auto no-scrollbar">
          {QUICK_REPLIES.map((reply) => (
            <button
              key={reply}
              type="button"
              onClick={() => handleSendMessage(reply)}
              className="shrink-0 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-[11.5px] font-bold text-[#121A2B] shadow-xs hover:border-[#EF5A78] hover:text-[#EF5A78] active:scale-[0.95] transition-all cursor-pointer"
            >
              {reply}
            </button>
          ))}
        </div>
      </div>

      {/* 4. FIXED BOTTOM MESSAGE INPUT BAR (directly above bottom navigation) */}
      <div className="shrink-0 border-t border-[#F0EAE0] bg-white p-3 px-4 md:px-8">
        <div className="max-w-[720px] mx-auto w-full">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSendMessage()
            }}
            className="flex items-center gap-2"
          >
            <div className="flex flex-1 items-center gap-2 rounded-full bg-[#FAF6F0] px-3.5 py-2 border border-gray-200 focus-within:border-[#EF5A78] transition-colors">
              <button
                type="button"
                aria-label="Attach file"
                className="text-[#7A8194] hover:text-[#121A2B] transition-colors cursor-pointer"
              >
                <Paperclip className="h-4 w-4" />
              </button>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Message Luciana..."
                className="flex-1 bg-transparent text-[13px] font-medium text-[#121A2B] placeholder:text-[#7A8194] focus:outline-none"
              />
              <button
                type="button"
                aria-label="Voice note"
                className="text-[#7A8194] hover:text-[#121A2B] transition-colors cursor-pointer"
              >
                <Mic className="h-4 w-4" />
              </button>
            </div>

            <button
              type="submit"
              aria-label="Send message"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EF5A78] text-white shadow-[0_4px_14px_rgba(239,90,120,0.35)] hover:brightness-105 active:scale-[0.95] transition-all cursor-pointer"
            >
              <Send className="h-4 w-4 stroke-[2.3]" />
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
