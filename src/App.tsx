import React, { useState } from 'react'

const FLEET = [
  { id: 'fronx', name: 'Maruti Suzuki Fronx', category: 'Compact SUV', seats: 5, trans: 'Manual / Automatic' },
  { id: 'brezza', name: 'Maruti Suzuki Brezza', category: 'Compact SUV', seats: 5, trans: 'Manual / Automatic' },
  { id: 'baleno', name: 'Maruti Suzuki Baleno', category: 'Hatchback', seats: 5, trans: 'Manual / Automatic' },
  { id: 'ertiga-1', name: 'Maruti Suzuki Ertiga (Vehicle 1)', category: 'MPV', seats: 7, trans: 'Manual / Automatic' },
  { id: 'ertiga-2', name: 'Maruti Suzuki Ertiga (Vehicle 2)', category: 'MPV', seats: 7, trans: 'Manual / Automatic' },
]

export default function App() {
  const [selectedCar, setSelectedCar] = useState('fronx')
  const [pickupDate, setPickupDate] = useState('')
  const [returnDate, setReturnDate] = useState('')

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-[#f3eee4] font-sans antialiased selection:bg-[#d4b373]/30">
      {/* Top Bar */}
      <header className="sticky top-0 z-30 border-b border-[#29292d] bg-[#0a0a0b]/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-8 rounded-lg bg-[#f3eee4] flex items-center justify-center font-black text-[#0a0a0b] text-base">
              Z
            </div>
            <div>
              <span className="font-extrabold tracking-widest text-[#f3eee4] text-base block leading-none">ZIPPY</span>
              <span className="text-[10px] tracking-[0.2em] text-[#9a9384] uppercase">Car Rental Pune</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="http://localhost:3000"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-lg bg-[#d4b373] text-[#0a0a0b] font-semibold text-sm hover:bg-[#e2c48a] transition-colors"
            >
              Open Production App (Port 3000) &rarr;
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
              href="http://localhost:3000/book"
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
          {FLEET.map((car, idx) => (
            <div
              key={car.id}
              className="rounded-xl border border-[#29292d] bg-[#141416] p-5 flex flex-col justify-between hover:border-[#3b3b40] transition-colors"
            >
              <div>
                <div className="aspect-[16/10] rounded-lg bg-[#1c1c1f] border border-[#29292d] flex items-center justify-center text-[#9a9384] text-sm font-medium mb-4">
                  Photo coming soon &middot; Unit {idx + 1}
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
                <a
                  href={`http://localhost:3000/cars/${car.id}`}
                  className="px-3.5 py-2 rounded-lg bg-[#1c1c1f] hover:bg-[#29292d] text-xs font-semibold text-[#d4b373] border border-[#3b3b40] transition-colors"
                >
                  View Details &rarr;
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Enquiry Calculator Preview */}
      <section className="py-16 px-4 border-t border-[#29292d] bg-[#141416]">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#d4b373]">Interactive Flow</p>
            <h2 className="text-2xl font-bold text-[#f3eee4] mt-1">Rental Enquiry Preview</h2>
            <p className="text-xs text-[#9a9384] mt-1">Direct manual confirmation via WhatsApp &bull; No automatic charges</p>
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
              <a
                href={`http://localhost:3000/book?car=${selectedCar}`}
                className="px-4 py-2.5 rounded-lg bg-[#d4b373] text-[#0a0a0b] font-bold text-xs hover:bg-[#e2c48a] transition-colors"
              >
                Send Enquiry &rarr;
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-[#29292d] text-center text-xs text-[#9a9384]">
        <p>&copy; {new Date().getFullYear()} Zippy Car Rental Pune. All rights reserved.</p>
        <p className="mt-1">Phase 1 Preview Prototype &middot; Connected to Production Next.js App on Port 3000</p>
      </footer>
    </div>
  )
}
