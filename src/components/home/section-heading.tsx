import { ArrowRight, ArrowUpRight } from "lucide-react";

import { cn } from "@/lib/utils";

/** Section title on the left, an "all of these" link on the right. */
export function SectionHeading({
  id,
  title,
  link,
  tone = "light",
}: {
  id: string;
  title: React.ReactNode;
  /** `hrefLang` marks a link to a page in another language (kesla.com's investor pages are Finnish only). */
  link?: { href: string; label: string; external?: boolean; hrefLang?: string };
  tone?: "light" | "dark";
}) {
  const Icon = link?.external ? ArrowUpRight : ArrowRight;

  return (
    <div className="mb-[clamp(24px,3vw,40px)] flex flex-wrap items-end justify-between gap-4">
      <h2
        id={id}
        className={cn(
          "text-[clamp(1.875rem,3.4vw,2.875rem)] leading-none font-extrabold uppercase",
          tone === "dark" && "text-white",
        )}
      >
        {title}
      </h2>
      {link && (
        <a
          href={link.href}
          hrefLang={link.hrefLang}
          {...(link.external ? { target: "_blank", rel: "noopener" } : {})}
          className={cn(
            // The ::after grows the hit area to 44px tall without moving the layout.
            "relative inline-flex items-center gap-1.5 font-display font-semibold link-wipe after:absolute after:inset-x-0 after:-inset-y-2.5 after:content-['']",
            tone === "dark" ? "text-yellow [--wipe-color:var(--color-white)]" : "text-ink",
          )}
        >
          {link.label}
          <Icon className="size-4" strokeWidth={2.5} aria-hidden="true" />
        </a>
      )}
    </div>
  );
}
