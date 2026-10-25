import type { Locale } from "@/i18n/routing";
import type { FamilyKey } from "@/lib/routes";

/**
 * Kesla's product range, from the technical-data tables on kesla.com product
 * pages, read 18 October 2026. Each pair is [smallest, largest] across a
 * model's versions. Japan-only versions are left out. This is the only source
 * for product names and figures in the concept: never add a model or a value
 * that is not on kesla.com.
 */

export type SubKey = "timber" | "city" | "g3" | "g2" | "heads" | "fmc" | "loaders" | "trailers" | "g1";
export type SpecKey = "reach" | "torque" | "area" | "weight" | "cut" | "cap4" | "cap" | "tarea";
/** Boom or feed type. Labels live in `Products.types`. */
export type TypeKey = "st" | "z" | "zf" | "tl" | "cs" | "cz" | "fw" | "hv" | "r" | "r3" | "s" | "ld" | "tr" | "g";

type Range = readonly [number, number];
type Specs = Partial<Record<SpecKey, Range>>;
type RawModel = Specs & { n: string; t: string; v: readonly string[] };

export type Model = {
  name: string;
  type: TypeKey;
  versions: readonly string[];
  specs: Specs;
};

const RAW: Record<SubKey, readonly RawModel[]> = {
  timber: [
    { n: "2109Z", t: "ctl", reach: [8.0, 9.5], torque: [88, 100], v: ["2109Z-80", "2109ZT-95"] },
    { n: "2110Z", t: "ctl", reach: [8.0, 9.5], torque: [96, 101], v: ["2110Z-80", "2110ZT-95"] },
    { n: "2111Z", t: "ctl", reach: [8.1, 9.6], torque: [105, 110], v: ["2111Z-81", "2111ZT-96"] },
    { n: "2112Z", t: "ctl", reach: [8.1, 10.1], torque: [108, 120], v: ["2112Z-81", "2112Z-101", "2112ZT-96"] },
    { n: "2115", t: "ctl", reach: [8.1, 11.5], torque: [136, 151], v: ["2115-81", "2115-86", "2115T-97", "2115T-102", "2115T-115"] },
    { n: "2117", t: "ctl", reach: [8.1, 12.5], torque: [140, 173], v: ["2117-81", "2117-86", "2117T-97", "2117T-102", "2117T-115", "2117T-125"] },
    { n: "2121Z", t: "z", reach: [8.2, 9.7], torque: [210, 216], v: ["2121Z-82", "2121ZT-97"] },
    { n: "2124Z", t: "z", reach: [8.2, 9.7], torque: [244, 250], v: ["2124Z-82", "2124ZT-97"] },
    { n: "2209S", t: "ctl", reach: [8.1, 9.7], torque: [91, 95], v: ["2209S-81", "2209S-86", "2209ST-97"] },
    { n: "2210S", t: "ctl", reach: [8.1, 10.2], torque: [97, 105], v: ["2210S-81", "2210S-86", "2210ST-97", "2210ST-102"] },
    { n: "2212S", t: "ctl", reach: [8.1, 10.2], torque: [119, 128], v: ["2212S-81", "2212S-86", "2212ST-97", "2212ST-102"] },
    { n: "2212Z", t: "z", reach: [8.1, 10.2], torque: [108, 119], v: ["2212Z-81", "2212Z-97", "2212Z-102"] },
    { n: "2214Z", t: "z", reach: [8.1, 10.2], torque: [126, 139], v: ["2214Z-81", "2214Z-97", "2214Z-102"] },
    { n: "2217Z", t: "z", reach: [8.1, 10.2], torque: [150, 160], v: ["2217Z-81", "2217Z-97", "2217Z-102"] },
    { n: "2111ZF", t: "zf", reach: [8.1, 9.6], torque: [105, 110], v: ["2111ZF-81", "2111ZTF-96"] },
    { n: "2212ZF", t: "zf", reach: [8.1, 10.1], torque: [108, 120], v: ["2212ZF-81", "2212ZFT-96", "2212ZTF-101"] },
    { n: "2214ZF", t: "zf", reach: [8.1, 10.1], torque: [128, 139], v: ["2214ZF-81", "2214ZTF-96", "2214ZTF-101"] },
    { n: "2217ZF", t: "zf", reach: [8.1, 10.1], torque: [156, 167], v: ["2217ZF-81", "2217ZTF-94", "2217ZTF-101"] },
    { n: "2225", t: "tl", reach: [8.4, 10.2], torque: [221, 267], v: ["2225-84", "2225-84 (+)", "2225-88", "2225-88 (+)", "2225-98", "2225-98 (+)", "2225-102", "2225-102 (+)"] },
    { n: "2228", t: "tl", reach: [8.4, 10.2], torque: [249, 285], v: ["2228-84", "2228-88", "2228-98", "2228-102"] },
  ],
  city: [
    { n: "12 City", t: "cs", reach: [8.1, 11.5], torque: [108, 128], v: ["12 City -81", "12T City -97", "12T City -102", "12T City -115"] },
    { n: "15 City", t: "cs", reach: [8.1, 11.5], torque: [131, 151], v: ["15 City -81", "15T City -97", "15T City -102", "15T City -115"] },
    { n: "17 City", t: "cs", reach: [8.1, 11.5], torque: [153, 173], v: ["17 City -81", "17T City -97", "17T City -102", "17T City -115"] },
    { n: "2212Z City", t: "cz", reach: [8.1, 10.2], torque: [108, 119], v: ["2212Z City - 81", "2212ZT City - 97", "2212ZT City - 102"] },
    { n: "2214Z City", t: "cz", reach: [8.1, 10.2], torque: [126, 139], v: ["2214ZT City - 81", "2214ZT City - 97", "2214ZT City - 102"] },
    { n: "2217Z City", t: "cz", reach: [8.1, 10.2], torque: [150, 160], v: ["2217Z City - 81", "2217ZT City - 97", "2217ZT City - 102"] },
    { n: "Z17-3 City", t: "cz", reach: [8.1, 9.5], torque: [150, 162], v: ["Z17-3 City 81", "Z17-3 City 95"] },
  ],
  g3: [
    { n: "proG30E", t: "g", area: [0.21, 0.21], weight: [245, 245], v: ["proG30E"] },
    { n: "proG35", t: "g", area: [0.35, 0.35], weight: [214, 214], v: ["proG35"] },
    { n: "proG40", t: "g", area: [0.4, 0.4], weight: [265, 265], v: ["proG40"] },
    { n: "proG40E | proG40E3", t: "g", area: [0.25, 0.25], weight: [300, 325], v: ["proG40E", "proG40E3"] },
    { n: "proG46", t: "g", area: [0.46, 0.46], weight: [270, 270], v: ["proG46"] },
    { n: "proG50", t: "g", area: [0.5, 0.5], weight: [280, 280], v: ["proG 50"] },
    { n: "proG50E | proG50E6", t: "g", area: [0.46, 0.46], weight: [450, 450], v: ["proG50E", "proG50E6"] },
    { n: "proG50P", t: "g", area: [0.46, 0.46], weight: [397, 397], v: ["proG50P"] },
  ],
  g2: [
    { n: "proG30", t: "g", area: [0.3, 0.3], weight: [200, 200], v: ["proG30"] },
    { n: "proG35", t: "g", area: [0.35, 0.35], weight: [214, 214], v: ["proG35"] },
    { n: "proG50", t: "g", area: [0.5, 0.5], weight: [280, 280], v: ["proG 50"] },
  ],
  heads: [
    { n: "14RH", t: "r", cut: [380, 380], weight: [350, 350], v: ["14RH"] },
    { n: "16RH", t: "r", cut: [450, 450], weight: [445, 445], v: ["16RH"] },
    { n: "18RH-II", t: "r", cut: [500, 500], weight: [560, 560], v: ["18RH-II"] },
    { n: "19RH-III", t: "r3", cut: [540, 540], weight: [680, 680], v: ["19RH-III"] },
    { n: "20SH-II", t: "s", cut: [520, 520], weight: [540, 540], v: ["20SH-II"] },
    { n: "21RH-III", t: "r3", cut: [540, 540], weight: [720, 720], v: ["21RH-III"] },
    { n: "24RH-III", t: "r3", cut: [650, 650], weight: [960, 960], v: ["24RH-III"] },
    { n: "25RH-II", t: "r", cut: [670, 670], weight: [860, 860], v: ["25RH-II"] },
    { n: "25SH-II", t: "s", cut: [670, 670], weight: [920, 920], v: ["25SH-II"] },
    { n: "26RH-III", t: "r3", cut: [650, 650], weight: [1010, 1010], v: ["26RH-III"] },
    { n: "27RH-III", t: "r3", cut: [780, 780], weight: [1290, 1290], v: ["27RH-III"] },
    { n: "28RH-III", t: "r3", cut: [780, 780], weight: [1380, 1440], v: ["28RH-III 2WD", "28RH-III 3WD"] },
    { n: "29RH-III", t: "r3", cut: [780, 780], weight: [1540, 1660], v: ["29RH-III", "29RH-III TS"] },
    { n: "30RH-III", t: "r3", cut: [780, 780], weight: [1690, 1690], v: ["30RH-III 2WD", "30RH-III 3WD"] },
    { n: "twinAX", t: "r3", v: ["twinAX"] },
  ],
  fmc: [
    { n: "500", t: "fw", reach: [6.1, 8.8], torque: [41, 47], v: ["500M-61", "500M-65", "500MT", "500T"] },
    { n: "600 | 600T", t: "fw", reach: [7.7, 10.3], torque: [53, 60], v: ["600", "600S", "600ST", "600T"] },
    { n: "700 | 700T", t: "fw", reach: [7.7, 10.3], torque: [64, 70], v: ["700", "700S", "700ST", "700T"] },
    { n: "9F", t: "fw", reach: [8.2, 10.1], torque: [71, 78], v: ["9F", "9FT"] },
    { n: "10F", t: "fw", reach: [8.2, 10.1], torque: [90, 96], v: ["10F", "10FT"] },
    { n: "12F", t: "fw", reach: [8.2, 10.1], torque: [103, 110], v: ["12F", "12FT"] },
    { n: "14F", t: "fw", reach: [8.2, 10.1], torque: [124, 131], v: ["14F", "14FT"] },
    { n: "6H", t: "hv", reach: [7.1, 8.6], torque: [32, 43], v: ["671H", "685H"] },
    { n: "13H", t: "hv", reach: [9.5, 10.5], torque: [91, 109], v: ["1395H", "13105H"] },
    { n: "16H", t: "hv", reach: [7.9, 11.0], torque: [98, 138], v: ["1608H", "1609H", "1610H", "1611H"] },
  ],
  loaders: [
    { n: "202T", t: "ld", reach: [6.15, 6.15], cap4: [425, 425], v: ["202T"] },
    { n: "203T", t: "ld", reach: [6.7, 6.7], cap4: [690, 690], v: ["203T"] },
    { n: "224", t: "ld", reach: [7.0, 7.0], cap4: [830, 830], v: ["224"] },
    { n: "305 | 305T", t: "ld", reach: [6.9, 8.5], cap4: [1150, 1290], v: ["305", "305T"] },
    { n: "314 | 314T", t: "ld", reach: [7.1, 8.7], cap4: [1065, 1165], v: ["314", "314T"] },
    { n: "325T", t: "ld", reach: [8.8, 8.8], cap4: [1335, 1335], v: ["325T"] },
    { n: "326T", t: "ld", reach: [9.1, 9.1], cap4: [1450, 1450], v: ["326T"] },
  ],
  trailers: [
    { n: "104", t: "tr", cap: [10, 10], area: [2.4, 2.4], v: ["104"] },
    { n: "114H | HD | ND", t: "tr", cap: [10, 10], area: [2.4, 2.4], v: ["114H", "114HD", "114ND"] },
    { n: "124H | HD", t: "tr", cap: [12, 12], area: [2.7, 2.7], v: ["124H", "124HD"] },
    { n: "144H | HD | ND", t: "tr", cap: [14, 14], area: [3.2, 3.2], v: ["144H", "144HD", "144ND 2WD", "144ND 4WD"] },
    { n: "145", t: "tr", cap: [14, 14], area: [3.2, 3.2], v: ["145 2WD", "145 4WD"] },
    { n: "165", t: "tr", cap: [16, 16], area: [4.0, 4.0], v: ["165"] },
  ],
  g1: [
    { n: "proG20", t: "g", area: [0.18, 0.18], weight: [70, 70], v: ["proG20"] },
    { n: "proG26", t: "g", area: [0.24, 0.24], weight: [130, 130], v: ["proG26"] },
    { n: "proG26E", t: "g", area: [0.15, 0.15], weight: [140, 140], v: ["proG26E"] },
    { n: "proG28", t: "g", area: [0.27, 0.27], weight: [170, 170], v: ["proG28"] },
    { n: "19GX", t: "g", weight: [185, 185], cut: [180, 180], v: ["19GX"] },
  ],
};

