import type { Locale } from "@/i18n/routing";
import type { Pair } from "@/lib/references";

/*
 * KESLA 2112Z, as published on kesla.com (EN /en/products/category/product/
 * ctl-cranes/2112z, FI /fi/tuotteet/tuotekategoria/tuote/
 * tavaralajimenetelmaen-nosturit/2112z), read 18 October 2026 and carried by
 * the approved mockup (variants/product-offer-variants.html, tab C "Black
 * head"). Figures are typed in exactly as kesla.com lists them; a null is a
 * cell kesla.com leaves empty. kesla.com's own product texts (features,
 * options, accessories, FAQ, titles) are [en, fi] pairs here, the way the
 * References and News data carry theirs; the page's own interface copy lives
 * in messages/{en,fi}/product.json. Keeping the long texts out of the
 * message catalogue also keeps next-intl's key types under TypeScript's
 * union limit, which the catalogue had reached.
 *
 * kesla.com's Finnish page calls the 9 575 mm version "2112Z-77"; the English
 * page and this page call it "2112ZT-96" in both languages.
 */

export const VERSION_IDS = ["2112Z-81", "2112ZT-96", "2112Z-101"] as const;
export type VersionId = (typeof VERSION_IDS)[number];
export const DEFAULT_VERSION: VersionId = "2112Z-81";

/** The English or Finnish half of a pair. */
export function pick(pair: Pair, locale: Locale): string {
  return pair[locale === "fi" ? 1 : 0];
}

export function isVersionId(value: string): value is VersionId {
  return (VERSION_IDS as readonly string[]).includes(value);
}

export type Version = {
  id: VersionId;
  /** mm */
  outreach: number;
  /** kNm, net */
  torque: number;
  /** Number of extensions and the stroke of each, mm. */
  telescope: { count: 1 | 2; stroke: number };
  /** kNm */
  slewingTorque: number;
  /** degrees */
  slewingAngle: number;
  /** MPa */
  pressure: number;
  /** kg */
  weight: number;
  /** kg, the crane plus its separate stabilizer legs, as kesla.com writes it. */
  weightWithLegs: readonly [crane: number, legs: number] | null;
  /** mm */
  width: number | null;
  /** mm */
  height: number | null;
};

/** Ordered by outreach, the way a buyer reads them. */
export const VERSIONS: readonly Version[] = [
  {
    id: "2112Z-81",
    outreach: 8090,
    torque: 120,
    telescope: { count: 1, stroke: 1650 },
    slewingTorque: 28,
    slewingAngle: 415,
    pressure: 26,
    weight: 2290,
    weightWithLegs: [2020, 370],
    width: 2500,
    height: 2500,
  },
  {
    id: "2112ZT-96",
    outreach: 9575,
    torque: 115,
    telescope: { count: 2, stroke: 1550 },
    slewingTorque: 28,
    slewingAngle: 415,
    pressure: 26,
    weight: 2410,
    weightWithLegs: null,
    width: 2500,
    height: 2500,
  },
  {
    id: "2112Z-101",
    outreach: 10100,
    torque: 108,
    telescope: { count: 2, stroke: 1690 },
    slewingTorque: 23,
    slewingAngle: 415,
    pressure: 26,
    weight: 2548,
    weightWithLegs: [2548, 385],
    width: null,
    height: null,
  },
];

export function versionOf(id: VersionId): Version {
  return VERSIONS.find((v) => v.id === id) ?? VERSIONS[0];
}

/* ---------------------------------------------------------------- */
/* Figures                                                           */
/* ---------------------------------------------------------------- */

/** The full technical data table, in kesla.com's row order. */
export const SPEC_KEYS = [
  "outreach",
  "torque",
  "telescope",
  "slewingTorque",
  "slewingAngle",
  "pressure",
  "weight",
  "weightWithLegs",
  "width",
  "height",
] as const;
export type SpecKey = (typeof SPEC_KEYS)[number];

