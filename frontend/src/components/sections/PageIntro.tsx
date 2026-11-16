import type { ReactNode } from "react";
import { Breadcrumbs, type Crumb } from "@/components/layout/Breadcrumbs";

export function PageIntro({
  crumbs,
  title,
  intro,
  children,
  aside,
}: {
  crumbs: Crumb[];
  title: string;
  intro?: string;
  children?: ReactNode;
  aside?: ReactNode;
}) {
  return (
    <div className="border-b border-line w-full max-w-full overflow-x-hidden relative bg-canvas">
      <div className="container-site py-10 sm:py-14 px-4 sm:px-6">
        {aside ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            <div className="lg:col-span-7 xl:col-span-6 flex flex-col justify-center">
              <Breadcrumbs items={crumbs} />
              <h1 className="mt-6 font-display text-4xl sm:text-5xl lg:text-[3.25rem] font-black tracking-[-0.03em] text-ink leading-[1.12]">
                {title}
              </h1>
              {intro ? (
                <p className="mt-5 text-base sm:text-lg leading-relaxed text-ink-2 max-w-xl">
                  {intro}
                </p>
              ) : null}
              {children}
            </div>
            <div className="lg:col-span-5 xl:col-span-6 flex items-center justify-center lg:justify-end relative mt-4 lg:mt-0">
              {aside}
            </div>
          </div>
        ) : (
          <>
            <Breadcrumbs items={crumbs} />
            <h1 className="mt-6 max-w-3xl font-display text-4xl font-extrabold tracking-[-0.03em] text-ink sm:text-5xl">
              {title}
            </h1>
            {intro ? (
              <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-2">{intro}</p>
            ) : null}
            {children}
          </>
        )}
      </div>
    </div>
  );
}
