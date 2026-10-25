import { ArrowRight } from "lucide-react";
import Image from "next/image";

import type { Locale } from "@/i18n/routing";
import { dateText, headline, newsHref, newsTeaser, newsTitle, type NewsItem, type NewsKind } from "@/lib/news";
import { cn } from "@/lib/utils";

/** What every row needs from the page: the locale and a few resolved strings. */
export type RowContext = {
  locale: Locale;
  kinds: Record<NewsKind, string>;
  /** "In Finnish" on the English page, "Englanniksi" on the Finnish one. */
  otherLanguage: string;
};

/** Rows past a topic's preview count hide under "Everything" (see `TopicSection`). */
export const PREVIEW_HIDDEN = "group-data-[view=all]/topic:hidden";

/** The small hairline tag after a title published only in the other language. */
function LanguageTag({ text }: { text: string }) {
  return (
    <span className="ml-1.5 inline-block border border-line px-1.5 pt-1 pb-[3px] align-[2px] font-display text-xs leading-none font-semibold tracking-[0.04em] whitespace-nowrap text-mute">
      {text}
    </span>
  );
}

function Kind({ kind, ctx, className }: { kind: NewsKind; ctx: RowContext; className?: string }) {
  return <span className={cn("caps text-xs whitespace-nowrap text-mute", className)}>{ctx.kinds[kind]}</span>;
}

/** The title link; on touch screens it covers its whole row, so the target is never a thin line of text. */
function TitleLink({ item, ctx }: { item: NewsItem; ctx: RowContext }) {
  const title = newsTitle(item, ctx.locale);
  const link = newsHref(item, ctx.locale);

  return (
    <>
      <a
        href={link.href}
        hrefLang={link.hrefLang}
        lang={title.lang}
        className="decoration-yellow decoration-[3px] underline-offset-4 hover:underline pointer-coarse:after:absolute pointer-coarse:after:inset-0 pointer-coarse:after:content-['']"
      >
        {headline(title.text)}
      </a>
      {title.lang && <LanguageTag text={ctx.otherLanguage} />}
    </>
  );
}

/**
 * A ruled row with a thumbnail: photo, title and a two-line teaser, date and
 * kind on the right. An item without a photo leaves the photo column empty
 * from 722px, so every title in a section starts at one left edge, and runs
 * full width on phones; it never shows an empty grey box. The photo repeats
 * the title's link, so it is hidden from keyboard and screen readers.
 */
export function NewsRow({ item, ctx, className }: { item: NewsItem; ctx: RowContext; className?: string }) {
  const teaser = newsTeaser(item, ctx.locale);
  const image = item.image?.[ctx.locale];
  const link = newsHref(item, ctx.locale);

  return (
    <li
      className={cn(
        "relative grid items-start gap-x-6 gap-y-1.5 border-b border-line py-[18px] text-ink",
        "grid-cols-[176px_minmax(0,1fr)_auto]",
        image ? "max-[721px]:grid-cols-[112px_minmax(0,1fr)] max-[721px]:gap-x-3.5" : "max-[721px]:grid-cols-1",
        className,
      )}
    >
      {image && (
        <a
          href={link.href}
          tabIndex={-1}
          aria-hidden="true"
          className="group relative block aspect-[16/10] overflow-hidden bg-warm max-[721px]:row-span-2"
        >
          {/* A fixed 176px box (112px on phones): a 1x/2x pair, not a full responsive srcset per row. */}
          <Image
            src={image}
            alt=""
            width={176}
            height={110}
            className="size-full object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.03]"
          />
        </a>
      )}
      <div className={cn("min-w-0", !image && "min-[722px]:col-start-2")}>
        <h3 className="font-display text-[1.1875rem] leading-[1.25] font-bold tracking-normal text-ink max-[721px]:text-base">
          <TitleLink item={item} ctx={ctx} />
        </h3>
        {teaser && (
          <p
            lang={teaser.lang}
            className="mt-1.5 line-clamp-2 text-[0.9375rem] leading-[1.5] text-grey max-[721px]:hidden"
          >
            {teaser.text}
          </p>
        )}
      </div>
      <div
        className={cn(
          "flex flex-col items-end gap-2 text-right text-sm whitespace-nowrap text-mute tabular-nums",
          "max-[721px]:flex-row max-[721px]:items-center max-[721px]:gap-3 max-[721px]:text-left",
          image && "max-[721px]:col-start-2",
        )}
      >
        <time dateTime={item.date}>{dateText(item.date, ctx.locale)}</time>
        <Kind kind={item.kind} ctx={ctx} />
      </div>
    </li>
  );
}

