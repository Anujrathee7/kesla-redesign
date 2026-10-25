import Image, { type StaticImageData } from "next/image";
import { getLocale, getTranslations } from "next-intl/server";

import { PlayBadge } from "@/components/home/home-media";
import { SectionHeading } from "@/components/home/section-heading";
import type { Locale } from "@/i18n/routing";
import { FEATURED_VIDEOS, pick, youtube, type FeaturedVideoKey } from "@/lib/product-2112z";
import { EXTERNAL } from "@/lib/routes";

import highSeatStill from "../../../public/images/product-2112z-yt-ZFH433GjXiw.jpg";
import industrialStill from "../../../public/images/product-2112z-yt-kGAewbJ4y7Q.jpg";
import kuhmoStill from "../../../public/images/product-2112z-yt-Ya8uYCET6jA.jpg";
import sawMillStill from "../../../public/images/product-2112z-yt-b1l42696xfs.jpg";

export const VIDEO_STILLS: Record<FeaturedVideoKey, StaticImageData> = {
  highSeat: highSeatStill,
  kuhmo: kuhmoStill,
  industrial: industrialStill,
  sawMill: sawMillStill,
};

/**
 * The frontpage's black video block, filled with the 2112's own videos: the
 * high-seat film as the main video and the three industrial films as rows.
 */
export async function ProductMedia() {
  const t = await getTranslations("Product");
  const locale = (await getLocale()) as Locale;
  const [main, ...side] = FEATURED_VIDEOS;

  return (
    <section aria-labelledby="product-media-title" className="bg-black text-on-dark gutter">
      <div className="wrap py-[clamp(56px,8vw,96px)]">
        <SectionHeading
          id="product-media-title"
          title={t("media.title")}
          tone="dark"
          link={{ href: EXTERNAL.youtube, label: t("media.all"), external: true }}
        />
        <div className="grid items-start gap-[clamp(24px,3.4vw,48px)] lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
          <a href={youtube(main.id)} target="_blank" rel="noopener" className="group block">
            <span className="relative block overflow-hidden bg-ink [--cut:26px] cut">
              <Image
                src={VIDEO_STILLS[main.key]}
                alt={t("videos.mainAlt")}
                placeholder="blur"
                sizes="(min-width: 1024px) 58vw, 100vw"
                className="aspect-video w-full object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.03]"
              />
              <PlayBadge />
            </span>
            <span className="block pt-[18px]">
              <span className="block font-display text-[clamp(1.25rem,2vw,1.625rem)] leading-[1.1] font-extrabold text-white uppercase decoration-yellow decoration-[3px] underline-offset-[5px] group-hover:underline">
                {pick(main.title, locale)}
              </span>
              <span className="mt-1.5 block text-on-dark-mute">{t("media.watch")}</span>
            </span>
            <span className="sr-only">, {t("newTab")}</span>
          </a>

          <div className="flex flex-col max-lg:mt-3">
            {side.map(({ key, id, title }) => (
              <a
                key={id}
                href={youtube(id)}
                target="_blank"
                rel="noopener"
                className="group mb-5 grid grid-cols-[minmax(0,130px)_minmax(0,1fr)] items-center gap-3.5 border-b border-dark-line pb-5 sm:grid-cols-[minmax(0,190px)_minmax(0,1fr)] sm:gap-[18px]"
              >
                <span className="relative block overflow-hidden bg-ink">
                  <Image src={VIDEO_STILLS[key]} alt="" sizes="190px" className="aspect-video w-full object-cover" />
                  <PlayBadge small />
                </span>
                <span>
                  <span className="block font-display text-lg leading-[1.2] font-bold text-white decoration-yellow decoration-2 underline-offset-4 group-hover:underline">
                    {pick(title, locale)}
                  </span>
                  <span className="mt-1 block text-[0.9375rem] text-on-dark-mute">{t("videos.youtube")}</span>
                </span>
                <span className="sr-only">, {t("newTab")}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
