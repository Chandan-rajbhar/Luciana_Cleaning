import React, { useState } from 'react'
import {
  Settings,
  Bell,
  Smartphone,
  Mail,
  Shield,
  RotateCcw,
  ChevronRight,
  Sparkles,
  Info,
} from 'lucide-react'
import { USER_PROFILE } from '../data/services'

/**
 * Screen: App Settings
 * - Accessible from SideMenu and Profile
 * - Notification preferences (Push, SMS, Email receipts)
 * - Service preferences & system actions
 */
export default function SettingsScreen({
  onShowToast,
  onResetDemo,
}) {
  const [pushEnabled, setPushEnabled] = useState(true)
  const [smsEnabled, setSmsEnabled] = useState(true)
  const [emailEnabled, setEmailEnabled] = useState(true)
  const [ecoFriendlyOnly, setEcoFriendlyOnly] = useState(true)

  return (
    <div className="flex flex-col text-[#121A2B] px-4 md:px-8 pt-3 md:pt-4 pb-2 space-y-4 max-w-[720px] mx-auto w-full">
      {/* Intro Header Card */}
      <div className="relative overflow-hidden rounded-[24px] bg-white p-5 shadow-[0_4px_16px_rgba(20,30,60,0.06)] border border-[#F0EAE0] stagger-item">
        <div className="flex items-center gap-3.5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#F4F1FB] text-[#7E57C2] shadow-xs">
            <Settings className="h-6 w-6 stroke-[2.2]" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#EF5A78]">
              PREFERENCES
            </span>
            <h2 className="text-[17px] font-extrabold text-[#121A2B] leading-tight">
              Application Settings
            </h2>
            <p className="text-[11.5px] font-medium text-[#7A8194]">
              Manage notifications and cleaning preferences
            </p>
          </div>
        </div>
      </div>

      {/* Notifications Section */}
      <div className="rounded-[24px] bg-white p-4 border border-[#F0EAE0] shadow-[0_2px_12px_rgba(20,30,60,0.04)] space-y-1">
        <h3 className="px-1 text-[11px] font-extrabold uppercase tracking-wider text-[#7A8194]">
          Notification Channels
        </h3>

        {/* Push Notifications */}
        <div className="flex items-center justify-between py-3 px-1 border-b border-[#F0EAE0]">
          <div className="flex items-center gap-3 min-w-0 pr-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FDE4EA] text-[#EF5A78]">
              <Bell className="h-4 w-4 stroke-[2.2]" />
            </div>
            <div className="min-w-0">
              <span className="block text-[13px] font-extrabold text-[#121A2B]">
                Push Notifications
              </span>
              <span className="block text-[11px] font-medium text-[#7A8194]">
                Cleaner en route & booking status
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              const next = !pushEnabled
              setPushEnabled(next)
              onShowToast?.(next ? 'Push alerts enabled' : 'Push alerts paused')
            }}
            className={`relative h-6 w-11 rounded-full transition-colors cursor-pointer shrink-0 ${
              pushEnabled ? 'bg-[#EF5A78]' : 'bg-gray-300'
            }`}
          >
            <span
              className={`block h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                pushEnabled ? 'translate-x-5.5' : 'translate-x-0.5'
              }`}
            />
          </button>
        </div>

        {/* SMS Notifications */}
        <div className="flex items-center justify-between py-3 px-1 border-b border-[#F0EAE0]">
          <div className="flex items-center gap-3 min-w-0 pr-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FFF1DE] text-[#D98A1E]">
              <Smartphone className="h-4 w-4 stroke-[2.2]" />
            </div>
            <div className="min-w-0">
              <span className="block text-[13px] font-extrabold text-[#121A2B]">
                SMS Arrival Alerts
              </span>
              <span className="block text-[11px] font-medium text-[#7A8194]">
                Text updates to {USER_PROFILE.phone}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              const next = !smsEnabled
              setSmsEnabled(next)
              onShowToast?.(next ? 'SMS alerts enabled' : 'SMS alerts paused')
            }}
            className={`relative h-6 w-11 rounded-full transition-colors cursor-pointer shrink-0 ${
              smsEnabled ? 'bg-[#EF5A78]' : 'bg-gray-300'
            }`}
          >
            <span
              className={`block h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                smsEnabled ? 'translate-x-5.5' : 'translate-x-0.5'
              }`}
            />
          </button>
        </div>

        {/* Email Receipts */}
        <div className="flex items-center justify-between py-3 px-1">
          <div className="flex items-center gap-3 min-w-0 pr-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#E6EEFB] text-[#3567C9]">
              <Mail className="h-4 w-4 stroke-[2.2]" />
            </div>
            <div className="min-w-0">
              <span className="block text-[13px] font-extrabold text-[#121A2B]">
                Email Invoices & Receipts
              </span>
              <span className="block text-[11px] font-medium text-[#7A8194]">
                Receipts sent to {USER_PROFILE.email}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              const next = !emailEnabled
              setEmailEnabled(next)
              onShowToast?.(next ? 'Email receipts enabled' : 'Email receipts paused')
            }}
            className={`relative h-6 w-11 rounded-full transition-colors cursor-pointer shrink-0 ${
              emailEnabled ? 'bg-[#EF5A78]' : 'bg-gray-300'
            }`}
          >
            <span
              className={`block h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                emailEnabled ? 'translate-x-5.5' : 'translate-x-0.5'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Cleaning Preferences Section */}
      <div className="rounded-[24px] bg-white p-4 border border-[#F0EAE0] shadow-[0_2px_12px_rgba(20,30,60,0.04)] space-y-1">
        <h3 className="px-1 text-[11px] font-extrabold uppercase tracking-wider text-[#7A8194]">
          Service Standards
        </h3>

        <div className="flex items-center justify-between py-3 px-1">
          <div className="flex items-center gap-3 min-w-0 pr-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#E6F6EC] text-[#2E9E5B]">
              <Sparkles className="h-4 w-4 stroke-[2.2]" />
            </div>
            <div className="min-w-0">
              <span className="block text-[13px] font-extrabold text-[#121A2B]">
                Eco-Friendly & Non-Toxic Products Only
              </span>
              <span className="block text-[11px] font-medium text-[#7A8194]">
                Pet-safe plant-based formulas
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              const next = !ecoFriendlyOnly
              setEcoFriendlyOnly(next)
              onShowToast?.(next ? 'Eco-standard active' : 'Standard products allowed')
            }}
            className={`relative h-6 w-11 rounded-full transition-colors cursor-pointer shrink-0 ${
              ecoFriendlyOnly ? 'bg-[#2E9E5B]' : 'bg-gray-300'
            }`}
          >
            <span
              className={`block h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                ecoFriendlyOnly ? 'translate-x-5.5' : 'translate-x-0.5'
              }`}
            />
          </button>
        </div>
      </div>

      {/* App Information & Actions */}
      <div className="rounded-[24px] bg-white p-4 border border-[#F0EAE0] shadow-[0_2px_12px_rgba(20,30,60,0.04)] space-y-2">
        <div className="flex items-center justify-between py-2 text-[12.5px] font-bold text-[#121A2B]">
          <span className="flex items-center gap-2">
            <Info className="h-4 w-4 text-[#7A8194]" />
            Version
          </span>
          <span className="text-[#7A8194]">1.0.0 (Build 2026.11)</span>
        </div>
        <div className="flex items-center justify-between py-2 text-[12.5px] font-bold text-[#121A2B]">
          <span className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-[#7A8194]" />
            Privacy Policy & Terms
          </span>
          <ChevronRight className="h-4 w-4 text-[#7A8194]" />
        </div>
      </div>
    </div>
  )
}