export const SPEC_UNITS: Record<SpecKey, string> = {
  outreach: "mm",
  torque: "kNm",
  telescope: "mm",
  slewingTorque: "kNm",
  slewingAngle: "°",
  pressure: "MPa",
  weight: "kg",
  weightWithLegs: "kg",
  width: "mm",
  height: "mm",
};

/** The five figures the offer card, the compare table and the phone bar print. */
export const KEY_FIGURES = ["outreach", "torque", "slewingTorque", "telescope", "weight"] as const;
export type KeyFigure = (typeof KEY_FIGURES)[number];

const NBSP = " ";

/** 2290 reads "2 290", with a no-break space so a figure never wraps. */
function group(n: number): string {
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, NBSP);
}

/** Outreach in metres, two decimals at most: 8 090 mm reads "8.09 m", "8,09 m" in Finnish. */
export function metres(mm: number, locale: Locale): string {
  const m = String(Math.round(mm / 10) / 100);
  return `${locale === "fi" ? m.replace(".", ",") : m}${NBSP}m`;
}

/** A technical data cell without its unit, or null where kesla.com leaves it empty. */
export function specValue(v: Version, key: SpecKey): string | null {
  switch (key) {
    case "telescope":
      return v.telescope.count === 2 ? `2${NBSP}×${NBSP}${group(v.telescope.stroke)}` : group(v.telescope.stroke);
    case "weightWithLegs":
      return v.weightWithLegs ? `${group(v.weightWithLegs[0])}${NBSP}+ ${group(v.weightWithLegs[1])}` : null;
    case "slewingAngle":
      return `${v.slewingAngle}°`;
    default: {
      const n = v[key];
      return n == null ? null : group(n);
    }
  }
}

/** A key figure with its unit, outreach in metres. */
export function figure(v: Version, key: KeyFigure, locale: Locale): string {
  if (key === "outreach") return metres(v.outreach, locale);
  return `${specValue(v, key)}${NBSP}${SPEC_UNITS[key]}`;
}

/** True where all three versions print the same value, so the table can quiet that row. */
export function sameAcross(key: SpecKey): boolean {
  const values = VERSIONS.map((v) => specValue(v, key)).filter((x): x is string => x != null);
  return new Set(values).size <= 1;
}

/* ---------------------------------------------------------------- */
/* Gallery, features, options                                        */
/* ---------------------------------------------------------------- */

/**
 * kesla.com's 13 photos, by their file number (public/images/
 * product-2112z-NN.jpg), in the mockup's order: the snowy photo with the
 * proG grapple first. The largest originals on kesla.com are 700x400.
 */
export const GALLERY = [3, 1, 6, 8, 9, 11, 12, 13, 5, 2, 4, 7, 10] as const;
export type GalleryPhoto = (typeof GALLERY)[number];

