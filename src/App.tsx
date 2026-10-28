import React, { useState } from 'react'

const FLEET = [
  { id: 'fronx', name: 'Maruti Suzuki Fronx', category: 'Compact SUV', seats: 5, trans: 'Manual / Automatic', image: '/images/cars/fronx.jpeg' },
  { id: 'brezza', name: 'Maruti Suzuki Brezza', category: 'Compact SUV', seats: 5, trans: 'Manual / Automatic', image: '/images/cars/brezza.jpeg' },
  { id: 'baleno', name: 'Maruti Suzuki Baleno', category: 'Hatchback', seats: 5, trans: 'Manual / Automatic', image: '/images/cars/baleno.jpeg' },
  { id: 'ertiga-1', name: 'Maruti Suzuki Ertiga (Vehicle 1)', category: 'MPV', seats: 7, trans: 'Manual / Automatic', image: '/images/cars/ertiga.jpeg' },
  { id: 'ertiga-2', name: 'Maruti Suzuki Ertiga (Vehicle 2)', category: 'MPV', seats: 7, trans: 'Manual / Automatic', image: '/images/cars/ertiga.jpeg' },
]

const WHATSAPP_NUMBER = '919921208410'

function buildWhatsAppUrl(carId: string, pickupDate: string, returnDate: string): string {
  const car = FLEET.find((c) => c.id === carId)
  const carName = car?.name ?? 'Any available car'

  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'Not selected'
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
  }

  const lines = [
    'Hi Zippy! 👋',
    '',
    `🚗 Car: ${carName}`,
    `📅 Pickup: ${formatDate(pickupDate)}`,
    `📅 Return: ${formatDate(returnDate)}`,
    '',
    'Please confirm availability and price. Thank you!',
  ]

  const message = lines.join('\n')
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}

