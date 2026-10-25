"use client";

import { useTranslations } from "next-intl";
import { useSyncExternalStore } from "react";

import { ENDED_BADGE_DAYS, fairStatus, type Fair, type FairStatus } from "@/lib/news";
import { cn } from "@/lib/utils";

export type FairRow = {
  slug: string;
  fair: Fair;
  href: string;
  hrefLang?: string;
  /** "15–18 Oct 2026 · Munich, Germany · stand FS 1011/1" */
  where: string;
  tile: { days: string; month: string };
};

function pad(n: number) {
  return String(n).padStart(2, "0");
}

/** The visitor's own calendar date, as an ISO date. */
function readToday(): string {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** Re-read once a minute, so a page left open over midnight moves on with the date. */
function subscribe(onChange: () => void) {
  const id = window.setInterval(onChange, 60_000);
  return () => window.clearInterval(id);
}

/**
 * Today's date, read in the browser and never at build time: the page is
 * prerendered once, so a date taken on the server would freeze the badges at
 * the build day. The server and the hydration render get `null`, and the
 * rows show without status until the browser's date arrives.
 */
function useToday(): string | null {
  return useSyncExternalStore(subscribe, readToday, () => null);
}

function StatusBadge({ status }: { status: FairStatus }) {
  const t = useTranslations("News.fairStatus");

  if (status.state === "past") {
    if (status.days > ENDED_BADGE_DAYS) return null;
    return (
      <span className="inline-flex items-center px-2 pt-[5px] pb-1 font-display text-xs leading-none font-bold tracking-[0.08em] whitespace-nowrap text-on-dark uppercase shadow-[inset_0_0_0_1px_var(--color-dark-line)]">
        {t("ended", { days: status.days })}
      </span>
    );
  }

  const text = status.state === "now" ? t(status.lastDay ? "lastDay" : "now") : t("next", { days: status.days });
  return (
    <span className="inline-flex items-center gap-[7px] bg-yellow px-2 pt-[5px] pb-1 font-display text-xs leading-none font-bold tracking-[0.08em] whitespace-nowrap text-black uppercase before:size-[7px] before:rounded-full before:bg-black before:content-['']">
      {text}
    </span>
  );
}

/**
 * Meet Kesla's fairs, newest first, on the black band. A fair that is on or
 * coming up gets the yellow date tile and a large name; a past fair drops to
 * a small row with an outlined tile. Which is which depends on today's date,
 * so this list is the page's one client-dated part.
 *
 * The prerendered rows have no date yet, so every row is laid out at one
 * height whatever its state: the same padding, a tile and a title with fixed
 * line boxes. When the browser's date arrives only colour and font size change
 * inside those boxes, and the list does not move.
 */
export function FairList({ rows }: { rows: readonly FairRow[] }) {
  const today = useToday();

  return (
    <ul>
      {rows.map((row) => {
        const status = today ? fairStatus(row.fair, today) : null;
        const big = status !== null && status.state !== "past";

        return (
          <li
            key={row.slug}
            className="relative grid grid-cols-[120px_minmax(0,1fr)_auto] items-center gap-x-6 gap-y-2 border-b border-dark-line py-3.5 max-[721px]:grid-cols-[92px_minmax(0,1fr)]"
          >
            {/* The full range is in the text beside it, so the tile is for the eye only. */}
            <span
              aria-hidden="true"
              className={cn(
                "grid place-items-center px-2 pt-3 pb-2.5 text-center font-display",
                big ? "cut bg-yellow text-black [--cut:12px]" : "text-on-dark shadow-[inset_0_0_0_1px_var(--color-dark-line)]",
              )}
            >
              <b
                className={cn(
                  "block leading-[26px] font-extrabold tracking-[-0.01em] whitespace-nowrap tabular-nums max-[721px]:leading-5",
                  big ? "text-[26px] max-[721px]:text-xl" : "text-lg",
                )}
              >
                {row.tile.days}
              </b>
              <small className="mt-1 block text-xs leading-[1.2] font-bold tracking-[0.08em] uppercase">
                {row.tile.month}
              </small>
            </span>
            <div className="min-w-0">
              <h3
                className={cn(
                  "font-display leading-[1.625rem] text-white",
                  big ? "text-[clamp(1.125rem,1.8vw,1.375rem)] font-extrabold uppercase" : "text-base font-bold",
                )}
              >
                <a
                  href={row.href}
                  hrefLang={row.hrefLang}
                  className="decoration-yellow decoration-2 underline-offset-[3px] hover:underline pointer-coarse:after:absolute pointer-coarse:after:inset-0 pointer-coarse:after:content-['']"
                >
                  {row.fair.name}
                </a>
              </h3>
              <p className="mt-1.5 text-[0.9375rem] leading-[1.45] text-on-dark-mute">{row.where}</p>
            </div>
            {status && (
              <div className="empty:hidden max-[721px]:col-start-2">
                <StatusBadge status={status} />
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
