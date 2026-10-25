import Image, { type StaticImageData } from "next/image";
import { getLocale, getTranslations } from "next-intl/server";

import { SectionHeading } from "@/components/home/section-heading";
import { IR_LINKS, PEOPLE, PERSON_NAMES, type PersonKey } from "@/lib/company";

import jormanainenPhoto from "../../../public/images/company-mt-jormanainen.jpg";
import miettinenPhoto from "../../../public/images/company-mt-miettinen.jpg";
import nieminenPhoto from "../../../public/images/company-mt-nieminen.jpg";
import pirinenPhoto from "../../../public/images/company-mt-pirinen.jpg";
import sederholmPhoto from "../../../public/images/company-mt-sederholm.jpg";
import tahvanainenPhoto from "../../../public/images/company-mt-tahvanainen.jpg";

const PORTRAITS: Record<PersonKey, StaticImageData> = {
  nieminen: nieminenPhoto,
  jormanainen: jormanainenPhoto,
  miettinen: miettinenPhoto,
  pirinen: pirinenPhoto,
  tahvanainen: tahvanainenPhoto,
  sederholm: sederholmPhoto,
};

/**
 * The management team as of 1 September 2026: six portraits in a row with
 * the official titles, and the announced change underneath.
 */
export async function CompanyManagement() {
  const t = await getTranslations("Company.management");
  const locale = await getLocale();

  return (
    <section id="management" aria-labelledby="management-title" className="scroll-mt-4 gutter">
      <div className="wrap py-[clamp(56px,8vw,104px)]">
        <SectionHeading
          id="management-title"
          title={t("title")}
          link={{ href: IR_LINKS.board, label: t("board"), external: true, hrefLang: locale === "fi" ? undefined : "fi" }}
        />
        <ul className="grid grid-cols-2 gap-x-4 gap-y-6 min-[561px]:grid-cols-3 min-[561px]:gap-x-[clamp(16px,2vw,28px)] min-[561px]:gap-y-8 min-[1101px]:grid-cols-6">
          {PEOPLE.map((key) => (
            <li key={key}>
              <div className="relative aspect-square overflow-hidden bg-warm [--cut:18px] cut">
                {/* The name is right below, so the portrait needs no alt text of its own. */}
                <Image
                  src={PORTRAITS[key]}
                  alt=""
                  fill
                  placeholder="blur"
                  sizes="(min-width: 1101px) 190px, (min-width: 561px) 30vw, 45vw"
                  className="object-cover"
                />
              </div>
              <h3 className="mt-3.5 text-base leading-[1.15] font-bold tracking-normal min-[561px]:text-lg">{PERSON_NAMES[key]}</h3>
              <p className="mt-1.5 text-sm leading-[1.4] min-[561px]:text-[0.9375rem]">{t(`people.${key}.title`)}</p>
            </li>
          ))}
        </ul>
        <p className="mt-6 max-w-[80ch] text-[0.9375rem] text-mute">{t("note")}</p>
      </div>
    </section>
  );
}