export default function App() {
  const [selectedCar, setSelectedCar] = useState('fronx')
  const [pickupDate, setPickupDate] = useState('')
  const [returnDate, setReturnDate] = useState('')

  const handleSendEnquiry = () => {
    const url = buildWhatsAppUrl(selectedCar, pickupDate, returnDate)
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-[#f3eee4] font-sans antialiased selection:bg-[#d4b373]/30">
      {/* Top Bar */}
      <header className="sticky top-0 z-30 border-b border-[#29292d] bg-[#0a0a0b]/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/zippy_main_logo.png"
              alt="Zippy Car Rental"
              className="h-9 w-auto object-contain shrink-0"
            />
            <div>
              <span className="font-extrabold tracking-widest text-[#f3eee4] text-base block leading-none">ZIPPY</span>
              <span className="text-[10px] tracking-[0.2em] text-[#9a9384] uppercase">Car Rental Pune</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="#enquiry"
              className="px-4 py-2 rounded-lg bg-[#d4b373] text-[#0a0a0b] font-semibold text-sm hover:bg-[#e2c48a] transition-colors"
            >
              Book Now &rarr;
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4 border-b border-[#29292d] bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(212,179,115,0.15),transparent)]">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#d4b373]">
            Self-Drive &middot; Pune, Maharashtra
          </p>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-[#f3eee4]">
            Self-drive car rental <span className="text-[#d4b373]">in Pune.</span>
          </h1>
          <p className="text-lg text-[#c4bdaf] max-w-2xl mx-auto leading-relaxed">
            Five Maruti Suzuki cars. Choose your dates and times, prepare an enquiry, and Zippy Car Rental confirms the price and availability with you.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <a
              href="#enquiry"
              className="px-6 py-3 rounded-lg bg-[#d4b373] text-[#0a0a0b] font-semibold hover:bg-[#e2c48a] transition-colors"
            >
              Start an enquiry &rarr;
            </a>
            <a
              href="#fleet"
              className="px-6 py-3 rounded-lg border border-[#3b3b40] text-[#f3eee4] font-semibold hover:bg-[#1c1c1f] transition-colors"
            >
              View the fleet
            </a>
          </div>
        </div>
      </section>

      {/* Fleet Catalogue */}
      <section id="fleet" className="py-16 px-4 max-w-6xl mx-auto">
        <div className="mb-10 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#d4b373]">Authorized Fleet</p>
          <h2 className="text-3xl font-bold mt-2 text-[#f3eee4]">Five Maruti Suzuki Units</h2>
          <p className="text-[#9a9384] text-sm mt-1">Each car is an individual verified fleet record</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FLEET.map((car) => (
            <div
              key={car.id}
              className="rounded-xl border border-[#29292d] bg-[#141416] p-5 flex flex-col justify-between hover:border-[#3b3b40] transition-colors"
            >
              <div>
                <div className="aspect-[16/10] rounded-lg bg-[#1c1c1f] border border-[#29292d] overflow-hidden mb-4 relative">
                  <img
                    src={car.image}
                    alt={car.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <span className="text-xs uppercase tracking-wider text-[#d4b373] font-medium">{car.category}</span>
                <h3 className="text-xl font-bold mt-1 text-[#f3eee4]">{car.name}</h3>
                <p className="text-xs text-[#9a9384] mt-2">
                  Seating: {car.seats} seats &bull; Transmission: {car.trans}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#29292d] flex items-center justify-between">
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-[#9a9384] block">Rental Rate</span>
                  <span className="text-sm font-semibold text-[#f3eee4]">Price on request</span>
                </div>
                <button
                  onClick={() => {
                    setSelectedCar(car.id)
                    document.getElementById('enquiry')?.scrollIntoView({ behavior: 'smooth' })
                  }}
                  className="px-3.5 py-2 rounded-lg bg-[#1c1c1f] hover:bg-[#29292d] text-xs font-semibold text-[#d4b373] border border-[#3b3b40] transition-colors"
                >
                  Enquire Now &rarr;
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Enquiry Calculator Preview */}
      <section id="enquiry" className="py-16 px-4 border-t border-[#29292d] bg-[#141416]">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#d4b373]">Interactive Flow</p>
            <h2 className="text-2xl font-bold text-[#f3eee4] mt-1">Rental Enquiry</h2>
            <p className="text-xs text-[#9a9384] mt-1">
              Your enquiry is sent directly to Zippy&apos;s WhatsApp &bull; No automatic charges
            </p>
          </div>

          <div className="rounded-xl border border-[#29292d] bg-[#0a0a0b] p-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#c4bdaf] uppercase tracking-wider mb-2">Select Vehicle</label>
              <select
                value={selectedCar}
                onChange={(e) => setSelectedCar(e.target.value)}
                className="w-full bg-[#141416] border border-[#29292d] rounded-lg px-3.5 py-2.5 text-sm text-[#f3eee4] focus:outline-none focus:border-[#d4b373]"
              >
                {FLEET.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#c4bdaf] uppercase tracking-wider mb-2">Pickup Date</label>
                <input
                  type="date"
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  className="w-full bg-[#141416] border border-[#29292d] rounded-lg px-3.5 py-2.5 text-sm text-[#f3eee4] focus:outline-none focus:border-[#d4b373]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#c4bdaf] uppercase tracking-wider mb-2">Return Date</label>
                <input
                  type="date"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="w-full bg-[#141416] border border-[#29292d] rounded-lg px-3.5 py-2.5 text-sm text-[#f3eee4] focus:outline-none focus:border-[#d4b373]"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-[#29292d] flex items-center justify-between">
              <div>
                <span className="text-xs text-[#9a9384] block">Duration / Rate</span>
                <span className="text-sm font-medium text-[#f3eee4]">
                  {pickupDate && returnDate ? 'Custom Duration' : 'Choose dates'} &bull; Price on request
                </span>
              </div>
              <button
                onClick={handleSendEnquiry}
                className="px-4 py-2.5 rounded-lg bg-[#25D366] text-white font-bold text-xs hover:bg-[#20bd5a] transition-colors flex items-center gap-2"
              >
                <svg viewBox="0 0 24 24" className="size-4 fill-current" aria-hidden>
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Send via WhatsApp &rarr;
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-[#29292d] text-center text-xs text-[#9a9384] flex flex-col items-center gap-2">
        <img
          src="/zippy_main_logo.png"
          alt="Zippy Car Rental"
          className="h-7 w-auto object-contain opacity-80"
        />
        <p>&copy; {new Date().getFullYear()} Zippy Car Rental Pune. All rights reserved.</p>
        <p>Self-Drive Car Rental &middot; Pune, Maharashtra</p>
      </footer>
    </div>
  )
}

