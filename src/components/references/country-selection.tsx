"use client";

import { useEffect, useSyncExternalStore } from "react";

import { isCountryCode, type CountryCode } from "@/lib/references";

/**
 * The selected country lives in the URL hash (#fi, #de, #at), not in
 * searchParams, so the page stays fully static. The server and the first
 * client render show Finland; a deep link takes over right after hydration.
 * A group deep link (#de-cranes) picks the country before the dash and then
 * scrolls to that group. Same store as the Products page's family selection.
 */
const DEFAULT: CountryCode = "FI";

const listeners = new Set<() => void>();
let interacted = false;

function readHash(): CountryCode {
  const id = window.location.hash.slice(1).split("-")[0].toUpperCase();
  return isCountryCode(id) ? id : DEFAULT;
}

function emit() {
  for (const listener of listeners) listener();
}

function onHashChange() {
  interacted = true;
  emit();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (listeners.size === 1) window.addEventListener("hashchange", onHashChange);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) window.removeEventListener("hashchange", onHashChange);
  };
}

/** Scrolls to a product group and moves focus there, so the next Tab continues from it. */
function goToGroup(el: HTMLElement) {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  el.focus({ preventScroll: true });
}

export function selectCountry(country: CountryCode) {
  interacted = true;
  // Keep Next's own history state; only the hash changes.
  window.history.replaceState(window.history.state, "", `#${country.toLowerCase()}`);
  emit();
}

export function useCountry(): CountryCode {
  return useSyncExternalStore(subscribe, readHash, () => DEFAULT);
}

/** True once the visitor has picked a country, so a deep link is not announced on load. */
export function useInteracted(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => interacted,
    () => false,
  );
}

/**
 * One country's panel, rendered on the server and shown when its country is
 * picked. The inner key remounts the panel each time it is shown, so groups
 * opened with "Show all" close again, as in the mockup.
 */
export function CountryPanel({ country, children }: { country: CountryCode; children: React.ReactNode }) {
  const active = useCountry() === country;

  // A group deep link (#de-cranes): the panel was hidden when the browser
  // looked for the fragment, so go to the group once the panel is shown.
  useEffect(() => {
    if (!active) return;
    const id = window.location.hash.slice(1).toLowerCase();
    if (!id.startsWith(`${country.toLowerCase()}-`)) return;
    const el = document.getElementById(id);
    if (el) goToGroup(el);
  }, [active, country]);

  return (
    <div id={`refs-${country.toLowerCase()}`} hidden={!active}>
      <div key={active ? "shown" : "hidden"}>{children}</div>
    </div>
  );
}

/**
 * An in-page link to a product group. It scrolls instead of following the
 * fragment, because the hash already holds the country.
 */
export function JumpLink({ to, ...props }: Omit<React.ComponentProps<"a">, "href"> & { to: string }) {
  return (
    <a
      href={`#${to}`}
      onClick={(event) => {
        const el = document.getElementById(to);
        if (!el) return;
        event.preventDefault();
        goToGroup(el);
      }}
      {...props}
    />
  );
}
