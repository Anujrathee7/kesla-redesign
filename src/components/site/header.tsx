import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";

import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { EXTERNAL, localHref, navHref } from "@/lib/routes";

import { LanguageSwitch } from "./language-switch";
import { MobileNav } from "./mobile-nav";
import { NAV_ITEMS } from "./nav-items";
import { NavLink } from "./nav-link";

/**
 * One row instead of kesla.com's two: the black logo block with its angled
 * edge, the seven main links, then Defence, language and the dealer CTA.
 *
 * The row only holds what fits, measured against the longer Finnish labels:
 * below 1280px the links sit in the menu sheet, the Defence link joins the
 * row at 1440px, and the links take the larger size at 1536px.
 */
export async function SiteHeader() {
  const t = await getTranslations("Common.nav");
  const locale = (await getLocale()) as Locale;

  return (
    <header className="border-b border-line bg-white">
      <div className="mx-auto flex max-w-[1600px] items-stretch gap-6 pr-[max(clamp(16px,4vw,40px),env(safe-area-inset-right,0px))]">
        <Link
          href="/"
          aria-label={t("home")}
          className="flex shrink-0 items-center bg-black py-4 pr-10 pl-[max(clamp(16px,4vw,40px),env(safe-area-inset-left,0px))] [clip-path:polygon(0_0,100%_0,calc(100%-26px)_100%,0_100%)] lg:py-[22px] lg:pr-[46px]"
        >
          <Image
            src="/images/logo-kesla-invert.svg"
            alt="Kesla"
            width={164}
            height={34}
            priority
            className="h-auto w-[120px] lg:w-[150px]"
          />
        </Link>

        <nav aria-label={t("label")} className="hidden min-w-0 flex-1 items-center gap-0.5 xl:flex">
          {NAV_ITEMS.map((key) => (
            <NavLink
              key={key}
              href={navHref(key, locale)}
              className="group relative px-2 py-2.5 font-display text-sm font-semibold whitespace-nowrap text-ink 2xl:px-3 2xl:text-[0.9375rem]"
            >
              {t(key)}
              <span
                aria-hidden="true"
                className="absolute inset-x-2 bottom-0.5 h-[3px] origin-left scale-x-0 bg-yellow transition-transform duration-200 ease-out group-hover:scale-x-100 group-aria-[current=page]:scale-x-100 2xl:inset-x-3"
              />
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-3 2xl:gap-4">
          <a
            href={EXTERNAL.defence}
            className="hidden items-center gap-1.5 caps text-ink transition-colors hover:text-grey min-[1440px]:inline-flex"
          >
            {t("defence")}
            <ArrowUpRight className="size-3.5" strokeWidth={2.5} aria-hidden="true" />
          </a>
          <LanguageSwitch className="hidden lg:inline-flex" />
          <Button asChild size="sm" className="hidden lg:inline-flex">
            <a href={localHref("dealers", locale)}>{t("findDealer")}</a>
          </Button>
          <div className="xl:hidden">
            <MobileNav />
          </div>
        </div>
      </div>
    </header>
  );
}
