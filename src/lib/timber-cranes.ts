import type { Locale } from "@/i18n/routing";
import { KESLA, timberCranesHref } from "@/lib/routes";

import { CRANE_MODELS } from "./timber-cranes-data";

/**
 * The Timber cranes category: Kesla's 20 timber crane models and their
 * versions, the finder's filter rules and the number formats. The figures
 * live in `timber-cranes-data.ts`; nothing here adds a model or a value.
 */

export type BoomKey = "s" | "z" | "zf";
export type HydKey = "1c" | "2c" | "lsm" | "lse";
/** The kesla.com sub-group a model page sits under: CTL, Z, front-folding Z or tree-length. */
export type CraneGroup = "ctl" | "z" | "zf" | "tl";

export type CraneVersion = {
  name: string;
  /** Outreach in mm. */
  reach: number;
  /** Lifting torque, net, in kNm. */
  torque: number;
};

export type CraneModel = {
  name: string;
  boom: BoomKey;
  /** Tonne-metre class. */
  tm: number;
  hyd: readonly HydKey[];
  group: CraneGroup;
  /** The photo is a cut-out on white, shown contained in a hairline frame. */
  cutout: boolean;
  versions: readonly CraneVersion[];
  datasheet?: string;
};

export const BOOM_KEYS: readonly BoomKey[] = ["s", "z", "zf"];
export const HYD_KEYS: readonly HydKey[] = ["1c", "2c", "lsm", "lse"];

/* ---------------------------------------------------------------- */
/* Slider scales                                                     */
/* ---------------------------------------------------------------- */

/** Outreach slider in metres. The lowest value means "any". */
export const REACH = { min: 8, max: 12.5, step: 0.5 } as const;
/** Lifting torque slider in kNm. The lowest value means "any". */
export const TORQUE = { min: 80, max: 280, step: 10 } as const;

/* ---------------------------------------------------------------- */
/* Filters                                                           */
/* ---------------------------------------------------------------- */

export type SortKey = "n" | "r" | "t";
export const SORT_KEYS: readonly SortKey[] = ["n", "r", "t"];

export type Filters = {
  boom: readonly BoomKey[];
  hyd: readonly HydKey[];
  /** Outreach at least, metres. */
  reach: number;
  /** Lifting torque at least, kNm. */
  torque: number;
  sort: SortKey;
};

export const DEFAULT_FILTERS: Filters = { boom: [], hyd: [], reach: REACH.min, torque: TORQUE.min, sort: "n" };

export function reachSet(f: Filters): boolean {
  return f.reach > REACH.min;
}

export function torqueSet(f: Filters): boolean {
  return f.torque > TORQUE.min;
}

/** How many filters are on, for the badge on the phone's Filters button. */
export function activeCount(f: Filters): number {
  return f.boom.length + f.hyd.length + (reachSet(f) ? 1 : 0) + (torqueSet(f) ? 1 : 0);
}

/** Outreach and torque are checked on the same version. */
export function versionFits(v: CraneVersion, f: Filters): boolean {
  return (!reachSet(f) || v.reach >= f.reach * 1000 - 0.5) && (!torqueSet(f) || v.torque >= f.torque);
}

/** The boom and hydraulics ticks. Within a group any tick matches, across groups all must. */
export function tagsMatch(m: CraneModel, f: Filters): boolean {
  if (f.boom.length && !f.boom.includes(m.boom)) return false;
  if (f.hyd.length && !m.hyd.some((h) => f.hyd.includes(h))) return false;
  return true;
}

export type ModelSummary = {
  model: CraneModel;
  reach: readonly [number, number];
  torque: readonly [number, number];
};

function span(values: number[]): readonly [number, number] {
  return [Math.min(...values), Math.max(...values)];
}

export const SUMMARIES: readonly ModelSummary[] = CRANE_MODELS.map((model) => ({
  model,
  reach: span(model.versions.map((v) => v.reach)),
  torque: span(model.versions.map((v) => v.torque)),
}));

export const VERSION_TOTAL = CRANE_MODELS.reduce((sum, m) => sum + m.versions.length, 0);

const byName = (a: ModelSummary, b: ModelSummary) =>
  a.model.name.localeCompare(b.model.name, "en", { numeric: true });

export type Result = ModelSummary & { fits: readonly CraneVersion[] };

/** The models that pass, sorted, each with the versions that fit. */
export function results(f: Filters): Result[] {
  const list: Result[] = [];
  for (const s of SUMMARIES) {
    if (!tagsMatch(s.model, f)) continue;
    const fits = s.model.versions.filter((v) => versionFits(v, f));
    if (fits.length) list.push({ ...s, fits });
  }
  return list.sort((a, b) => {
    if (f.sort === "r") return b.reach[1] - a.reach[1] || byName(a, b);
    if (f.sort === "t") return b.torque[1] - a.torque[1] || byName(a, b);
    return byName(a, b);
  });
}

/** How many models carry each tag, printed beside its tick box. */
export const BOOM_COUNTS = Object.fromEntries(
  BOOM_KEYS.map((k) => [k, CRANE_MODELS.filter((m) => m.boom === k).length]),
) as Record<BoomKey, number>;

export const HYD_COUNTS = Object.fromEntries(
  HYD_KEYS.map((k) => [k, CRANE_MODELS.filter((m) => m.hyd.includes(k)).length]),
) as Record<HydKey, number>;

