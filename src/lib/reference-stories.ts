import type { Locale } from "@/i18n/routing";
import { FAMILY_KEYS, type FamilyKey } from "@/lib/routes";

import { COUNTRY_CODES, readable, SMALL_COUNTRY, type CountryCode, type Story } from "./references";
import { STORIES } from "./references-data";

/**
 * Queries over the stories, for the server components only. Every list is
 * strictly newest first, whatever language a story is in.
 */

function newestFirst(list: readonly Story[]): Story[] {
  return [...list].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : Number(b.id) - Number(a.id)));
}

/** The countries in the picker's order, with their story counts. */
export const COUNTRIES: readonly { code: CountryCode; count: number }[] = COUNTRY_CODES.map((code) => ({
  code,
  count: STORIES.filter((s) => s.country === code).length,
})).sort((a, b) => b.count - a.count);

export function storiesOf(country: CountryCode): Story[] {
  return newestFirst(STORIES.filter((s) => s.country === country));
}

/**
 * The country's lead: its newest video, preferring one in the reader's
 * language. Only stories with a large still qualify, so a country without one
 * has no lead rather than an upscaled thumbnail.
 */
export function pickLead(list: readonly Story[], locale: Locale): Story | null {
  const stills = list.filter((s) => s.still && s.video);
  return stills.find((s) => readable(s, locale)) ?? stills[0] ?? null;
}

/** Stories per product group, by each story's first family. */
export function familyCounts(list: readonly Story[]): Partial<Record<FamilyKey, number>> {
  const counts: Partial<Record<FamilyKey, number>> = {};
  for (const s of list) counts[s.families[0]] = (counts[s.families[0]] ?? 0) + 1;
  return counts;
}

/**
 * A country with fewer than four stories also shows the newest stories from
 * its main product group in other countries, so it never looks empty.
 */
export function abroad(
  country: CountryCode,
  list: readonly Story[],
): { family: FamilyKey; total: number; stories: Story[] } | null {
  if (list.length >= SMALL_COUNTRY) return null;
  const counts = familyCounts(list);
  const family = [...FAMILY_KEYS].filter((f) => counts[f]).sort((a, b) => (counts[b] ?? 0) - (counts[a] ?? 0))[0];
  if (!family) return null;
  const others = newestFirst(STORIES.filter((s) => s.country !== country && s.families.includes(family)));
  return { family, total: others.length, stories: others.slice(0, 4) };
}