/** Alt text for each photo, by file number. */
export const GALLERY_ALT: Record<GalleryPhoto, Pair> = {
  1: ["KESLA 2112Z with a cabin lifting a log against a blue sky", "Hytillinen KESLA 2112Z nostaa tukkia sinistä taivasta vasten"],
  2: ["Operator on the top seat of a KESLA 2112Z on a timber truck in a green forest", "Kuljettaja KESLA 2112Z:n yläohjauksessa puutavara-autossa vihreässä metsässä"],
  3: ["KESLA 2112Z with a cabin and a proG grapple beside snowy log stacks", "Hytillinen KESLA 2112Z ja proG-kahmari lumisten tukkipinojen vieressä"],
  4: ["KESLA 2112Z with a cabin and a yellow grapple over a load of birch logs", "Hytillinen KESLA 2112Z ja keltainen kahmari koivukuorman yllä"],
  5: ["KESLA 2112Z with a cabin on a loaded timber truck in the snow", "Hytillinen KESLA 2112Z kuormatussa puutavara-autossa lumessa"],
  6: ["KESLA 2112Z loading logs onto a truck from a large roadside stack", "KESLA 2112Z lastaa tukkeja autoon suuresta tienvarsipinosta"],
  7: ["KESLA 2112Z with a cabin between the bunks of a timber truck", "Hytillinen KESLA 2112Z puutavara-auton pankkojen välissä"],
  8: ["KESLA 2112Z folded between two loaded log trailers in the snow", "Kuljetusasentoon taitettu KESLA 2112Z kahden kuormatun perävaunun välissä lumessa"],
  9: ["KESLA 2112Z cabin and yellow grapple on a blue timber truck", "KESLA 2112Z:n hytti ja keltainen kahmari sinisessä puutavara-autossa"],
  10: ["Close-up of the KESLA 2112Z boom with its yellow grapple", "Lähikuva KESLA 2112Z:n puomista ja keltaisesta kahmarista"],
  11: ["Truck with a KESLA 2112Z loading logs in a snowy forest", "KESLA 2112Z:lla varustettu auto lastaa tukkeja lumisessa metsässä"],
  12: ["KESLA 2112Z on a Scania truck reaching over a log stack", "KESLA 2112Z Scania-autossa kurottaa tukkipinon yli"],
  13: ["Timber truck and trailer with a KESLA 2112Z on a forest road", "Puutavara-auto ja perävaunu KESLA 2112Z:lla metsätiellä"],
};

/** The timber cranes' ten features, as kesla.com lists them on the product page. */
export const FEATURE_KEYS = [
  "hosing",
  "zboom",
  "joint",
  "wideangle",
  "vbottom",
  "keslink",
  "valves",
  "stabilizers",
  "topseat",
  "grapples",
] as const;
export type FeatureKey = (typeof FEATURE_KEYS)[number];

// Two Finnish titles carry a soft hyphen (\u00ad): one word each, wider than a
// feature card between 1000 and 1120px and at 640px.
export const FEATURES: Record<FeatureKey, { title: Pair; body: Pair }> = {
  hosing: {
    title: ["In-boom hosing", "Sisäpuolinen letkutus"],
    body: ["In the new 21-series KESLA cranes the hoses run inside the booms, the transfer boom too. This cuts the risk of hose damage.", "Uusissa KESLA 21-sarjan nostureissa letkutus on puomin sisässä myös siirtopuomissa. Se vähentää letkurikon riskiä."],
  },
  zboom: {
    title: ["Space-saving Z-boom", "Tilaa säästävä Z-puomisto"],
    body: ["The transport position of the Z-boom cranes saves valuable load space.", "Z-puomisten nostureiden kuljetusasento säästää arvokasta kuormatilaa."],
  },
  joint: {
    title: ["New joint between the main and transfer booms", "Uudentyyppinen nosto- ja taittopuomin liitos"],
    body: ["The new type of joint keeps the hydraulic hoses well protected.", "Uudenlainen liitos pitää nosto- ja taittopuomin väliset hydrauliletkut hyvin suojassa."],
  },
  wideangle: {
    title: ["Wide-angle joint", "Laajakulmanivel"],
    body: ["Gives the best lifting capacity in every boom position.", "Varmistaa parhaan mahdollisen nostokyvyn eri puomin asennoissa."],
  },
  vbottom: {
    title: ["V-shaped bottom of the transfer boom", "Siirtopuomin V-pohja"],
    body: ["Makes work with the grapple more precise.", "Tekee kahmarin kanssa työskentelystä entistä tarkempaa."],
  },
  keslink: {
    title: ["KesLINK link", "KesLINK-riipuke"],
    body: ["Kesla's own link protects the hoses that lead to the grapple.", "Keslan luoma riipuke suojaa kahmarille meneviä letkuja."],
  },
  valves: {
    title: ["Wide choice of control valves", "Laaja valikoima ohjausventtiileitä"],
    body: ["Both mechanical and electric control valves.", "Niin mekaanisia kuin sähköisiä ohjausventtiileitä."],
  },
  stabilizers: {
    title: ["Stabilizer options", "Tukijalka\u00advaihtoehdot"],
    body: ["Integrated, separate, extra wide, for chipper use or for stationary use. The choice depends on the model.", "Integroidut, erilliset, erikoisleveät, hakkurikäyttöön tai asemakäyttöön. Valikoima riippuu mallista."],
  },
  topseat: {
    title: ["Top-seat equipment", "Yläohjaus\u00advarustus"],
    body: ["Handy when loading and unloading are short. Standard, side and E versions, the E with a very small slewing radius.", "Sopii, kun lastaus- ja purkuajat ovat lyhyitä. Standardi-, sivu- ja E-versio, E:n kääntymissäde on erityisen pieni."],
  },
  grapples: {
    title: ["The KESLA proG grapple range", "KESLA proG -kahmarivalikoima"],
    body: ["Timber and bioenergy grapples in many sizes, easy to grab one log or a big bunch.", "Puu- ja bioenergiakahmareita monessa koossa, helppo tarttua yhteen puuhun tai nippuun."],
  },
};

