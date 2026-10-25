import Image, { type StaticImageData } from "next/image";
import { getTranslations } from "next-intl/server";

import { PlayBadge } from "@/components/home/home-media";
import { SectionHeading } from "@/components/home/section-heading";
import { EXTERNAL } from "@/lib/routes";

import mainImage from "../../../public/images/timber-yt-XLxv2zC31sk.jpg";
import midpillarImage from "../../../public/images/timber-yt-c2uqYg9W32E.jpg";
import skTransImage from "../../../public/images/timber-yt-CsoMQK2bTwc.jpg";
import worrleinImage from "../../../public/images/timber-yt-_NEb6ece-14.jpg";

const youtube = (id: string) => `https://www.youtube.com/watch?v=${id}`;

const SIDE: { id: string; image: StaticImageData; title: "midpillar" | "skTrans" | "worrlein"; note: "youtube" | "subtitles" }[] = [
  { id: "c2uqYg9W32E", image: midpillarImage, title: "midpillar", note: "youtube" },
  { id: "CsoMQK2bTwc", image: skTransImage, title: "skTrans", note: "subtitles" },
  { id: "_NEb6ece-14", image: worrleinImage, title: "worrlein", note: "youtube" },
];

/**
 * The black video band, the frontpage's layout with four of the timber crane
 * videos from the category page on kesla.com: one main video and three rows.
 */
export async function TimberMedia() {
  const t = await getTranslations("TimberCranes.media");
  const newTab = <span className="sr-only"> {t("newTab")}</span>;

  return (
    <section aria-labelledby="timber-media-title" className="bg-black text-on-dark gutter">
      <div className="wrap py-[clamp(56px,8vw,96px)]">
        <SectionHeading
          id="timber-media-title"
          title={t("title")}
          tone="dark"
          link={{ href: EXTERNAL.youtube, label: t("all"), external: true }}
        />
        <div className="grid items-start gap-[clamp(24px,3.4vw,48px)] lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
          <a href={youtube("XLxv2zC31sk")} target="_blank" rel="noopener" className="group block">
            <span className="relative block overflow-hidden bg-ink [--cut:26px] cut">
              <Image
                src={mainImage}
                alt={t("mainAlt")}
                placeholder="blur"
                sizes="(min-width: 1024px) 58vw, 100vw"
                className="aspect-video w-full object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.03]"
              />
              <PlayBadge />
            </span>
            <span className="block pt-[18px]">
              <span className="block font-display text-[clamp(1.25rem,2vw,1.625rem)] leading-[1.1] font-extrabold text-white uppercase decoration-yellow decoration-[3px] underline-offset-[5px] group-hover:underline">
                {t("main")}
              </span>
              <span className="mt-1.5 block text-on-dark-mute">{t("watch")}</span>
              {newTab}
            </span>
          </a>

          <div className="flex flex-col max-lg:mt-3">
            {SIDE.map((video) => (
              <a
                key={video.id}
                href={youtube(video.id)}
                target="_blank"
                rel="noopener"
                className="group mb-5 grid grid-cols-[minmax(0,130px)_minmax(0,1fr)] items-center gap-3.5 border-b border-dark-line pb-5 sm:grid-cols-[minmax(0,190px)_minmax(0,1fr)] sm:gap-[18px]"
              >
                <span className="relative block overflow-hidden bg-ink">
                  <Image
                    src={video.image}
                    alt=""
                    sizes="190px"
                    className="aspect-video w-full object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.03]"
                  />
                  <PlayBadge small />
                </span>
                <span>
                  <span className="block font-display text-lg leading-[1.2] font-bold text-white decoration-yellow decoration-2 underline-offset-4 group-hover:underline">
                    {t(video.title)}
                  </span>
                  <span className="mt-1 block text-[0.9375rem] text-on-dark-mute">{t(video.note)}</span>
                  {newTab}
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
