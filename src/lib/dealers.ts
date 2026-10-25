import type { Locale } from "@/i18n/routing";

import { COUNTRY_REGIONS, DEALERS } from "./dealers-data";

/**
 * The Dealers page's shape and the pure helpers over kesla.com's dealer
 * cards: grouping a country's contacts by company, the search, phone links.
 * The cards themselves are in `dealers-data.ts`, the map in `dealers-map.ts`.
 */

export type Region = "eu" | "am" | "as" | "af";
export type DealerCountry = keyof typeof COUNTRY_REGIONS;

/** Short product tags, in the order the panel prints them. */
export const GROUP_KEYS = ["cr", "fc", "hh", "lt", "gr", "sp", "cabins", "hydrax"] as const;
export type GroupKey = (typeof GROUP_KEYS)[number];

/** kesla.com's own labels on a phone line; most lines have none. */
export type PhoneLabel = "" | "General number" | "WhatsApp" | "Mobile";

export type Dealer = {
  id: number;
  country: DealerCountry;
  name: string;
  /** A named person or office, printed under the company on kesla.com. */
  person?: string;
  /** A second contact name (one card, in Thailand). */
  contact?: string;
  address: readonly string[];
  town: string;
  phones: readonly (readonly [label: PhoneLabel, number: string])[];
  email: readonly string[];
  web: readonly string[];
  groups: readonly GroupKey[];
  /** Kesla's own sales people rather than a dealer. */
  own?: true;
  /** A note printed on the card, English and Finnish. */
  note?: readonly [en: string, fi: string];
  /**
   * The name in each language, where it differs. Only Kesla's factory sales has
   * one: "Kesla factory sales" / "Keslan tehdasmyynti". `name` stays the
   * English card name for sorting and grouping.
   */
  names?: readonly [en: string, fi: string];
};

export const COUNTRY_CODES = Object.keys(COUNTRY_REGIONS) as DealerCountry[];

export function isDealerCountry(value: string): value is DealerCountry {
  return value in COUNTRY_REGIONS;
}

export function regionOf(country: DealerCountry): Region {
  return COUNTRY_REGIONS[country];
}

/** Every card, Kesla's own included, by country. */
const BY_COUNTRY = new Map<DealerCountry, Dealer[]>();
for (const d of DEALERS) {
  const list = BY_COUNTRY.get(d.country);
  if (list) list.push(d);
  else BY_COUNTRY.set(d.country, [d]);
}

/**
 * The count the map badges, the start list, the phone dropdown and the
 * outside-Europe list show: a country's dealers, the same number as the panel
 * heading. Kesla's own people count only where there is no dealer (India 2,
 * Malaysia 1).
 */
export function cardCount(country: DealerCountry): number {
  const cards = BY_COUNTRY.get(country) ?? [];
  const dealers = cards.filter((d) => !d.own).length;
  return dealers > 0 ? dealers : cards.length;
}

/**
 * A deep link (#fi) is drawn in the browser, so the server HTML holds "Pick a
 * country". This script runs before hydration and, when the hash names a
 * dealer country, adds a style that hides the start state until the client
 * renders the country and removes it (`PENDING_ID`). It goes into <head> as
 * its own element, which React's hydration skips, rather than as an attribute
 * on <html>, which React would report as a mismatch. If the client never
 * renders, the start state comes back after 1.5s; without JS it never hides.
 */
export const PENDING_ID = "dealer-pending";

export function pendingScript(): string {
  const css =
    "[data-dealer-start]{visibility:hidden;animation:dealer-reveal 0s 1.5s forwards}@keyframes dealer-reveal{to{visibility:visible}}";
  return `(function(){try{var c=location.hash.slice(1).toUpperCase();if(${JSON.stringify(COUNTRY_CODES)}.indexOf(c)<0)return;var s=document.createElement("style");s.id=${JSON.stringify(PENDING_ID)};s.textContent=${JSON.stringify(css)};document.head.appendChild(s)}catch(e){}})()`;
}

/** The five countries with the most dealers, for the "Pick a country" start. */
export const BIGGEST = [...COUNTRY_CODES].sort((a, b) => cardCount(b) - cardCount(a)).slice(0, 5);

/** Kesla's factory sales in Joensuu, the way on when there is no dealer near. */
export const FACTORY = DEALERS.find((d) => d.own && d.country === "FI")!;

/** The name to print: the card's own name, or its Finnish name on the Finnish page. */
export function dealerName(d: Dealer, locale: Locale): string {
  return d.names ? d.names[locale === "fi" ? 1 : 0] : d.name;
}

/* ---------------------------------------------------------------- */
/* Text helpers                                                      */
/* ---------------------------------------------------------------- */

/** Lower case without accents, for sorting and search. */
export function fold(value: string): string {
  return value.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

export function townOf(d: Dealer): string {
  return d.town.replace(/\s*\/\s*/g, " / ").replace(/\s+/g, " ").trim();
}

function townKey(d: Dealer): string {
  return fold(townOf(d));
}

/** "JOENSUU" reads "Joensuu"; mixed-case towns stay as kesla.com prints them. */
export function titleCase(value: string): string {
  return value === value.toUpperCase()
    ? value.toLowerCase().replace(/(^|[\s/-])(\S)/g, (_, a: string, b: string) => a + b.toUpperCase())
    : value;
}

export function hostOf(url: string): string {
  return url.replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/.*$/, "");
}

