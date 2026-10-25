"use client";

import { ArrowUpRight, ChevronRight, Menu } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { EXTERNAL, localHref, navHref } from "@/lib/routes";

import { LanguageSwitch } from "./language-switch";
import { NAV_ITEMS } from "./nav-items";
import { NavLink } from "./nav-link";

export function MobileNav() {
  const t = useTranslations("Common.nav");
  const locale = useLocale();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          type="button"
          className="inline-flex min-h-11 items-center gap-2 border-2 border-ink px-3 pt-2 pb-[7px] lg:min-h-0 pointer-coarse:min-h-11 font-display text-sm font-bold uppercase tracking-[0.06em] text-ink"
        >
          <Menu className="size-4" strokeWidth={2.25} aria-hidden="true" />
          {t("menu")}
        </button>
      </SheetTrigger>
      <SheetContent side="right" closeLabel={t("close")} className="w-[min(88vw,380px)] gap-0 border-l-0 p-0">
        <div className="flex items-center bg-black px-5 pt-5 pb-4">
          <SheetTitle className="sr-only">{t("label")}</SheetTitle>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/logo-kesla-invert.svg" alt="Kesla" width={120} height={25} />
        </div>
        <nav aria-label={t("label")} className="flex flex-col px-5 py-2">
          {NAV_ITEMS.map((key) => (
            <SheetClose asChild key={key}>
              <NavLink
                href={navHref(key, locale as "en" | "fi")}
                className="group flex items-center justify-between border-b border-line py-4 font-display text-lg font-semibold text-ink"
              >
                <span className="decoration-yellow decoration-[3px] underline-offset-[6px] group-aria-[current=page]:underline">
                  {t(key)}
                </span>
                <ChevronRight className="size-4 text-mute" strokeWidth={2.25} aria-hidden="true" />
              </NavLink>
            </SheetClose>
          ))}
          <a
            href={EXTERNAL.defence}
            className="flex items-center justify-between border-b border-line py-4 font-display text-lg font-semibold text-ink"
          >
            {t("defence")}
            <ArrowUpRight className="size-4 text-mute" strokeWidth={2.25} aria-hidden="true" />
          </a>
        </nav>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-4 px-5 pt-4 pb-[max(20px,env(safe-area-inset-bottom))]">
          <LanguageSwitch />
          <Button asChild size="sm">
            <a href={localHref("dealers", locale as "en" | "fi")}>{t("findDealer")}</a>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
