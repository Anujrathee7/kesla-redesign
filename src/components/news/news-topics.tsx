import { getLocale, getTranslations } from "next-intl/server";

import type { Locale } from "@/i18n/routing";
import { fairRange, fairTile, newsHref, pair, TOPIC_KEYS, TOPIC_SHOW, type NewsItem, type TopicKey } from "@/lib/news";
import { ARTICLES } from "@/lib/news-articles";
import { NEWS } from "@/lib/news-data";

import { FairList, type FairRow } from "./fair-list";
import { LeadStory, NewsRow, PREVIEW_HIDDEN, ReleaseRow, TopicHeading, type RowContext } from "./news-rows";
import type { TopicOption } from "./topic-filter";
import { ShowTopicButton, TopicSection } from "./topic-selection";

const SECTION_TOP = "pt-[clamp(40px,5vw,64px)]";

function byTopic(topic: TopicKey): NewsItem[] {
  return NEWS.filter((item) => item.topic === topic);
}

/** The topic chips' options: Everything, then each topic in buyer order, with counts. */
export async function getTopicOptions(): Promise<TopicOption[]> {
  const t = await getTranslations("News");
  return [
    { key: "all", label: t("filter.everything"), count: NEWS.length, status: t("filter.statusAll", { count: NEWS.length }) },
    ...TOPIC_KEYS.map((key) => {
      const count = byTopic(key).length;
      const topic = t(`topics.${key}.title`);
      return { key, label: topic, count, status: t("filter.status", { count, topic }) };
    }),
  ];
}

/**
 * The five topic sections, in buyer order; their filter sits in the black
 * head (`NewsHead`). Every row is
 * rendered here on the server; the client filter only hides sections and,
 * under "Everything", the rows past each topic's preview count.
 */
export async function NewsTopics() {
  const t = await getTranslations("News");
  const locale = (await getLocale()) as Locale;
  const ctx: RowContext = {
    locale,
    kinds: { news: t("kind.news"), press: t("kind.press"), event: t("kind.event") },
    otherLanguage: t("otherLanguage"),
  };

  /** The heading of a topic, with its "All N" button when "Everything" shows only part of it. */
  function heading(topic: TopicKey, dark = false) {
    const count = byTopic(topic).length;
    const title = t(`topics.${topic}.title`);
    return (
      <TopicHeading
        id={`news-${topic}-title`}
        title={title}
        dark={dark}
        action={
          count > TOPIC_SHOW[topic] ? (
            <ShowTopicButton topic={topic} text={t("all", { count })} label={t("allLabel", { count, topic: title })} />
          ) : undefined
        }
      />
    );
  }

  const machines = byTopic("machines");
  const lead = machines.find((item) => item.local && ARTICLES[item.local]);
  const leadArticle = lead?.local ? ARTICLES[lead.local] : undefined;
  const rest = machines.filter((item) => item !== lead);
  const shownRest = TOPIC_SHOW.machines - (lead ? 1 : 0);

  const fairs: FairRow[] = byTopic("fairs")
    .filter((item): item is NewsItem & { fair: NonNullable<NewsItem["fair"]> } => Boolean(item.fair))
    .sort((a, b) => (a.fair.from < b.fair.from ? 1 : -1))
    .map((item) => {
      const link = newsHref(item, locale);
      const stand = item.fair.stand
        ? `\u00a0· ${t("stand", { count: item.fair.stand.includes(",") ? 2 : 1, stand: item.fair.stand })}`
        : "";
      return {
        slug: item.slug,
        fair: item.fair,
        href: link.href,
        hrefLang: link.hrefLang,
        where: `${fairRange(item.fair, locale)}\u00a0· ${pair(item.fair.place, locale)}${stand}`,
        tile: fairTile(item.fair, locale),
      };
    });

  // Under #fairs the black fairs band is the last section and meets the black
  // video band below, so the bottom padding goes (it would show as a white seam).
  return (
    <div className="pb-[clamp(48px,6vw,80px)] has-[#news-fairs:not([hidden])~#news-careers[hidden]]:pb-0">
      <TopicSection topic="machines" className={`gutter ${SECTION_TOP}`}>
        <div className="wrap">
          {heading("machines")}
          {lead && leadArticle && (
            <LeadStory
              item={lead}
              ctx={ctx}
              readMore={t("readMore")}
              image={{ ...leadArticle.image, alt: pair(leadArticle.image.alt, locale) }}
            />
          )}
          <ul>
            {rest.map((item, index) => (
              <NewsRow key={item.slug} item={item} ctx={ctx} className={index >= shownRest ? PREVIEW_HIDDEN : undefined} />
            ))}
          </ul>
        </div>
      </TopicSection>

      <TopicSection topic="fairs" className="mt-[clamp(40px,5vw,64px)] bg-black text-on-dark gutter">
        <div className="wrap py-[clamp(40px,5vw,64px)]">
          {heading("fairs", true)}
          <FairList rows={fairs} />
        </div>
      </TopicSection>

      {(["service", "company", "careers"] as const).map((topic) => (
        <TopicSection key={topic} topic={topic} className={`gutter ${SECTION_TOP}`}>
          <div className="wrap">
            {heading(topic)}
            {topic === "company" ? (
              // Two columns from 1001px; CSS columns rebalance when "Everything" hides rows.
              <ul className="gap-x-[clamp(24px,4vw,56px)] min-[1001px]:columns-2">
                {byTopic(topic).map((item, index) => (
                  <ReleaseRow
                    key={item.slug}
                    item={item}
                    ctx={ctx}
                    className={index >= TOPIC_SHOW[topic] ? PREVIEW_HIDDEN : undefined}
                  />
                ))}
              </ul>
            ) : (
              <ul>
                {byTopic(topic).map((item, index) => (
                  <NewsRow
                    key={item.slug}
                    item={item}
                    ctx={ctx}
                    className={index >= TOPIC_SHOW[topic] ? PREVIEW_HIDDEN : undefined}
                  />
                ))}
              </ul>
            )}
          </div>
        </TopicSection>
      ))}
    </div>
  );
}
