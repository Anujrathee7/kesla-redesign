"use client";

import { useSyncExternalStore } from "react";

import { DEFAULT_VERSION, type VersionId } from "@/lib/product-2112z";

/**
 * The chosen 2112Z version, shared by every island that prints a figure: the
 * offer card, the compare table, the technical data table and the phone bar.
 * It is page state, not a URL, so the server and the first client render
 * show the 2112Z-81 and the page stays static.
 */
const listeners = new Set<() => void>();
let current: VersionId = DEFAULT_VERSION;
let interacted = false;

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function setVersion(version: VersionId) {
  if (version === current && interacted) return;
  current = version;
  interacted = true;
  for (const listener of listeners) listener();
}

export function useVersion(): VersionId {
  return useSyncExternalStore(
    subscribe,
    () => current,
    () => DEFAULT_VERSION,
  );
}

/** True once the visitor has switched the version, so the live status stays quiet on load. */
export function useVersionInteracted(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => interacted,
    () => false,
  );
}
