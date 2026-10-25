"use client";

import { useMemo, useSyncExternalStore } from "react";

import { DEFAULT_FILTERS, isFilterHash, parseFilters, serializeFilters, type Filters } from "@/lib/timber-cranes";

/**
 * The finder's filters live in the URL hash (#boom=z&r=9.5&sort=t), not in
 * searchParams, so the page stays fully static and a filtered list can be
 * shared. The server and the first client render show every model; a deep
 * link takes over right after hydration. Same store shape as the References
 * country and the Products family selection.
 *
 * A slider fires on every step it passes, and Safari throttles
 * history.replaceState, so the list follows the in-memory state at once and
 * the hash is written once the visitor pauses.
 */
const listeners = new Set<() => void>();
let current: string | null = null;
let timer: ReturnType<typeof setTimeout> | undefined;

function emit() {
  for (const listener of listeners) listener();
}

function readHash(): string {
  const hash = window.location.hash.slice(1);
  return isFilterHash(hash) ? hash : "";
}

function onHashChange() {
  // An in-page jump (the skip link's #main) is not a filter state: keep the filters.
  const hash = window.location.hash.slice(1);
  if (!isFilterHash(hash) && hash !== "") return;
  current = hash;
  emit();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (listeners.size === 1) window.addEventListener("hashchange", onHashChange);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) {
      window.removeEventListener("hashchange", onHashChange);
      // Leaving the page: drop a pending write and read the URL afresh next time.
      clearTimeout(timer);
      current = null;
    }
  };
}

function getSnapshot(): string {
  if (current === null) current = readHash();
  return current;
}

function writeHash() {
  const { pathname, search } = window.location;
  // Keep Next's own history state; only the hash changes.
  window.history.replaceState(window.history.state, "", current ? `#${current}` : pathname + search);
}

export function setFilters(next: Filters) {
  current = serializeFilters(next);
  emit();
  clearTimeout(timer);
  timer = setTimeout(writeHash, 300);
}

export function useFilters(): Filters {
  const hash = useSyncExternalStore(subscribe, getSnapshot, () => "");
  return useMemo(() => (hash ? parseFilters(hash) : DEFAULT_FILTERS), [hash]);
}