/** Timber cranes take their boom type from Kesla's own product filter (Booms Straight / Booms Z). */
function timberType(name: string): TypeKey {
  if (/^22(25|28)$/.test(name)) return "tl";
  if (/ZF$/.test(name)) return "zf";
  if (/Z$/.test(name)) return "z";
  return "st";
}

function toModel(sub: SubKey, { n, t, v, ...specs }: RawModel): Model {
  const type = (sub === "timber" ? timberType(n) : t) as TypeKey;
  // Trailers keep their load space area under its own key, apart from grapple area.
  if (sub === "trailers") {
    const { area, ...rest } = specs;
    return { name: n, type, versions: v, specs: { ...rest, tarea: area } };
  }
  return { name: n, type, versions: v, specs };
}

export const MODELS: Record<SubKey, readonly Model[]> = {
  timber: RAW.timber.map((m) => toModel("timber", m)),
  city: RAW.city.map((m) => toModel("city", m)),
  g3: RAW.g3.map((m) => toModel("g3", m)),
  g2: RAW.g2.map((m) => toModel("g2", m)),
  heads: RAW.heads.map((m) => toModel("heads", m)),
  fmc: RAW.fmc.map((m) => toModel("fmc", m)),
  loaders: RAW.loaders.map((m) => toModel("loaders", m)),
  trailers: RAW.trailers.map((m) => toModel("trailers", m)),
  g1: RAW.g1.map((m) => toModel("g1", m)),
};

