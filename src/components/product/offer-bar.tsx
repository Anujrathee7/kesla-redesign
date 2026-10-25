"use client";

import { ChevronDown } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import type { Locale } from "@/i18n/routing";
import { VERSIONS, figure, isVersionId, versionOf } from "@/lib/product-2112z";
import { localHref } from "@/lib/routes";

import { setVersion, useVersion } from "./version-store";

/**
 * Phones and tablets (1000px and below): once the card's own offer button has
 * scrolled away, a black bar at the bottom of the screen keeps the version,
 * its key figures and "Ask for an offer" in reach. It leaves again when the
 * dealer list comes into view, so it never sits over the dealers, the videos
 * or the footer. Desktop has no bar: Anuj removed the black offer strip under
 * the tabs (19 October 2026), and the card in the head holds the button.
 */
export function OfferBar() {
  const t = useTranslations("Product");
  const locale = useLocale() as Locale;
  const v = versionOf(useVersion());
  const [on, setOn] = useState(false);

  useEffect(() => {
    const narrow = window.matchMedia("(max-width: 1000px)");
    let frame = 0;

    function check() {
      frame = 0;
      const button = document.getElementById("offer-button");
      const dealers = document.getElementById("dealers");
      if (!narrow.matches || !button || !dealers) return setOn(false);
      setOn(button.getBoundingClientRect().bottom < 0 && dealers.getBoundingClientRect().top > window.innerHeight);
    }
    function schedule() {
      if (!frame) frame = requestAnimationFrame(check);
    }

    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    narrow.addEventListener("change", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      narrow.removeEventListener("change", schedule);
    };
  }, []);

  return (
    <div
      role="region"
      aria-label={t("bar.label")}
      hidden={!on}
      className="fixed inset-x-0 bottom-0 z-30 bg-black pt-2.5 pb-[max(10px,env(safe-area-inset-bottom))] text-on-dark shadow-[0_-1px_0_var(--color-dark-line)] gutter min-[1001px]:hidden"
    >
      <div className="mx-auto flex max-w-[640px] items-center gap-3">
        <div className="min-w-0 flex-1">
          <div className="relative inline-block">
            <select
              aria-label={t("bar.version")}
              value={v.id}
              onChange={(event) => {
                const value = event.target.value;
                if (isVersionId(value)) setVersion(value);
              }}
              className="min-h-11 cursor-pointer appearance-none rounded-none border border-dark-line bg-black py-2 pr-[30px] pl-2.5 font-display text-[0.9375rem] leading-[1.1] font-bold text-white focus-visible:outline-yellow"
            >
              {VERSIONS.map((x) => (
                <option key={x.id} value={x.id}>
                  KESLA {x.id}
                </option>
              ))}
            </select>
            <ChevronDown
              className="pointer-events-none absolute top-1/2 right-2.5 size-3 -translate-y-1/2 text-white"
              strokeWidth={2.5}
              aria-hidden="true"
            />
          </div>
          <p className="mt-1 truncate text-[0.8125rem] leading-[1.3] text-on-dark-mute tabular-nums">
            {figure(v, "outreach", locale)} · {figure(v, "torque", locale)} · {figure(v, "weight", locale)}
          </p>
        </div>
        <Button asChild className="shrink-0 px-4 text-sm focus-visible:outline-white">
          <a href={localHref("dealers", locale)}>{t("offerShort")}</a>
        </Button>
      </div>
    </div>
  );
}
