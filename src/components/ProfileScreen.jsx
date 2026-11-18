import React, { useEffect, useRef, useState } from 'react'
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ShieldCheck,
  Pencil,
  Camera,
  Check,
} from 'lucide-react'
import { USER_PROFILE } from '../data/services'

/**
 * Screen: Profile
 * Dedicated Profile page displaying ONLY user's profile details.
 * - Centered Identity Block: 104px avatar, coral ring, green verified badge, name, PREFERRED CLIENT chip, email
 * - One white details card: Full name, Email, Phone, Address, Member since
 * - Action button: "Edit profile"
 * - Edit mode: switches fields to 16px rounded inputs with 2px borders, coral focus, photo upload overlay, "Save changes" & "Cancel"
 * - No lists, menus, stats, or external sections
 */
export default function ProfileScreen({
  user = USER_PROFILE,
  onUpdateProfile,
  isEditing = false,
  setIsEditing,
  onShowToast,
}) {
  const [avatarError, setAvatarError] = useState(false)
  const fileInputRef = useRef(null)

  // Local form state for edit mode
  const [formData, setFormData] = useState({
    name: user.name || 'Mark Sanders',
    email: user.email || 'mark.sanders@example.com',
    phone: user.phone || '(239) 555-8291',
    location: user.location || '123 McGregor Blvd, Fort Myers, FL 33901',
    memberSince: user.memberSince || 'October 2025',
    avatar: user.avatar || '/images/avatar-david.jpg',
  })

  // Form validation errors
  const [errors, setErrors] = useState({})

  // Sync form data whenever user prop changes
  useEffect(() => {
    setFormData({
      name: user.name || 'Mark Sanders',
      email: user.email || 'mark.sanders@example.com',
      phone: user.phone || '(239) 555-8291',
      location: user.location || '123 McGregor Blvd, Fort Myers, FL 33901',
      memberSince: user.memberSince || 'October 2025',
      avatar: user.avatar || '/images/avatar-david.jpg',
    })
    setErrors({})
  }, [user, isEditing])

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const imageUrl = URL.createObjectURL(file)
      setFormData((prev) => ({ ...prev, avatar: imageUrl }))
      setAvatarError(false)
    }
  }

  const handleSave = (e) => {
    if (e) e.preventDefault()
    const newErrors = {}

    // Validation: Name
    if (!formData.name.trim()) {
      newErrors.name = 'Please enter your name.'
    }

    // Validation: Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address.'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // Save changes
    onUpdateProfile?.({
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      location: formData.location.trim(),
      avatar: formData.avatar,
    })

    setIsEditing?.(false)
    onShowToast?.('Profile updated')
  }

  const handleCancel = () => {
    setFormData({
      name: user.name || 'Mark Sanders',
      email: user.email || 'mark.sanders@example.com',
      phone: user.phone || '(239) 555-8291',
      location: user.location || '123 McGregor Blvd, Fort Myers, FL 33901',
      memberSince: user.memberSince || 'October 2025',
      avatar: user.avatar || '/images/avatar-david.jpg',
    })
    setErrors({})
    setIsEditing?.(false)
  }

  return (
    <div className="flex flex-col text-[#121A2B] px-4 md:px-8 pt-2.5 md:pt-4 pb-2 space-y-4 max-w-[720px] mx-auto w-full select-none">
      {/* 1. Centered Identity Block */}
      <div className="flex flex-col items-center text-center">
        {/* Avatar Container: 104px round avatar with coral ring and verified badge */}
        <div className="relative">
          <div className="relative h-[104px] w-[104px] shrink-0 overflow-hidden rounded-full ring-4 ring-[#FDE4EA] shadow-md bg-gradient-to-br from-[#EF5A78] to-[#F5A623] flex items-center justify-center text-white font-extrabold text-[32px]">
            {!avatarError && formData.avatar ? (
              <img
                src={formData.avatar}
                alt={formData.name}
                onError={() => setAvatarError(true)}
                className="h-full w-full object-cover"
              />
            ) : (
              <span>MS</span>
            )}

            {/* Tap-to-change photo overlay in edit mode */}
            {isEditing && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                aria-label="Change profile photo"
                className="absolute inset-0 flex flex-col items-center justify-center bg-[#121A2B]/55 text-white backdrop-blur-[1.5px] transition-opacity cursor-pointer hover:bg-[#121A2B]/65"
              >
                <Camera className="h-6 w-6 stroke-[2.2]" />
                <span className="mt-1 text-[10.5px] font-extrabold tracking-tight">
                  Change
                </span>
              </button>
            )}
          </div>

          {/* Hidden File Input for Image Upload */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="hidden"
          />

          {/* Green Verified Shield Badge at bottom-right */}
          <span
            className="absolute bottom-1 right-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#2E9E5B] text-white ring-2 ring-white shadow-xs z-10"
            title="Verified Client"
          >
            <ShieldCheck className="h-3.5 w-3.5 stroke-[3]" />
          </span>
        </div>

        {/* Name in bold 22px */}
        <h2 className="mt-2.5 text-[22px] font-extrabold text-[#121A2B] leading-tight text-center">
          {formData.name}
        </h2>

        {/* Coral "PREFERRED CLIENT" Chip */}
        <div className="mt-1 flex justify-center">
          <span className="inline-block rounded-full bg-[#FDE4EA] px-3 py-0.5 text-[10.5px] font-extrabold tracking-wider text-[#EF5A78] uppercase">
            PREFERRED CLIENT
          </span>
        </div>

        {/* Email in gray */}
        <p className="mt-1 text-[13px] font-medium text-[#7A8194] text-center">
          {formData.email}
        </p>
      </div>

      {/* 2. Details Card (White, 20px radius, soft shadow) */}
      <div className="rounded-[20px] bg-white p-3.5 border border-[#F0EAE0] shadow-[0_4px_16px_rgba(20,30,60,0.06)] divide-y divide-[#F0EAE0]">
        {/* Row 1: Full Name */}
        <div className="flex items-center gap-3 pb-2.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FDE4EA] text-[#EF5A78]">
            <User className="h-4.5 w-4.5 stroke-[2.2]" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="block text-[11px] font-extrabold uppercase tracking-wider text-[#7A8194]">
              Full name
            </span>
            {isEditing ? (
              <div className="mt-1">
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value })
                    if (errors.name) setErrors({ ...errors, name: null })
                  }}
                  placeholder="Your full name"
                  className={`w-full rounded-xl border-2 bg-[#FAF6F0]/40 px-3 py-1.5 text-[16px] font-semibold text-[#121A2B] outline-none transition-colors ${
                    errors.name
                      ? 'border-rose-400 focus:border-rose-500'
                      : 'border-[#EAE3D8] focus:border-[#EF5A78] focus:bg-white'
                  }`}
                />
                {errors.name && (
                  <p className="mt-1 text-[11px] font-bold text-rose-500">
                    {errors.name}
                  </p>
                )}
              </div>
            ) : (
              <span className="block text-[14px] font-extrabold text-[#121A2B] mt-0.5 leading-snug">
                {formData.name}
              </span>
            )}
          </div>
        </div>

        {/* Row 2: Email */}
        <div className="flex items-center gap-3 py-2.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#E6EEFB] text-[#3567C9]">
            <Mail className="h-4.5 w-4.5 stroke-[2.2]" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="block text-[11px] font-extrabold uppercase tracking-wider text-[#7A8194]">
              Email
            </span>
            {isEditing ? (
              <div className="mt-1">
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value })
                    if (errors.email) setErrors({ ...errors, email: null })
                  }}
                  placeholder="your.email@example.com"
                  className={`w-full rounded-xl border-2 bg-[#FAF6F0]/40 px-3 py-1.5 text-[16px] font-semibold text-[#121A2B] outline-none transition-colors ${
                    errors.email
                      ? 'border-rose-400 focus:border-rose-500'
                      : 'border-[#EAE3D8] focus:border-[#EF5A78] focus:bg-white'
                  }`}
                />
                {errors.email && (
                  <p className="mt-1 text-[11px] font-bold text-rose-500">
                    {errors.email}
                  </p>
                )}
              </div>
            ) : (
              <span className="block text-[14px] font-extrabold text-[#121A2B] mt-0.5 leading-snug break-all">
                {formData.email}
              </span>
            )}
          </div>
        </div>

        {/* Row 3: Phone */}
        <div className="flex items-center gap-3 py-2.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#E6F6EC] text-[#2E9E5B]">
            <Phone className="h-4.5 w-4.5 stroke-[2.2]" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="block text-[11px] font-extrabold uppercase tracking-wider text-[#7A8194]">
              Phone
            </span>
            {isEditing ? (
              <div className="mt-1">
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  placeholder="(239) 555-8291"
                  className="w-full rounded-xl border-2 border-[#EAE3D8] bg-[#FAF6F0]/40 px-3 py-1.5 text-[16px] font-semibold text-[#121A2B] outline-none focus:border-[#EF5A78] focus:bg-white transition-colors"
                />
              </div>
            ) : (
              <span className="block text-[14px] font-extrabold text-[#121A2B] mt-0.5 leading-snug">
                {formData.phone}
              </span>
            )}
          </div>
        </div>

        {/* Row 4: Address */}
        <div className="flex items-center gap-3 py-2.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FFF1DE] text-[#D98A1E]">
            <MapPin className="h-4.5 w-4.5 stroke-[2.2]" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="block text-[11px] font-extrabold uppercase tracking-wider text-[#7A8194]">
              Address
            </span>
            {isEditing ? (
              <div className="mt-1">
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  placeholder="Address, City, State ZIP"
                  className="w-full rounded-xl border-2 border-[#EAE3D8] bg-[#FAF6F0]/40 px-3 py-1.5 text-[16px] font-semibold text-[#121A2B] outline-none focus:border-[#EF5A78] focus:bg-white transition-colors"
                />
              </div>
            ) : (
              <span className="block text-[14px] font-extrabold text-[#121A2B] mt-0.5 leading-snug">
                {formData.location}
              </span>
            )}
          </div>
        </div>

        {/* Row 5: Member Since */}
        <div className="flex items-center gap-3 pt-2.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F4F1FB] text-[#7E57C2]">
            <Calendar className="h-4.5 w-4.5 stroke-[2.2]" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="block text-[11px] font-extrabold uppercase tracking-wider text-[#7A8194]">
              Member since
            </span>
            <span className="block text-[14px] font-extrabold text-[#121A2B] mt-0.5 leading-snug">
              {formData.memberSince}
            </span>
          </div>
        </div>
      </div>

      {/* 3. Action Buttons */}
      <div className="pt-1">
        {isEditing ? (
          <div className="flex flex-col items-center space-y-1.5">
            <button
              type="button"
              onClick={handleSave}
              className="flex min-h-[46px] w-full items-center justify-center gap-2 rounded-full bg-[#EF5A78] py-2.5 text-[14px] font-extrabold text-white shadow-[0_6px_20px_rgba(239,90,120,0.35)] hover:brightness-105 active:scale-[0.98] transition-all cursor-pointer"
            >
              <Check className="h-4.5 w-4.5 stroke-[2.5]" />
              <span>Save changes</span>
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="text-[13px] font-bold text-[#7A8194] hover:text-[#121A2B] transition-colors py-1 cursor-pointer"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setIsEditing?.(true)}
            className="flex min-h-[46px] w-full items-center justify-center gap-2 rounded-full bg-[#EF5A78] py-2.5 text-[14px] font-extrabold text-white shadow-[0_6px_20px_rgba(239,90,120,0.35)] hover:brightness-105 active:scale-[0.98] transition-all cursor-pointer"
          >
            <Pencil className="h-4 w-4 stroke-[2.2]" />
            <span>Edit profile</span>
          </button>
        )}
      </div>
    </div>
  )
}
