import Image from "next/image";
import { getTranslations } from "next-intl/server";

import { PhotoHead } from "@/components/site/photo-head";

import twinaxPhoto from "../../../public/images/twinax.jpg";
import { NewsCrumbs } from "./news-crumbs";
import { TopicFilter } from "./topic-filter";
import { getTopicOptions } from "./news-topics";

/**
 * The black News head as a Photo Head: breadcrumb, title and the topic chips
 * on the left, the KESLA twinAX harvester head (the newest machine launch) cut
 * in on the right. The head is as tall as its text (no floor), and the chips
 * wrap inside the text column, which ends before the photo's cut at every
 * width. On phones the chips sit under the title and the photo is a short
 * strip under them. The page opens straight onto the first topic, with no
 * brand band (Anuj, 20 October 2026).
 */
export async function NewsHead() {
  const t = await getTranslations("News");
  const options = await getTopicOptions();

  return (
    <PhotoHead
      as="div"
      strip="short"
      floor={false}
      photo={
        <Image
          src={twinaxPhoto}
          alt={t("headImageAlt")}
          fill
          priority
          placeholder="blur"
          sizes="(min-width: 1001px) 46vw, 100vw"
          className="object-cover object-[60%_50%]"
        />
      }
    >
      <NewsCrumbs
        label={t("breadcrumb.label")}
        crumbs={[{ label: t("breadcrumb.home"), href: "/" }, { label: t("breadcrumb.news") }]}
        className="mt-[18px] mb-[18px]"
      />
      <h1
        id="news-title"
        className="text-[clamp(2.5rem,5vw,4.5rem)] leading-[0.95] font-extrabold tracking-[-0.015em] text-white uppercase"
      >
        {t("title")}
      </h1>
      <div className="mt-[clamp(22px,2.6vw,36px)]">
        <TopicFilter label={t("filter.label")} options={options} />
      </div>
    </PhotoHead>
  );
}
