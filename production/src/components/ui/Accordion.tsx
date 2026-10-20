import { ChevronDown } from "lucide-react";

/** Native <details>: keyboard and screen-reader accessible, answers stay in the DOM. */
export function Accordion({
  items,
}: {
  items: { id: string; question: string; answer: string }[];
}) {
  return (
    <div className="divide-y divide-line border-y border-line">
      {items.map((item) => (
        <details key={item.id} className="group" id={`faq-${item.id}`}>
          <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-6 py-4 text-left text-base font-semibold text-ink marker:hidden hover:text-accent-ink [&::-webkit-details-marker]:hidden">
            <span>{item.question}</span>
            <ChevronDown
              aria-hidden
              className="size-5 shrink-0 text-ink-3 transition-transform duration-200 group-open:rotate-180"
            />
          </summary>
          <p className="max-w-3xl pb-5 text-[0.9375rem] leading-relaxed text-ink-2">
            {item.answer}
          </p>
        </details>
      ))}
    </div>
  );
}
