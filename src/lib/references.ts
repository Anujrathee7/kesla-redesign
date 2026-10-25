import type { Locale } from "@/i18n/routing";
import type { FamilyKey } from "@/lib/routes";

/**
 * The References page's shape: the story type, the countries, and the small
 * pure helpers both the server panels and the client picker use. The stories
 * themselves are in `references-data.ts` and the queries over them in
 * `reference-stories.ts`, so a client component that imports from here never
 * pulls the whole story list into the browser.
 */

/**
 * Every country with a story on kesla.com, most stories first and ties in
 * English alphabetical order (the mockup's order). `UK` is kesla.com's own
 * code for the United Kingdom.
 */
export const COUNTRY_CODES = ["FI", "DE", "AT", "FR", "JP", "IE", "PL", "RU", "SE", "UK"] as const;
export type CountryCode = (typeof COUNTRY_CODES)[number];

export function isCountryCode(value: string): value is CountryCode {
  return (COUNTRY_CODES as readonly string[]).includes(value);
}

/** A value kesla.com prints differently in English and Finnish. */
export type Pair = readonly [en: string, fi: string];

export type Story = {
  id: string;
  /** ISO date the story was published on kesla.com. */
  date: string;
  country: CountryCode;
  /** The first family is the product group the story is listed under. */
  families: readonly FamilyKey[];
  models: readonly string[];
  /** The language(s) the story was published in. */
  lang: "en" | "fi" | "both";
  title: { en: string | null; fi: string | null };
  teaser: { en: string | null; fi: string | null };
  who: Pair | null;
  place: Pair | null;
  /** YouTube video id. */
  video: string | null;
  /** True when there is a large video still to lead the country with. */
  still: boolean;
  url: { en?: string; fi?: string };
};

/** A product group shows this many stories before "Show all". */
export const GROUP_SHOW = 4;

/** A country with fewer stories than this borrows its product group from other countries. */
export const SMALL_COUNTRY = 4;

export function pair(value: Pair, locale: Locale): string {
  return value[locale === "fi" ? 1 : 0];
}

/** True when the story text exists in the reader's language. */
export function readable(story: Story, locale: Locale): boolean {
  return story.lang === "both" || story.lang === locale;
}

/** The title as published: in the reader's language if there is one, otherwise the original. */
export function storyTitle(story: Story, locale: Locale): { text: string; lang?: Locale } {
  if (story.lang === "both") return { text: story.title[locale] ?? "" };
  const lang = story.lang;
  return { text: story.title[lang] ?? "", lang: lang === locale ? undefined : lang };
}

export function storyTeaser(story: Story, locale: Locale): { text: string; lang?: Locale } {
  if (story.lang === "both") return { text: story.teaser[locale] ?? "" };
  const lang = story.lang;
  return { text: story.teaser[lang] ?? "", lang: lang === locale ? undefined : lang };
}

/** The story's page on kesla.com, in the reader's language when it exists. */
export function storyHref(story: Story, locale: Locale): { href: string; hrefLang?: Locale } {
  const own = story.url[locale];
  if (own) return { href: own };
  const other: Locale = locale === "fi" ? "en" : "fi";
  return { href: story.url[other] ?? "", hrefLang: other };
}

export function videoHref(id: string): string {
  return `https://www.youtube.com/watch?v=${id}`;
}

export function stillSrc(story: Story, large = false): string {
  return `/images/ref-${story.id}${large && story.still ? "" : "-s"}.jpg`;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/**
 * "27 Mar 2025" or "27.3.2025". Written out rather than left to Intl, whose
 * en-GB short month for September varies between ICU versions.
 */
export function dateText(iso: string, locale: Locale): string {
  const [y, m, d] = iso.split("-").map(Number);
  return locale === "fi" ? `${d}.${m}.${y}` : `${d} ${MONTHS[m - 1]} ${y}`;
}

/** Model names that kesla.com writes out differently in Finnish. The rest are codes. */
const MODEL_NAMES: Record<string, Pair> = {
  "C645 chipper": ["C645 chipper", "C645-hakkuri"],
  "C645T chipper": ["C645T chipper", "C645T-hakkuri"],
  "144 series": ["144 series", "144-sarja"],
  Xtender: ["Xtender boom", "Xtender-puomi"],
  "proC i": ["proC i control", "proC i -kärkiohjaus"],
};

export function modelName(model: string, locale: Locale): string {
  const names = MODEL_NAMES[model];
  return names ? pair(names, locale) : model;
}
