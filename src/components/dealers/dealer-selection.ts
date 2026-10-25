"use client";

import { useSyncExternalStore } from "react";

import { isDealerCountry, type DealerCountry } from "@/lib/dealers";

/**
 * The picked country lives in the URL hash (#fi, #de, #no), not in
 * searchParams, so the page stays fully static. Nothing is picked until the
 * visitor picks or a deep link names a country: the server and the first
 * client render show "Pick a country", as the mockup does. Same store as the
 * References country picker.
 */
const listeners = new Set<() => void>();
let interacted = false;

function readHash(): DealerCountry | null {
  const id = window.location.hash.slice(1).toUpperCase();
  return isDealerCountry(id) ? id : null;
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

export function selectCountry(country: DealerCountry) {
  interacted = true;
  // Keep Next's own history state; only the hash changes.
  window.history.replaceState(window.history.state, "", `#${country.toLowerCase()}`);
  emit();
}

export function useDealerCountry(): DealerCountry | null {
  return useSyncExternalStore(subscribe, readHash, () => null);
}

/** True once the visitor has picked a country, so a deep link is not announced on load. */
export function useInteracted(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => interacted,
    () => false,
  );
}

/** At 1000px and below the panel sits under the map instead of beside it. */
export const STACKED = "(max-width: 1000px)";

export function reducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