/**
 * The configurator's choices, from productConfigJSON on the kesla.com page.
 * `only` lists the versions that offer an option when not all three do.
 */
export const OPTION_GROUPS: readonly {
  key: string;
  title: Pair;
  options: readonly { key: string; label: Pair; only?: readonly VersionId[] }[];
}[] = [
  {
    key: "control",
    title: ["Control equipment", "Hallintalaitteet"],
    options: [
      { key: "topSeatStd", label: ["Top-seat equipment STD", "Yläohjausvarustus STD"] },
      { key: "topSeatE", label: ["Top-seat equipment E", "Yläohjausvarustus E"] },
      { key: "cabin", label: ["KESLA Vision cabin", "Hytti STD (Vision)"] },
      { key: "cabinXl", label: ["KESLA XL Vision cabin", "Hytti XL (Vision XL)"], only: ["2112ZT-96"] },
    ],
  },
  {
    key: "valve",
    title: ["Control valve", "Ohjausventtiili"],
    options: [
      { key: "electric", label: ["Electric control valve", "Sähköinen ohjausventtiili"], only: ["2112Z-81", "2112ZT-96"] },
      { key: "mech22", label: ["Mechanical, 2 levers + 2 pedals", "Mekaaninen, 2 vipua + 2 poljinta"] },
      { key: "mech42", label: ["Mechanical, 4 levers + 2 pedals", "Mekaaninen, 4 vipua + 2 poljinta"] },
      { key: "mech51", label: ["Mechanical, 5 levers + 1 pedal", "Mekaaninen, 5 vipua + 1 poljin"] },
    ],
  },
  {
    key: "topSeat",
    title: ["For the top-seat", "Yläohjauslaitteen varustelu"],
    options: [
      { key: "weatherGuard", label: ["Weather guard", "Sääsuoja"] },
    ],
  },
  {
    key: "cabin",
    title: ["For the cabin", "Hytin varustelu"],
    options: [
      { key: "colour", label: ["Special colour", "Erikoisväri"] },
      { key: "lights", label: ["Working lights, H3, LED or Xenon", "Työvalot, H3, LED tai Xenon"] },
      { key: "beacon", label: ["LED-level beacon", "LED-tasomajakka"] },
      { key: "heating", label: ["Heating, water or diesel", "Lämmitys, vesi tai diesel"] },
      { key: "ce", label: ["CE accessories for the cabin", "Hytin CE-varustelu"] },
      { key: "aircon", label: ["Air conditioner", "Ilmastointi"] },
    ],
  },
  {
    key: "stabilizers",
    title: ["Stabilizers", "Tukijalat"],
    options: [
      { key: "integrated", label: ["Integrated stabilizers", "Integroitu tukijalkapalkisto"] },
      { key: "separate", label: ["Separate stabilizers, normal", "Erillinen tukijalkapalkisto, normaali"] },
      { key: "wide", label: ["Separate stabilizers, wide", "Erilliset tukijalat, leveä malli"] },
    ],
  },
  {
    key: "steps",
    title: ["Steps", "Portaat"],
    options: [
      { key: "steps", label: ["Standard steps", "Vakioportaat"] },
    ],
  },
  {
    key: "plate",
    title: ["Stabilizer plate", "Tukijalan talla"],
    options: [
      { key: "fixed", label: ["Fixed", "Kiinteä"] },
      { key: "tilting", label: ["Tilting", "Kallistuva"] },
    ],
  },
  {
    key: "stabilizerControl",
    title: ["Stabilizer control", "Tukijalkojen ohjaus"],
    options: [
      { key: "below", label: ["From below", "Alhaalta"] },
      { key: "aboveMech", label: ["From above, mechanical", "Ylhäältä, mekaaninen"] },
      { key: "aboveElectric", label: ["From above, electric", "Ylhäältä, sähköinen"] },
    ],
  },
  {
    key: "transport",
    title: ["Automatic transport position of the stabilizers", "Tukijalkojen automaattinen kuljetusasento"],
    options: [
      { key: "deg60", label: ["60 degrees", "60 astetta"] },
      { key: "deg90", label: ["90 degrees", "90 astetta"] },
      { key: "deg180", label: ["180 degrees", "180 astetta"] },
    ],
  },
];

