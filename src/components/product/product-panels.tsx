import { ArrowUpRight, ChevronDown } from "lucide-react";
import Image, { type StaticImageData } from "next/image";
import { getLocale, getTranslations } from "next-intl/server";

import { PlayBadge } from "@/components/home/home-media";
import type { Locale } from "@/i18n/routing";
import {
  ACCESSORIES,
  ACCESSORY_KEYS,
  BROCHURES,
  DATASHEETS,
  FAQ,
  FEATURE_KEYS,
  FEATURED_VIDEOS,
  FEATURES,
  MORE_VIDEOS,
  OPTION_GROUPS,
  pick,
  youtube,
  type AccessoryKey,
  type FeatureKey,
} from "@/lib/product-2112z";

import accCeComfort from "../../../public/images/product-2112z-o-ce-comfort.jpg";
import accCeKit from "../../../public/images/product-2112z-o-ce-kit.jpg";
import accColour from "../../../public/images/product-2112z-o-colour.jpg";
import accCylinderGuard from "../../../public/images/product-2112z-o-cylinder-guard.jpg";
import accDamping from "../../../public/images/product-2112z-o-damping.jpg";
import accDumpValve from "../../../public/images/product-2112z-o-dump-valve.jpg";
import accEmergencyStop from "../../../public/images/product-2112z-o-emergency-stop.jpg";
import accHeatedSeat from "../../../public/images/product-2112z-o-heated-seat.jpg";
import accLights from "../../../public/images/product-2112z-o-lights.jpg";
import accLubrication from "../../../public/images/product-2112z-o-lubrication.jpg";
import ds90000419 from "../../../public/images/product-2112z-ds-90000419.jpg";
import ds90000451 from "../../../public/images/product-2112z-ds-90000451.jpg";
import ds90000454 from "../../../public/images/product-2112z-ds-90000454.jpg";
import fGrapples from "../../../public/images/product-2112z-f-grapples.jpg";
import fHosing from "../../../public/images/product-2112z-f-hosing.jpg";
import fJoint from "../../../public/images/product-2112z-f-joint.jpg";
import fKeslink from "../../../public/images/product-2112z-f-keslink.jpg";
import fStabilizers from "../../../public/images/product-2112z-f-stabilizers.jpg";
import fTopseat from "../../../public/images/product-2112z-f-topseat.jpg";
import fValves from "../../../public/images/product-2112z-f-valves.jpg";
import fVbottom from "../../../public/images/product-2112z-f-vbottom.jpg";
import fWideangle from "../../../public/images/product-2112z-f-wideangle.jpg";
import fZboom from "../../../public/images/product-2112z-f-zboom.jpg";
import { VIDEO_STILLS } from "./product-media";
import { CompareTable, SpecTable } from "./version-tables";

const FEATURE_PHOTOS: Record<FeatureKey, StaticImageData> = {
  hosing: fHosing,
  zboom: fZboom,
  joint: fJoint,
  wideangle: fWideangle,
  vbottom: fVbottom,
  keslink: fKeslink,
  valves: fValves,
  stabilizers: fStabilizers,
  topseat: fTopseat,
  grapples: fGrapples,
};

const ACCESSORY_PHOTOS: Record<AccessoryKey, StaticImageData> = {
  emergencyStop: accEmergencyStop,
  ceKit: accCeKit,
  ceComfort: accCeComfort,
  dumpValve: accDumpValve,
  damping: accDamping,
  heatedSeat: accHeatedSeat,
  lights: accLights,
  cylinderGuard: accCylinderGuard,
  lubrication: accLubrication,
  colour: accColour,
};

const DATASHEET_COVERS: Record<string, StaticImageData> = {
  "90000419": ds90000419,
  "90000451": ds90000451,
  "90000454": ds90000454,
};

const H2 = "text-[clamp(1.75rem,3.2vw,2.625rem)] leading-none font-extrabold uppercase";
const H2_SMALL = "text-[clamp(1.25rem,1.8vw,1.5rem)] leading-[1.05] font-extrabold uppercase";
/** Name links in ruled rows: a yellow underline on hover, like the rest of the site. */
const ROW_NAME =
  "decoration-yellow decoration-2 underline-offset-4 group-hover:underline group-focus-visible:underline";

async function NewTab() {
  const t = await getTranslations("Product");
  return <span className="sr-only">, {t("newTab")}</span>;
}

/* ---------------------------------------------------------------- */
/* Overview                                                          */
/* ---------------------------------------------------------------- */

