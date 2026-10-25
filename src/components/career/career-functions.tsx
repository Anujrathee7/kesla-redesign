import { ChevronRight } from "lucide-react";
import Image, { type StaticImageData } from "next/image";
import { getLocale, getTranslations } from "next-intl/server";

import { SectionHeading } from "@/components/home/section-heading";
import type { Locale } from "@/i18n/routing";
import { FUNCTIONS, type Func } from "@/lib/career";

import aftersalesImage from "../../../public/images/career-sq-aftersales.jpg";
import productionImage from "../../../public/images/career-sq-production.jpg";
import rndImage from "../../../public/images/career-sq-rnd.jpg";
import salesImage from "../../../public/images/career-sq-sales.jpg";
import supportImage from "../../../public/images/career-sq-support.jpg";

const IMAGES: Record<Func["key"], StaticImageData> = {
  production: productionImage,
  rnd: rndImage,
  aftersales: aftersalesImage,
  sales: salesImage,
  support: supportImage,
};

/**
 * Where you could work: kesla.com's five functions as ruled thumbnail rows,
 * each going to its kesla.com page and the role videos there. The photos are
 * greyscale until the row is hovered.
 */
export async function CareerFunctions() {
  const t = await getTranslations("Career.functions");
  const locale = (await getLocale()) as Locale;

  return (
    <section aria-labelledby="functions-title" className="border-t border-line gutter">
      <div className="wrap py-[clamp(56px,8vw,104px)]">
        <SectionHeading id="functions-title" title={t("title")} />
        <p className="-mt-2 mb-6 max-w-[46ch] text-lg leading-normal text-ink sm:text-[1.1875rem]">{t("intro")}</p>

        <ul className="border-t-[3px] border-ink">
          {FUNCTIONS.map((fn) => (
            <li key={fn.key}>
              <a
                href={fn.page[locale]}
                className="group grid grid-cols-[72px_minmax(0,1fr)_16px] items-center gap-4 border-b border-line py-4 text-ink min-[721px]:grid-cols-[96px_minmax(0,1fr)_9em_16px] min-[721px]:gap-5"
              >
                <Image
                  src={IMAGES[fn.key]}
                  alt=""
                  sizes="(min-width: 721px) 96px, 72px"
                  placeholder="blur"
                  className="size-[72px] object-cover contrast-105 grayscale transition-[filter] duration-400 ease-out group-hover:contrast-100 group-hover:grayscale-0 min-[721px]:size-24"
                />
                <span>
                  <strong className="block font-display text-xl leading-[1.15] font-extrabold uppercase decoration-yellow decoration-[3px] underline-offset-4 group-hover:underline">
                    {t(`items.${fn.key}.name`)}
                  </strong>
                  <small className="mt-1 line-clamp-2 max-w-[70ch] text-[0.9375rem] text-grey">
                    {t(`items.${fn.key}.text`)}
                  </small>
                </span>
                <span className="hidden text-right text-sm text-mute tabular-nums min-[721px]:block">
                  {fn.videos > 0 && t("videos", { count: fn.videos })}
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
