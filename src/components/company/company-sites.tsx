import { MapPin, Phone } from "lucide-react";
import Image from "next/image";
import { getTranslations } from "next-intl/server";

import { SITES } from "@/lib/company";

import harvesterImage from "../../../public/images/company-harvester-head.jpg";
import { SectionTitle } from "./section-title";

/**
 * Offices and production plants: the three Finnish factories and the German
 * sales office as ruled rows.
 */
export async function CompanySites() {
  const t = await getTranslations("Company.sites");

  return (
    <section id="sites" aria-labelledby="sites-title" className="scroll-mt-4 gutter">
      <div className="wrap grid items-start gap-x-[clamp(32px,5vw,72px)] gap-y-9 py-[clamp(56px,8vw,104px)] min-[1001px]:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <div>
          <SectionTitle id="sites-title">{t("title")}</SectionTitle>
          <div className="relative mt-7 aspect-[23/10] overflow-hidden bg-warm [--cut:22px] cut">
            <Image
              src={harvesterImage}
              alt={t("imageAlt")}
              fill
              placeholder="blur"
              sizes="(min-width: 1001px) 40vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>

        <ul className="border-t-[3px] border-ink">
          {SITES.map((site) => (
            <li
              key={site.key}
              className="grid items-baseline gap-x-6 gap-y-2 border-b border-line pt-5 pb-[19px] min-[721px]:grid-cols-[minmax(0,11em)_minmax(0,1fr)]"
            >
              <div>
                <h3 className="text-[clamp(1.375rem,2.2vw,1.75rem)] leading-none font-extrabold tracking-normal uppercase">
                  {site.name}
                </h3>
                <p className="mt-1.5 text-[0.9375rem]">{t(`roles.${site.key}`)}</p>
              </div>

              <div className="flex flex-col gap-1.5 text-base text-ink">
                <p className="flex items-baseline gap-2">
                  <MapPin className="size-4 shrink-0 translate-y-0.5 text-mute" strokeWidth={2} aria-hidden="true" />
                  <span>
                    <span className="sr-only">{t("address")}: </span>
                    {site.street}, {t(`countries.${site.country}`)}
                  </span>
                </p>
                {site.phone && (
                  <p className="flex items-baseline gap-2">
                    <Phone className="size-4 shrink-0 translate-y-0.5 text-mute" strokeWidth={2} aria-hidden="true" />
                    <span className="sr-only">{t("phone")}: </span>
                    <a
                      href={site.phone.href}
                      className="-my-2.5 py-2.5 tabular-nums decoration-yellow decoration-2 underline-offset-4 hover:underline sm:my-0 sm:py-0"
                    >
                      {site.phone.label}
                    </a>
                  </p>
                )}
              </div>

            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
