import type { ReactNode } from "react";
import { Breadcrumbs, type Crumb } from "@/components/layout/Breadcrumbs";

export function PageIntro({
  crumbs,
  title,
  intro,
  children,
}: {
  crumbs: Crumb[];
  title: string;
  intro?: string;
  children?: ReactNode;
}) {
  return (
    <div className="border-b border-line">
      <div className="container-site py-10 sm:py-14">
        <Breadcrumbs items={crumbs} />
        <h1 className="mt-6 max-w-3xl font-display text-4xl font-extrabold tracking-[-0.03em] text-ink sm:text-5xl">
          {title}
        </h1>
        {intro ? (
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-2">{intro}</p>
        ) : null}
        {children}
      </div>
    </div>
  );
}
