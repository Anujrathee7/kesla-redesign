import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { getTranslations } from "next-intl/server";

import { PlayBadge } from "@/components/home/home-media";
import { Button } from "@/components/ui/button";
import { abroad, familyCounts, pickLead, storiesOf } from "@/lib/reference-stories";
import { stillSrc, storyHref, storyTeaser, storyTitle, videoHref, type CountryCode } from "@/lib/references";
import { FAMILY_KEYS } from "@/lib/routes";

import { JumpLink } from "./country-selection";
import { ShowAll } from "./show-all";
import { GroupHeading, StoryKicker, StoryModels, StoryRow, storyWhere, type StoryContext } from "./story-parts";

/** The two-column ruled list every group uses: one column at 1000px and below. */
const ROWS = "grid gap-x-[clamp(28px,3.4vw,48px)] min-[1001px]:grid-cols-2";

/**
 * One country's stories, "Picker in the head": the country's name with a jump
 * chip per product group, its newest video as the lead, then each product
 * group newest first. A country with fewer than four stories also shows its
 * product group from other countries.
 */
export async function ReferencesCountry({ country, ctx }: { country: CountryCode; ctx: StoryContext }) {
  const t = await getTranslations("References");
  const tf = await getTranslations("Common.families");
  const { locale } = ctx;
  const code = country.toLowerCase();

  const list = storiesOf(country);
  const lead = pickLead(list, locale);
  const rest = list.filter((s) => s !== lead);
  const counts = familyCounts(rest);
  const groups = FAMILY_KEYS.filter((f) => counts[f]);
  const borrowed = abroad(country, list);

  return (
    <>
      <div className="mb-7 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2.5 border-b-[3px] border-ink pb-3.5">
        <div>
          <h2 className="text-[clamp(2rem,4vw,3.25rem)] leading-[0.95] font-extrabold uppercase">
            {ctx.countries[country]}
          </h2>
          <p className="mt-2 text-base">
            {t("stories", { count: list.length })}
          </p>
        </div>
        {groups.length > 1 && (
          <nav aria-label={t("jumpLabel")}>
            <ul className="flex flex-wrap gap-1.5">
              {groups.map((family) => (
                <li key={family}>
                  <JumpLink
                    to={`${code}-${family}`}
                    className="inline-flex items-center gap-2 border border-line px-[11px] pt-2 pb-[7px] font-display text-sm leading-none font-semibold text-ink transition-colors duration-200 ease-out hover:border-ink pointer-coarse:min-h-11"
                  >
                    <Image src={`/images/icon-${family}.svg`} alt="" width={20} height={20} className="size-5" />
                    {t(`short.${family}`)}
                    <span className="text-xs font-semibold text-mute tabular-nums">{counts[family]}</span>
                  </JumpLink>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>

      {lead && <Lead lead={lead} ctx={ctx} priority={country === "FI"} watch={t("watch")} read={t("read")} />}

      {groups.map((family) => {
        const stories = rest.filter((s) => s.families[0] === family);
        const id = `${code}-${family}`;
        return (
          <section
            key={family}
            id={id}
            tabIndex={-1}
            aria-labelledby={`${id}-title`}
            className="mt-[clamp(40px,5vw,64px)] scroll-mt-4 outline-none"
          >
            <GroupHeading
              family={family}
              id={`${id}-title`}
              title={tf(`${family}.name`)}
              count={t("stories", { count: stories.length })}
            />
            <ShowAll
              id={`${id}-list`}
              count={stories.length}
              more={t("showAll", { count: stories.length })}
              fewer={t("showFewer")}
              className={ROWS}
            >
              {stories.map((story) => (
                <StoryRow key={story.id} story={story} ctx={ctx} />
              ))}
            </ShowAll>
          </section>
        );
      })}

      {borrowed && (
        <section aria-labelledby={`${code}-abroad-title`} className="mt-[clamp(40px,5vw,64px)]">
          <GroupHeading
            family={borrowed.family}
            id={`${code}-abroad-title`}
            title={t("abroad.title", { family: tf(`${borrowed.family}.name`) })}
            count={t("abroad.count", { shown: borrowed.stories.length, total: borrowed.total })}
          />
          <ul className={ROWS}>
            {borrowed.stories.map((story) => (
              <StoryRow key={story.id} story={story} ctx={ctx} />
            ))}
          </ul>
        </section>
      )}

    </>
  );
}

/** The country's newest video, large, with its teaser and the two ways on. */
function Lead({
  lead,
  ctx,
  priority,
  watch,
  read,
}: {
  lead: NonNullable<ReturnType<typeof pickLead>>;
  ctx: StoryContext;
  priority: boolean;
  watch: string;
  read: string;
}) {
  const title = storyTitle(lead, ctx.locale);
  const teaser = storyTeaser(lead, ctx.locale);
  const link = storyHref(lead, ctx.locale);
  const video = videoHref(lead.video ?? "");

  return (
    <div className="grid items-center gap-x-[clamp(24px,3vw,48px)] gap-y-5 min-[1001px]:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
      {/* Repeats "Watch the video", so it stays out of the tab order. */}
      <a
        href={video}
        target="_blank"
        rel="noopener"
        tabIndex={-1}
        aria-hidden="true"
        className="group relative block aspect-video overflow-hidden bg-warm [--cut:26px] cut"
      >
        <Image
          src={stillSrc(lead, true)}
          alt=""
          fill
          priority={priority}
          sizes="(min-width: 1001px) 58vw, 100vw"
          className="object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.03]"
        />
        <PlayBadge />
      </a>
      <div>
        <StoryKicker story={lead} ctx={ctx} />
        <h3 lang={title.lang} className="text-[clamp(1.375rem,2.2vw,1.875rem)] leading-[1.08] font-extrabold uppercase">
          {title.text}
        </h3>
        <p lang={teaser.lang} className="mt-3">
          {teaser.text}
        </p>
        <p className="mt-3 text-[0.9375rem]">{storyWhere(lead, ctx)}</p>
        <StoryModels story={lead} ctx={ctx} className="mt-2.5" />
        <div className="mt-5 flex flex-wrap gap-3">
          <Button asChild>
            <a href={video} target="_blank" rel="noopener">
              {watch}
              <ArrowUpRight strokeWidth={2.5} aria-hidden="true" />
            </a>
          </Button>
          <Button asChild variant="outline-ink">
            <a href={link.href} hrefLang={link.hrefLang}>
              {read}
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