/** Unit and the fewest decimals a value is written with. Labels live in `Products.specs`. */
export const SPECS: Record<SpecKey, { unit: string; decimals: number }> = {
  reach: { unit: "m", decimals: 1 },
  torque: { unit: "kNm", decimals: 0 },
  area: { unit: "m²", decimals: 2 },
  weight: { unit: "kg", decimals: 0 },
  cut: { unit: "mm", decimals: 0 },
  cap4: { unit: "kg", decimals: 0 },
  cap: { unit: "t", decimals: 0 },
  tarea: { unit: "m²", decimals: 1 },
};

/** A spec label key in `Products.specs`: the spec's own, or a sub-category's wording of it. */
export type SpecLabel = SpecKey | "torqueAt4m" | "weightNoRotator";

export type Sub = {
  /** Specs summed up in the facts list, in order. */
  specs: readonly SpecKey[];
  /** Sub-categories that word a spec differently on kesla.com. */
  labels?: Partial<Record<SpecKey, SpecLabel>>;
  /** Product cutout on white (grapples) instead of a photo. */
  cutout?: boolean;
  /** Index into `categoryHref`, which follows kesla.com's own subcategory order. */
  category: number;
};

export const SUBS: Record<SubKey, Sub> = {
  timber: { specs: ["reach", "torque"], category: 1 },
  city: { specs: ["reach", "torque"], category: 2 },
  g3: { specs: ["area", "weight"], cutout: true, category: 3 },
  heads: { specs: ["cut", "weight"], labels: { weight: "weightNoRotator" }, category: 2 },
  fmc: { specs: ["reach", "torque"], labels: { torque: "torqueAt4m" }, category: 3 },
  g2: { specs: ["area", "weight"], cutout: true, category: 1 },
  loaders: { specs: ["reach", "cap4"], category: 1 },
  trailers: { specs: ["cap", "tarea"], category: 2 },
  g1: { specs: ["area", "weight"], cutout: true, category: 3 },
};

