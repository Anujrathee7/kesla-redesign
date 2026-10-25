import { ChevronRight } from "lucide-react";
import Image, { type StaticImageData } from "next/image";
import { getLocale, getTranslations } from "next-intl/server";

import type { Locale } from "@/i18n/routing";
import { FAMILY_KEYS, categoryHref, localHref, type FamilyKey } from "@/lib/routes";

import cranesImage from "../../../public/images/timber-crane.jpg";
import loggingImage from "../../../public/images/harvester-20rh.jpg";
import tractorImage from "../../../public/images/tractor-loader.jpg";
import { SectionHeading } from "./section-heading";

const PHOTOS: Record<FamilyKey, StaticImageData> = {
  cranes: cranesImage,
  logging: loggingImage,
  tractor: tractorImage,
};

/**
 * The three product families. The photo pushes in on hover and Kesla's
 * yellow round icon breaks its bottom edge, as on kesla.com.
 */
export async function HomeFamilies() {
  const t = await getTranslations("Home.families");
  const tf = await getTranslations("Common.families");
  const locale = (await getLocale()) as Locale;

  return (
    <section aria-labelledby="families-title" className="gutter">
      <div className="wrap pt-[clamp(56px,8vw,104px)]">
        <SectionHeading
          id="families-title"
          title={t("title")}
          link={{ href: localHref("products", locale), label: t("all") }}
        />
        <div className="grid gap-x-[clamp(16px,2.4vw,32px)] gap-y-12 md:grid-cols-3">
          {FAMILY_KEYS.map((key) => {
            const subs = tf.raw(`${key}.subs`) as string[];
            return (
              <article key={key} className="group flex flex-col">
                <a href={localHref("products", locale, key)} tabIndex={-1} aria-hidden="true" className="block">
                  <div className="relative aspect-[5/3.4] overflow-hidden bg-warm [--cut:22px] cut">
                    <Image
                      src={PHOTOS[key]}
                      alt={t(`imageAlt.${key}`)}
                      fill
                      placeholder="blur"
                      sizes="(min-width: 768px) 33vw, 100vw"
                      className="object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.04]"
                    />
                  </div>
                </a>
                <Image
                  src={`/images/icon-${key}.svg`}
                  alt=""
                  width={76}
                  height={76}
                  className="relative z-10 -mt-10 ml-5 size-[76px] drop-shadow-[0_4px_10px_rgb(0_0_0/0.25)]"
                />
                <h3 className="mt-3.5 mb-3 text-[clamp(1.25rem,1.7vw,1.5rem)] leading-[1.1] font-bold uppercase">
                  <a
                    href={localHref("products", locale, key)}
                    className="decoration-yellow decoration-[3px] underline-offset-[5px] hover:underline"
                  >
                    {tf(`${key}.name`)}
                  </a>
                </h3>
                <ul className="[&>li:last-child>a]:border-b">
                  {subs.map((sub, i) => (
                    <li key={sub}>
                      <a
                        href={categoryHref(key, i + 1, locale)}
                        className="group/sub flex items-center justify-between gap-3 border-t border-line px-0.5 py-[11px] font-medium text-ink"
                      >
                        {sub}
                        <ChevronRight
                          className="size-4 text-mute transition-[translate,color] duration-200 ease-out-expo group-hover/sub:translate-x-1 group-hover/sub:text-ink"
                          strokeWidth={2.25}
                          aria-hidden="true"
                        />
                      </a>
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
