"use client";

import { useSyncExternalStore } from "react";

import { isFamilyKey, type FamilyKey } from "@/lib/routes";
import { cn } from "@/lib/utils";

/**
 * The selected base machine lives in the URL hash (#cranes, #logging,
 * #tractor), not in searchParams, so the page stays fully static. The server
 * and the first client render show cranes; a deep link takes over right after
 * hydration. Nothing animates until the visitor picks something.
 */
const DEFAULT: FamilyKey = "cranes";

const listeners = new Set<() => void>();
let interacted = false;

function readHash(): FamilyKey {
  const id = window.location.hash.slice(1);
  return isFamilyKey(id) ? id : DEFAULT;
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

export function selectFamily(family: FamilyKey) {
  interacted = true;
  // Keep Next's own history state; only the hash changes.
  window.history.replaceState(window.history.state, "", `#${family}`);
  emit();
}

export function useFamily(): FamilyKey {
  return useSyncExternalStore(subscribe, readHash, () => DEFAULT);
}

/** True once the visitor has picked a family, so a deep link does not fade on load. */
export function useInteracted(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => interacted,
    () => false,
  );
}

/** One of the stacked head photos. Only the selected one is visible. */
export function FamilyPhoto({ family, children }: { family: FamilyKey; children: React.ReactNode }) {
  const active = useFamily() === family;
  const animate = useInteracted();

  return (
    <div
      aria-hidden={!active}
      className={cn(
        "absolute inset-0 opacity-0",
        active && "opacity-100",
        animate && "transition-opacity duration-500 ease-out motion-reduce:transition-none",
      )}
    >
      {children}
    </div>
  );
}

/** One family's panel, rendered on the server and shown when its family is picked. */
export function FamilyPanel({ family, children }: { family: FamilyKey; children: React.ReactNode }) {
  const active = useFamily() === family;

  return (
    <div id={`panel-${family}`} hidden={!active}>
      {children}
    </div>
  );
}
