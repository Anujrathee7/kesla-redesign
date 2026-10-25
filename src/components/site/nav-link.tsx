"use client";

import { usePathname } from "next/navigation";

/**
 * A main-nav link that marks itself `aria-current="page"` when it points at
 * the page being shown. Only redesigned pages have a local href, so links out
 * to kesla.com are never current and the frontpage has no current item.
 */
export function NavLink({ href, ...props }: React.ComponentProps<"a"> & { href: string }) {
  const pathname = usePathname();
  const current = href.startsWith("/") && (pathname === href || pathname.startsWith(`${href}/`));

  return <a href={href} aria-current={current ? "page" : undefined} {...props} />;
}
