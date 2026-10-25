import type { Locale } from "@/i18n/routing";

import { SERVICE_POINTS, TOWN_REGIONS, type Maakunta, type ServicePointData } from "./contacts-data";

/**
 * The Contacts page's data: Kesla's own desks, people and sites from
 * kesla.com/en/contact-information, /fi/yhteystiedot and their sub-pages, the
 * dealer page and the chipper spare-parts article of 8 September 2026, read
 * 18 October 2026 (`original/contacts-content.md`). The service points are in
 * `contacts-data.ts`; this file shapes them for the region filter and search.
 */

type Bilingual = readonly [en: string, fi: string];

export function pick(text: Bilingual, locale: Locale): string {
  return locale === "fi" ? text[1] : text[0];
}

/* ---------------------------------------------------------------- */
/* Kesla's own contacts                                              */
/* ---------------------------------------------------------------- */

/** One phone number as each language prints it, and its tel: link. */
export type Phone = { en: string; fi: string; href: string };

export const SPARE_PARTS = {
  phone: { en: "+358 40 709 2208", fi: "040 709 2208", href: "tel:+358407092208" } satisfies Phone,
  email: "spare.parts@kesla.com",
  fax: "+358 13 610 0522",
  address: "Kuurnankatu 24, 80100 Joensuu",
} as const;

export const GENERAL: Phone = { en: "+358 207 862 841", fi: "0207 862 841", href: "tel:+358207862841" };

export const EMAILS = {
  service: "after.sales@kesla.com",
  sales: "sales@kesla.com",
  invoices: "invoices.kesla@kesla.com",
} as const;

/** Service and warranty work is done at these two sites. */
export const SERVICE_SITES = ["Kuurnankatu 24, 80100 Joensuu", "Metsolantie 2, 59800 Kesälahti"] as const;

/** UAB Ukmergės Staklės took over Kesla's chippers in December 2025. */
export const USTA = {
  name: "Simonas Gutauskas",
  phone: "+370 630 89318",
  email: "simonas.gutauskas@ukmergesstakles.lt",
  web: "http://www.ustmachining.eu",
} as const;

export const GMBH = {
  phone: "+49 151 12686761",
  web: "http://www.kesla-gmbh.de",
} as const;

export const INVOICING = {
  einvoice: "003701687158",
  operatorId: "003723609900",
  operator: "PAGERO",
  vat: { en: "FI01687158", fi: "FI0168715-8" },
} as const;

export type SiteKey = "joensuu" | "kesalahti" | "ilomantsi" | "gmbh";

/** Factories and the German office. Names and the postal note are in the messages. */
export const SITES: readonly {
  key: SiteKey;
  lines: readonly string[];
  map?: string;
  phone?: string;
  web?: string;
  register?: string;
}[] = [
  {
    key: "joensuu",
    lines: ["Kesla Oyj", "Kuurnankatu 24", "80100 Joensuu"],
    map: "https://www.google.fi/maps/place/Kuurnankatu+24,+80130+Joensuu/@62.618498,29.7522236,17z/data=!3m1!4b1!4m2!3m1!1s0x469b86f27ba25915:0xef698564220ed04d",
  },
  {
    key: "kesalahti",
    lines: ["Kesla Oyj", "Metsolantie 2", "59800 Kesälahti"],
    map: "https://www.google.fi/maps/place/Metsolantie+2,+59800+Kes%C3%A4lahti/@61.8889328,29.8091557,17z/data=!3m1!4b1!4m2!3m1!1s0x469bd2f27f3941eb:0x81455b9c6d0be529",
  },
  {
    key: "ilomantsi",
    lines: ["Kesla Oyj", "Teollisuustie 8", "82900 Ilomantsi"],
    map: "https://www.google.fi/maps/place/Teollisuustie+8,+82900+Ilomantsi/@62.6701568,30.9440081,17z/data=!3m1!4b1!4m5!3m4!1s0x469c1a57b83d034d:0x3293df42ee423486!8m2!3d62.6701544!4d30.9461968",
  },
  {
    key: "gmbh",
    lines: ["Kesla GmbH", "Frankenweg 48"],
    phone: GMBH.phone,
    web: GMBH.web,
    register: "Handelsregister: Amtsgericht Freiburg, HRB 716290",
  },
];

/* ---------------------------------------------------------------- */
/* Links                                                             */
/* ---------------------------------------------------------------- */

/**
 * A tel: link from a number as kesla.com prints it. A Finnish trunk zero
 * becomes +358, and a stray zero after it ("+358 040 ...", "006 ...") is
 * dropped. The printed number is never changed, only the link. A number with
 * neither a country code nor a trunk zero ("247 372 072") cannot be dialled
 * as printed, so it gets no link: `null`, and the caller prints plain text.
 */
export function telHref(number: string): string | null {
  let digits = number.replace(/[^\d+]/g, "");
  if (!digits.startsWith("+") && !digits.startsWith("0")) return null;
  if (digits.startsWith("0")) digits = "+358" + digits.slice(1);
  while (digits.startsWith("+3580")) digits = "+358" + digits.slice(5);
  return `tel:${digits}`;
}

export function hostOf(url: string): string {
  return url
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/\/$/, "");
}

