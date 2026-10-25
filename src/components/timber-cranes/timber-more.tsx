import { ArrowUpRight, ChevronRight } from "lucide-react";
import Image, { type StaticImageData } from "next/image";
import { getTranslations } from "next-intl/server";

import { CRANE_MODELS } from "@/lib/timber-cranes-data";

import grapplesImage from "../../../public/images/timber-f-grapples.jpg";
import hosingImage from "../../../public/images/timber-f-hosing.jpg";
import jointImage from "../../../public/images/timber-f-joint.jpg";
import keslinkImage from "../../../public/images/timber-f-keslink.jpg";
import stabilizersImage from "../../../public/images/timber-f-stabilizers.jpg";
import topseatImage from "../../../public/images/timber-f-topseat.jpg";
import valvesImage from "../../../public/images/timber-f-valves.jpg";
import vbottomImage from "../../../public/images/timber-f-vbottom.jpg";
import wideangleImage from "../../../public/images/timber-f-wideangle.jpg";
import zboomImage from "../../../public/images/timber-f-zboom.jpg";

const FEATURE_IMAGES: Record<string, StaticImageData> = {
  hosing: hosingImage,
  zboom: zboomImage,
  joint: jointImage,
  wideangle: wideangleImage,
  vbottom: vbottomImage,
  keslink: keslinkImage,
  valves: valvesImage,
  stabilizers: stabilizersImage,
  topseat: topseatImage,
  grapples: grapplesImage,
};

const BROCHURES = {
  en: "https://issuu.com/keslaoyj/docs/2022_2_autonosturit_eng",
  fi: "https://issuu.com/keslaoyj/docs/2022_2_autonosturit_fin",
} as const;

type Feature = { image: string; title: string; text: string };
type Question = { q: string; a: string };

const sectionY = "py-[clamp(40px,5.5vw,72px)]";

/** kesla.com's ten timber crane features as ruled rows with a small photo, two columns on desktop. */
export async function TimberFeatures() {
  const t = await getTranslations("TimberCranes.features");
  const items = t.raw("items") as Feature[];

  return (
    <section aria-labelledby="features-title" className="gutter">
      <div className={`wrap ${sectionY}`}>
        <h2
          id="features-title"
          className="mb-[clamp(24px,3vw,40px)] text-[clamp(1.75rem,3.2vw,2.625rem)] leading-none font-extrabold uppercase"
        >
          {t("title")}
        </h2>
        <ul className="grid gap-x-[clamp(24px,4vw,56px)] min-[1001px]:grid-cols-2">
          {items.map((item) => (
            <li
              key={item.image}
              className="grid grid-cols-[96px_minmax(0,1fr)] items-start gap-3.5 border-t border-line py-4 last:border-b min-[561px]:grid-cols-[132px_minmax(0,1fr)] min-[561px]:gap-[18px] min-[1001px]:[&:nth-last-child(2)]:border-b"
            >
              <Image
                src={FEATURE_IMAGES[item.image]}
                alt=""
                sizes="(max-width: 560px) 96px, 132px"
                className="aspect-[2/1] w-full bg-warm object-cover"
              />
              <div>
                <h3 className="font-display text-base leading-[1.2] font-bold tracking-[0.02em] break-words hyphens-auto text-ink uppercase">
                  {item.title}
                </h3>
                <p className="mt-1 text-[0.9375rem]">{item.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** The category's questions beside the brochures and one datasheet per model. */
export async function TimberHelp() {
  const t = await getTranslations("TimberCranes");
  const questions = t.raw("faq.items") as Question[];
  const datasheets = CRANE_MODELS.filter((m) => m.datasheet).sort((a, b) =>
    a.name.localeCompare(b.name, "en", { numeric: true }),
  );
  const newTab = <span className="sr-only"> {t("media.newTab")}</span>;
  const titleClass = "mb-[18px] text-[clamp(1.5rem,2.4vw,2rem)] leading-none font-extrabold uppercase";

  return (
    <div className="gutter">
      <div
        className={`wrap grid items-start gap-x-[clamp(32px,5vw,72px)] gap-y-10 ${sectionY} min-[1001px]:grid-cols-2`}
      >
        <section aria-labelledby="faq-title">
          <h2 id="faq-title" className={titleClass}>
            {t("faq.title")}
          </h2>
          <div>
            {questions.map((item) => (
              <details key={item.q} className="group border-t border-line last:border-b">
                <summary className="grid cursor-pointer list-none grid-cols-[minmax(0,1fr)_20px] items-center gap-4 py-4 font-display text-[1.0625rem] leading-[1.3] font-bold text-ink decoration-yellow decoration-2 underline-offset-4 hover:underline [&::-webkit-details-marker]:hidden">
                  {item.q}
                  <ChevronRight
                    className="size-3.5 justify-self-end rotate-90 text-mute transition-transform duration-200 ease-out-expo group-open:-rotate-90 group-open:text-ink"
                    strokeWidth={2.5}
                    aria-hidden="true"
                  />
                </summary>
                <p className="max-w-[72ch] pr-9 pb-[18px]">{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section aria-labelledby="downloads-title">
          <h2 id="downloads-title" className={titleClass}>
            {t("downloads.title")}
          </h2>
          <ul>
            {(["en", "fi"] as const).map((lang) => (
              <li key={lang}>
                <a
                  href={BROCHURES[lang]}
                  target="_blank"
                  rel="noopener"
                  hrefLang={lang}
                  className={`group grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3.5 border-t border-line py-3 text-ink ${lang === "fi" ? "border-b" : ""}`}
                >
                  <span>
                    <strong
                      lang={lang}
                      className="block font-display text-[0.9375rem] leading-[1.25] font-bold tracking-[0.01em] decoration-yellow decoration-2 underline-offset-4 group-hover:underline"
                    >
                      {t(lang === "en" ? "downloads.brochureEn" : "downloads.brochureFi")}
                    </strong>
                    <small className="mt-0.5 block text-sm text-mute">
                      {t(lang === "en" ? "downloads.brochureEnNote" : "downloads.brochureFiNote")}
                    </small>
                    {newTab}
                  </span>
                  <ArrowUpRight className="size-4 text-mute" strokeWidth={2.25} aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
          <h3 className="mt-4 mb-2.5 caps text-ink">{t("downloads.datasheets")}</h3>
          <ul className="flex flex-wrap gap-1.5">
            {datasheets.map((m) => (
              <li key={m.name}>
                <a
                  href={m.datasheet}
                  target="_blank"
                  rel="noopener"
                  aria-label={`${t("downloads.datasheetLabel", { model: m.name })} ${t("media.newTab")}`}
                  className="inline-flex items-center border border-line px-2.5 pt-2 pb-[7px] font-display text-sm leading-none font-semibold text-ink tabular-nums transition-colors duration-150 ease-out hover:border-ink hover:bg-yellow pointer-coarse:min-h-11"
                >
                  {m.name}
                </a>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
