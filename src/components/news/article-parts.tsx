import { ArrowRight, ChevronRight } from "lucide-react";
import Image from "next/image";
import { getTranslations } from "next-intl/server";

import { PhotoHead } from "@/components/site/photo-head";
import { Button } from "@/components/ui/button";
import type { Locale } from "@/i18n/routing";
import { dateText, headline, pair, type NewsItem } from "@/lib/news";
import type { Article, ArticleBlock, Contact, Segment } from "@/lib/news-articles";
import { categoryHref, localHref } from "@/lib/routes";
import { cn } from "@/lib/utils";

import { NewsCrumbs } from "./news-crumbs";

type PartProps = { article: Article; item: NewsItem; locale: Locale };

/** A fact label on white: At a glance and the operator benefits. */
const FACT_TERM = "font-display text-[0.8125rem] leading-[1.5] font-bold tracking-[0.06em] text-ink uppercase";

const MONTHS_LONG = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/** The dateline's date: "5 June 2026" in English, "5.6.2026" in Finnish. */
function longDate(iso: string, locale: Locale): string {
  if (locale === "fi") return dateText(iso, locale);
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} ${MONTHS_LONG[m - 1]} ${y}`;
}

function Segments({ value }: { value: readonly Segment[] }) {
  return value.map((part, index) =>
    typeof part === "string" ? (
      part
    ) : (
      <b key={index} className="font-display text-lg font-bold">
        {part.b}
      </b>
    ),
  );
}

/**
 * The article's black head as a Photo Head: breadcrumb, the headline with a
 * plain dateline under it ("Press release, 5 June 2026") and the two ways on
 * (the cranes, a dealer) on the left, the release's own photo cut in on the
 * right. The lead moved to the top of the body (`ArticleBody`), so the head
 * holds only what a reader scans first. Below 1001px the photo is a strip
 * under the buttons. The head closes square onto the white body.
 */
export async function ArticleHead({ article, item, locale }: PartProps) {
  const t = await getTranslations("News");

  return (
    <PhotoHead
      as="header"
      photo={
        <Image
          src={article.image.src}
          alt={pair(article.image.alt, locale)}
          fill
          priority
          sizes="(min-width: 1001px) 46vw, 100vw"
          className="object-cover object-[40%_50%]"
        />
      }
    >
      <NewsCrumbs
        label={t("breadcrumb.label")}
        crumbs={[
          { label: t("breadcrumb.home"), href: "/" },
          { label: t("breadcrumb.news"), href: "/news" },
          { label: t("article.crumb") },
        ]}
        lastIsPage={false}
        className="mt-[18px] mb-[18px]"
      />
      <h1 className="text-[clamp(1.5rem,2.3vw,2.125rem)] leading-[1.12] font-extrabold text-white">
        {headline(pair(article.title, locale))}
      </h1>
      <p className="mt-3 text-[0.9375rem] text-on-dark-mute">
        {t(`kind.${item.kind}`)},{" "}
        <time dateTime={item.date} className="tabular-nums">
          {longDate(item.date, locale)}
        </time>
      </p>
      <div className="mt-[26px] flex flex-wrap gap-3">
        <Button asChild>
          <a href={localHref("products", locale, "logging")}>
            {t("article.seeCranes")}
            <ArrowRight strokeWidth={2.5} aria-hidden="true" />
          </a>
        </Button>
        <Button asChild variant="outline-light">
          <a href={localHref("dealers", locale)}>{t("article.findDealer")}</a>
        </Button>
      </div>
    </PhotoHead>
  );
}

function ContactLines({ contact, locale }: { contact: Contact; locale: Locale }) {
  return (
    <>
      <b className="font-display">{contact.name}</b>
      <br />
      {pair(contact.role, locale)}
      {contact.phone && (
        <>
          <br />
          <a href={`tel:${contact.phone.replace(/\s/g, "")}`} className="tabular-nums">
            {contact.phone}
          </a>
        </>
      )}
    </>
  );
}

const MAIL = "text-ink underline decoration-yellow decoration-2 underline-offset-4 hover:decoration-[3px]";

/** A run of blocks under one subhead (or the opening run, which has none). */
type Group = { head?: Extract<ArticleBlock, { type: "h2" }>; items: ArticleBlock[] };

/** Splits the release at its subheads, and takes the quote out to stand on its own. */
function groupBlocks(blocks: readonly ArticleBlock[]) {
  const groups: Group[] = [{ items: [] }];
  const quotes: Extract<ArticleBlock, { type: "quote" }>[] = [];
  for (const block of blocks) {
    if (block.type === "h2") groups.push({ head: block, items: [] });
    else if (block.type === "quote") quotes.push(block);
    else groups[groups.length - 1].items.push(block);
  }
  return { groups, quotes };
}

const H2 = "scroll-mt-6 text-[clamp(1.375rem,2.2vw,1.75rem)] leading-[1.05] font-extrabold text-ink uppercase";
/** The space between the full-width parts of the body. */
const PART_GAP = "mt-[clamp(48px,6vw,80px)]";

function Block({ block, locale }: { block: ArticleBlock; locale: Locale }) {
  switch (block.type) {
    case "p":
      return <p>{pair(block.text, locale)}</p>;
    case "h2":
      return (
        <h2 id={block.id} className={H2}>
          {pair(block.text, locale)}
        </h2>
      );
    case "ul":
      return (
        <ul>
          {block.items.map((entry) => (
            <li
              key={entry[0]}
              className="relative border-b border-line pt-[9px] pb-2 pl-[26px] text-ink first:border-t before:absolute before:top-[19px] before:left-0.5 before:size-2.5 before:bg-ink before:content-[''] before:[clip-path:polygon(0_0,100%_0,100%_50%,50%_100%,0_100%)]"
            >
              {pair(entry, locale)}
            </li>
          ))}
        </ul>
      );
    case "dl":
      // The operator benefits as ruled cells under a 3px ink rule: three across from 1001px, two from 641px.
      return (
        <dl className="grid gap-x-[clamp(24px,3vw,48px)] border-t-[3px] border-ink min-[641px]:grid-cols-2 min-[1001px]:grid-cols-3">
          {block.rows.map((row) => (
            <div key={row.term[0]} className="border-b border-line pt-4 pb-5">
              <dt className={FACT_TERM}>{pair(row.term, locale)}</dt>
              <dd className="mt-1.5 text-[1.0625rem] leading-[1.55] text-ink">{pair(row.text, locale)}</dd>
            </div>
          ))}
        </dl>
      );
    case "quote":
      return (
        <figure className="border-l-[6px] border-ink pl-[clamp(20px,3vw,40px)]">
          <blockquote>
            <p className="max-w-[34em] font-display text-[clamp(1.375rem,2.5vw,2.125rem)] leading-[1.22] font-bold tracking-[-0.005em] text-pretty text-ink">
              {pair(block.text, locale)}
            </p>
          </blockquote>
          <figcaption className="mt-4 text-base text-grey">
            <b className="mr-1.5 font-display text-base leading-[1.2] font-bold tracking-[0.04em] text-ink uppercase">
              {block.name}
            </b>
            {pair(block.role, locale)}
          </figcaption>
        </figure>
      );
  }
}

function GroupBlocks({ group, locale, className }: { group: Group; locale: Locale; className?: string }) {
  return (
    <div className={cn("[&>*+*]:mt-[18px]", className)}>
      {group.head && <Block block={group.head} locale={locale} />}
      {group.items.map((block, index) => (
        <Block key={index} block={block} locale={locale} />
      ))}
    </div>
  );
}

/** The later subhead groups in reading order: one with the benefit list spans the width, plain-text neighbours pair up as two columns. */
function laterParts(groups: readonly Group[]) {
  const parts: ({ wide: Group } | { pair: Group[] })[] = [];
  for (const group of groups) {
    const last = parts[parts.length - 1];
    if (group.items.some((block) => block.type === "dl")) parts.push({ wide: group });
    else if (last && "pair" in last && last.pair.length < 2) last.pair.push(group);
    else parts.push({ pair: [group] });
  }
  return parts;
}

/**
 * The release under the head, laid out across the whole wrap above 1000px.
 * The opening (the lead as a lede, then the first paragraph) and the first
 * subhead run in a 68ch reading column, with "At a glance" beside the opening
 * and the F-series models and press contacts beside the first subhead, so the
 * right side carries the page's figures and ways on. Then the operator
 * benefits span the width as ruled cells, the next two subheads sit side by
 * side, the quote is a full-width pull quote on a 6px ink rule, and the
 * boilerplate closes in two muted columns.
 *
 * The rail is not sticky: glance, models and contacts together run taller
 * than a 900px window, and each half sits beside text of about its height.
 * At 1000px and below it is one column in source order: the lede, the first
 * paragraph, At a glance, the release, the quote, the models and contacts,
 * then the boilerplate.
 */
export async function ArticleBody({ article, locale }: Omit<PartProps, "item">) {
  const t = await getTranslations("News.article");
  const { groups, quotes } = groupBlocks(article.blocks);
  const [opening, first, ...later] = groups;
  const links = [
    ...article.models.map((model) => ({ label: model.name, href: pair(model.href, locale) })),
    { label: t("allCranes"), href: categoryHref("logging", 3, locale) },
  ];

  return (
    <div className="gutter">
      <div className="wrap grid grid-cols-[minmax(0,1fr)] gap-x-[clamp(40px,5vw,80px)] pt-[clamp(40px,5vw,64px)] pb-[clamp(48px,6vw,80px)] text-lg leading-[1.62] text-grey max-[721px]:text-[1.0625rem] min-[1001px]:grid-cols-[minmax(0,68ch)_minmax(300px,1fr)]">
        {/* The release's lead, moved here from the head: one step larger, in ink. */}
        <div className="[&>*+*]:mt-[18px] min-[1001px]:col-start-1 min-[1001px]:row-start-1">
          <p className="text-[clamp(1.1875rem,1.6vw,1.3125rem)] leading-[1.5] font-medium text-pretty text-ink">
            {pair(article.lead, locale)}
          </p>
          {opening.items.map((block, index) => (
            <Block key={index} block={block} locale={locale} />
          ))}
        </div>

        <section
          aria-labelledby="glance-title"
          className="@container mt-10 min-[1001px]:col-start-2 min-[1001px]:row-start-1 min-[1001px]:mt-1"
        >
          <h2 id="glance-title" className="mb-2.5 caps text-ink">
            {t("glanceTitle")}
          </h2>
          <dl className="border-t-[3px] border-ink">
            {article.glance.map((row) => (
              <div
                key={row.term[0]}
                className="grid gap-x-5 gap-y-0.5 border-b border-line pt-2.5 pb-[9px] @min-[420px]:grid-cols-[minmax(0,11rem)_minmax(0,1fr)]"
              >
                <dt className={FACT_TERM}>{pair(row.term, locale)}</dt>
                <dd className="text-base leading-[1.5] text-ink">
                  <Segments value={row.value[locale === "fi" ? 1 : 0]} />
                </dd>
              </div>
            ))}
          </dl>
        </section>

        {first && (
          <GroupBlocks group={first} locale={locale} className="mt-10 min-[1001px]:col-start-1 min-[1001px]:row-start-2" />
        )}

        {laterParts(later).map((part, index) =>
          "wide" in part ? (
            <GroupBlocks
              key={index}
              group={part.wide}
              locale={locale}
              className={cn(PART_GAP, "min-[1001px]:col-span-2")}
            />
          ) : (
            <div
              key={index}
              className={cn(
                PART_GAP,
                "grid gap-x-[clamp(40px,5vw,80px)] gap-y-10 min-[1001px]:col-span-2 min-[1001px]:grid-cols-2",
              )}
            >
              {part.pair.map((group, i) => (
                <GroupBlocks key={i} group={group} locale={locale} />
              ))}
            </div>
          ),
        )}

        {quotes.map((quote, index) => (
          <div key={index} className={cn(PART_GAP, "min-[1001px]:col-span-2")}>
            <Block block={quote} locale={locale} />
          </div>
        ))}

        {/* Beside the first subhead from 1001px; after the quote on phones. */}
        <aside className="mt-12 flex flex-col gap-6 self-start min-[1001px]:col-start-2 min-[1001px]:row-start-2 min-[1001px]:mt-10">
          <nav aria-labelledby="models-title">
            <h2 id="models-title" className="mb-2.5 caps text-ink">
              {t("modelsTitle")}
            </h2>
            <ul className="border-t-[3px] border-ink">
              {links.map((link) => (
                <li key={link.href} className="border-b border-line">
                  <a
                    href={link.href}
                    className="group flex min-h-11 items-center justify-between gap-3 pt-3 pb-[11px] font-display text-[1.0625rem] leading-[1.2] font-bold text-ink"
                  >
                    <span className="decoration-yellow decoration-2 underline-offset-4 group-hover:underline">
                      {link.label}
                    </span>
                    <ChevronRight
                      className="size-4 shrink-0 text-mute transition-[transform,color] duration-200 ease-out-expo group-hover:translate-x-1 group-hover:text-ink"
                      strokeWidth={2.5}
                      aria-hidden="true"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <section aria-labelledby="contact-title" className="bg-warm px-6 pt-[22px] pb-6 text-base leading-[1.5] text-ink">
            <h2 id="contact-title" className="mb-2.5 caps text-ink">
              {t("moreInfo")}
            </h2>
            <p>
              <ContactLines contact={article.contact} locale={locale} />
              <br />
              <a href={`mailto:${article.contact.email}`} className={MAIL}>
                {article.contact.email}
              </a>
            </p>
            <p className="mt-2.5">
              {t("imageInquiries")}: <b className="font-display">{article.images.name}</b>,{" "}
              {pair(article.images.role, locale)}
              <br />
              <a href={`mailto:${article.images.email}`} className={MAIL}>
                {article.images.email}
              </a>
            </p>
            {/* The release's own photo caption, where kesla.com prints it: under the image inquiries. */}
            <p className="mt-2.5 text-[0.9375rem] text-grey">{pair(article.image.caption, locale)}</p>
          </section>
        </aside>

        <p
          className={cn(
            PART_GAP,
            "border-t border-line pt-[18px] text-[0.9375rem] leading-[1.55] text-mute min-[1001px]:col-span-2 min-[1001px]:columns-2 min-[1001px]:gap-x-[clamp(40px,5vw,80px)]",
          )}
        >
          <b className="font-display text-ink">{t("aboutLead")}</b> {pair(article.about, locale)}
        </p>
      </div>
    </div>
  );
}
