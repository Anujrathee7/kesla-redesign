"use client";

import { useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { GROUP_SHOW } from "@/lib/references";
import { cn } from "@/lib/utils";

/**
 * A product group's story rows, all rendered on the server. Until the visitor
 * asks for the rest, rows after the fourth are hidden. A group of five shows
 * all five, since a button to reveal one row is not worth it.
 */
export function ShowAll({
  id,
  count,
  more,
  fewer,
  className,
  children,
}: {
  id: string;
  count: number;
  more: string;
  fewer: string;
  className?: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const list = useRef<HTMLUListElement>(null);
  const collapsible = count > GROUP_SHOW + 1;

  function toggle() {
    const closing = open;
    setOpen(!open);
    // Closing a long group can leave the visitor below it; bring its top back.
    const section = list.current?.closest("section");
    if (closing && section && section.getBoundingClientRect().top < 0) {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      section.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    }
  }

  return (
    <>
      <ul
        ref={list}
        id={id}
        className={cn(className, collapsible && !open && "[&>li:nth-child(n+5)]:hidden")}
      >
        {children}
      </ul>
      {collapsible && (
        <Button
          type="button"
          variant="outline-ink"
          size="sm"
          aria-expanded={open}
          aria-controls={id}
          onClick={toggle}
          className="mt-5 max-sm:min-h-11 max-sm:whitespace-normal max-sm:leading-[1.2]"
        >
          {open ? fewer : more}
        </Button>
      )}
    </>
  );
}