export async function OverviewPanel() {
  const t = await getTranslations("Product");
  const locale = (await getLocale()) as Locale;

  return (
    <>
      <div className="grid items-start gap-x-[clamp(32px,5vw,72px)] gap-y-8 min-[1001px]:grid-cols-2">
        <div className="max-w-[58ch] space-y-4 text-lg">
          <p>{t("overview.intro1")}</p>
          <p>{t("overview.intro2")}</p>
        </div>
        <div>
          <h2 className={`${H2_SMALL} mb-2.5`}>{t("overview.versions")}</h2>
          <CompareTable />
        </div>
      </div>

      <h2 id="features-title" className={`${H2} mt-[clamp(44px,5.4vw,72px)] mb-[22px]`}>
        {t("overview.features")}
      </h2>
      {/* Five across on desktop, three on tablets, a sideways row on phones. */}
      <ul
        aria-labelledby="features-title"
        tabIndex={0}
        className="grid grid-cols-5 gap-x-5 gap-y-9 focus-visible:outline-offset-4 max-[1000px]:grid-cols-3 max-[640px]:-mr-[max(clamp(16px,4vw,40px),env(safe-area-inset-right,0px))] max-[640px]:flex max-[640px]:snap-x max-[640px]:snap-mandatory max-[640px]:gap-3.5 max-[640px]:overflow-x-auto max-[640px]:pr-[max(clamp(16px,4vw,40px),env(safe-area-inset-right,0px))] max-[640px]:pb-2"
      >
        {FEATURE_KEYS.map((key) => (
          <li key={key} className="min-w-0 max-[640px]:w-[72%] max-[640px]:shrink-0 max-[640px]:snap-start">
            <Image
              src={FEATURE_PHOTOS[key]}
              alt=""
              sizes="(min-width: 1001px) 240px, (min-width: 641px) 33vw, 72vw"
              className="aspect-[2/1] w-full bg-warm object-cover cut"
            />
            <h3 className="mt-3.5 font-display text-base leading-[1.2] font-bold tracking-[0.02em] uppercase max-[640px]:mt-2.5 max-[640px]:text-sm">
              {pick(FEATURES[key].title, locale)}
            </h3>
            <p className="mt-1.5 text-[0.9375rem] max-[640px]:text-sm">{pick(FEATURES[key].body, locale)}</p>
          </li>
        ))}
      </ul>
    </>
  );
}

/* ---------------------------------------------------------------- */
/* Technical data                                                    */
/* ---------------------------------------------------------------- */

export async function TechnicalPanel() {
  const t = await getTranslations("Product");

  return (
    <>
      <h2 className="sr-only">{t("tabs.technical")}</h2>
      <SpecTable />
    </>
  );
}

/* ---------------------------------------------------------------- */
/* Options and accessories                                           */
/* ---------------------------------------------------------------- */

