import type { Locale } from "@/i18n/routing";

/**
 * Pages that are not redesigned yet link to their live kesla.com
 * counterpart, so the concept never shows a 404. Every path here was read
 * off kesla.com's own navigation. Swap an entry for an internal path when
 * that page gets built.
 */
export const KESLA = "https://kesla.com";

const PAGES = {
  products: { en: "/en/products", fi: "/fi/tuotteet" },
  references: { en: "/en/references", fi: "/fi/referenssit" },
  dealers: { en: "/en/kesla-dealers", fi: "/fi/kesla-jaelleenmyyjaet" },
  news: { en: "/en/news/news", fi: "/fi/ajankohtaista/uutiset" },
  events: { en: "/en/news/events", fi: "/fi/ajankohtaista/tapahtumat" },
  company: { en: "/en/company", fi: "/fi/yritys" },
  history: { en: "/en/company/kesla-from-60s-to-today", fi: "/fi/yritys/kesla-60-luvulta-nykypaeivaeaen" },
  career: { en: "/en/career", fi: "/fi/ura" },
  contacts: { en: "/en/contact-information", fi: "/fi/yhteystiedot" },
  spareParts: { en: "/en/contact-information", fi: "/fi/yhteystiedot/varaosamyynti" },
  privacy: { en: "/en/contact-information/privacy-policy", fi: "/fi/yhteystiedot/tietosuojaselosteet" },
  terms: { en: "/en/contact-information/terms-of-use", fi: "/fi/yhteystiedot/kaeyttoeehdot" },
  twinax: {
    en: "/en/products/category/product/3rd-generation-harvester-heads/kesla-twinax",
    fi: "/fi/tuotteet/tuotekategoria/tuote/iii-sukupolven-rullasyoettoeiset-harvesterikourat/kesla-twinax",
  },
  chipper: {
    en: "/en/news/article/reminder-regarding-chipper-spare-parts",
    fi: "/fi/ajankohtaista/uutinen/reminder-regarding-chipper-spare-parts",
  },
} as const;

export type PageKey = keyof typeof PAGES;

export function keslaHref(page: PageKey, locale: Locale): string {
  return KESLA + PAGES[page][locale];
}

/**
 * Pages the redesign has built, by the nav key they replace. Plain paths, so
 * a `#family` hash is an ordinary fragment link that the Products page reads.
 */
const LOCAL_PAGES = {
  products: "/products",
  company: "/company",
  references: "/references",
  dealers: "/dealers",
  career: "/career",
  news: "/news",
  contacts: "/contacts",
  // Spare part sales is the head of the Contacts page.
  spareParts: "/contacts",
} as const satisfies Partial<Record<PageKey, string>>;

export type LocalPageKey = keyof typeof LOCAL_PAGES;

export function isLocalPage(page: PageKey): page is LocalPageKey {
  return page in LOCAL_PAGES;
}

export function localHref(page: LocalPageKey, locale: Locale, hash?: string): string {
  return `/${locale}${LOCAL_PAGES[page]}${hash ? `#${hash}` : ""}`;
}

/** Where a nav item goes: the redesigned page if there is one, otherwise kesla.com. */
export function navHref(page: PageKey, locale: Locale): string {
  return isLocalPage(page) ? localHref(page, locale) : keslaHref(page, locale);
}

/** Family page first, then its subcategories in the order of `Common.families.*.subs`. */
const CATEGORIES = {
  cranes: {
    en: ["truck-and-stationary-cranes", "timber-cranes", "city-cranes", "grapples-iii"],
    fi: ["auto-ja-teollisuusnosturit", "puutavaranosturit", "city-nosturit", "kahmarit-iii"],
  },
  logging: {
    en: ["logging-equipment", "grapples-ii", "harvester-heads", "forest-machine-cranes"],
    fi: ["puunkorjuulaitteet", "kahmarit-ii", "harvesterikourat", "metsaekonenosturit"],
  },
  tractor: {
    en: ["tractor-equipment", "loaders", "trailers", "grapples-i"],
    fi: ["traktorivarusteet", "kuormaimet", "peraevaunut", "kahmarit-i"],
  },
} as const;

export type FamilyKey = keyof typeof CATEGORIES;
export const FAMILY_KEYS: readonly FamilyKey[] = ["cranes", "logging", "tractor"];

export function isFamilyKey(value: string): value is FamilyKey {
  return (FAMILY_KEYS as readonly string[]).includes(value);
}

/**
 * The redesigned Timber cranes category page, or one product page under it
 * (`model` is the lowercase model name, "2112z"). English slugs in both
 * languages, like every local page.
 */
export function timberCranesHref(locale: Locale, model?: string): string {
  return `/${locale}/products/timber-cranes${model ? `/${model}` : ""}`;
}

export function categoryHref(family: FamilyKey, index: number, locale: Locale): string {
  // Timber cranes is built; every other category still goes to kesla.com.
  if (family === "cranes" && index === 1) return timberCranesHref(locale);
  const slug = CATEGORIES[family][locale][index];
  return locale === "fi"
    ? `${KESLA}/fi/tuotteet/tuotekategoria/${slug}`
    : `${KESLA}/en/products/category/${slug}`;
}

export const EXTERNAL = {
  defence: "https://kesladefence.com/",
  catalogues: "https://issuu.com/keslaoyj",
  shop: { en: "https://en.keslashop.fi/", fi: "https://www.keslashop.fi/" },
  extranet: "https://www.ekesla.com",
  youtube: "https://www.youtube.com/channel/UCPFj28xZNB5TGGhzc55Mk6A",
  instagram: "https://www.instagram.com/kesla_official/",
  facebook: "https://www.facebook.com/Kesla.Oyj",
  linkedin: "https://www.linkedin.com/company/kesla-oyj",
  tiktok: "https://www.tiktok.com/@kesla_official",
} as const;

export const VIDEOS = {
  inka: "https://www.youtube.com/watch?v=anDRu-slq_c",
  highSeat: "https://www.youtube.com/watch?v=ulbFv1Nbt8k",
  cabin: "https://www.youtube.com/watch?v=8k_xzqMuBAs",
} as const;
