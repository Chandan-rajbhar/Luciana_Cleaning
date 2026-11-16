/**
 * Shared booking-draft store and pricing formulas for Luciana Cleaning Services.
 * Synchronized across Home, Estimate Sheet, Service Detail, Schedule, and Booking Confirmed.
 */

export const FORT_MYERS_ZIPS = [
  '33901',
  '33903',
  '33904',
  '33905',
  '33907',
  '33908',
  '33909',
  '33912',
  '33913',
  '33914',
  '33916',
  '33919',
  '33931',
  '33966',
  '33967',
  '33990',
  '33991',
  '33993',
]

export const FREQUENCY_OPTIONS = [
  { id: 'One-time', label: 'One-time', discount: 0, badge: null },
  { id: 'Weekly', label: 'Weekly', discount: 0.2, badge: 'Save 20%' },
  { id: 'Bi-weekly', label: 'Bi-weekly', discount: 0.15, badge: 'Save 15%' },
  { id: 'Monthly', label: 'Monthly', discount: 0.1, badge: 'Save 10%' },
]

export const ENTRY_NOTE_CHIPS = [
  '🔑 Lockbox on Front Porch',
  "🤫 Baby Sleeping (Don't Ring Bell)",
  '🐶 Friendly Dog at Home',
  '🚗 Park in Driveway',
  '🧴 Use Scent-Free Products',
]

export const ADD_ON_PRICES = {
  fridge: 25,
  oven: 30,
  windows: 40,
  laundry: 20,
  'Inside Fridge (+$25)': 25,
  'Inside Oven (+$30)': 30,
  'Windows (+$40)': 40,
  'Laundry (+$20)': 20,
}

export const PRICING_CONFIG = {
  baseHours: 2.0,
  bedroomStepHours: 0.5,
  bathroomStepHours: 0.5,
  defaultHourlyRate: 24,
  maxBedroomsCount: 4,
  maxBathroomsCount: 3,
}

export const DEFAULT_BOOKING_DRAFT = {
  bedrooms: 3,
  bathrooms: 2,
  frequency: 'One-time',
  notes: [],
  customNotes: '',
  addOns: [],
  serviceId: 'kitchen-deep-cleaning',
  zip: '',
}

/**
 * Calculate estimated cleaning duration in hours.
 * Formula: 2.0 + 0.5 * (bedrooms - 1) + 0.5 * (bathrooms - 1)
 * (where 4+ counts as 4, and 3+ counts as 3)
 */
export function calcBookingHours(bedrooms = 3, bathrooms = 2) {
  const bedNum = typeof bedrooms === 'string' && bedrooms.includes('+') ? 4 : Number(bedrooms) || 1
  const bathNum = typeof bathrooms === 'string' && bathrooms.includes('+') ? 3 : Number(bathrooms) || 1

  const bedCapped = Math.min(Math.max(bedNum, 1), PRICING_CONFIG.maxBedroomsCount)
  const bathCapped = Math.min(Math.max(bathNum, 1), PRICING_CONFIG.maxBathroomsCount)

  const hours =
    PRICING_CONFIG.baseHours +
    PRICING_CONFIG.bedroomStepHours * (bedCapped - 1) +
    PRICING_CONFIG.bathroomStepHours * (bathCapped - 1)

  return Math.round(hours * 10) / 10
}

/**
 * Calculate add-ons subtotal.
 */
export function calcAddOnsTotal(addOns = []) {
  if (!Array.isArray(addOns)) return 0
  return addOns.reduce((sum, item) => {
    const price = ADD_ON_PRICES[item] || 0
    return sum + price
  }, 0)
}

/**
 * Calculate pricing details given draft parameters.
 */
export function calcPricingDetails({
  bedrooms = 3,
  bathrooms = 2,
  frequency = 'One-time',
  addOns = [],
  hourlyRate = PRICING_CONFIG.defaultHourlyRate,
}) {
  const hours = calcBookingHours(bedrooms, bathrooms)
  const basePrice = Math.round(hours * hourlyRate * 100) / 100

  const freqItem = FREQUENCY_OPTIONS.find((f) => f.id === frequency) || FREQUENCY_OPTIONS[0]
  const discountRate = freqItem.discount || 0
  const savings = Math.round(basePrice * discountRate * 100) / 100
  const discountedBase = Math.round((basePrice - savings) * 100) / 100

  const addOnsTotal = calcAddOnsTotal(addOns)
  const finalPrice = Math.round((discountedBase + addOnsTotal) * 100) / 100

  return {
    hours,
    basePrice,
    discountRate,
    savings,
    discountedBase,
    addOnsTotal,
    finalPrice,
    isRecurring: discountRate > 0,
    formattedHours: hours.toFixed(1),
    formattedBasePrice: basePrice.toFixed(2),
    formattedSavings: savings.toFixed(2),
    formattedFinalPrice: finalPrice.toFixed(2),
  }
}