export async function OptionsPanel() {
  const t = await getTranslations("Product");
  const locale = (await getLocale()) as Locale;

  return (
    <div className="grid items-start gap-x-[clamp(32px,5vw,72px)] gap-y-10 min-[1001px]:grid-cols-2">
      <div>
        <h2 className={`${H2_SMALL} mb-1`}>{t("options.title")}</h2>
        {OPTION_GROUPS.map((group) => (
          <div key={group.key}>
            <h3 className="mt-4 mb-1.5 caps text-mute">
              {pick(group.title, locale)}
            </h3>
            <ul className="flex flex-wrap gap-1.5">
              {group.options.map((option) => (
                <li
                  key={option.key}
                  className="border border-line px-2.5 pt-[7px] pb-1.5 font-display text-sm leading-[1.2] font-semibold text-ink"
                >
                  {pick(option.label, locale)}
                  {option.only && (
                    <span className="font-medium text-mute">
                      {" · "}
                      {t("options.only", { versions: option.only.join(", ") })}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div>
        <h2 className={`${H2_SMALL} mb-1`}>{t("options.accessories")}</h2>
        <ul>
          {ACCESSORY_KEYS.map((key) => (
            <li
              key={key}
              className="grid grid-cols-[132px_minmax(0,1fr)] items-start gap-[18px] border-t border-line py-4 last:border-b max-[560px]:grid-cols-[96px_minmax(0,1fr)] max-[560px]:gap-3.5"
            >
              <Image
                src={ACCESSORY_PHOTOS[key]}
                alt=""
                sizes="132px"
                className="aspect-[2/1] w-full bg-warm object-cover"
              />
              <div>
                <h3 className="font-display text-base leading-[1.2] font-bold tracking-[0.02em] uppercase">
                  {pick(ACCESSORIES[key].title, locale)}
                </h3>
                <p className="mt-1 text-[0.9375rem]">{pick(ACCESSORIES[key].body, locale)}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* Videos                                                            */
/* ---------------------------------------------------------------- */

export async function VideosPanel() {
  const t = await getTranslations("Product");
  const locale = (await getLocale()) as Locale;

  return (
    <>
      <h2 className="sr-only">{t("videos.title")}</h2>
      <ul className="grid grid-cols-2 gap-6 max-[640px]:grid-cols-1">
        {FEATURED_VIDEOS.map(({ key, id, title }) => (
          <li key={id}>
            <a href={youtube(id)} target="_blank" rel="noopener" className="group block">
              <span className="relative block overflow-hidden bg-ink [--cut:18px] cut">
                <Image
                  src={VIDEO_STILLS[key]}
                  alt=""
                  sizes="(min-width: 641px) 50vw, 100vw"
                  className="aspect-video w-full object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.03]"
                />
                <PlayBadge small />
              </span>
              <span className="block pt-3.5">
                <span className={`block font-display text-lg leading-[1.25] font-bold text-ink ${ROW_NAME}`}>
                  {pick(title, locale)}
                </span>
                <span className="mt-1 block text-sm text-mute">{t("videos.youtube")}</span>
              </span>
              <NewTab />
            </a>
          </li>
        ))}
      </ul>
      <ul className="mt-6">
        {MORE_VIDEOS.map(({ id, title }) => (
          <li key={id}>
            <a
              href={youtube(id)}
              target="_blank"
              rel="noopener"
              className="group grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3.5 border-t border-line py-3 text-ink [li:last-child>&]:border-b"
            >
              <span>
                <strong className={`block font-display text-[0.9375rem] leading-[1.25] font-bold ${ROW_NAME}`}>
                  {title}
                </strong>
                <small className="mt-0.5 block text-sm text-mute">{t("videos.youtube")}</small>
              </span>
              <ArrowUpRight className="size-4 text-mute transition-colors group-hover:text-ink" strokeWidth={2.5} aria-hidden="true" />
              <NewTab />
            </a>
          </li>
        ))}
      </ul>
    </>
  );
}

/* ---------------------------------------------------------------- */
/* Downloads                                                         */
/* ---------------------------------------------------------------- */

export async function DownloadsPanel() {
  const t = await getTranslations("Product");
  const locale = (await getLocale()) as Locale;

  return (
    <>
      <h2 className="sr-only">{t("downloads.title")}</h2>
      <ul className="grid grid-cols-3 gap-x-6 gap-y-4 max-[1000px]:grid-cols-1 max-[1000px]:gap-0">
        {DATASHEETS.map(({ title, code, href }) => (
          <li key={code}>
            <a
              href={href}
              target="_blank"
              rel="noopener"
              className="group grid grid-cols-[72px_minmax(0,1fr)_auto] items-center gap-3.5 border-y border-line py-3 text-ink max-[1000px]:[li+li>&]:border-t-0"
            >
              <Image
                src={DATASHEET_COVERS[code]}
                alt=""
                sizes="72px"
                className="aspect-[2/3] w-[72px] bg-paper object-cover shadow-[inset_0_0_0_1px_var(--color-line)]"
              />
              <span>
                <strong className={`block font-display text-[0.9375rem] leading-[1.25] font-bold ${ROW_NAME}`}>
                  {pick(title, locale)}
                </strong>
                <small className="mt-[3px] block text-sm text-mute">{t("downloads.on", { code })}</small>
              </span>
              <ArrowUpRight className="size-4 text-mute transition-colors group-hover:text-ink" strokeWidth={2.5} aria-hidden="true" />
              <NewTab />
            </a>
          </li>
        ))}
      </ul>

      <h3 className="mt-8 mb-1.5 caps text-ink">{t("downloads.brochures")}</h3>
      <ul>
        {BROCHURES.map(({ title, code, href }) => (
          <li key={code}>
            <a
              href={href}
              target="_blank"
              rel="noopener"
              className="group grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3.5 border-t border-line py-3 text-ink [li:last-child>&]:border-b"
            >
              <span>
                <strong className={`block font-display text-[0.9375rem] leading-[1.25] font-bold ${ROW_NAME}`}>
                  {pick(title, locale)}
                </strong>
                <small className="mt-0.5 block text-sm text-mute">{t("downloads.on", { code })}</small>
              </span>
              <ArrowUpRight className="size-4 text-mute transition-colors group-hover:text-ink" strokeWidth={2.5} aria-hidden="true" />
              <NewTab />
            </a>
          </li>
        ))}
      </ul>
    </>
  );
}

/* ---------------------------------------------------------------- */
/* FAQ                                                               */
/* ---------------------------------------------------------------- */

export async function FaqPanel() {
  const t = await getTranslations("Product");
  const locale = (await getLocale()) as Locale;

  return (
    <>
      <h2 className="sr-only">{t("faq.title")}</h2>
      <div>
        {FAQ.map(({ q, a }) => (
          <details key={q[0]} className="group border-t border-line last:border-b">
            <summary className="grid cursor-pointer list-none grid-cols-[minmax(0,1fr)_20px] items-center gap-4 py-4 font-display text-[1.0625rem] leading-[1.3] font-bold text-ink decoration-yellow decoration-2 underline-offset-4 hover:underline [&::-webkit-details-marker]:hidden">
              {pick(q, locale)}
              <ChevronDown
                className="size-4 justify-self-end text-mute transition-transform duration-200 ease-out-expo group-open:rotate-180 group-open:text-ink"
                strokeWidth={2.5}
                aria-hidden="true"
              />
            </summary>
            <p className="max-w-[72ch] pr-9 pb-[18px]">{pick(a, locale)}</p>
          </details>
        ))}
      </div>
    </>
  );
}
