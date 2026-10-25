"use client";

import { ChevronDown, ChevronRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useRef } from "react";

import {
  cardCount,
  COUNTRY_CODES,
  isDealerCountry,
  PENDING_ID,
  regionOf,
  type DealerCountry,
} from "@/lib/dealers";

import { DealerMap } from "./dealer-map";
import { DealerPanel, PanelStart } from "./dealer-panel";
import { reducedMotion, selectCountry, STACKED, useDealerCountry, useInteracted } from "./dealer-selection";

const OUTSIDE = ["am", "as", "af"] as const;

/**
 * The map page: Europe on the left with the countries outside Europe under
 * it, the picked country's dealers on the right. At 1000px and below it is
 * one column in the order a phone needs: a country dropdown, the map, the
 * dealers, then the countries outside Europe.
 */
export function DealerFinder() {
  const t = useTranslations("Dealers");
  const locale = useLocale();
  const country = useDealerCountry();
  const interacted = useInteracted();
  const panel = useRef<HTMLDivElement>(null);
  const select = useRef<HTMLSelectElement>(null);

  const name = (code: DealerCountry) => t(`countries.${code}`);
  const sorted = [...COUNTRY_CODES].sort((a, b) => name(a).localeCompare(name(b), locale));

  // The deep-linked country is on screen: drop the page's pre-hydration style
  // that hid "Pick a country" (see `pendingScript`).
  useEffect(() => {
    if (country) document.getElementById(PENDING_ID)?.remove();
  }, [country]);

  function pick(code: DealerCountry) {
    selectCountry(code);
    // Stacked, the dealers open under the map: bring them up.
    if (window.matchMedia(STACKED).matches && panel.current) {
      panel.current.scrollIntoView({ behavior: reducedMotion() ? "auto" : "smooth", block: "start" });
    }
  }

  function changeCountry() {
    const box = select.current;
    if (!box) return;
    box.scrollIntoView({ block: "center" });
    box.focus({ preventScroll: true });
  }

  return (
    <div className="gutter">
      <div className="wrap grid items-start gap-x-[clamp(28px,4vw,56px)] pt-[clamp(32px,4vw,48px)] pb-[clamp(56px,7vw,88px)] min-[1001px]:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] max-[1001px]:gap-y-4">
        <div className="relative min-[1001px]:hidden">
          <label htmlFor="dealer-country" className="sr-only">
            {t("picker.select")}
          </label>
          <select
            ref={select}
            id="dealer-country"
            value={country ?? ""}
            onChange={(event) => {
              if (isDealerCountry(event.target.value)) pick(event.target.value);
            }}
            className="w-full cursor-pointer appearance-none rounded-none bg-white pt-[18px] pr-12 pb-4 pl-[18px] font-display text-[1.0625rem] leading-[1.2] font-semibold text-ink shadow-[inset_0_0_0_1px_var(--color-line-strong)] focus:shadow-[inset_0_0_0_3px_var(--color-yellow)] focus:outline-none"
          >
            <option value="">{t("picker.choose")}</option>
            {sorted.map((code) => (
              <option key={code} value={code}>
                {t("picker.option", { country: name(code), count: cardCount(code) })}
              </option>
            ))}
          </select>
          <ChevronDown
            className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-ink"
            strokeWidth={2.6}
            aria-hidden="true"
          />
        </div>

        <div className="min-[1001px]:col-start-1">
          <DealerMap selected={country} onPick={pick} />
        </div>

        <ul className="flex flex-wrap gap-x-[22px] gap-y-1.5 text-sm text-mute min-[1001px]:col-start-1 min-[1001px]:mt-3 max-[1001px]:-mt-1.5">
          <li className="flex items-center gap-2">
            <span aria-hidden="true" className="size-3.5 bg-map" />
            {t("map.keyCountry")}
          </li>
          <li className="flex items-center gap-2">
            <span aria-hidden="true" className="size-3.5 bg-black" />
            {t("map.keyCount")}
          </li>
        </ul>

        <div
          ref={panel}
          className="min-w-0 scroll-mt-2 min-[1001px]:sticky min-[1001px]:top-4 min-[1001px]:col-start-2 min-[1001px]:row-span-3 min-[1001px]:row-start-1 max-[1001px]:mt-4"
        >
          {country ? (
            <DealerPanel key={country} country={country} onChangeCountry={changeCountry} />
          ) : (
            <PanelStart onPick={pick} />
          )}
        </div>

        <section
          aria-labelledby="outside-title"
          className="min-[1001px]:col-start-1 min-[1001px]:mt-[clamp(28px,4vw,44px)] max-[1001px]:mt-6"
        >
          <h2
            id="outside-title"
            className="border-b-[3px] border-ink pb-2.5 text-[clamp(1.375rem,2.2vw,1.75rem)] leading-[1.05] font-extrabold uppercase"
          >
            {t("outside.title")}
          </h2>
          <div className="grid grid-cols-3 gap-x-[clamp(16px,2.4vw,32px)] max-[721px]:grid-cols-2 max-[561px]:grid-cols-1">
            {OUTSIDE.map((region) => (
              <div key={region}>
                <h3 className="caps pt-[18px] pb-1.5 text-mute">{t(`outside.${region}`)}</h3>
                <ul>
                  {sorted
                    .filter((code) => regionOf(code) === region)
                    .map((code) => (
                      <li key={code}>
                        <button
                          type="button"
                          aria-pressed={country === code}
                          onClick={() => pick(code)}
                          className="group flex w-full cursor-pointer items-center justify-between gap-2.5 border-b border-line pt-[9px] pb-2 text-left font-medium text-ink focus-visible:outline-ink focus-visible:-outline-offset-3 aria-pressed:bg-yellow aria-pressed:px-2 pointer-coarse:min-h-11"
                        >
                          <span className="decoration-yellow decoration-2 underline-offset-4 group-hover:underline group-aria-pressed:decoration-black">
                            {name(code)}
                          </span>
                          <span className="inline-flex items-center gap-1 font-display text-[0.8125rem] leading-none font-semibold text-mute tabular-nums group-aria-pressed:text-black">
                            {cardCount(code)}
                            <ChevronRight
                              className="size-3.5 transition-transform duration-200 ease-out-expo group-hover:translate-x-1 group-hover:text-ink"
                              strokeWidth={2.4}
                              aria-hidden="true"
                            />
                          </span>
                        </button>
                      </li>
                    ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <p aria-live="polite" className="sr-only">
          {interacted && country ? t("picker.status", { country: name(country) }) : ""}
        </p>
      </div>
    </div>
  );
}
