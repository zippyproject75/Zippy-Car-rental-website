import React, { useState } from 'react'

type Car = {
  id: string
  name: string
  category: 'Compact SUV' | 'Hatchback' | 'MPV'
  seats: number
  trans: string
  fuel: string
  image: string
}

const FLEET: Car[] = [
  { id: 'fronx', name: 'Maruti Suzuki Fronx', category: 'Compact SUV', seats: 5, trans: 'Manual / Auto', fuel: 'Petrol', image: '/images/cars/fronx.jpeg' },
  { id: 'brezza', name: 'Maruti Suzuki Brezza', category: 'Compact SUV', seats: 5, trans: 'Manual / Auto', fuel: 'Petrol', image: '/images/cars/brezza.jpeg' },
  { id: 'baleno', name: 'Maruti Suzuki Baleno', category: 'Hatchback', seats: 5, trans: 'Manual / Auto', fuel: 'Petrol', image: '/images/cars/baleno.jpeg' },
  { id: 'ertiga-1', name: 'Maruti Suzuki Ertiga (Unit 1)', category: 'MPV', seats: 7, trans: 'Manual / Auto', fuel: 'Petrol', image: '/images/cars/ertiga.jpeg' },
  { id: 'ertiga-2', name: 'Maruti Suzuki Ertiga (Unit 2)', category: 'MPV', seats: 7, trans: 'Manual / Auto', fuel: 'Petrol', image: '/images/cars/ertiga.jpeg' },
]

const BRANCHES = [
  {
    id: 'kondhwa',
    name: 'Kondhwa',
    tag: 'South Pune',
    address: 'Khadi Machine Chowk, Kondhwa Saswad Road, Pune – 411048, Maharashtra',
    mapQuery: 'Khadi Machine Chowk, Kondhwa Saswad Road, Pune 411048, Maharashtra',
    mapUrl: 'https://maps.app.goo.gl/NgJLjwf5Gz8Kayow9?g_st=awb',
    phone: '+91 99212 08410',
  },
  {
    id: 'gangadham',
    name: 'Gangadham',
    tag: 'Market Yard / Bibwewadi',
    address: 'Gangadham Chowk, Beside Solitaire Premier, Ganga Dham Road, Phase 1, Pune – 411037, Maharashtra',
    mapQuery: 'Gangadham Chowk, Beside Solitaire Premier, Ganga Dham Road, Phase 1, Pune 411037, Maharashtra',
    mapUrl: 'https://maps.app.goo.gl/HhaVdxAMNHdPfZti7?g_st=awb',
    phone: '+91 99212 08410',
  },
  {
    id: 'undri',
    name: 'Undri',
    tag: 'Undri / Pisoli',
    address: 'Opposite Euro School, Undri Marg, Near My Toy Trolly, Undri, Pune – 411060, Maharashtra',
    mapQuery: 'Opposite Euro School, Undri Marg, Undri, Pune 411060, Maharashtra',
    mapUrl: 'https://maps.app.goo.gl/GgxcQBUnbwYiDJw87?g_st=awb',
    phone: '+91 99212 08410',
  },
]

const WHATSAPP_NUMBER = '919921208410'
const PHONE_DISPLAY = '+91 99212 08410'
const PHONE_TEL = 'tel:+919921208410'

function buildWhatsAppUrl(carId: string, branchId: string, pickupDate: string, returnDate: string): string {
  const car = FLEET.find((c) => c.id === carId)
  const carName = car?.name ?? 'Any available car'
  const branch = BRANCHES.find((b) => b.id === branchId)
  const branchName = branch?.name ?? 'Kondhwa'

  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'Not selected'
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
  }

  const lines = [
    'Hi Zippy! 👋',
    '',
    `🚗 Car: ${carName}`,
    `📍 Pickup Branch: ${branchName} (Pune)`,
    `📅 Pickup: ${formatDate(pickupDate)}`,
    `📅 Return: ${formatDate(returnDate)}`,
    '',
    'Please confirm availability and price. Thank you!',
  ]

  const message = lines.join('\n')
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}

