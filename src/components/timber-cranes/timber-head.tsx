import { ChevronRight } from "lucide-react";
import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";

import { PhotoHead } from "@/components/site/photo-head";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { KESLA, localHref } from "@/lib/routes";

import heroImage from "../../../public/images/timber-hero-2225.jpg";

const SIDE_LINKS = {
  protect: {
    en: "/en/products/category/kesla-protect-surface",
    fi: "/fi/tuotteet/tuotekategoria/kesla-protect-suojaava-pintakaesittely",
  },
  cabins: {
    en: "/en/products/category/cabins-and-high-seats",
    fi: "/fi/tuotteet/tuotekategoria/hytit-ja-avohallintalaitteet",
  },
} as const;

/**
 * Exo 2 ExtraBold uppercase runs about 0.64em a letter. One word cannot wrap,
 * so the title is capped at the size where its longest word still fits its
 * column: "PUUTAVARANOSTURIT" would otherwise run out of a 390px phone and,
 * at desktop sizes, into the photo.
 */
function titleSize(title: string): string {
  const longest = Math.max(...title.split(/\s+/).map((word) => word.length));
  return `min(clamp(2.625rem, 5.6vw, 5rem), calc(100cqi / ${(longest * 0.66).toFixed(2)}))`;
}

/**
 * The black head of the Timber cranes category: breadcrumb, title, intro,
 * the EN 12999 note and the two side links on the left, and the KESLA 2225
 * cut in on the right as a Photo Head (`PhotoHead`), its caption on the
 * photo. The yellow "Made in Finland since 1960" band was cut in the copy
 * audit (TIMB-1, 19 October 2026).
 */
export async function TimberHead() {
  const t = await getTranslations("TimberCranes");
  const locale = (await getLocale()) as Locale;
  const title = t("title");

  const crumbLink =
    "relative text-on-dark-mute transition-colors after:absolute after:-inset-x-1 after:-inset-y-3 after:content-[''] hover:text-yellow";
  const crumbChevron = <ChevronRight className="size-3 shrink-0 text-on-dark-mute" strokeWidth={2.5} aria-hidden="true" />;

  return (
    <PhotoHead
      labelledBy="timber-title"
      photo={
        <Image
          src={heroImage}
          alt={t("heroAlt")}
          fill
          priority
          placeholder="blur"
          sizes="(min-width: 1001px) 46vw, 100vw"
          className="object-cover object-[35%_50%]"
        />
      }
      caption={t("heroCaption")}
    >
      <div className="@container">
        <nav aria-label={t("breadcrumb.label")}>
          <ol className="mt-[18px] mb-[18px] flex flex-wrap items-center gap-x-2 gap-y-1 font-display text-lg leading-[1.2] font-semibold text-on-dark">
            <li className="flex items-center gap-2 whitespace-nowrap">
              <Link href="/" className={crumbLink}>
                {t("breadcrumb.home")}
              </Link>
              {crumbChevron}
            </li>
            <li className="flex items-center gap-2 whitespace-nowrap">
              <a href={localHref("products", locale)} className={crumbLink}>
                {t("breadcrumb.products")}
              </a>
              {crumbChevron}
            </li>
            <li className="flex items-center gap-2 whitespace-nowrap">
              <a href={localHref("products", locale, "cranes")} className={crumbLink}>
                {t("breadcrumb.family")}
              </a>
              {crumbChevron}
            </li>
            <li aria-current="page" className="whitespace-nowrap">
              {title}
            </li>
          </ol>
        </nav>
        <h1
          id="timber-title"
          className="leading-[0.95] font-extrabold tracking-[-0.015em] text-white uppercase"
          style={{ fontSize: titleSize(title) }}
        >
          {title}
        </h1>
        <p className="mt-[18px] max-w-[52ch] text-lg text-on-dark">{t("intro")}</p>
        <p className="mt-3 max-w-[52ch] text-[0.9375rem] text-on-dark-mute">{t("standard")}</p>
        <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-2">
          {(["protect", "cabins"] as const).map((key) => (
            <li key={key}>
              <a
                href={KESLA + SIDE_LINKS[key][locale]}
                className="relative inline-block font-display text-[0.9375rem] leading-[1.2] font-semibold text-white link-wipe [--wipe-color:var(--color-white)] after:absolute after:inset-x-0 after:-inset-y-3 after:content-['']"
              >
                {t(`links.${key}`)}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </PhotoHead>
  );
}
