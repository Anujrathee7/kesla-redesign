import { cacheLife } from "next/cache";

import type { Locale } from "@/i18n/routing";
import { KESLA } from "@/lib/routes";

/**
 * The Career page's structure: the open positions, the five kinds of work and
 * where they link. Everything a visitor reads in sentences lives in
 * `messages/{en,fi}/career.json` under the same keys. Read off kesla.com's
 * Career pages and the two vacancy posts of 15 October 2026 on 18 October
 * 2026 (see `original/career-content.md`). Names, numbers and dates are not
 * translated, so they live here.
 */

/** Applications for both posts go to this address, with salary expectations. */
export const RECRUITING_EMAIL = "rekry@kesla.com";

export type Job = {
  key: "software" | "export";
  /** The ad's own title, the same on the English and the Finnish post. */
  title: string;
  /** ISO dates. The ads close at 23:59 Finnish time on the deadline. */
  posted: string;
  deadline: string;
  posting: Record<Locale, string>;
  contact: {
    name: string;
    phone: { href: string; label: string };
    email?: string;
  };
};

export const JOBS: readonly Job[] = [
  {
    key: "software",
    title: "Software Engineer",
    posted: "2026-10-15",
    deadline: "2026-10-29",
    posting: {
      en: `${KESLA}/en/news/article/open-vacancy-software-engineer`,
      fi: `${KESLA}/fi/ajankohtaista/uutinen/avoin-tyoepaikka-software-engineer-1`,
    },
    contact: {
      name: "Heidi Sederholm",
      phone: { href: "tel:+358447510224", label: "+358 447 510 224" },
    },
  },
  {
    key: "export",
    title: "Export Coordinator",
    posted: "2026-10-15",
    deadline: "2026-10-27",
    posting: {
      en: `${KESLA}/en/news/article/open-vacancy-export-coordinator`,
      fi: `${KESLA}/fi/ajankohtaista/uutinen/avoin-tyoepaikka-export-coordinator`,
    },
    contact: {
      name: "Pasi Nieminen",
      phone: { href: "tel:+358409014401", label: "+358 40 901 4401" },
      email: "pasi.nieminen@kesla.com",
    },
  },
];

/** The UTC offset of Finnish time at one instant, in minutes: 120 in winter, 180 in summer. */
function helsinkiOffset(at: Date): number {
  const name =
    new Intl.DateTimeFormat("en-US", { timeZone: "Europe/Helsinki", timeZoneName: "longOffset" })
      .formatToParts(at)
      .find((part) => part.type === "timeZoneName")?.value ?? "GMT+02:00";
  const match = /GMT([+-])(\d{2}):(\d{2})/.exec(name);
  if (!match) return 120;
  const minutes = Number(match[2]) * 60 + Number(match[3]);
  return match[1] === "-" ? -minutes : minutes;
}

/** The last instant a post takes applications: 23:59 Finnish time on its deadline. */
export function closesAt(job: Job): Date {
  const wall = Date.parse(`${job.deadline}T23:59:59.999Z`);
  return new Date(wall - helsinkiOffset(new Date(wall)) * 60_000);
}

/** Whether a post still takes applications at `now`. */
export function isOpen(job: Job, now: Date): boolean {
  return now.getTime() <= closesAt(job).getTime();
}

/**
 * The posts still open. Cached with the "minutes" profile, so the page is
 * prerendered and regenerated in the background at most a minute or two after
 * a deadline passes. `cacheComponents` rules out a route-level `revalidate`,
 * and reading the clock outside a cache would make the whole page dynamic.
 */
export async function openJobs(): Promise<Job[]> {
  "use cache";
  cacheLife("minutes");
  const now = new Date();
  return JOBS.filter((job) => isOpen(job, now));
}

/** The application email for one posting, with the title as its subject. */
export function applyHref(job: Job): string {
  return `mailto:${RECRUITING_EMAIL}?subject=${encodeURIComponent(job.title)}`;
}

/** kesla.com's application form, for an open application or a posted job. */
export const OPEN_APPLICATION: Record<Locale, string> = {
  en: `${KESLA}/en/career/work-at-kesla`,
  fi: `${KESLA}/fi/ura/toeihin-keslalle`,
};

export type Func = {
  key: "production" | "rnd" | "aftersales" | "sales" | "support";
  /** Kesla's own role videos on the function's page. */
  videos: number;
  page: Record<Locale, string>;
};

/** The five kinds of work, in kesla.com's order, each linking to its kesla.com page. */
export const FUNCTIONS: readonly Func[] = [
  {
    key: "production",
    videos: 6,
    page: { en: `${KESLA}/en/career/functions/production-work`, fi: `${KESLA}/fi/ura/toiminnot/tuotantotyot` },
  },
  {
    key: "rnd",
    videos: 5,
    page: { en: `${KESLA}/en/career/functions/product-developement`, fi: `${KESLA}/fi/ura/toiminnot/tuotekehitys` },
  },
  {
    key: "aftersales",
    videos: 1,
    page: { en: `${KESLA}/en/career/functions/aftermarketing`, fi: `${KESLA}/fi/ura/toiminnot/jalkimarkkinointi` },
  },
  {
    key: "sales",
    videos: 0,
    page: { en: `${KESLA}/en/career/functions/sales-and-marketing`, fi: `${KESLA}/fi/ura/toiminnot/myynti-ja-markkinointi` },
  },
  {
    key: "support",
    videos: 1,
    page: { en: `${KESLA}/en/career/functions/other-support-functions`, fi: `${KESLA}/fi/ura/toiminnot/muut-tukitoiminnot` },
  },
];

export const VALUES = ["responsibility", "innovativeness", "promptness", "reliability"] as const;

/** A date as each language's posts write it: "29 October 2026", "29.10.2026". */
export function formatDate(iso: string, locale: Locale, style: "long" | "numeric" = "long"): string {
  const date = new Date(`${iso}T12:00:00Z`);
  if (style === "numeric" || locale === "fi") {
    return new Intl.DateTimeFormat("fi-FI", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
      timeZone: "Europe/Helsinki",
    }).format(date);
  }
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/Helsinki",
  }).format(date);
}
