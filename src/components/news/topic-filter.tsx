"use client";

import { selectTopic, useInteracted, useTopic, type Selection } from "./topic-selection";

export type TopicOption = {
  key: Selection;
  label: string;
  count: number;
  /** Read out politely when this topic is picked: "Showing 13 items: Machines and launches". */
  status: string;
};

/**
 * The topic chips in the black News head, under the H1: a toggle group of
 * square chips outlined in a light hairline, each with its item count in the
 * muted on-dark colour. The pressed chip is filled yellow with black text, the
 * one selected choice on the head (DESIGN.md, Chips in a black head).
 */
export function TopicFilter({ label, options }: { label: string; options: readonly TopicOption[] }) {
  const selected = useTopic();
  const interacted = useInteracted();
  const status = options.find((o) => o.key === selected)?.status ?? "";

  return (
    <>
      <div role="group" aria-label={label} className="flex flex-wrap gap-1.5">
        {options.map((option) => (
          <button
            key={option.key}
            type="button"
            data-topic-chip={option.key}
            aria-pressed={option.key === selected}
            aria-controls={option.key === "all" ? undefined : `news-${option.key}`}
            onClick={() => selectTopic(option.key)}
            className="group inline-flex cursor-pointer items-center gap-2 border border-on-dark-mute/70 px-3 pt-[9px] pb-2 font-display text-sm leading-none font-semibold text-on-dark transition-colors duration-200 ease-out hover:border-white hover:text-white aria-pressed:border-yellow aria-pressed:bg-yellow aria-pressed:text-black pointer-coarse:min-h-11"
          >
            {option.label}
            <span className="text-xs font-semibold text-on-dark-mute tabular-nums group-aria-pressed:text-black/75">
              {option.count}
            </span>
          </button>
        ))}
      </div>
      <p aria-live="polite" className="sr-only">
        {interacted ? status : ""}
      </p>
    </>
  );
}
