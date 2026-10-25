import { Play } from "lucide-react";
import Image from "next/image";

import { PlayBadge } from "@/components/home/home-media";
import type { Locale } from "@/i18n/routing";
import {
  dateText,
  modelName,
  pair,
  stillSrc,
  storyHref,
  storyTitle,
  videoHref,
  type CountryCode,
  type Story,
} from "@/lib/references";
import type { FamilyKey } from "@/lib/routes";
import { cn } from "@/lib/utils";

/** What every story part needs from the page: the locale and a few resolved strings. */
export type StoryContext = {
  locale: Locale;
  countries: Record<CountryCode, string>;
  video: string;
  /** "In Finnish" on the English page, "Englanniksi" on the Finnish one. */
  otherLanguage: string;
  /** "Watch the video: {title} (YouTube, opens in a new tab)", the label of a video row's thumbnail. */
  watchVideo: (title: string) => string;
};

const NEW_TAB = { target: "_blank", rel: "noopener" } as const;

/** One anatomy for every story: date, video and language sit in a line above the title. */
export function StoryKicker({ story, ctx }: { story: Story; ctx: StoryContext }) {
  const foreign = story.lang !== "both" && story.lang !== ctx.locale;

  return (
    <p className="mb-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 font-display text-[0.8125rem] leading-[1.3] font-semibold text-mute tabular-nums">
      <time dateTime={story.date}>{dateText(story.date, ctx.locale)}</time>
      {story.video && (
        <span className="inline-flex items-center gap-1.5 text-xs leading-none font-bold tracking-[0.08em] text-ink uppercase">
          <span aria-hidden="true" className="grid size-4 shrink-0 place-items-center rounded-full bg-yellow text-black">
            <Play className="size-[7px] translate-x-px fill-current" strokeWidth={0} />
          </span>
          {ctx.video}
        </span>
      )}
      {foreign && (
        <span className="border border-line px-1.5 pt-1 pb-[3px] text-xs leading-none font-semibold tracking-[0.04em] whitespace-nowrap text-mute">
          {ctx.otherLanguage}
        </span>
      )}
    </p>
  );
}

/** "Kuljetus Leppänen Oy · Kittilä, Finland" */
export function storyWhere(story: Story, ctx: StoryContext): string {
  const country = ctx.countries[story.country];
  const where = story.place ? `${pair(story.place, ctx.locale)}, ${country}` : country;
  return story.who ? `${pair(story.who, ctx.locale)} · ${where}` : where;
}

/** The models as plain square chips; they lead nowhere, the story does. */
export function StoryModels({ story, ctx, className }: { story: Story; ctx: StoryContext; className?: string }) {
  if (!story.models.length) return null;

  return (
    <ul className={cn("flex flex-wrap gap-[5px]", className)}>
      {story.models.map((model) => (
        <li
          key={model}
          className="border border-line px-[7px] pt-[5px] pb-1 font-display text-[0.8125rem] leading-none font-semibold whitespace-nowrap text-ink"
        >
          {modelName(model, ctx.locale)}
        </li>
      ))}
    </ul>
  );
}

/**
 * A ruled story row: the thumbnail, then the kicker, the title linking to the
 * story on kesla.com, who and where, and the models. A video row's thumbnail is
 * the only way to the video, so it is a labelled link in the tab order. Any other
 * thumbnail repeats the title's link, so it is hidden from keyboard and screen readers.
 */
export function StoryRow({ story, ctx }: { story: Story; ctx: StoryContext }) {
  const title = storyTitle(story, ctx.locale);
  const link = storyHref(story, ctx.locale);

  return (
    <li className="grid min-w-0 grid-cols-[168px_minmax(0,1fr)] items-start gap-5 border-b border-line py-4 text-ink max-[721px]:grid-cols-[112px_minmax(0,1fr)] max-[721px]:gap-3.5 max-[721px]:py-3.5">
      <a
        {...(story.video
          ? { href: videoHref(story.video), ...NEW_TAB, "aria-label": ctx.watchVideo(title.text) }
          : { href: link.href, tabIndex: -1, "aria-hidden": true })}
        className="group relative block aspect-video overflow-hidden bg-warm"
      >
        {/* A fixed 168px box (112px on phones): a 1x/2x pair, not the full responsive srcset times a hundred rows. */}
        <Image
          src={stillSrc(story)}
          alt=""
          width={168}
          height={95}
          className="size-full object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.03]"
        />
        {story.video && <PlayBadge small />}
      </a>
      {/* On touch screens the title's link covers the whole text column, so the target is never a thin line of text. */}
      <div className="relative min-w-0">
        <StoryKicker story={story} ctx={ctx} />
        <h4 className="font-display text-lg leading-[1.25] font-bold text-ink [text-wrap:balance] max-[721px]:text-base">
          <a
            href={link.href}
            hrefLang={link.hrefLang}
            lang={title.lang}
            className="decoration-yellow decoration-[3px] underline-offset-4 hover:underline pointer-coarse:after:absolute pointer-coarse:after:inset-0 pointer-coarse:after:content-['']"
          >
            {title.text}
          </a>
        </h4>
        <p className="mt-1 text-[0.9375rem] text-grey max-[721px]:text-sm">{storyWhere(story, ctx)}</p>
        <StoryModels story={story} ctx={ctx} className="mt-2 max-[721px]:mt-1.5" />
      </div>
    </li>
  );
}

/** A product group's heading: Kesla's round icon, the name, and the count under it. */
export function GroupHeading({
  family,
  id,
  title,
  count,
}: {
  family: FamilyKey;
  id: string;
  title: string;
  count: string;
}) {
  return (
    <div className="grid grid-cols-[44px_minmax(0,1fr)] items-center gap-x-3.5 gap-y-1 border-b-[3px] border-ink pb-3 max-[721px]:grid-cols-[40px_minmax(0,1fr)]">
      <Image src={`/images/icon-${family}.svg`} alt="" width={44} height={44} className="size-11 max-[721px]:size-10" />
      <div>
        <h3 id={id} className="text-[clamp(1.25rem,2vw,1.625rem)] leading-[1.05] font-extrabold uppercase">
          {title}
        </h3>
        <p className="mt-[3px] text-[0.9375rem]">{count}</p>
      </div>
    </div>
  );
}
