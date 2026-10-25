import type { Locale } from "@/i18n/routing";
import { dateText, pair, type Pair } from "@/lib/references";

/**
 * The News page's shape: the item type, the buyer topics and the small pure
 * helpers both the server sections and the client parts use. The items are in
 * `news-data.ts` and the one built article in `news-articles.ts`, so a client
 * component that imports from here never pulls the whole list into the browser.
 */

/**
 * The topics in buyer order: new machines first, then where to meet Kesla,
 * dealer and parts notices, company releases, and careers. The key is also the
 * URL hash of the filter (`/news#fairs`).
 */
export const TOPIC_KEYS = ["machines", "fairs", "service", "company", "careers"] as const;
export type TopicKey = (typeof TOPIC_KEYS)[number];

export function isTopicKey(value: string): value is TopicKey {
  return (TOPIC_KEYS as readonly string[]).includes(value);
}

/**
 * How many rows a topic shows under "Everything" before its "All N" button.
 * Machines counts the lead story too. Fairs always show in full.
 */
export const TOPIC_SHOW: Record<TopicKey, number> = {
  machines: 6,
  fairs: Infinity,
  service: 4,
  company: 8,
  careers: 4,
};

export type NewsKind = "news" | "press" | "event";

export type Fair = {
  name: string;
  /** First and last day, ISO dates. */
  from: string;
  to: string;
  place: Pair;
  stand: string | null;
};

export type NewsItem = {
  slug: string;
  /** ISO date the item was published on kesla.com. */
  date: string;
  kind: NewsKind;
  topic: TopicKey;
  /** The language(s) the item was published in. */
  lang: "en" | "fi" | "both";
  title: { en: string | null; fi: string | null };
  teaser: { en: string | null; fi: string | null };
  /** Row thumbnail per page language (the job ads differ), or none. */
  image: { en: string; fi: string } | null;
  url: { en?: string; fi?: string };
  fair?: Fair;
  /** Slug of the redesign's own article page, when it has one. */
  local?: string;
};

export { dateText, pair };

/** A text as published: in the reader's language if there is one, otherwise the original, marked with its `lang`. */
export type Text = { text: string; lang?: Locale };

function inLanguage(item: NewsItem, value: { en: string | null; fi: string | null }, locale: Locale): Text | null {
  if (item.lang === "both") return value[locale] ? { text: value[locale] } : null;
  const lang = item.lang;
  const text = value[lang];
  return text ? { text, lang: lang === locale ? undefined : lang } : null;
}

/** U+2060 WORD JOINER: no break on either side, and no glyph of its own. */
const WORD_JOINER = String.fromCharCode(0x2060);

/**
 * A headline as set on the page. A compound led by one capital letter
 * ("F-Series", "F-sarjan") keeps its plain hyphen followed by a word joiner
 * (U+2060), so the letter never ends a line on its own (the Finnish Fits
 * Rule). Not U+2011: neither Exo 2 nor Hind has a glyph for it, so it falls
 * back to Arial and looks thin. Only rendered headings use it; the page
 * `<title>` and meta keep the plain hyphen.
 */
export function headline(text: string): string {
  return text.replace(/\b([A-Z])-(?=\p{L})/gu, `$1-${WORD_JOINER}`);
}

export function newsTitle(item: NewsItem, locale: Locale): Text {
  return inLanguage(item, item.title, locale) ?? { text: "" };
}

export function newsTeaser(item: NewsItem, locale: Locale): Text | null {
  return inLanguage(item, item.teaser, locale);
}

/** The redesign's own article if there is one, otherwise the item on kesla.com in the reader's language when it exists. */
export function newsHref(item: NewsItem, locale: Locale): { href: string; hrefLang?: Locale } {
  if (item.local) return { href: `/${locale}/news/${item.local}` };
  const own = item.url[locale];
  if (own) return { href: own };
  const other: Locale = locale === "fi" ? "en" : "fi";
  return { href: item.url[other] ?? "", hrefLang: other };
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function parts(iso: string): [number, number, number] {
  const [y, m, d] = iso.split("-").map(Number);
  return [y, m, d];
}

/** "15–18 Oct 2026" or "15.–18.10.2026". */
export function fairRange(fair: Fair, locale: Locale): string {
  const [, am, ad] = parts(fair.from);
  const [by, bm, bd] = parts(fair.to);
  if (locale === "fi") return am === bm ? `${ad}.–${bd}.${bm}.${by}` : `${ad}.${am}.–${bd}.${bm}.${by}`;
  return am === bm
    ? `${ad}–${bd} ${MONTHS[bm - 1]} ${by}`
    : `${ad} ${MONTHS[am - 1]} – ${bd} ${MONTHS[bm - 1]} ${by}`;
}

/** The date tile: "15–18" over "Oct 2026" (or "10/2026"). */
export function fairTile(fair: Fair, locale: Locale): { days: string; month: string } {
  const [, , ad] = parts(fair.from);
  const [by, bm, bd] = parts(fair.to);
  return { days: `${ad}–${bd}`, month: locale === "fi" ? `${bm}/${by}` : `${MONTHS[bm - 1]} ${by}` };
}

/** Days since 1970 for an ISO date, so two dates can be subtracted without time zones. */
export function dayNumber(iso: string): number {
  const [y, m, d] = parts(iso);
  return Date.UTC(y, m - 1, d) / 86_400_000;
}

export type FairStatus =
  | { state: "next"; days: number }
  | { state: "now"; lastDay: boolean }
  | { state: "past"; days: number };

/** Where a fair stands on `today` (an ISO date). */
export function fairStatus(fair: Fair, today: string): FairStatus {
  if (today < fair.from) return { state: "next", days: dayNumber(fair.from) - dayNumber(today) };
  if (today > fair.to) return { state: "past", days: dayNumber(today) - dayNumber(fair.to) };
  return { state: "now", lastDay: today === fair.to };
}

/** A past fair keeps an "Ended N days ago" badge this long. */
export const ENDED_BADGE_DAYS = 14;