export const ACCESSORY_KEYS = [
  "emergencyStop",
  "ceKit",
  "ceComfort",
  "dumpValve",
  "damping",
  "heatedSeat",
  "lights",
  "cylinderGuard",
  "lubrication",
  "colour",
] as const;
export type AccessoryKey = (typeof ACCESSORY_KEYS)[number];

export const ACCESSORIES: Record<AccessoryKey, { title: Pair; body: Pair }> = {
  emergencyStop: {
    title: ["Emergency stop in the stabilizers", "Hätäkatkaisija tukijalkapalkistossa"],
    body: ["A switch in the stabilizers for emergencies.", "Tukijalkapalkistoon sijoitettu kytkin hätätapauksia varten."],
  },
  ceKit: {
    title: ["KESLA CE kit", "KESLA CE-varustus"],
    body: ["Monitors the loads and the transport position of the crane, to EU directives.", "EU-direktiivien mukainen kuormituksen ja kuljetusasennon valvontajärjestelmä."],
  },
  ceComfort: {
    title: ["KESLA CE Comfort kit", "KESLA CE Comfort -varustus"],
    body: ["Load and stabilizer monitoring, tilt sensors, emergency stop, switches for lights and seat heating, engine on and off, engine revs and two free switches for your own uses.", "Kuorma- ja tukijalkavalvonta, kallistusanturit, hätä-seis, valojen ja istuinlämmityksen kytkimet, moottorin käynnistys ja sammutus, kierrosten säätö ja kaksi vapaata kytkintä omiin sovelluksiin."],
  },
  dumpValve: {
    title: ["Dump valve", "Vapaakiertoventtiili"],
    body: ["Switches the crane hydraulics to free circulation, for example when the CE Comfort tilt sensor stops the crane.", "Ohjaa nosturin hydrauliikan vapaakierrolle esimerkiksi, kun CE Comfort -varustelun kallistusanturi pysäyttää nosturin."],
  },
  damping: {
    title: ["Piston accumulator damping", "Paineakkuvaimennus"],
    body: ["For the slewing, lifting and folding cylinders, as you choose.", "Valinnan mukaan kääntö-, nosto- ja taittosylinterille."],
  },
  heatedSeat: {
    title: ["Heated seat", "Istuinlämmitys"],
    body: ["For the cabin or the top-seat.", "Saatavilla sekä hyttiin että avohallintalaitteeseen."],
  },
  lights: {
    title: ["Working lights, H3, LED or Xenon", "Työvalot H3, LED tai Xenon"],
    body: ["Well placed and well protected working lights.", "Tehokas työvalaistus oikein sijoitetuilla ja hyvin suojatuilla valoilla."],
  },
  cylinderGuard: {
    title: ["Lifting cylinder guard", "Nostosylinterin suoja"],
    body: ["Protects the lifting cylinder from knocks by tree trunks.", "Suojaa sylinterin vartta esimerkiksi puunrunkojen kolhuilta."],
  },
  lubrication: {
    title: ["Central lubrication system", "Keskusvoitelujärjestelmä"],
    body: ["Factory fitted, with an electric or hydraulic pump. It can cover the grapple too, and has grease nipples for lubricating by hand.", "Tehdasasennettu, sähköisellä tai hydraulisella pumpulla. Kattaa haluttaessa myös kahmarin, ja siinä on rasvanipat käsin voitelua varten."],
  },
  colour: {
    title: ["Special colour", "Erikoisväri"],
    body: ["Any colour on the RAL chart.", "Mikä tahansa RAL-värikartan väri."],
  },
};