/**
 * A ruled release row without a photo: date over kind on the left, title on
 * the right. Phones stack date, kind and title.
 */
export function ReleaseRow({ item, ctx, className }: { item: NewsItem; ctx: RowContext; className?: string }) {
  return (
    <li
      className={cn(
        "relative grid break-inside-avoid grid-cols-[6.4em_minmax(0,1fr)] items-baseline gap-x-[22px] gap-y-1 border-b border-line pt-[15px] pb-3.5 max-[721px]:grid-cols-1",
        className,
      )}
    >
      <time dateTime={item.date} className="text-sm text-mute tabular-nums">
        {dateText(item.date, ctx.locale)}
      </time>
      <h3 className="row-span-2 font-display text-base leading-[1.3] font-bold tracking-normal text-ink max-[721px]:order-1 max-[721px]:row-span-1">
        <TitleLink item={item} ctx={ctx} />
      </h3>
      <Kind kind={item.kind} ctx={ctx} />
    </li>
  );
}

/**
 * The lead story of Machines and launches: a cut-corner photo beside the
 * headline and teaser, with "Read the release" followed by the date and kind
 * the way the list rows show them, all one link to the article page.
 */
export function LeadStory({
  item,
  ctx,
  image,
  readMore,
}: {
  item: NewsItem;
  ctx: RowContext;
  image: { src: string; width: number; height: number; alt: string };
  readMore: string;
}) {
  const title = newsTitle(item, ctx.locale);
  const teaser = newsTeaser(item, ctx.locale);
  const link = newsHref(item, ctx.locale);

  return (
    <article className="border-b border-line">
      <a
        href={link.href}
        className="group grid items-center gap-x-[clamp(24px,3.4vw,48px)] gap-y-6 py-7 text-ink min-[1001px]:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]"
      >
        <span className="cut relative block aspect-[3/2] overflow-hidden bg-warm [--cut:22px]">
          <Image
            src={image.src}
            alt={image.alt}
            width={image.width}
            height={image.height}
            sizes="(min-width: 1280px) 700px, (min-width: 1001px) 56vw, 100vw"
            className="size-full object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.03]"
          />
        </span>
        <span className="block min-w-0">
          <h3
            lang={title.lang}
            className="font-display text-[clamp(1.375rem,2.2vw,1.875rem)] leading-[1.12] font-extrabold tracking-normal text-balance text-ink decoration-yellow decoration-[3px] underline-offset-[5px] group-hover:underline"
          >
            {headline(title.text)}
          </h3>
          {teaser && (
            <p lang={teaser.lang} className="mt-3 line-clamp-4 text-grey">
              {teaser.text}
            </p>
          )}
          <span className="mt-[18px] flex flex-wrap items-center gap-x-5 gap-y-2">
            <span className="inline-flex items-center gap-1.5 font-display text-[0.9375rem] leading-[1.2] font-semibold text-ink underline decoration-yellow decoration-2 underline-offset-[5px] group-hover:decoration-[3px]">
              {readMore}
              <ArrowRight className="size-4" strokeWidth={2.25} aria-hidden="true" />
            </span>
            <span className="inline-flex items-center gap-3 text-sm whitespace-nowrap text-mute tabular-nums">
              <time dateTime={item.date}>{dateText(item.date, ctx.locale)}</time>
              <Kind kind={item.kind} ctx={ctx} />
            </span>
          </span>
        </span>
      </a>
    </article>
  );
}

/**
 * A topic's heading over a 3px rule: the title on the left, the "All N"
 * button on the right. On the black fairs band the rule turns white.
 */
export function TopicHeading({
  id,
  title,
  dark = false,
  action,
}: {
  id: string;
  title: string;
  dark?: boolean;
  action?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-baseline justify-between gap-x-5 gap-y-2 border-b-[3px] pb-3",
        dark ? "border-white" : "border-ink",
      )}
    >
      <h2
        id={id}
        className={cn(
          "text-[clamp(1.625rem,3vw,2.5rem)] leading-none font-extrabold uppercase",
          dark ? "text-white" : "text-ink",
        )}
      >
        {title}
      </h2>
      {action}
    </div>
  );
}