/** Just the domain, for the table's website column. */
export function domainOf(url: string): string {
  return hostOf(url).split("/")[0];
}

/* ---------------------------------------------------------------- */
/* Service points                                                    */
/* ---------------------------------------------------------------- */

export type AreaKey = "south" | "west" | "east" | "north";
export const AREA_KEYS: readonly AreaKey[] = ["south", "west", "east", "north"];

/** The four parts of the country, named in both languages for the search. */
export const AREA_NAMES: Record<AreaKey, Bilingual> = {
  south: ["Southern Finland", "Etelä-Suomi"],
  west: ["Western and Central Finland", "Länsi- ja Keski-Suomi"],
  east: ["Eastern Finland", "Itä-Suomi"],
  north: ["Northern Finland", "Pohjois-Suomi"],
};

/** Each maakunta's English name and the part of the country it is grouped in. */
const REGIONS: Record<Maakunta, readonly [en: string, area: AreaKey]> = {
  Uusimaa: ["Uusimaa", "south"],
  "Kanta-Häme": ["Kanta-Häme", "south"],
  "Päijät-Häme": ["Päijät-Häme", "south"],
  Kymenlaakso: ["Kymenlaakso", "south"],
  "Varsinais-Suomi": ["Southwest Finland", "south"],
  Satakunta: ["Satakunta", "west"],
  Pirkanmaa: ["Pirkanmaa", "west"],
  Pohjanmaa: ["Ostrobothnia", "west"],
  "Etelä-Pohjanmaa": ["South Ostrobothnia", "west"],
  "Keski-Pohjanmaa": ["Central Ostrobothnia", "west"],
  "Keski-Suomi": ["Central Finland", "west"],
  "Pohjois-Karjala": ["North Karelia", "east"],
  "Etelä-Karjala": ["South Karelia", "east"],
  "Etelä-Savo": ["South Savo", "east"],
  "Pohjois-Savo": ["North Savo", "east"],
  "Pohjois-Pohjanmaa": ["North Ostrobothnia", "north"],
  Kainuu: ["Kainuu", "north"],
  Lappi: ["Lapland", "north"],
};

/** kesla.com's desk labels on a phone line, translated. Anything else is a person. */
const DESKS: Record<string, Bilingual> = {
  Huolto: ["Service", "Huolto"],
  varaosat: ["Spare parts", "Varaosat"],
  korjaamo: ["Workshop", "Korjaamo"],
  päivystys: ["On call", "Päivystys"],
};

export type ServicePoint = {
  id: string;
  name: string;
  /** "Espoo", not "ESPOO". */
  town: string;
  region: Bilingual;
  area: AreaKey;
  /** One line: "Muottipojankuja 1, 02780 Espoo". */
  address: string;
  phones: readonly { who?: Bilingual; number: string }[];
  email: readonly string[];
  web: readonly string[];
  notes: readonly Bilingual[];
  /** Folded text the search looks in. */
  haystack: string;
};

/** Lower case without accents, for the search. */
export function fold(value: string): string {
  return value.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

function capitalise(word: string): string {
  return word.charAt(0) + word.slice(1).toLowerCase();
}

/** Lines printed in capitals get title case; numbers stay as they are. */
function tidy(line: string): string {
  if (line !== line.toUpperCase()) return line;
  return line
    .split(" ")
    .map((word) => (/\d/.test(word) ? word : capitalise(word)))
    .join(" ");
}

function shape(data: ServicePointData, index: number): ServicePoint {
  const maakunta = TOWN_REGIONS[data.town];
  const [regionEn, area] = REGIONS[maakunta];
  const phones = data.phones.map(([label, number]) => ({
    who: label ? (DESKS[label] ?? ([label, label] as const)) : undefined,
    number,
  }));
  const notes = data.notes ?? [];
  const haystack = fold(
    [
      data.name,
      data.address.join(" "),
      data.town,
      maakunta,
      regionEn,
      ...AREA_NAMES[area],
      ...data.phones.map(([label]) => label),
      ...notes.flat(),
    ].join(" "),
  );

  return {
    id: `sp${index}`,
    name: data.name,
    town: data.town.split(" ").map(capitalise).join(" "),
    region: [regionEn, maakunta],
    area,
    address: data.address.map(tidy).join(", "),
    phones,
    email: data.email,
    web: data.web,
    notes,
    haystack,
  };
}

/** All 45, A to Z by town as kesla.com lists them. */
export const SERVICE: readonly ServicePoint[] = SERVICE_POINTS.map(shape);

export const AREA_COUNTS: Record<AreaKey, number> = {
  south: SERVICE.filter((s) => s.area === "south").length,
  west: SERVICE.filter((s) => s.area === "west").length,
  east: SERVICE.filter((s) => s.area === "east").length,
  north: SERVICE.filter((s) => s.area === "north").length,
};

/** Every word of the query must appear somewhere in the service point. */
export function filterService(area: AreaKey | "all", query: string): ServicePoint[] {
  const words = fold(query.trim()).split(/\s+/).filter(Boolean);
  return SERVICE.filter(
    (s) => (area === "all" || s.area === area) && words.every((word) => s.haystack.includes(word)),
  );
}
