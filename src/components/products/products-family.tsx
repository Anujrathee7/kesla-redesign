import Image, { type StaticImageData } from "next/image";
import { getLocale, getTranslations } from "next-intl/server";

import { Button } from "@/components/ui/button";
import type { Locale } from "@/i18n/routing";
import { FAMILY_SUBS, MODELS, SUBS, rangeText, specRange, type SubKey } from "@/lib/products";
import { categoryHref, localHref, type FamilyKey } from "@/lib/routes";
import { cn } from "@/lib/utils";

import harvesterImage from "../../../public/images/harvester-20rh.jpg";
import cityImage from "../../../public/images/city-crane.jpg";
import fmcImage from "../../../public/images/p-13h.jpg";
import loaderImage from "../../../public/images/p-loader-305t.jpg";
import grapple1Image from "../../../public/images/p-prog26.jpg";
import grapple2Image from "../../../public/images/p-prog30.jpg";
import grapple3Image from "../../../public/images/p-prog40.jpg";
import trailerImage from "../../../public/images/p-trailer-144nd.jpg";
import timberImage from "../../../public/images/timber-crane.jpg";

const IMAGES: Record<SubKey, StaticImageData> = {
  timber: timberImage,
  city: cityImage,
  g3: grapple3Image,
  heads: harvesterImage,
  fmc: fmcImage,
  g2: grapple2Image,
  loaders: loaderImage,
  trailers: trailerImage,
  g1: grapple1Image,
};

/**
 * One family's panel: the yellow band with its name and intro, then its three
 * sub-categories, each with a photo, spec ranges worked out from the model
 * data, the model names, and the way on to kesla.com or a dealer.
 */
export async function ProductsFamily({ family }: { family: FamilyKey }) {
  const t = await getTranslations("Products");
  const tf = await getTranslations("Common.families");
  const locale = (await getLocale()) as Locale;

  return (
    <>
      {/*
        --shear is how far the band's left edge leans in at the top. Until the
        wrap is centred clear of it, the heading's first letter would sit on
        that edge, so the heading is pushed right by the overlap plus 6px.
      */}
      <div className="on-yellow bg-yellow gutter [--shear:clamp(24px,5vw,80px)] [clip-path:polygon(var(--shear)_0,100%_0,100%_100%,0_100%)]">
        <div className="wrap flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2 pt-[18px] pb-4">
          <h2 className="pl-[max(0px,calc(var(--shear)_+_6px_-_max(clamp(16px,4vw,40px),calc((100vw_-_1240px)_/_2))))] text-[clamp(1.75rem,4.4vw,3.75rem)] leading-[0.95] font-extrabold text-black uppercase italic">
            {tf(`${family}.name`)}
          </h2>
          {/* Only the cranes family carries an intro: it gives the old PEKU and FORESTERI names. */}
          {family === "cranes" && <p className="max-w-[52ch] text-base text-black">{t("families.cranes.intro")}</p>}
        </div>
      </div>

      <div className="gutter">
        <div className="wrap">
          {FAMILY_SUBS[family].map((sub, i) => {
            const config = SUBS[sub];
            const models = MODELS[sub];
            const href = categoryHref(family, config.category, locale);

            return (
              <section
                key={sub}
                id={`sub-${sub}`}
                aria-labelledby={`sub-${sub}-title`}
                className={cn(
                  "grid scroll-mt-20 items-center gap-x-[clamp(28px,5vw,72px)] gap-y-7 py-[clamp(40px,5vw,64px)] min-[1001px]:grid-cols-2",
                  i > 0 && "border-t border-line",
                )}
              >
                <div
                  className={cn(
                    "relative aspect-[7/4.4] overflow-hidden [--cut:22px] cut",
                    config.cutout ? "bg-white shadow-[inset_0_0_0_1px_var(--color-line)]" : "bg-warm",
                    i % 2 === 1 && "min-[1001px]:order-2",
                  )}
                >
                  <Image
                    src={IMAGES[sub]}
                    alt={t(`subs.${sub}.imageAlt`)}
                    fill
                    placeholder="blur"
                    sizes="(min-width: 1001px) 50vw, 100vw"
                    className={config.cutout ? "object-contain p-[6%]" : "object-cover"}
                  />
                </div>

                <div>
                  <h3
                    id={`sub-${sub}-title`}
                    className="text-[clamp(1.625rem,2.8vw,2.375rem)] leading-none font-extrabold uppercase"
                  >
                    {t(`subs.${sub}.name`)}
                  </h3>
                  <p className="mt-3 max-w-[50ch]">{t(`subs.${sub}.intro`)}</p>

                  <dl className="mt-5 grid grid-cols-[auto_minmax(0,1fr)] gap-x-5 border-t border-line">
                    {config.specs.map((key) => {
                      const range = specRange(models, key);
                      if (!range) return null;
                      return (
                        <Fact key={key} label={t(`specs.${config.labels?.[key] ?? key}`)}>
                          {rangeText(range, key, locale)}
                        </Fact>
                      );
                    })}
                    <Fact label={t("specs.models")}>{models.length}</Fact>
                  </dl>

                  {/* Model names only: kesla.com has no per-model URL here, "See all" is the link. */}
                  <ul aria-label={t("specs.models")} className="mt-[18px] flex flex-wrap gap-1.5">
                    {models.map((model) => (
                      <li
                        key={model.name}
                        className="border border-line px-2.5 pt-2 pb-[7px] font-display text-sm leading-none font-semibold text-ink"
                      >
                        {model.name}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <Button asChild variant="dark" size="sm" className="pointer-coarse:min-h-11">
                      <a href={href}>{t(`subs.${sub}.all`)}</a>
                    </Button>
                    <Button asChild variant="outline-ink" size="sm" className="pointer-coarse:min-h-11">
                      <a href={localHref("dealers", locale)}>{t("dealer")}</a>
                    </Button>
                  </div>
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </>
  );
}

function Fact({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <>
      <dt className="border-b border-line py-[9px] font-display text-sm leading-[1.4] font-bold tracking-[0.05em] text-ink uppercase">
        {label}
      </dt>
      <dd className="border-b border-line py-[9px] text-ink tabular-nums">{children}</dd>
    </>
  );
}
