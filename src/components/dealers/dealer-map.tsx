"use client";

import { useTranslations } from "next-intl";

import { cardCount, type DealerCountry } from "@/lib/dealers";
import { LAND, MAP_BADGES, MAP_COUNTRIES, MAP_VIEWBOX } from "@/lib/dealers-map";
import { cn } from "@/lib/utils";

/**
 * Europe with every country that has a Kesla dealer drawn dark and labelled
 * with its count. Each country is a toggle button: click, tap, Enter or
 * Space picks it, and the picked one turns Kesla yellow. The badges are
 * drawn over the shapes but let the pointer through to them.
 */
export function DealerMap({
  selected,
  onPick,
}: {
  selected: DealerCountry | null;
  onPick: (country: DealerCountry) => void;
}) {
  const t = useTranslations("Dealers");

  return (
    <svg viewBox={MAP_VIEWBOX} role="group" aria-label={t("map.label")} className="block h-auto w-full">
      <path d={LAND} className="fill-warm stroke-white [stroke-width:1]" />
      {MAP_COUNTRIES.map(({ code, d }) => (
        <path
          key={code}
          d={d}
          role="button"
          tabIndex={0}
          aria-pressed={selected === code}
          aria-label={t("map.country", { country: t(`countries.${code}`), count: cardCount(code) })}
          onClick={() => onPick(code)}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              onPick(code);
            }
          }}
          className="cursor-pointer fill-map stroke-white [stroke-width:1.1] outline-none transition-[fill] duration-200 ease-out hover:fill-yellow-hi focus-visible:fill-yellow-hi focus-visible:stroke-ink focus-visible:[stroke-width:3] aria-pressed:fill-yellow aria-pressed:stroke-ink aria-pressed:[stroke-width:1.6] focus-visible:aria-pressed:[stroke-width:3.5]"
        />
      ))}
      {MAP_BADGES.map(({ code, x, y, w }) => {
        const on = selected === code;
        return (
          <g key={code} aria-hidden="true" transform={`translate(${x} ${y})`} className="pointer-events-none">
            <rect
              x={-w / 2}
              y={-16}
              width={w}
              height={32}
              className={cn(on ? "fill-white stroke-ink [stroke-width:2]" : "fill-black")}
            />
            <text
              y={7.5}
              textAnchor="middle"
              className={cn(
                "font-display text-[21px] font-bold tabular-nums max-[561px]:text-[23px]",
                on ? "fill-black" : "fill-yellow",
              )}
            >
              {cardCount(code)}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