/**
 * Why nothing fits, from the versions the ticks leave: either the ticks
 * themselves rule every model out (front-folding Z models carry no
 * hydraulics tag), or no single version reaches and lifts enough. For the
 * second, the closest versions on each side, so the visitor knows which
 * slider to move.
 */
export type EmptyReason =
  | { kind: "tags" }
  | {
      kind: "both";
      /** The strongest version at the outreach asked for, if any reaches it. */
      atReach?: CraneVersion;
      /** The longest version at the torque asked for, if any lifts it. */
      atTorque?: CraneVersion;
    };

export function emptyReason(f: Filters): EmptyReason {
  const pool = CRANE_MODELS.filter((m) => tagsMatch(m, f)).flatMap((m) => m.versions);
  if (!pool.length) return { kind: "tags" };
  const reachOnly = { ...f, torque: TORQUE.min };
  const torqueOnly = { ...f, reach: REACH.min };
  const atReach = pool.filter((v) => versionFits(v, reachOnly)).sort((a, b) => b.torque - a.torque)[0];
  const atTorque = pool.filter((v) => versionFits(v, torqueOnly)).sort((a, b) => b.reach - a.reach)[0];
  return { kind: "both", atReach, atTorque };
}

/* ---------------------------------------------------------------- */
/* The URL hash                                                      */
/* ---------------------------------------------------------------- */

/**
 * The filters live in the hash (#boom=z,zf&r=9.5&t=120&sort=t) so a filtered
 * list can be shared and the page stays fully static. A hash without "=" (the
 * skip link's #main) is not a filter state and is left alone.
 */
export function isFilterHash(hash: string): boolean {
  return hash.includes("=");
}

function snap(value: number, scale: { min: number; max: number; step: number }): number {
  if (!Number.isFinite(value)) return scale.min;
  const stepped = Math.round((value - scale.min) / scale.step) * scale.step + scale.min;
  return Math.min(scale.max, Math.max(scale.min, stepped));
}

export function parseFilters(hash: string): Filters {
  if (!isFilterHash(hash)) return DEFAULT_FILTERS;
  const params = new URLSearchParams(hash);
  const list = <T extends string>(key: string, allowed: readonly T[]): T[] =>
    (params.get(key) ?? "").split(",").filter((v): v is T => (allowed as readonly string[]).includes(v));
  const sort = params.get("sort");
  return {
    boom: list("boom", BOOM_KEYS),
    hyd: list("hyd", HYD_KEYS),
    reach: params.has("r") ? snap(Number(params.get("r")), REACH) : REACH.min,
    torque: params.has("t") ? snap(Number(params.get("t")), TORQUE) : TORQUE.min,
    sort: SORT_KEYS.includes(sort as SortKey) ? (sort as SortKey) : "n",
  };
}

/** The hash for a filter state, without "#". Empty for the defaults. */
export function serializeFilters(f: Filters): string {
  const parts: string[] = [];
  if (f.boom.length) parts.push(`boom=${BOOM_KEYS.filter((k) => f.boom.includes(k)).join(",")}`);
  if (f.hyd.length) parts.push(`hyd=${HYD_KEYS.filter((k) => f.hyd.includes(k)).join(",")}`);
  if (reachSet(f)) parts.push(`r=${f.reach}`);
  if (torqueSet(f)) parts.push(`t=${f.torque}`);
  if (f.sort !== "n") parts.push(`sort=${f.sort}`);
  return parts.join("&");
}

/* ---------------------------------------------------------------- */
/* Numbers                                                           */
/* ---------------------------------------------------------------- */

/** Metres with one decimal in the reader's own format: 9.5 in English, 9,5 in Finnish. */
export function metres(value: number, locale: Locale): string {
  return new Intl.NumberFormat(locale === "fi" ? "fi-FI" : "en-GB", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value);
}

/** An outreach range from mm, "8.0–9.5" or "8,0–9,5", or one value when both ends match. */
export function reachRange([lo, hi]: readonly [number, number], locale: Locale): string {
  const a = metres(lo / 1000, locale);
  const b = metres(hi / 1000, locale);
  return a === b ? a : `${a}–${b}`;
}

export function torqueRange([lo, hi]: readonly [number, number]): string {
  return lo === hi ? String(lo) : `${lo}–${hi}`;
}

/* ---------------------------------------------------------------- */
/* Links                                                             */
/* ---------------------------------------------------------------- */

/** The product pages the redesign has built under this category, by lowercase model name. */
const LOCAL_MODELS = new Set(["2112z"]);

const GROUP_SLUGS: Record<CraneGroup, Record<Locale, string>> = {
  ctl: { en: "ctl-cranes", fi: "tavaralajimenetelmaen-nosturit" },
  z: { en: "z-cranes", fi: "z-nosturit" },
  zf: { en: "front-folding-z-cranes", fi: "eteenpaein-avautuvat-z-nosturit" },
  tl: { en: "tree-length-cranes", fi: "kokopuunosturit" },
};

/** The model's own page: the redesigned one if it is built, otherwise its kesla.com page. */
export function modelHref(model: CraneModel, locale: Locale): string {
  const slug = model.name.toLowerCase();
  if (LOCAL_MODELS.has(slug)) return timberCranesHref(locale, slug);
  const group = GROUP_SLUGS[model.group][locale];
  return locale === "fi"
    ? `${KESLA}/fi/tuotteet/tuotekategoria/tuote/${group}/${slug}`
    : `${KESLA}/en/products/category/product/${group}/${slug}`;
}