export default function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'suv' | 'hatchback' | 'mpv'>('all')
  const [selectedCar, setSelectedCar] = useState('fronx')
  const [selectedBranch, setSelectedBranch] = useState('kondhwa')
  const [pickupDate, setPickupDate] = useState('')
  const [returnDate, setReturnDate] = useState('')
  const [activeMapBranch, setActiveMapBranch] = useState('kondhwa')

  const isDark = theme === 'dark'

  const filteredFleet = FLEET.filter((car) => {
    if (selectedCategory === 'all') return true
    if (selectedCategory === 'suv') return car.category === 'Compact SUV'
    if (selectedCategory === 'hatchback') return car.category === 'Hatchback'
    if (selectedCategory === 'mpv') return car.category === 'MPV'
    return true
  })

  const handleSendEnquiry = () => {
    const url = buildWhatsAppUrl(selectedCar, selectedBranch, pickupDate, returnDate)
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const scrollToEnquiry = (carId?: string, branchId?: string) => {
    if (carId) setSelectedCar(carId)
    if (branchId) {
      setSelectedBranch(branchId)
      setActiveMapBranch(branchId)
    }
    const el = document.getElementById('enquiry')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const selectedCarObj = FLEET.find((c) => c.id === selectedCar)
  const selectedBranchObj = BRANCHES.find((b) => b.id === selectedBranch)
  const activeBranchMapObj = BRANCHES.find((b) => b.id === activeMapBranch) ?? BRANCHES[0]

  // Calculate rental duration in days
  const calculateDuration = () => {
    if (!pickupDate || !returnDate) return null
    const start = new Date(pickupDate).getTime()
    const end = new Date(returnDate).getTime()
    if (isNaN(start) || isNaN(end) || end < start) return null
    const diffDays = Math.max(1, Math.round((end - start) / (1000 * 60 * 60 * 24)))
    return diffDays
  }
  const durationDays = calculateDuration()

  return (
    <div
      className={`min-h-screen font-sans antialiased selection:bg-[#d4b373]/30 transition-colors duration-300 pb-20 sm:pb-0 ${
        isDark ? 'bg-[#0a0a0b] text-[#f3eee4]' : 'bg-[#f6f3ed] text-[#18160f]'
      }`}
    >
      {/* Top Header */}
      <header
        className={`sticky top-0 z-30 border-b backdrop-blur-md transition-colors duration-300 ${
          isDark ? 'border-[#29292d] bg-[#0a0a0b]/92' : 'border-[#ddd6c8] bg-[#f6f3ed]/92'
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          {/* Logo & Brand */}
          <a href="#" className="flex items-center gap-2.5 sm:gap-3 shrink-0 group">
            <img
              src="/zippy_main_logo.png"
              alt="Zippy Car Rental Pune"
              className="h-8 sm:h-9 w-auto object-contain shrink-0 transition-transform group-hover:scale-105"
            />
            <div className="flex flex-col">
              <span
                className={`font-black tracking-widest text-sm sm:text-base leading-none ${
                  isDark ? 'text-[#f3eee4]' : 'text-[#18160f]'
                }`}
              >
                ZIPPY
              </span>
              <span
                className={`text-[9px] sm:text-[10px] tracking-[0.18em] uppercase font-semibold mt-0.5 ${
                  isDark ? 'text-[#d4b373]' : 'text-[#77571b]'
                }`}
              >
                Car Rental Pune
              </span>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold">
            <a
              href="#fleet"
              className={`transition-colors hover:text-[#d4b373] ${
                isDark ? 'text-[#c4bdaf]' : 'text-[#48443b]'
              }`}
            >
              Our Fleet (5)
            </a>
            <a
              href="#branches"
              className={`transition-colors hover:text-[#d4b373] ${
                isDark ? 'text-[#c4bdaf]' : 'text-[#48443b]'
              }`}
            >
              3 Pune Branches
            </a>
            <a
              href="#enquiry"
              className={`transition-colors hover:text-[#d4b373] ${
                isDark ? 'text-[#c4bdaf]' : 'text-[#48443b]'
              }`}
            >
              Booking Flow
            </a>
          </nav>

          {/* Actions: Direct Call, Theme Toggle, CTA */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Direct Call Button (visible on mobile & desktop) */}
            <a
              href={PHONE_TEL}
              aria-label="Call Zippy Car Rental"
              className={`size-9 rounded-lg border flex items-center justify-center transition-colors ${
                isDark
                  ? 'border-[#29292d] bg-[#141416] text-[#25D366] hover:border-[#25D366]/60'
                  : 'border-[#ddd6c8] bg-white text-[#15803d] hover:border-[#15803d]/60 shadow-sm'
              }`}
              title="Call +91 99212 08410"
            >
              <svg className="size-4 fill-current" viewBox="0 0 24 24" aria-hidden>
                <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.45.57 3.57a1 1 0 01-.25 1.02l-2.2 2.2z" />
              </svg>
            </a>

            {/* Theme Toggle Button */}
            <button
              type="button"
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              className={`size-9 rounded-lg border flex items-center justify-center transition-colors ${
                isDark
                  ? 'border-[#29292d] bg-[#141416] text-[#d4b373] hover:border-[#3b3b40]'
                  : 'border-[#ddd6c8] bg-white text-[#77571b] hover:border-[#c6bca9] shadow-sm'
              }`}
            >
              {isDark ? (
                <svg className="size-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24" aria-hidden>
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
                </svg>
              ) : (
                <svg className="size-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24" aria-hidden>
                  <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
                </svg>
              )}
            </button>

            {/* Primary Book CTA */}
            <button
              onClick={() => scrollToEnquiry()}
              className="px-3 sm:px-4 py-2 rounded-lg bg-[#d4b373] hover:bg-[#e2c48a] text-[#0a0a0b] font-bold text-xs sm:text-sm transition-all shadow-sm active:scale-95 shrink-0"
            >
              Book Now &rarr;
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section
        className={`py-12 sm:py-20 px-4 sm:px-6 border-b transition-colors duration-300 relative overflow-hidden ${
          isDark
            ? 'border-[#29292d] bg-[radial-gradient(ellipse_90%_60%_at_50%_0%,rgba(212,179,115,0.18),transparent)]'
            : 'border-[#ddd6c8] bg-[radial-gradient(ellipse_90%_60%_at_50%_0%,rgba(201,166,96,0.22),transparent)]'
        }`}
      >
        <div className="max-w-4xl mx-auto text-center space-y-5 sm:space-y-6">
          {/* Live Availability Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-[11px] sm:text-xs font-semibold tracking-wide backdrop-blur-sm shadow-xs transition-colors border-[#d4b373]/30 bg-[#d4b373]/10 text-[#d4b373]">
            <span className="size-2 rounded-full bg-[#22c55e] animate-pulse"></span>
            <span>Self-Drive Car Rental &middot; Pune, Maharashtra</span>
          </div>

          <h1
            className={`text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15] sm:leading-[1.1] ${
              isDark ? 'text-[#f3eee4]' : 'text-[#18160f]'
            }`}
          >
            Drive your Pune journey on <span className="text-[#d4b373]">your own terms.</span>
          </h1>

          <p
            className={`text-sm sm:text-base lg:text-lg max-w-2xl mx-auto leading-relaxed px-2 ${
              isDark ? 'text-[#c4bdaf]' : 'text-[#48443b]'
            }`}
          >
            Verified fleet of 5 Maruti Suzuki cars across 3 accessible Pune branches: <strong className="font-semibold">Kondhwa</strong>, <strong className="font-semibold">Gangadham</strong>, and <strong className="font-semibold">Undri</strong>. No complex booking hoops—confirm fast via WhatsApp.
          </p>

          {/* Responsive Action Buttons (Stacked on mobile, row on tablet/desktop) */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 max-w-md sm:max-w-none mx-auto">
            <button
              onClick={() => scrollToEnquiry()}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#d4b373] text-[#0a0a0b] font-bold text-sm sm:text-base hover:bg-[#e2c48a] transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
            >
              <span>Start an Enquiry</span>
              <span>&rarr;</span>
            </button>

            <a
              href="#branches"
              className={`w-full sm:w-auto px-6 py-3.5 rounded-xl border text-sm sm:text-base font-semibold text-center transition-colors flex items-center justify-center gap-2 ${
                isDark
                  ? 'border-[#3b3b40] bg-[#141416]/80 text-[#f3eee4] hover:bg-[#1c1c1f]'
                  : 'border-[#ddd6c8] bg-white text-[#18160f] hover:bg-[#ece7dd] shadow-sm'
              }`}
            >
              <svg className="size-4 shrink-0 fill-current opacity-80" viewBox="0 0 24 24" aria-hidden>
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
              </svg>
              <span>View 3 Branches & Map</span>
            </a>
          </div>

          {/* Mobile-Friendly Feature Badges */}
          <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 max-w-3xl mx-auto text-left">
            {[
              { title: 'Self-Drive', desc: 'Full freedom, zero driver fee' },
              { title: '3 Pune Spots', desc: 'Kondhwa, Gangadham, Undri' },
              { title: 'WhatsApp Fast', desc: 'Instant confirmation & quotes' },
              { title: 'Maruti Fleet', desc: 'Fuel efficient & clean cars' },
            ].map((f, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-xl border transition-colors ${
                  isDark ? 'border-[#29292d]/80 bg-[#141416]/50' : 'border-[#ddd6c8]/80 bg-white/70 shadow-xs'
                }`}
              >
                <p className="text-xs font-bold text-[#d4b373]">{f.title}</p>
                <p className={`text-[11px] leading-tight mt-0.5 ${isDark ? 'text-[#9a9384]' : 'text-[#635d51]'}`}>
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fleet Catalogue */}
      <section id="fleet" className="py-14 sm:py-20 px-4 sm:px-6 max-w-6xl mx-auto">
        <div className="mb-8 sm:mb-12 text-center max-w-2xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#d4b373]">Authorized Fleet</p>
          <h2
            className={`text-2xl sm:text-4xl font-extrabold mt-1 tracking-tight ${
              isDark ? 'text-[#f3eee4]' : 'text-[#18160f]'
            }`}
          >
            Five Verified Maruti Suzuki Units
          </h2>
          <p className={`text-xs sm:text-sm mt-2 ${isDark ? 'text-[#9a9384]' : 'text-[#635d51]'}`}>
            Every vehicle is thoroughly sanitised, maintained, and ready for Pune and outstation trips.
          </p>

          {/* Responsive Fleet Filter Pills */}
          <div className="mt-5 flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap">
            {[
              { id: 'all', label: 'All Fleet (5)' },
              { id: 'suv', label: 'SUVs (2)' },
              { id: 'hatchback', label: 'Hatchback (1)' },
              { id: 'mpv', label: '7-Seaters (2)' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id as any)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                  selectedCategory === tab.id
                    ? 'bg-[#d4b373] text-[#0a0a0b] shadow-sm'
                    : isDark
                    ? 'bg-[#141416] text-[#c4bdaf] border border-[#29292d] hover:border-[#3b3b40]'
                    : 'bg-white text-[#48443b] border border-[#ddd6c8] hover:border-[#c6bca9] shadow-xs'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Fleet Grid: 1 col on mobile, 2 col on tablet, 3 col on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {filteredFleet.map((car) => (
            <div
              key={car.id}
              className={`rounded-2xl border p-4 sm:p-5 flex flex-col justify-between transition-all duration-200 group ${
                isDark
                  ? 'border-[#29292d] bg-[#141416] hover:border-[#d4b373]/50 shadow-md'
                  : 'border-[#ddd6c8] bg-white hover:border-[#d4b373] shadow-sm'
              }`}
            >
              <div>
                {/* Vehicle Image Container */}
                <div
                  className={`aspect-[16/10] rounded-xl border overflow-hidden mb-3.5 relative ${
                    isDark ? 'bg-[#1c1c1f] border-[#29292d]' : 'bg-[#ece7dd] border-[#ddd6c8]'
                  }`}
                >
                  <img
                    src={car.image}
                    alt={car.name}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {/* Category Pill Tag on Image */}
                  <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-md text-[10px] uppercase tracking-wider font-extrabold bg-[#0a0a0b]/85 backdrop-blur-xs text-[#d4b373] border border-[#d4b373]/30">
                    {car.category}
                  </span>
                </div>

                <h3
                  className={`text-lg sm:text-xl font-bold tracking-tight ${
                    isDark ? 'text-[#f3eee4]' : 'text-[#18160f]'
                  }`}
                >
                  {car.name}
                </h3>

                {/* Feature Specification Chips */}
                <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md font-medium text-[11px] ${
                      isDark ? 'bg-[#1c1c1f] text-[#c4bdaf]' : 'bg-[#f6f3ed] text-[#48443b]'
                    }`}
                  >
                    👤 {car.seats} Seats
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md font-medium text-[11px] ${
                      isDark ? 'bg-[#1c1c1f] text-[#c4bdaf]' : 'bg-[#f6f3ed] text-[#48443b]'
                    }`}
                  >
                    ⚙️ {car.trans}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md font-medium text-[11px] ${
                      isDark ? 'bg-[#1c1c1f] text-[#c4bdaf]' : 'bg-[#f6f3ed] text-[#48443b]'
                    }`}
                  >
                    ⛽ {car.fuel}
                  </span>
                </div>
              </div>

              {/* Card Footer: Rate & Direct Booking Action */}
              <div
                className={`mt-5 pt-3.5 border-t flex items-center justify-between gap-3 ${
                  isDark ? 'border-[#29292d]' : 'border-[#ddd6c8]'
                }`}
              >
                <div>
                  <span
                    className={`text-[10px] uppercase tracking-wider font-semibold block ${
                      isDark ? 'text-[#9a9384]' : 'text-[#635d51]'
                    }`}
                  >
                    Rental Rate
                  </span>
                  <span
                    className={`text-xs sm:text-sm font-bold ${
                      isDark ? 'text-[#f3eee4]' : 'text-[#18160f]'
                    }`}
                  >
                    On Request
                  </span>
                </div>

                <button
                  onClick={() => scrollToEnquiry(car.id)}
                  className={`px-3.5 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95 ${
                    isDark
                      ? 'bg-[#1c1c1f] hover:bg-[#d4b373] text-[#d4b373] hover:text-[#0a0a0b] border border-[#3b3b40]'
                      : 'bg-[#f6f3ed] hover:bg-[#d4b373] text-[#77571b] hover:text-[#0a0a0b] border border-[#ddd6c8]'
                  }`}
                >
                  <span>Select Car</span>
                  <span>&rarr;</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Our 3 Pune Branches Section */}
      <section
        id="branches"
        className={`py-14 sm:py-20 px-4 sm:px-6 border-t transition-colors duration-300 ${
          isDark ? 'border-[#232a3e] bg-[#07090e]' : 'border-[#ddd6c8] bg-[#ece7dd]'
        }`}
      >
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="mb-8 sm:mb-12 max-w-2xl">
            <p
              className={`text-xs font-bold uppercase tracking-[0.2em] mb-1.5 ${
                isDark ? 'text-[#facc15]' : 'text-[#77571b]'
              }`}
            >
              PICKUP LOCATIONS
            </p>
            <h2
              className={`text-2xl sm:text-4xl font-extrabold tracking-tight ${
                isDark ? 'text-white' : 'text-[#18160f]'
              }`}
            >
              Find Zippy Car Rental near you in Pune
            </h2>
            <p className={`text-xs sm:text-sm mt-2 ${isDark ? 'text-[#9ca3af]' : 'text-[#635d51]'}`}>
              3 convenient self-drive pickup points in Pune. Tap &quot;Get Directions&quot; to open the Google Maps location directly.
            </p>
          </div>

          {/* 3 Branch Cards Grid (1 col on mobile, 3 col on tablet/desktop) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
            {BRANCHES.map((b) => (
              <div
                key={b.id}
                className={`rounded-2xl p-5 sm:p-6 flex flex-col justify-between border transition-all duration-200 ${
                  isDark
                    ? 'bg-[#10141f] border-[#232a3e] shadow-xl hover:border-[#3d4968]'
                    : 'bg-white border-[#ddd6c8] shadow-md hover:border-[#c6bca9]'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`size-10 sm:size-11 rounded-xl border flex items-center justify-center shrink-0 ${
                          isDark
                            ? 'bg-[#26251b] border-[#4d441e] text-[#facc15]'
                            : 'bg-[#f6ecd6] border-[#e9c06d] text-[#77571b]'
                        }`}
                      >
                        <svg
                          className="size-5"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.2"
                          viewBox="0 0 24 24"
                          aria-hidden
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3
                          className={`text-lg sm:text-xl font-bold tracking-tight ${
                            isDark ? 'text-white' : 'text-[#18160f]'
                          }`}
                        >
                          {b.name}
                        </h3>
                        <span
                          className={`text-[11px] font-semibold block ${
                            isDark ? 'text-[#facc15]' : 'text-[#77571b]'
                          }`}
                        >
                          {b.tag}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p
                    className={`text-xs sm:text-sm leading-relaxed mb-5 ${
                      isDark ? 'text-[#9ca3af]' : 'text-[#48443b]'
                    }`}
                  >
                    {b.address}
                  </p>
                </div>

                {/* Mobile-Optimized Action Buttons */}
                <div className="space-y-2 pt-2">
                  <a
                    href={b.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#facc15] hover:bg-[#eab308] text-[#0a0a0b] font-bold text-xs sm:text-sm py-2.5 px-4 transition-colors shadow-sm active:scale-98"
                  >
                    <svg className="size-4 shrink-0 fill-current" viewBox="0 0 24 24" aria-hidden>
                      <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                    </svg>
                    <span>Get Directions (Maps)</span>
                  </a>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => scrollToEnquiry(undefined, b.id)}
                      className={`w-full py-2 px-2.5 rounded-lg text-xs font-semibold border text-center transition-colors ${
                        isDark
                          ? 'border-[#232a3e] bg-[#141824] hover:bg-[#1a2030] text-[#c4bdaf]'
                          : 'border-[#ddd6c8] bg-[#f6f3ed] hover:bg-[#ece7dd] text-[#48443b]'
                      }`}
                    >
                      Book from here &darr;
                    </button>

                    <button
                      onClick={() => setActiveMapBranch(b.id)}
                      className={`w-full py-2 px-2.5 rounded-lg text-xs font-semibold border text-center transition-colors ${
                        activeMapBranch === b.id
                          ? isDark
                            ? 'border-[#facc15]/40 text-[#facc15] bg-[#26251b]'
                            : 'border-[#77571b]/40 text-[#77571b] bg-[#f6ecd6]'
                          : isDark
                          ? 'border-[#232a3e] bg-[#141824] hover:bg-[#1a2030] text-[#9ca3af]'
                          : 'border-[#ddd6c8] bg-[#f6f3ed] hover:bg-[#ece7dd] text-[#635d51]'
                      }`}
                    >
                      View on Map
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Static Google Map Preview Box */}
          <div
            className={`mt-10 sm:mt-12 rounded-2xl border p-4 sm:p-7 transition-colors duration-300 ${
              isDark ? 'border-[#232a3e] bg-[#10141f] shadow-xl' : 'border-[#ddd6c8] bg-white shadow-md'
            }`}
          >
            {/* Header with Switcher Tabs */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 sm:mb-5">
              <div>
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-[#facc15] animate-pulse"></span>
                  <h3
                    className={`text-base sm:text-lg font-bold ${
                      isDark ? 'text-white' : 'text-[#18160f]'
                    }`}
                  >
                    Map Preview &middot; {activeBranchMapObj.name} Branch
                  </h3>
                </div>
                <p className={`text-xs mt-0.5 ${isDark ? 'text-[#9ca3af]' : 'text-[#635d51]'}`}>
                  {activeBranchMapObj.address}
                </p>
              </div>

              {/* Branch Switcher: Grid 3-col on mobile, flex on desktop */}
              <div
                className={`grid grid-cols-3 sm:flex items-center gap-1 p-1 rounded-xl border w-full sm:w-auto ${
                  isDark ? 'bg-[#07090e] border-[#232a3e]' : 'bg-[#f6f3ed] border-[#ddd6c8]'
                }`}
              >
                {BRANCHES.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => setActiveMapBranch(b.id)}
                    className={`py-2 px-2.5 sm:px-3.5 rounded-lg text-xs font-bold text-center transition-all ${
                      activeMapBranch === b.id
                        ? 'bg-[#facc15] text-[#0a0a0b] shadow-sm'
                        : isDark
                        ? 'text-[#9ca3af] hover:text-white'
                        : 'text-[#635d51] hover:text-[#18160f]'
                    }`}
                  >
                    {b.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Map Frame */}
            <div
              className={`w-full h-64 sm:h-80 md:h-96 rounded-xl overflow-hidden border relative ${
                isDark ? 'border-[#232a3e] bg-[#07090e]' : 'border-[#ddd6c8] bg-[#ece7dd]'
              }`}
            >
              <iframe
                title={`Zippy Car Rental ${activeBranchMapObj.name} Branch Map`}
                src={`https://maps.google.com/maps?q=${encodeURIComponent(
                  activeBranchMapObj.mapQuery
                )}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                className="size-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            {/* Direct Open in Google Maps Banner */}
            <div className="mt-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <span className={`text-[11px] sm:text-xs ${isDark ? 'text-[#9ca3af]' : 'text-[#635d51]'}`}>
                📍 Khadi Machine Chowk &bull; Gangadham Chowk &bull; Undri Euro School
              </span>
              <a
                href={activeBranchMapObj.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto text-center inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-lg font-bold text-xs bg-[#facc15]/15 hover:bg-[#facc15]/25 text-[#facc15] border border-[#facc15]/30 transition-colors"
              >
                <span>Open {activeBranchMapObj.name} in Google Maps App</span>
                <span>&rarr;</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Rental Enquiry Form */}
      <section
        id="enquiry"
        className={`py-14 sm:py-20 px-4 sm:px-6 border-t transition-colors duration-300 ${
          isDark ? 'border-[#29292d] bg-[#141416]' : 'border-[#ddd6c8] bg-[#f6f3ed]'
        }`}
      >
        <div className="max-w-2xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-7 sm:mb-9">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#d4b373]">Fast Booking</p>
            <h2
              className={`text-2xl sm:text-3xl font-extrabold mt-1 tracking-tight ${
                isDark ? 'text-[#f3eee4]' : 'text-[#18160f]'
              }`}
            >
              Plan Your Self-Drive Rental
            </h2>
            <p className={`text-xs sm:text-sm mt-1.5 px-4 ${isDark ? 'text-[#9a9384]' : 'text-[#635d51]'}`}>
              Select your car and dates. We will automatically generate your WhatsApp enquiry with no upfront payment.
            </p>
          </div>

          {/* Form Card */}
          <div
            className={`rounded-2xl border p-5 sm:p-7 space-y-5 transition-colors duration-300 ${
              isDark ? 'border-[#29292d] bg-[#0a0a0b] shadow-xl' : 'border-[#ddd6c8] bg-white shadow-lg'
            }`}
          >
            {/* Step 1: Vehicle & Branch */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${
                    isDark ? 'text-[#c4bdaf]' : 'text-[#48443b]'
                  }`}
                >
                  1. Select Vehicle
                </label>
                <select
                  value={selectedCar}
                  onChange={(e) => setSelectedCar(e.target.value)}
                  className={`w-full border rounded-xl px-3.5 py-3 text-base sm:text-sm font-medium focus:outline-none focus:border-[#d4b373] transition-colors ${
                    isDark
                      ? 'bg-[#141416] border-[#29292d] text-[#f3eee4]'
                      : 'bg-[#f6f3ed] border-[#ddd6c8] text-[#18160f]'
                  }`}
                >
                  {FLEET.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.seats} seats)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${
                    isDark ? 'text-[#c4bdaf]' : 'text-[#48443b]'
                  }`}
                >
                  2. Pickup Branch (Pune)
                </label>
                <select
                  value={selectedBranch}
                  onChange={(e) => {
                    setSelectedBranch(e.target.value)
                    setActiveMapBranch(e.target.value)
                  }}
                  className={`w-full border rounded-xl px-3.5 py-3 text-base sm:text-sm font-medium focus:outline-none focus:border-[#d4b373] transition-colors ${
                    isDark
                      ? 'bg-[#141416] border-[#29292d] text-[#f3eee4]'
                      : 'bg-[#f6f3ed] border-[#ddd6c8] text-[#18160f]'
                  }`}
                >
                  {BRANCHES.map((b, i) => (
                    <option key={b.id} value={b.id}>
                      {i + 1}) {b.name} ({b.tag})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Step 2: Pickup & Return Dates */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${
                    isDark ? 'text-[#c4bdaf]' : 'text-[#48443b]'
                  }`}
                >
                  3. Pickup Date
                </label>
                <input
                  type="date"
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  className={`w-full border rounded-xl px-3.5 py-3 text-base sm:text-sm font-medium focus:outline-none focus:border-[#d4b373] transition-colors ${
                    isDark
                      ? 'bg-[#141416] border-[#29292d] text-[#f3eee4]'
                      : 'bg-[#f6f3ed] border-[#ddd6c8] text-[#18160f]'
                  }`}
                />
              </div>

              <div>
                <label
                  className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${
                    isDark ? 'text-[#c4bdaf]' : 'text-[#48443b]'
                  }`}
                >
                  4. Return Date
                </label>
                <input
                  type="date"
                  value={returnDate}
                  min={pickupDate || undefined}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className={`w-full border rounded-xl px-3.5 py-3 text-base sm:text-sm font-medium focus:outline-none focus:border-[#d4b373] transition-colors ${
                    isDark
                      ? 'bg-[#141416] border-[#29292d] text-[#f3eee4]'
                      : 'bg-[#f6f3ed] border-[#ddd6c8] text-[#18160f]'
                  }`}
                />
              </div>
            </div>

            {/* Live Calculation / Booking Summary */}
            <div
              className={`p-3.5 sm:p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                isDark ? 'border-[#29292d] bg-[#141416]/80' : 'border-[#ddd6c8] bg-[#f6f3ed]/80'
              }`}
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#d4b373]">
                    {selectedCarObj?.name}
                  </span>
                  <span className={`text-[11px] ${isDark ? 'text-[#9a9384]' : 'text-[#635d51]'}`}>
                    &bull; {selectedBranchObj?.name} Branch
                  </span>
                </div>
                <p className={`text-xs ${isDark ? 'text-[#c4bdaf]' : 'text-[#48443b]'}`}>
                  {durationDays ? (
                    <span className="font-semibold text-emerald-500">
                      Estimated Duration: {durationDays} {durationDays === 1 ? 'Day' : 'Days'}
                    </span>
                  ) : (
                    <span>Select pickup & return dates above</span>
                  )}
                </p>
              </div>

              <div className="text-left sm:text-right">
                <span
                  className={`text-[10px] uppercase tracking-wider font-semibold block ${
                    isDark ? 'text-[#9a9384]' : 'text-[#635d51]'
                  }`}
                >
                  Payment
                </span>
                <span
                  className={`text-xs font-bold ${
                    isDark ? 'text-[#f3eee4]' : 'text-[#18160f]'
                  }`}
                >
                  Pay on pickup
                </span>
              </div>
            </div>

            {/* Primary Action Button: WhatsApp */}
            <div className="pt-2 space-y-3">
              <button
                onClick={handleSendEnquiry}
                className="w-full py-4 px-5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-extrabold text-sm sm:text-base transition-all flex items-center justify-center gap-2.5 shadow-lg shadow-[#25D366]/20 active:scale-[0.98]"
              >
                <svg viewBox="0 0 24 24" className="size-5 fill-current shrink-0" aria-hidden>
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                <span>Send Enquiry via WhatsApp &rarr;</span>
              </button>

              {/* Direct Call Secondary Option */}
              <div className="text-center pt-1">
                <a
                  href={PHONE_TEL}
                  className={`inline-flex items-center gap-1.5 text-xs font-semibold hover:underline ${
                    isDark ? 'text-[#9a9384] hover:text-[#f3eee4]' : 'text-[#635d51] hover:text-[#18160f]'
                  }`}
                >
                  <svg className="size-3.5 fill-current text-[#25D366]" viewBox="0 0 24 24" aria-hidden>
                    <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.45.57 3.57a1 1 0 01-.25 1.02l-2.2 2.2z" />
                  </svg>
                  <span>Or call Pune desk: {PHONE_DISPLAY}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className={`py-10 sm:py-12 px-4 sm:px-6 border-t text-center text-xs transition-colors duration-300 ${
          isDark ? 'border-[#29292d] bg-[#0a0a0b] text-[#9a9384]' : 'border-[#ddd6c8] bg-[#ece7dd] text-[#635d51]'
        }`}
      >
        <div className="max-w-4xl mx-auto flex flex-col items-center gap-3">
          <img
            src="/zippy_main_logo.png"
            alt="Zippy Car Rental Pune"
            className="h-8 w-auto object-contain opacity-90"
          />
          <p className="font-semibold text-sm">
            Zippy Car Rental Pune &middot; Self-Drive Solutions
          </p>
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs">
            <span>Kondhwa: Khadi Machine Chowk</span>
            <span>&bull;</span>
            <span>Gangadham: Ganga Dham Road</span>
            <span>&bull;</span>
            <span>Undri: Euro School Marg</span>
          </div>
          <p className="pt-2 text-[11px] opacity-75">
            &copy; {new Date().getFullYear()} Zippy Car Rental Pune. All rights reserved. Direct WhatsApp booking without hidden broker commissions.
          </p>
        </div>
      </footer>

      {/* Mobile Sticky Bottom Action Bar (visible strictly on mobile screens < 640px) */}
      <div
        className={`sm:hidden fixed bottom-0 left-0 right-0 z-40 border-t backdrop-blur-lg px-3 py-2.5 flex items-center gap-2.5 shadow-2xl transition-colors ${
          isDark
            ? 'bg-[#0a0a0b]/95 border-[#29292d]'
            : 'bg-[#f6f3ed]/95 border-[#ddd6c8]'
        }`}
        style={{ paddingBottom: 'max(0.625rem, env(safe-area-inset-bottom))' }}
      >
        <a
          href={PHONE_TEL}
          className="flex-1 py-2.5 px-3 rounded-xl border font-bold text-xs flex items-center justify-center gap-1.5 transition-colors active:scale-95 bg-[#141416] border-[#3b3b40] text-[#f3eee4]"
        >
          <svg className="size-4 fill-current text-[#22c55e]" viewBox="0 0 24 24" aria-hidden>
            <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.45.57 3.57a1 1 0 01-.25 1.02l-2.2 2.2z" />
          </svg>
          <span>Call Desk</span>
        </a>

        <button
          onClick={() => scrollToEnquiry()}
          className="flex-[1.5] py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-transform active:scale-95 bg-[#25D366] text-white shadow-md shadow-[#25D366]/20"
        >
          <svg viewBox="0 0 24 24" className="size-4 fill-current shrink-0" aria-hidden>
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          <span>Book on WhatsApp</span>
        </button>
      </div>
    </div>
  )
}
