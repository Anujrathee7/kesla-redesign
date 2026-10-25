import { COUNTRY_CODES, dealersOf, ownOf, type Dealer, type DealerCountry } from "./dealers";

/**
 * Cards tagged "cr" that sell City cranes only, not timber cranes. Kesla
 * tags Nappa Machine Oy (Valkeala) City cranes only, so Anuj dropped it from
 * the timber crane lists on 19 October 2026. It stays on the Dealers page; Anuj
 * took it out of the Contacts service points on 20 October 2026.
 */
const CITY_CRANES_ONLY: ReadonlySet<number> = new Set([62]);

/**
 * The dealers who sell Kesla's timber cranes: kesla.com's dealer cards
 * tagged "cr" (Cranes) less the City-cranes-only ones, Kesla's own sales
 * first, then the dealers in town order. The Dealers page has every card;
 * the Timber cranes and 2112Z pages list only these.
 */
function sellsCranes(d: Dealer): boolean {
  return d.groups.includes("cr") && !CITY_CRANES_ONLY.has(d.id);
}

export function craneDealersOf(country: DealerCountry): Dealer[] {
  return [...ownOf(country), ...dealersOf(country)].filter(sellsCranes);
}

/** Countries with at least one crane dealer, in English alphabetical order. */
export const CRANE_COUNTRIES: readonly DealerCountry[] = COUNTRY_CODES.filter(
  (code) => craneDealersOf(code).length > 0,
);

/** Finland, where the factory is: the country the list opens on. */
export const DEFAULT_DEALER_COUNTRY: DealerCountry = "FI";
