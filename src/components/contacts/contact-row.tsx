import { ArrowUpRight, Mail, Phone } from "lucide-react";

import { cn } from "@/lib/utils";

export type ContactKind = "tel" | "mail" | "web";

const ICONS = {
  tel: <Phone className="size-[13px] shrink-0 fill-current" strokeWidth={0} aria-hidden="true" />,
  mail: <Mail className="size-[13px] shrink-0" strokeWidth={2.2} aria-hidden="true" />,
  web: <ArrowUpRight className="size-[13px] shrink-0" strokeWidth={2.5} aria-hidden="true" />,
};

/**
 * One contact line in a door or an accordion: who and the value on the left,
 * one fixed-width action on the right (yellow Call or Write, a hairline Open
 * for a website), so the actions line up down a column. A number that cannot
 * be dialled (`href` null) prints as plain text with no action.
 */
export function ContactRow({
  kind,
  value,
  href,
  who,
  action,
  label,
  dark = false,
}: {
  kind: ContactKind;
  /** What is printed: the number, address or host. */
  value: string;
  /** null: the value is printed with no action. */
  href: string | null;
  who?: React.ReactNode;
  /** The visible action word: Call, Write, Open. */
  action: string;
  /** The action's accessible name, with the value in it. */
  label: string;
  /** On a black band. */
  dark?: boolean;
}) {
  const external = kind === "web";

  return (
    <li
      className={cn(
        "grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3.5 gap-y-1 py-[9px] [&+&]:border-t",
        dark ? "border-dark-line" : "border-line",
      )}
    >
      <span
        className={cn(
          "min-w-0 text-[0.9375rem] leading-[1.3] tabular-nums [overflow-wrap:anywhere]",
          dark ? "text-on-dark" : "text-ink",
        )}
      >
        {who && (
          <small
            className={cn("mb-px block text-[0.8125rem] leading-[1.3] font-medium", dark ? "text-on-dark-mute" : "text-grey")}
          >
            {who}
          </small>
        )}
        <span className="select-all">{value}</span>
      </span>
      {href && (
        <a
          href={href}
          aria-label={label}
          {...(external ? { target: "_blank", rel: "noopener" } : {})}
          className={cn(
            "inline-flex h-9 w-[92px] items-center justify-center gap-1.5 px-2 pt-0.5 font-display text-[0.8125rem] leading-none font-bold tracking-[0.05em] whitespace-nowrap uppercase [:lang(fi)_&]:w-[112px] max-[721px]:h-11",
            external
              ? cn(
                  "transition-shadow duration-200 ease-out",
                  dark
                    ? "text-white shadow-[inset_0_0_0_1px_var(--color-dark-line)] hover:shadow-[inset_0_0_0_1px_var(--color-white)]"
                    : "text-ink shadow-[inset_0_0_0_1px_var(--color-line)] hover:shadow-[inset_0_0_0_1px_var(--color-ink)]",
                )
              : cn(
                  "cut-fill text-black [--cut:8px] [--fill:var(--color-yellow)] hover:[--fill:var(--color-yellow-hi)]",
                  dark ? "focus-visible:outline-white" : "focus-visible:outline-ink",
                ),
          )}
        >
          {ICONS[kind]}
          {action}
        </a>
      )}
    </li>
  );
}

/** A list of contact rows. */
export function ContactRows({ children, className }: { children: React.ReactNode; className?: string }) {
  return <ul className={cn("grid", className)}>{children}</ul>;
}
