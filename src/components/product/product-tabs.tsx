"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

import { cn } from "@/lib/utils";

/**
 * The open tab lives in the URL hash (#technical-data, #faq), so a link can
 * open the page on a tab, while the page itself stays static. The server and
 * the first client render show the overview.
 */
export const TAB_KEYS = ["overview", "technical-data", "options", "videos", "downloads", "faq"] as const;
export type TabKey = (typeof TAB_KEYS)[number];
const DEFAULT: TabKey = "overview";

function isTabKey(value: string): value is TabKey {
  return (TAB_KEYS as readonly string[]).includes(value);
}

const listeners = new Set<() => void>();

function readHash(): TabKey {
  const id = window.location.hash.slice(1);
  return isTabKey(id) ? id : DEFAULT;
}

function emit() {
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (listeners.size === 1) window.addEventListener("hashchange", emit);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) window.removeEventListener("hashchange", emit);
  };
}

function selectTab(tab: TabKey) {
  // Keep Next's own history state; only the hash changes.
  window.history.replaceState(window.history.state, "", tab === DEFAULT ? window.location.pathname + window.location.search : `#${tab}`);
  emit();
}

function useTab(): TabKey {
  return useSyncExternalStore(subscribe, readHash, () => DEFAULT);
}

export type ProductTab = { key: TabKey; label: string; panel: React.ReactNode };

/**
 * Overview, Technical data, Options, Videos, Downloads and FAQ, full width
 * under the black head. On desktop the tab row sticks to the top of the
 * window while the panels scroll; picking a tab while it is stuck brings the
 * new panel's start back under it. On phones the six tabs sit as a 3×2 grid
 * and do not stick. The panels are rendered on the server and only shown or
 * hidden here.
 */
export function ProductTabs({ label, tabs }: { label: string; tabs: readonly ProductTab[] }) {
  const active = useTab();
  const row = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLDivElement>(null);
  const panels = useRef<HTMLDivElement>(null);
  const [more, setMore] = useState(false);

  // Fade the row's right end while tabs are scrolled out of view (641px to ~700px).
  useEffect(() => {
    const el = list.current;
    if (!el) return;
    const check = () => setMore(el.scrollLeft + el.clientWidth < el.scrollWidth - 2);
    const first = requestAnimationFrame(check);
    el.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    return () => {
      cancelAnimationFrame(first);
      el.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, []);

  function open(tab: TabKey, focus = false) {
    const stuck = (row.current?.getBoundingClientRect().top ?? 1) <= 0 && getComputedStyle(row.current!).position === "sticky";
    selectTab(tab);
    const button = list.current?.querySelector<HTMLButtonElement>(`#tab-${tab}`);
    if (focus) button?.focus();
    button?.scrollIntoView({ block: "nearest", inline: "nearest" });
    if (stuck && panels.current && row.current) {
      const top = panels.current.getBoundingClientRect().top + window.scrollY - row.current.offsetHeight;
      window.scrollTo({ top });
    }
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLButtonElement>, index: number) {
    const last = tabs.length - 1;
    const next =
      event.key === "ArrowRight"
        ? index === last
          ? 0
          : index + 1
        : event.key === "ArrowLeft"
          ? index === 0
            ? last
            : index - 1
          : event.key === "Home"
            ? 0
            : event.key === "End"
              ? last
              : null;
    if (next == null) return;
    event.preventDefault();
    open(tabs[next].key, true);
  }

  return (
    <div>
      <div
        ref={row}
        className="z-10 border-b border-line bg-white gutter min-[641px]:sticky min-[641px]:top-0 max-[640px]:border-b-0 max-[640px]:pt-6"
      >
        <div className="wrap">
          <div
            ref={list}
            role="tablist"
            aria-label={label}
            className={cn(
              "flex gap-x-[22px] overflow-x-auto [scrollbar-width:none] max-[640px]:grid max-[640px]:grid-cols-3 max-[640px]:gap-0 max-[640px]:overflow-visible",
              more && "min-[641px]:[mask-image:linear-gradient(to_right,#000_calc(100%-56px),transparent)]",
            )}
          >
            {tabs.map((tab, index) => {
              const selected = tab.key === active;
              return (
                <button
                  key={tab.key}
                  id={`tab-${tab.key}`}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-controls={`panel-${tab.key}`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => open(tab.key)}
                  onKeyDown={(event) => onKeyDown(event, index)}
                  className={cn(
                    "shrink-0 border-b-[3px] pt-4 pb-[13px] font-display text-base leading-none font-semibold whitespace-nowrap transition-colors duration-200 ease-out focus-visible:outline-offset-[-3px]",
                    selected ? "border-yellow text-ink" : "border-transparent text-grey hover:text-ink",
                    // Phones: a 3×2 grid of ruled cells, the open one filled yellow.
                    "max-[640px]:-mr-px max-[640px]:-mb-px max-[640px]:min-h-11 max-[640px]:border max-[640px]:px-1 max-[640px]:pt-3.5 max-[640px]:pb-3 max-[640px]:text-center max-[640px]:text-[0.9375rem] max-[640px]:whitespace-normal",
                    selected
                      ? "max-[640px]:relative max-[640px]:border-yellow max-[640px]:bg-yellow max-[640px]:text-black max-[640px]:focus-visible:outline-black"
                      : "max-[640px]:border-line",
                  )}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div ref={panels} className="gutter">
        <div className="wrap pt-[clamp(28px,4vw,48px)] pb-[clamp(48px,7vw,88px)]">
          {tabs.map((tab) => (
            <div
              key={tab.key}
              id={`panel-${tab.key}`}
              role="tabpanel"
              aria-labelledby={`tab-${tab.key}`}
              tabIndex={0}
              hidden={tab.key !== active}
              className="scroll-mt-16 focus-visible:outline-offset-8"
            >
              {tab.panel}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