/** kesla.com's crane family FAQ and its general FAQ, in that order. */
export const FAQ: readonly { q: Pair; a: Pair }[] = [
  {
    q: ["Can KESLA cranes be used for other work than timber loading?", "Voiko KESLA-nostureita käyttää muuhunkin kuin puiden lastaamiseen?"],
    a: ["Yes. KESLA cranes and loaders can handle lime, bioenergy, scrap, metal and firewood, among many others. Usually another kind of grapple is needed.", "Kyllä. KESLA-nostureita ja kuormaimia käytetään mm. kalkin, bioenergian, jätteen, polttopuiden ja metallin käsittelyyn. Yleensä tarvitaan toisenlainen kahmari."],
  },
  {
    q: ["Is an electric control valve available?", "Voiko KESLA-nosturiin saada sähköisen ohjausventtiilin?"],
    a: ["Yes, for KESLA cranes with a cabin.", "Kyllä, hytillä varustettuihin KESLA-nostureihin."],
  },
  {
    q: ["Can I use biodegradable hydraulic oil?", "Voiko KESLA-nosturissa käyttää biohajoavaa hydrauliöljyä?"],
    a: ["Yes. A KESLA crane can also be delivered tested with biodegradable oil. Check the right oil type with your dealer.", "Kyllä voi. KESLA-nosturi voidaan myös toimittaa tehtaalta biohajoavalla öljyllä koeajettuna. Varmista sopiva öljytyyppi jälleenmyyjältä."],
  },
  {
    q: ["Is an oil cooler needed?", "Tarvitaanko KESLA-nosturin kanssa öljynlauhdutin?"],
    a: ["KESLA cranes have generously sized hydraulics that do not heat up easily. Trucks with a KESLA crane often have no oil cooler.", "KESLA-nostureissa on reilun kokoinen hydrauliikka, joka ei kuumene herkästi. Usein autoissa ei ole öljynlauhdutinta."],
  },
  {
    q: ["Can a scale be fitted?", "Saako KESLA-nosturiin vaa'an?"],
    a: ["Yes, a Tamtron scale, either hydraulically piped or wireless.", "Kyllä, Tamtron-vaakajärjestelmän joko hydrauliputkitettuna tai langattomana."],
  },
  {
    q: ["How does the central lubrication system work?", "Kuinka keskusvoitelujärjestelmä toimii?"],
    a: ["There are two options, mechanical and electric. The mechanical system feeds grease to the lines when the stabilizers are stretched out. The electric system is fully controlled from the cabin.", "Vaihtoehtoja on kaksi, mekaaninen ja sähköinen. Mekaaninen järjestelmä syöttää rasvaa, kun tukijalat levitetään. Sähköistä ohjataan kokonaan hytistä."],
  },
  {
    q: ["What cooling is available for KESLA proCAB cabins?", "Minkälaisia viilennysvaihtoehtoja KESLA proCAB -hytteihin saa?"],
    a: ["A cooler and air conditioning are optional. Where there is no room for them, a ceiling fan is available.", "Viilennin- ja ilmastointilaitteet ovat valinnaisia. Jos tilaa ei ole, voidaan asentaa kattotuuletin."],
  },
];

