import { KESLA } from "@/lib/routes";

/**
 * The Company page's structure: which sites, themes, certificates, decades,
 * people and investor links there are, in kesla.com's order. Everything a
 * visitor reads lives in `messages/{en,fi}/company.json` under the same keys.
 * Read off kesla.com's Company, history, contact and investor pages on
 * 18 October 2026 (see `original/company-content.md`).
 */

/** In-page sections, in page order. The hero's chips jump to these ids. */
export const SECTIONS = ["sites", "quality", "history", "management", "investors"] as const;
export type SectionKey = (typeof SECTIONS)[number];

export type Site = {
  key: "joensuu" | "kesalahti" | "ilomantsi" | "appenweier";
  name: string;
  street: string;
  country: "finland" | "germany";
  phone?: { href: string; label: string };
};

export const SITES: readonly Site[] = [
  {
    key: "joensuu",
    name: "Joensuu",
    street: "Kuurnankatu 24, 80100 Joensuu",
    country: "finland",
    phone: { href: "tel:+358207862841", label: "+358 207 862 841" },
  },
  { key: "kesalahti", name: "Kesälahti", street: "Metsolantie 2, 59800 Kesälahti", country: "finland" },
  { key: "ilomantsi", name: "Ilomantsi", street: "Teollisuustie 8, 82900 Ilomantsi", country: "finland" },
  { key: "appenweier", name: "Appenweier", street: "Frankenweg 48, 77767 Appenweier", country: "germany" },
];

export const THEMES = ["economy", "partnership", "resources", "safety", "energy"] as const;
export type ThemeKey = (typeof THEMES)[number];

export const BADGES = [
  "iso9001",
  "iso3834",
  "aaa",
  "luotettava",
  "esg",
  "madeinfinland",
  "gdpr",
  "asiakastieto",
] as const;
export type BadgeKey = (typeof BADGES)[number];

export const DECADES = [1960, 1970, 1980, 1990, 2000, 2010, 2020] as const;
export type Decade = (typeof DECADES)[number];

export const PEOPLE = ["nieminen", "jormanainen", "miettinen", "pirinen", "tahvanainen", "sederholm"] as const;
export type PersonKey = (typeof PEOPLE)[number];

/** Names are not translated, so they live here rather than in the messages. */
export const PERSON_NAMES: Record<PersonKey, string> = {
  nieminen: "Pasi Nieminen",
  jormanainen: "Jari Jormanainen",
  miettinen: "Ilkka Miettinen",
  pirinen: "Tapio Pirinen",
  tahvanainen: "Mika Tahvanainen",
  sederholm: "Heidi Sederholm",
};

/** The investor relations contact, from kesla.com/fi/sijoittajille. */
export const IR_CONTACT = {
  person: "nieminen" as PersonKey,
  email: "pasi.nieminen@kesla.com",
  phone: { href: "tel:+358409014401", label: "040 9014 401" },
};

/** kesla.com has investor pages in Finnish only; /en/investors is a 404. */
const IR = `${KESLA}/fi/sijoittajille`;

export const IR_LINKS = {
  root: IR,
  sustainabilityReports: `${IR}/vastuullisuus/vastuullisuusraportit`,
  board: `${IR}/hallinnointi/hallitus-ja-valiokunnat`,
} as const;

export const BOOK_URL = "https://issuu.com/keslaoyj/docs/kesla_close_up_2010_2020";