/** The sub-categories shown under each base machine, in the panel's order. */
export const FAMILY_SUBS: Record<FamilyKey, readonly [SubKey, SubKey, SubKey]> = {
  cranes: ["timber", "city", "g3"],
  logging: ["heads", "fmc", "g2"],
  tractor: ["loaders", "trailers", "g1"],
};

/** Smallest and largest value of one spec across a list of models, or null if none has it. */
export function specRange(models: readonly Model[], key: SpecKey): Range | null {
  const values = models.flatMap((m) => m.specs[key] ?? []);
  return values.length ? [Math.min(...values), Math.max(...values)] : null;
}

/** At least `decimals` places, more if the value itself has them (6.15 stays 6.15). */
function fmt(value: number, decimals: number): string {
  const own = (String(value).split(".")[1] ?? "").length;
  return value.toFixed(Math.max(decimals, own));
}

/** "8.0–12.5 m", one value when both ends match, with a decimal comma in Finnish and a no-break space before the unit. */
export function rangeText(range: Range, key: SpecKey, locale: Locale): string {
  const { unit, decimals } = SPECS[key];
  const a = fmt(range[0], decimals);
  const b = fmt(range[1], decimals);
  const text = `${a === b ? a : `${a}–${b}`} ${unit}`;
  return locale === "fi" ? text.replace(/\./g, ",") : text;
}
