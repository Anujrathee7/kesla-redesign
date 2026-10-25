import { ChevronRight } from "lucide-react";

import { Link } from "@/i18n/navigation";

export type Crumb = { label: string; href?: string };

/**
 * The page heads' breadcrumb on black, spaced like the Products and Company
 * heads so the heads line up. A crumb without `href` is plain text; the last
 * one is the current page unless `lastIsPage` is false.
 */
export function NewsCrumbs({
  label,
  crumbs,
  lastIsPage = true,
  className,
}: {
  label: string;
  crumbs: readonly Crumb[];
  lastIsPage?: boolean;
  className?: string;
}) {
  return (
    <nav aria-label={label} className={className}>
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 font-display text-lg leading-[1.2] font-semibold text-on-dark">
        {crumbs.map((crumb, index) => {
          const last = index === crumbs.length - 1;
          return (
            <li
              key={crumb.label}
              aria-current={last && lastIsPage ? "page" : undefined}
              className="flex items-center gap-2"
            >
              {crumb.href ? (
                <Link
                  href={crumb.href}
                  className="relative text-on-dark-mute transition-colors after:absolute after:-inset-x-1 after:-inset-y-3 after:content-[''] hover:text-yellow"
                >
                  {crumb.label}
                </Link>
              ) : (
                crumb.label
              )}
              {!last && (
                <ChevronRight className="size-3 shrink-0 text-on-dark-mute" strokeWidth={2.5} aria-hidden="true" />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