/**
 * A few published phone fields hold two numbers split by a semicolon. Each
 * becomes its own line, so each gets its own call link.
 */
export function phonesOf(d: Dealer): (readonly [PhoneLabel, string])[] {
  return d.phones.flatMap(([label, value]) =>
    value
      .split(/\s*;\s*/)
      .filter(Boolean)
      .map((n) => [label, n] as const),
  );
}

/** Digits and a leading plus; Finnish numbers written 0400 … get +358. */
export function telHref(number: string, country: DealerCountry): string {
  let digits = number.replace(/[^\d+]/g, "");
  if (country === "FI" && digits.startsWith("0")) digits = `+358${digits.slice(1)}`;
  return `tel:${digits}`;
}

/* ---------------------------------------------------------------- */
/* A country's dealers, grouped by company                           */
/* ---------------------------------------------------------------- */

function byTown(a: Dealer, b: Dealer): number {
  return (
    townKey(a).localeCompare(townKey(b), "fi") ||
    fold(a.name).localeCompare(fold(b.name)) ||
    fold(a.person ?? "").localeCompare(fold(b.person ?? ""))
  );
}

/** A country's dealers (not Kesla's own people), sorted by town. */
export function dealersOf(country: DealerCountry): Dealer[] {
  return (BY_COUNTRY.get(country) ?? []).filter((d) => !d.own).sort(byTown);
}

/** Kesla's own sales people listed under a country (Germany, India, Malaysia; Finland's factory sales). */
export function ownOf(country: DealerCountry): Dealer[] {
  return (BY_COUNTRY.get(country) ?? []).filter((d) => d.own);
}

export function townCount(list: readonly Dealer[]): number {
  return new Set(list.map(townKey)).size;
}

/**
 * Norway's chains list every branch as its own card ("Akershus Traktor
 * Dokka", "Eik Senteret Bodø"). The branches share one company block.
 */
const CHAINS: readonly [RegExp, string][] = [
  [/^akershus traktor\b/i, "Akershus Traktor"],
  [/^eik sente?ret\b/i, "Eik Sentret"],
  [/^hengsrød\b/i, "HENGSRØD"],
];

function companyOf(d: Dealer): string {
  return CHAINS.find(([pattern]) => pattern.test(d.name))?.[1] ?? d.name;
}

export type Company = {
  key: string;
  name: string;
  items: Dealer[];
  /** The website most of its cards give. */
  web: string | null;
  towns: number;
  groups: GroupKey[];
  hasEmail: boolean;
  own: boolean;
};

function company(key: string, name: string, items: Dealer[], own = false): Company {
  const webs = new Map<string, number>();
  for (const d of items) if (d.web[0]) webs.set(d.web[0], (webs.get(d.web[0]) ?? 0) + 1);
  let web: string | null = null;
  let most = 0;
  for (const [url, n] of webs) if (n > most) [web, most] = [url, n];

  return {
    key,
    name,
    items,
    web,
    towns: townCount(items),
    groups: GROUP_KEYS.filter((g) => items.some((d) => d.groups.includes(g))),
    hasEmail: items.some((d) => d.email.length > 0),
    own,
  };
}

/** Companies, biggest first; each one's contacts stay in town order. */
export function companiesOf(list: readonly Dealer[]): Company[] {
  const map = new Map<string, { name: string; items: Dealer[] }>();
  for (const d of list) {
    const name = companyOf(d);
    const key = fold(name);
    const entry = map.get(key);
    if (entry) entry.items.push(d);
    else map.set(key, { name, items: [d] });
  }
  return [...map]
    .map(([key, { name, items }]) => company(key, name, items))
    .sort((a, b) => b.items.length - a.items.length || fold(a.name).localeCompare(fold(b.name)));
}

/** A Kesla office listed under a country with dealers (Kesla GmbH), pinned above them. */
export function ownCompany(d: Dealer): Company {
  return company(`own-${d.id}`, d.name, [d], true);
}

/** What a row prints: the person or branch first, then the street. */
export function rowLines(d: Dealer): { first: string; second: string } {
  const name = companyOf(d);
  const branch = name !== d.name ? d.name.slice(name.length).trim() : "";
  const who = branch && fold(branch) !== townKey(d) ? branch : "";
  const street = d.address[0] ?? "";
  const first = d.person || who || street;
  const second = d.person ? (who ? `${who}, ` : "") + street : first === street ? "" : street;
  return { first, second };
}

/* ---------------------------------------------------------------- */
/* Search                                                            */
/* ---------------------------------------------------------------- */

const HAYSTACK = new Map<number, string>(
  DEALERS.map((d) => [
    d.id,
    fold(
      [d.name, ...(d.names ?? []), d.person ?? "", d.contact ?? "", d.address.join(" "), d.town, ...phonesOf(d).map(([, n]) => n)].join(
        " ",
      ),
    ),
  ]),
);

function words(query: string): string[] {
  return fold(query.trim()).split(/\s+/).filter(Boolean);
}

/** Every word of the query appears in the card: town, company, person, street or number. */
export function matches(d: Dealer, query: string): boolean {
  const hay = HAYSTACK.get(d.id) ?? "";
  return words(query).every((w) => hay.includes(w));
}

export function nameMatches(name: string, query: string): boolean {
  const hay = fold(name);
  return words(query).every((w) => hay.includes(w));
}

/** Contacts shown before "Show all", and how much bigger a group must be to fold. */
export const GROUP_SHOW = 6;
export const GROUP_FOLD = GROUP_SHOW + 2;
