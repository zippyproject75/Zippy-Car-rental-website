import { useTranslations } from "next-intl";
import { PendingBadge } from "@/components/ui/PendingBadge";
import type { PublicSpec } from "./specs";

export function useSpecValue() {
  const t = useTranslations("Specs");
  return (spec: PublicSpec): string => {
    switch (spec.key) {
      case "bodyType":
        return t(`bodyTypes.${spec.value}` as "bodyTypes.mpv");
      case "transmission":
        return t(`transmissions.${spec.value}` as "transmissions.manual");
      case "fuel":
        return t(`fuels.${spec.value}` as "fuels.petrol");
      case "seats":
        return t("seatsValue", { count: Number(spec.value) });
      default:
        return String(spec.value);
    }
  };
}

export function SpecList({ specs }: { specs: PublicSpec[] }) {
  const t = useTranslations("Specs");
  const format = useSpecValue();
  return (
    <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-card border border-line bg-line sm:grid-cols-3">
      {specs.map((spec) => (
        <div key={spec.key} className="bg-raised p-4">
          <dt className="text-xs font-semibold tracking-wide text-ink-3 uppercase">
            {t(spec.key)}
          </dt>
          <dd className="mt-1.5 flex flex-wrap items-center gap-2 font-display text-lg font-semibold tabular-nums text-ink">
            {format(spec)}
            {spec.pending ? <PendingBadge /> : null}
          </dd>
        </div>
      ))}
    </dl>
  );
}
