import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";

import { Button } from "@/components/ui/button";
import type { Locale } from "@/i18n/routing";
import { localHref } from "@/lib/routes";
import { cn } from "@/lib/utils";

import heroImage from "../../../public/images/hero-truck-crane.jpg";

/**
 * The Finnish Fits Rule (DESIGN.md): Exo 2 ExtraBold caps run about 0.6em a
 * letter and a word cannot wrap, so the title is capped at the size where its
 * longest word still fits the text column.
 */
function titleSize(title: string): string {
  const longest = Math.max(...title.split(/\s+/).map((word) => word.length));
  return `min(clamp(2.5rem, 5.2vw, 4.75rem), calc(100cqi / ${(longest * 0.66).toFixed(2)}))`;
}

/**
 * Kesla's own hero, kept: the black panel with the tagline on the left, a
 * real machine on the right.
 */
export async function HomeHero() {
  const t = await getTranslations("Home.hero");
  const locale = (await getLocale()) as Locale;
  const title = `${t("titleLead")} ${t("titleAccent")}`;
  // "VASTUULLINEN" outgrows the column at the English size; "RESPONSIBLE" fits, so English keeps its size.
  const capTitle = locale === "fi";

  return (
    <section aria-labelledby="hero-title">
      <div className="grid bg-black lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <div
          className={cn(
            "flex flex-col justify-center gap-6 pt-[clamp(40px,6vw,88px)] pr-[max(clamp(16px,4vw,40px),env(safe-area-inset-right,0px))] pb-[clamp(40px,5vw,64px)] pl-[max(clamp(16px,4vw,40px),env(safe-area-inset-left,0px))] lg:max-w-[640px] lg:justify-self-end lg:pr-[clamp(24px,4vw,56px)]",
            // The Finnish title is capped to its column, so the column takes the track's width instead of the title's.
            capTitle && "w-full",
          )}
        >
          <div className={cn(capTitle && "@container")}>
            <h1
              id="hero-title"
              className="text-[clamp(2.5rem,5.2vw,4.75rem)] leading-[0.95] font-extrabold tracking-[-0.015em] text-white uppercase"
              style={capTitle ? { fontSize: titleSize(title) } : undefined}
            >
              {t("titleLead")} <span className="block text-yellow">{t("titleAccent")}</span>
            </h1>
          </div>
          <p className="max-w-[46ch] text-lg text-on-dark">{t("intro")}</p>
          <div className="mt-2 flex flex-wrap gap-3">
            <Button asChild>
              <a href={localHref("products", locale)}>
                {t("products")}
                <ArrowRight strokeWidth={2.5} aria-hidden="true" />
              </a>
            </Button>
            <Button asChild variant="outline-light">
              <a href={localHref("dealers", locale)}>{t("dealer")}</a>
            </Button>
          </div>
        </div>
        <div className="relative aspect-[16/9] lg:aspect-auto lg:min-h-[480px]">
          <Image
            src={heroImage}
            alt={t("imageAlt")}
            fill
            priority
            placeholder="blur"
            sizes="(min-width: 1024px) 58vw, 100vw"
            className="object-cover object-[60%_50%]"
          />
        </div>
      </div>
    </section>
  );
}
