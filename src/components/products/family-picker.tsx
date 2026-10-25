"use client";

import Image, { type StaticImageData } from "next/image";
import { useEffect, useRef } from "react";

import type { FamilyKey } from "@/lib/routes";

import { selectFamily, useFamily, useInteracted } from "./family-selection";

export type PickerOption = {
  family: FamilyKey;
  /** The base machine, the card's title. */
  base: string;
  /** The product family that fits it. */
  name: string;
  photo: StaticImageData;
  /** Read out politely when this family is picked. */
  status: string;
};

/**
 * Three photo cards that overlap the bottom of the head. The pressed card is
 * Kesla yellow with a colour photo; the others are white and greyscale until
 * hovered. Below 720px they stack as rows with the photo on the left.
 */
export function FamilyPicker({ label, options }: { label: string; options: readonly PickerOption[] }) {
  const selected = useFamily();
  const interacted = useInteracted();
  const ref = useRef<HTMLDivElement>(null);
  const status = options.find((o) => o.family === selected)?.status ?? "";

  // A #family link followed from further down the page (the footer) swaps the
  // panel off-screen, so bring the cards back into view.
  useEffect(() => {
    // An instant jump: a smooth scroll started here gets cancelled by the
    // fragment navigation that fired the event.
    function onHashChange() {
      ref.current?.scrollIntoView({ block: "start" });
    }
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  return (
    <div
      ref={ref}
      className="relative z-10 -mt-8 scroll-mt-20 gutter min-[721px]:mt-[clamp(-104px,-8vw,-64px)]"
    >
      <div
        role="group"
        aria-label={label}
        className="wrap grid gap-[clamp(12px,2vw,24px)] min-[721px]:grid-cols-3"
      >
        {options.map((option) => (
          <button
            key={option.family}
            type="button"
            aria-pressed={option.family === selected}
            aria-controls={`panel-${option.family}`}
            onClick={() => selectFamily(option.family)}
            className="group flex text-left focus-visible:shadow-[0_0_0_3px_var(--color-white),0_0_0_6px_var(--color-ink)] focus-visible:outline-hidden"
          >
            {/* The cut is on the inside: a clip-path on the button would clip its focus ring too. */}
            <span className="flex w-full bg-white [--cut:22px] cut min-[721px]:flex-col">
              <span className="relative w-[38%] shrink-0 overflow-hidden bg-warm min-[721px]:aspect-video min-[721px]:w-full">
                <Image
                  src={option.photo}
                  alt=""
                  fill
                  placeholder="blur"
                  sizes="(min-width: 721px) 33vw, 38vw"
                  className="object-cover contrast-105 grayscale transition-[filter] duration-400 ease-out group-hover:contrast-100 group-hover:grayscale-0 group-aria-pressed:contrast-100 group-aria-pressed:grayscale-0"
                />
              </span>
              <span className="flex flex-1 items-center gap-3.5 px-4 py-3.5 transition-colors duration-200 ease-out group-aria-pressed:bg-yellow min-[721px]:px-5 min-[721px]:pt-4 min-[721px]:pb-[22px]">
                <Image
                  src={`/images/icon-${option.family}.svg`}
                  alt=""
                  width={48}
                  height={48}
                  className="hidden size-12 shrink-0 min-[721px]:block"
                />
                <span>
                  <span className="block font-display text-[clamp(1.125rem,1.8vw,1.4375rem)] leading-[1.08] font-extrabold text-ink uppercase">
                    {option.base}
                  </span>
                  <span className="mt-1 block text-[0.9375rem] text-grey group-aria-pressed:text-black">
                    {option.name}
                  </span>
                </span>
              </span>
            </span>
          </button>
        ))}
      </div>
      <p aria-live="polite" className="sr-only">
        {interacted ? status : ""}
      </p>
    </div>
  );
}
