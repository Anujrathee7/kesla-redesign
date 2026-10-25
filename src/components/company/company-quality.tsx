import Image, { type StaticImageData } from "next/image";
import { getLocale, getTranslations } from "next-intl/server";

import { SectionHeading } from "@/components/home/section-heading";
import { BADGES, IR_LINKS, THEMES, type BadgeKey, type ThemeKey } from "@/lib/company";

import aaaBadge from "../../../public/images/company-badge-aaa.jpg";
import asiakastietoBadge from "../../../public/images/company-badge-asiakastieto.jpg";
import esgBadge from "../../../public/images/company-badge-esg.jpg";
import gdprBadge from "../../../public/images/company-badge-gdpr.jpg";
import iso3834Badge from "../../../public/images/company-badge-iso3834.jpg";
import iso9001Badge from "../../../public/images/company-badge-iso9001.jpg";
import luotettavaBadge from "../../../public/images/company-badge-luotettava.jpg";
import madeInFinlandBadge from "../../../public/images/company-badge-madeinfinland.jpg";
import economyIcon from "../../../public/images/company-theme-economy.jpg";
import energyIcon from "../../../public/images/company-theme-energy.jpg";
import partnershipIcon from "../../../public/images/company-theme-partnership.jpg";
import resourcesIcon from "../../../public/images/company-theme-resources.jpg";
import safetyIcon from "../../../public/images/company-theme-safety.jpg";

const THEME_ICONS: Record<ThemeKey, StaticImageData> = {
  economy: economyIcon,
  partnership: partnershipIcon,
  resources: resourcesIcon,
  safety: safetyIcon,
  energy: energyIcon,
};

const BADGE_IMAGES: Record<BadgeKey, StaticImageData> = {
  iso9001: iso9001Badge,
  iso3834: iso3834Badge,
  aaa: aaaBadge,
  luotettava: luotettavaBadge,
  esg: esgBadge,
  madeinfinland: madeInFinlandBadge,
  gdpr: gdprBadge,
  asiakastieto: asiakastietoBadge,
};

/**
 * Quality and responsibility: the five sustainability themes from Kesla's
 * reporting as ruled rows, and the certificate and rating badges kesla.com
 * shows as bare images, here named.
 */
export async function CompanyQuality() {
  const t = await getTranslations("Company.quality");
  const locale = await getLocale();

  return (
    <section id="quality" aria-labelledby="quality-title" className="scroll-mt-4 border-t border-line gutter">
      <div className="wrap py-[clamp(56px,8vw,104px)]">
        <SectionHeading
          id="quality-title"
          title={t("title")}
          link={{ href: IR_LINKS.sustainabilityReports, label: t("reports"), external: true, hrefLang: locale === "fi" ? undefined : "fi" }}
        />
        <div className="grid items-start gap-x-[clamp(32px,5vw,72px)] gap-y-12 min-[1001px]:grid-cols-2">
          <div>
            <ul className="border-t border-line">
              {THEMES.map((key) => (
                <li key={key} className="grid grid-cols-[56px_minmax(0,1fr)] items-center gap-[18px] border-b border-line py-4">
                  <Image src={THEME_ICONS[key]} alt="" sizes="56px" className="size-14" />
                  <h3 className="text-lg leading-[1.2] font-bold tracking-[0.02em] uppercase">{t(`themes.${key}.name`)}</h3>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="border-b-[3px] border-ink pb-2.5 text-[clamp(1.125rem,1.6vw,1.3125rem)] leading-[1.1] font-extrabold tracking-[0.02em] uppercase">
              {t("certificates")}
            </h3>
            <ul className="grid gap-x-6 min-[561px]:grid-cols-2">
              {BADGES.map((key) => (
                <li key={key} className="grid grid-cols-[76px_minmax(0,1fr)] items-center gap-4 border-b border-line py-3.5">
                  <span className="grid h-16 w-[76px] place-items-center">
                    <Image
                      src={BADGE_IMAGES[key]}
                      alt=""
                      sizes="76px"
                      className="h-auto max-h-16 w-auto max-w-[76px]"
                    />
                  </span>
                  <strong className="block font-display text-base leading-[1.2] font-bold text-ink">
                    {t(`badges.${key}.name`)}
                  </strong>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
