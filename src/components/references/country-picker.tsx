"use client";

import { useEffect, useRef } from "react";

import type { CountryCode } from "@/lib/references";

import { selectCountry, useCountry, useInteracted } from "./country-selection";

export type CountryOption = {
  code: CountryCode;
  name: string;
  /** "42 stories" */
  count: string;
  /** Read out politely when this country is picked. */
  status: string;
};

/**
 * The ten countries as tiles in the black head: five by two on desktop, a
 * sideways scroller at 1000px and below. The pressed tile is Kesla yellow.
 * On the grid a long name ("United Kingdom", "Iso-Britannia") wraps onto two
 * balanced lines and the row's tiles stretch to the tallest; on the scroller
 * each tile is as wide as its name, so nothing is cut.
 */
export function CountryPicker({ label, options }: { label: string; options: readonly CountryOption[] }) {
  const selected = useCountry();
  const interacted = useInteracted();
  const scroller = useRef<HTMLDivElement>(null);
  const status = options.find((o) => o.code === selected)?.status ?? "";

  // On the scroller, bring a deep-linked or picked tile into view without
  // moving the page.
  useEffect(() => {
    const box = scroller.current;
    const tile = box?.querySelector<HTMLElement>('[aria-pressed="true"]');
    if (!box || !tile || box.scrollWidth <= box.clientWidth) return;
    const pad = parseFloat(getComputedStyle(box).paddingLeft) || 0;
    const left = tile.offsetLeft - box.offsetLeft;
    if (left < box.scrollLeft + pad || left + tile.offsetWidth > box.scrollLeft + box.clientWidth) {
      box.scrollLeft = left - pad;
    }
  }, [selected]);

  return (
    <>
      <div
        ref={scroller}
        role="group"
        aria-label={label}
        className="mt-[clamp(22px,2.6vw,34px)] grid grid-cols-5 gap-2 max-[1001px]:-mr-[max(clamp(16px,4vw,40px),env(safe-area-inset-right,0px))] max-[1001px]:-ml-[max(clamp(16px,4vw,40px),env(safe-area-inset-left,0px))] max-[1001px]:flex max-[1001px]:snap-x max-[1001px]:snap-proximity max-[1001px]:overflow-x-auto max-[1001px]:scroll-pl-[max(clamp(16px,4vw,40px),env(safe-area-inset-left,0px))] max-[1001px]:pr-[max(clamp(16px,4vw,40px),env(safe-area-inset-right,0px))] max-[1001px]:pl-[max(clamp(16px,4vw,40px),env(safe-area-inset-left,0px))] max-[1001px]:pt-[5px] max-[1001px]:pb-1.5 max-[1001px]:[scrollbar-color:var(--color-on-dark-mute)_transparent] max-[1001px]:[scrollbar-width:thin] pointer-coarse:[scrollbar-width:none] pointer-coarse:[&::-webkit-scrollbar]:hidden"
      >
        {options.map((option) => (
          <button
            key={option.code}
            type="button"
            aria-pressed={option.code === selected}
            aria-controls={`refs-${option.code.toLowerCase()}`}
            onClick={() => selectCountry(option.code)}
            className="group grid min-w-0 cursor-pointer grid-cols-[auto_minmax(0,1fr)] items-center gap-x-3 gap-y-[3px] border border-dark-line px-3.5 pt-3 pb-[11px] text-left text-white transition-colors duration-200 ease-out hover:border-on-dark-mute focus-visible:outline-white aria-pressed:border-yellow aria-pressed:bg-yellow aria-pressed:text-black max-[1001px]:shrink-0 max-[1001px]:snap-start max-[1001px]:px-3 max-[1001px]:pt-2.5 max-[1001px]:pb-[9px]"
          >
            <span
              aria-hidden="true"
              className="row-span-2 inline-grid h-[1.75em] min-w-[2.4em] place-items-center border-[1.5px] border-current px-[5px] pt-px font-display text-xs leading-none font-bold tracking-[0.06em] text-yellow group-aria-pressed:text-black"
            >
              {option.code}
            </span>
            <span className="font-display text-[1.0625rem] leading-[1.05] font-bold text-balance max-[1001px]:text-base max-[1001px]:whitespace-nowrap max-[1001px]:leading-[1.15]">
              {option.name}
            </span>
            <span className="text-sm leading-[1.2] text-on-dark-mute group-aria-pressed:text-black">{option.count}</span>
          </button>
        ))}
      </div>
      <p aria-live="polite" className="sr-only">
        {interacted ? status : ""}
      </p>
    </>
  );
}
