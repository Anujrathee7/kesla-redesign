"use client";

import { useSyncExternalStore } from "react";

import { isTopicKey, type TopicKey } from "@/lib/news";
import { cn } from "@/lib/utils";

/**
 * The picked topic lives in the URL hash (#machines, #fairs, #service,
 * #company, #careers), not in searchParams, so the page stays fully static.
 * No hash means "Everything". The server and the first client render show
 * everything; a deep link takes over right after hydration. Same store shape
 * as the Products and References pickers.
 */
export type Selection = TopicKey | "all";

const listeners = new Set<() => void>();
let interacted = false;

function readHash(): Selection {
  const id = window.location.hash.slice(1);
  return isTopicKey(id) ? id : "all";
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

export function selectTopic(topic: Selection) {
  interacted = true;
  // Keep Next's own history state; only the hash changes.
  const url = topic === "all" ? window.location.pathname + window.location.search : `#${topic}`;
  window.history.replaceState(window.history.state, "", url);
  emit();
}

export function useTopic(): Selection {
  return useSyncExternalStore(subscribe, readHash, () => "all");
}

/** True once the visitor has picked a topic, so a deep link is not announced on load. */
export function useInteracted(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => interacted,
    () => false,
  );
}

/**
 * One topic's section, rendered in full on the server. It hides when another
 * topic is picked. Under "Everything" it carries `data-view="all"`, which
 * hides the rows past the topic's preview count (`group-data-[view=all]/topic:hidden`
 * on those rows) and shows its "All N" button.
 */
export function TopicSection({
  topic,
  className,
  children,
}: {
  topic: TopicKey;
  className?: string;
  children: React.ReactNode;
}) {
  const selected = useTopic();

  return (
    <section
      id={`news-${topic}`}
      aria-labelledby={`news-${topic}-title`}
      hidden={selected !== "all" && selected !== topic}
      data-view={selected === "all" ? "all" : "one"}
      className={cn("group/topic", className)}
    >
      {children}
    </section>
  );
}

/**
 * "All 13": picks the topic, then brings the filter back into view and moves
 * focus to the now pressed chip, since this button disappears with the pick.
 */
export function ShowTopicButton({ topic, label, text }: { topic: TopicKey; label: string; text: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-controls={`news-${topic}`}
      onClick={() => {
        selectTopic(topic);
        const chip = document.querySelector<HTMLElement>(`[data-topic-chip="${topic}"]`);
        if (!chip) return;
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        chip.closest("[role=group]")?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
        chip.focus({ preventScroll: true });
      }}
      className="hidden cursor-pointer font-display text-[0.9375rem] leading-[1.2] font-semibold whitespace-nowrap text-ink link-wipe group-data-[view=all]/topic:inline-block relative after:absolute after:-inset-x-2 after:-inset-y-3.5 after:content-['']"
    >
      {text}
    </button>
  );
}
