import { Play } from "lucide-react";
import Image, { type StaticImageData } from "next/image";
import { getTranslations } from "next-intl/server";

import { SOCIAL_KEYS, SOCIAL_NAMES, SocialIcon } from "@/components/site/social-icons";
import { cn } from "@/lib/utils";
import { EXTERNAL, VIDEOS } from "@/lib/routes";

import cabinImage from "../../../public/images/video-cabin.jpg";
import highSeatImage from "../../../public/images/video-highseat.jpg";
import inkaImage from "../../../public/images/video-inka.jpg";
import { SectionHeading } from "./section-heading";

export function PlayBadge({ small = false }: { small?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "absolute top-1/2 left-1/2 grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-yellow text-black shadow-[0_6px_24px_rgb(0_0_0/0.35)] transition-transform duration-300 ease-out-expo group-hover:scale-110",
        small ? "size-9 sm:size-[46px]" : "size-16 sm:size-[84px]",
      )}
    >
      <Play
        className={cn("translate-x-[2px] fill-current", small ? "size-3.5 sm:size-4" : "size-6 sm:size-[30px]")}
        strokeWidth={0}
      />
    </span>
  );
}

const SIDE_VIDEOS: { key: "highSeat" | "cabin"; image: StaticImageData; product: [string, string] }[] = [
  { key: "highSeat", image: highSeatImage, product: ["KESLA High Seat", "proPilot 2+2"] },
  { key: "cabin", image: cabinImage, product: ["KESLA Vision Cabin", "proC i 2.0"] },
];

/**
 * kesla.com's black video block, sorted: one main video, the two 360°
 * product videos as rows, and the social links as labelled buttons
 * instead of a column of loose icons.
 */
export async function HomeMedia() {
  const t = await getTranslations("Home.media");

  return (
    <section aria-labelledby="media-title" className="bg-black text-on-dark gutter">
      <div className="wrap py-[clamp(56px,8vw,96px)]">
        <SectionHeading
          id="media-title"
          title={t("title")}
          tone="dark"
          link={{ href: EXTERNAL.youtube, label: t("all"), external: true }}
        />
        <div className="grid items-start gap-[clamp(24px,3.4vw,48px)] lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
          <a href={VIDEOS.inka} target="_blank" rel="noopener" className="group block">
            <span className="relative block overflow-hidden bg-ink [--cut:26px] cut">
              <Image
                src={inkaImage}
                alt={t("main.imageAlt")}
                placeholder="blur"
                sizes="(min-width: 1024px) 58vw, 100vw"
                className="aspect-video w-full object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.03]"
              />
              <PlayBadge />
            </span>
            <span className="block pt-[18px]">
              <span className="block font-display text-[clamp(1.25rem,2vw,1.625rem)] leading-[1.1] font-extrabold text-white uppercase decoration-yellow decoration-[3px] underline-offset-[5px] group-hover:underline">
                {t("main.title")}
              </span>
              <span className="mt-1.5 block text-on-dark-mute">
                {t("main.by")} · {t("main.watch")}
              </span>
            </span>
          </a>

          <div className="flex flex-col">
            {SIDE_VIDEOS.map(({ key, image, product }) => (
              <a
                key={key}
                href={VIDEOS[key]}
                target="_blank"
                rel="noopener"
                className="group mb-5 grid grid-cols-[minmax(0,130px)_minmax(0,1fr)] items-center gap-3.5 border-b border-dark-line pb-5 sm:grid-cols-[minmax(0,190px)_minmax(0,1fr)] sm:gap-[18px]"
              >
                <span className="relative block overflow-hidden bg-ink">
                  <Image src={image} alt="" sizes="190px" className="aspect-video w-full object-cover" />
                  <span className="absolute top-0 left-0 bg-black px-2 pt-1.5 pb-[5px] font-display text-xs leading-none font-bold tracking-[0.06em] text-yellow">
                    360°
                  </span>
                  <PlayBadge small />
                </span>
                <span>
                  <span className="block font-display text-lg leading-[1.2] font-bold text-white decoration-yellow decoration-2 underline-offset-4 group-hover:underline">
                    {product[0]} {t("and")} {product[1]}
                  </span>
                  <span className="mt-1 block text-[0.9375rem] text-on-dark-mute">{t("view360")}</span>
                </span>
              </a>
            ))}

            <h3 className="mt-2 mb-3.5 caps text-yellow">{t("follow")}</h3>
            <ul className="flex flex-wrap gap-2">
              {SOCIAL_KEYS.map((key) => (
                <li key={key}>
                  <a
                    href={EXTERNAL[key]}
                    target="_blank"
                    rel="noopener"
                    className="inline-flex min-h-11 items-center gap-[9px] border border-dark-line px-3.5 pt-[11px] pb-2.5 lg:min-h-0 pointer-coarse:min-h-11 font-display text-sm leading-none font-semibold text-on-dark transition-colors duration-200 hover:border-yellow hover:text-yellow"
                  >
                    <SocialIcon name={key} className="size-[18px] shrink-0" />
                    {SOCIAL_NAMES[key]}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
