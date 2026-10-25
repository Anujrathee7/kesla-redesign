import { Globe, Mail, Phone } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * The yellow call button: the number itself on a cut-corner yellow block, so
 * the buyer reads it and taps it in one place. Below 561px it shrinks to a
 * 48px square and the number moves into the row beside it.
 */
export function CallButton({
  href,
  number,
  label,
  className,
}: {
  href: string;
  number: string;
  label: string;
  className?: string;
}) {
  return (
    <a
      href={href}
      aria-label={label}
      className={cn(
        "cut-fill inline-flex h-10 w-[188px] shrink-0 items-center gap-2 overflow-hidden px-3 pt-0.5 font-display text-sm leading-none font-semibold whitespace-nowrap text-black tabular-nums [--cut:8px] [--fill:var(--color-yellow)] hover:[--fill:var(--color-yellow-hi)]",
        number.length > 17 && "gap-1.5 text-[0.78125rem] tracking-[-0.01em]",
        "max-[561px]:size-12 max-[561px]:justify-center max-[561px]:p-0",
        className,
      )}
    >
      <Phone className="size-3.5 shrink-0 fill-current max-[561px]:size-[18px]" strokeWidth={0} aria-hidden="true" />
      <span className="truncate max-[561px]:sr-only">{number}</span>
    </a>
  );
}

/** A square email or website link beside the call button. */
export function SquareLink({
  href,
  label,
  kind,
  dark = false,
  className,
}: {
  href: string;
  label: string;
  kind: "email" | "web";
  /** On the black head: white icon, dark hairline, white on hover. */
  dark?: boolean;
  className?: string;
}) {
  const Icon = kind === "email" ? Mail : Globe;
  const external = kind === "web";

  return (
    <a
      href={href}
      aria-label={label}
      title={label}
      {...(external ? { target: "_blank", rel: "noopener" } : {})}
      className={cn(
        "inline-grid size-10 shrink-0 place-items-center transition-colors duration-200 ease-out max-[561px]:size-12",
        dark
          ? "text-white shadow-[inset_0_0_0_1px_var(--color-dark-line)] hover:bg-white hover:text-black"
          : "bg-white text-ink shadow-[inset_0_0_0_1px_var(--color-line-strong)] hover:bg-black hover:text-yellow hover:shadow-[inset_0_0_0_1px_var(--color-black)] focus-visible:outline-ink",
        className,
      )}
    >
      <Icon className="size-4" strokeWidth={2} aria-hidden="true" />
    </a>
  );
}

/** Holds the second slot open so call buttons line up when a contact has no email. */
export function EmptySlot() {
  return <span aria-hidden="true" className="block size-10 shrink-0 max-[561px]:size-12" />;
}
