import { ArrowRight, ChevronRight } from "lucide-react";
import Image, { type StaticImageData } from "next/image";
import { getLocale, getTranslations } from "next-intl/server";

import { buttonVariants } from "@/components/ui/button";
import type { Locale } from "@/i18n/routing";
import { EXTERNAL, keslaHref } from "@/lib/routes";
import { cn } from "@/lib/utils";

import brandshopImage from "../../../public/images/brandshop.jpg";
import cataloguesImage from "../../../public/images/catalogues.jpg";
import chipperImage from "../../../public/images/chipper.jpg";
import defenceImage from "../../../public/images/defence.jpg";
import twinaxImage from "../../../public/images/twinax.jpg";

type ItemKey = "catalogues" | "chipper" | "shop" | "defence";
type Item = { key: ItemKey; name: string; text: string };

const THUMBS: Record<ItemKey, StaticImageData> = {
  catalogues: cataloguesImage,
  chipper: chipperImage,
  shop: brandshopImage,
  defence: defenceImage,
};

function itemHref(key: ItemKey, locale: Locale) {
  switch (key) {
    case "catalogues":
      return EXTERNAL.catalogues;
    case "chipper":
      return keslaHref("chipper", locale);
    case "shop":
      return EXTERNAL.shop[locale];
    case "defence":
      return EXTERNAL.defence;
  }
}

/**
 * kesla.com's six equal tiles, given an order: the current product
 * campaign leads, the four standing links sit beside it as a ruled list.
 */
export async function HomeHighlights() {
  const t = await getTranslations("Home.highlights");
  const locale = (await getLocale()) as Locale;
  const items = t.raw("items") as Item[];

  return (
    <section aria-labelledby="highlights-title" className="gutter">
      <h2 id="highlights-title" className="sr-only">
        {t("title")}
      </h2>
      <div className="wrap grid gap-[clamp(16px,2.4vw,32px)] pt-[clamp(56px,8vw,104px)] lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
        <a href={keslaHref("twinax", locale)} className="group block bg-black [--cut:22px] cut">
          <div className="relative aspect-[8/3] overflow-hidden">
            <Image
              src={twinaxImage}
              alt={t("twinax.imageAlt")}
              fill
              placeholder="blur"
              sizes="(min-width: 1024px) 58vw, 100vw"
              className="object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.03]"
            />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3.5 px-[26px] pt-[22px] pb-[26px]">
            <div>
              <h3 className="text-[1.375rem] leading-[1.15] font-extrabold text-white uppercase">{t("twinax.name")}</h3>
              <p className="text-on-dark-mute">{t("twinax.text")}</p>
            </div>
            {/* The whole panel is the link, so the button is drawn, not nested. */}
            <span className={cn(buttonVariants(), "group-hover:[--fill:var(--color-yellow-hi)]")}>
              {t("twinax.cta")}
              <ArrowRight strokeWidth={2.5} aria-hidden="true" />
            </span>
          </div>
        </a>

        <ul className="[&>li:last-child>a]:border-b">
          {items.map((item) => (
            <li key={item.key}>
              <a
                href={itemHref(item.key, locale)}
                className="group grid grid-cols-[88px_minmax(0,1fr)_auto] items-center gap-3 border-t border-line py-3.5 text-ink sm:grid-cols-[120px_minmax(0,1fr)_auto] sm:gap-[18px]"
              >
                <Image
                  src={THUMBS[item.key]}
                  alt=""
                  sizes="120px"
                  className="aspect-[8/3] w-full object-cover"
                />
                <span>
                  <span className="block font-display font-bold uppercase leading-[1.2] tracking-[0.02em] decoration-yellow decoration-2 underline-offset-4 group-hover:underline">
                    {item.name}
                  </span>
                  <span className="mt-0.5 block text-[0.9375rem] text-grey">{item.text}</span>
                </span>
                <ChevronRight
                  className="size-4 text-mute transition-[translate,color] duration-200 ease-out-expo group-hover:translate-x-1 group-hover:text-ink"
                  strokeWidth={2.25}
                  aria-hidden="true"
                />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