/* ---------------------------------------------------------------- */
/* Downloads and videos                                              */
/* ---------------------------------------------------------------- */

export const DATASHEETS = [
  { title: ["Datasheet KESLA 2112Z", "Tekninen esite KESLA 2112Z"], code: "90000419", href: "https://issuu.com/keslaoyj/docs/2021_12_kesla_2112z_90000419" },
  { title: ["Datasheet KESLA 2112Z front-folded", "Tekninen esite KESLA 2112Z, eteenpäin avautuva"], code: "90000451", href: "https://issuu.com/keslaoyj/docs/2022_1_kesla_2112z_front_folded_90000451" },
  { title: ["Datasheet KESLA 2112Z front-folded", "Tekninen esite KESLA 2112Z, eteenpäin avautuva"], code: "90000454", href: "https://issuu.com/keslaoyj/docs/2022_1_kesla_2112z_front_folded_90000454" },
] as const;

export const DATASHEET_HREF = DATASHEETS[0].href;

export const BROCHURES = [
  { title: ["Brochure: Truck and industrial cranes", "Esite: Truck and industrial cranes"], code: "ENG", href: "https://issuu.com/keslaoyj/docs/2022_2_autonosturit_eng" },
  { title: ["Brochure: Auto- ja teollisuusnosturit", "Esite: Auto- ja teollisuusnosturit"], code: "FIN", href: "https://issuu.com/keslaoyj/docs/2022_2_autonosturit_fin" },
] as const;

export function youtube(id: string): string {
  return `https://www.youtube.com/watch?v=${id}`;
}

/** The four 2112 videos, with stills in public/images. */
export const FEATURED_VIDEOS = [
  { key: "highSeat", id: "ZFH433GjXiw", title: ["KESLA 2112Z high seat with EHC", "KESLA 2112Z yläohjauksella ja EHC:llä"] },
  { key: "kuhmo", id: "Ya8uYCET6jA", title: ["Kuhmo Oy: KESLA 2112 crane in industrial use", "Kuhmo Oy: KESLA 2112 -nosturi teollisuuskäytössä"] },
  { key: "industrial", id: "kGAewbJ4y7Q", title: ["KESLA 2112T industrial crane in action", "KESLA 2112T teollisuusnosturi työssä"] },
  { key: "sawMill", id: "b1l42696xfs", title: ["KESLA 2112T with Vision cabin unloading at a saw mill", "KESLA 2112T ja Vision-hytti purkamassa sahalla"] },
] as const;
export type FeaturedVideoKey = (typeof FEATURED_VIDEOS)[number]["key"];

/** The rest of kesla.com's video list for the model, under YouTube's own titles. */
export const MORE_VIDEOS = [
  { id: "9NAHJRNMpdk", title: "Kuhmo Oy: KESLA 2112 -nosturi teollisuuskäytössä" },
  { id: "TwXFO9AVTYc", title: "KESLA 1200T bioenergy crane with Bruks chipper" },
  { id: "Z6xpwd8wOAI", title: "KESLA 2117T crane with Vision cabin" },
  { id: "ILzAyOxOeNs", title: "KESLA 2210ST customer in Russia" },
  { id: "2_i3FnoFMok", title: "KESLA cranes: KKJ Sped Poland" },
  { id: "l6KDnI7awH4", title: "KESLA cranes: Kuljetusliike Kari Malmstedt Oy" },
  { id: "SOOQmwFImrY", title: "KESLA timber cranes: Sheffield & CO Ltd, UK" },
  { id: "Ep3UCv6SIBY", title: "Metsäenergia Meter: KESLA 1200" },
] as const;
