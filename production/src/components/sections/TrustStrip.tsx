import { Car, CheckCircle2, MapPin, MessageCircle } from "lucide-react";

const benefits = [
  {
    icon: Car,
    title: "Well-maintained vehicles",
    body: "Every Maruti Suzuki in the fleet is kept in excellent condition before your rental.",
  },
  {
    icon: CheckCircle2,
    title: "Flexible rental plans",
    body: "Hourly and multi-day rentals available. Enquire for rates tailored to your trip.",
  },
  {
    icon: MapPin,
    title: "3 convenient locations",
    body: "Pick up from Kondhwa, Gangadham, or Undri — wherever suits you best.",
  },
  {
    icon: MessageCircle,
    title: "Personal WhatsApp support",
    body: "Every enquiry is answered by Zippy directly. Real answers, no bots.",
  },
];

export function TrustStrip() {
  return (
    <section
      aria-label="Why choose Zippy"
      className="border-y border-line bg-raised"
    >
      <div className="container-site py-12 sm:py-16">
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map(({ icon: Icon, title, body }) => (
            <li key={title} className="flex gap-4">
              <div className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-xl border border-line bg-muted">
                <Icon aria-hidden className="size-5 text-accent-ink" />
              </div>
              <div>
                <h3 className="font-display text-[0.9375rem] font-bold text-ink">
                  {title}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-ink-3">{body}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

