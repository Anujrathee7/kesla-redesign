import { MapPin } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { VALUES } from "@/lib/career";
import { SITES } from "@/lib/company";

const TITLE = "text-[clamp(1.75rem,3.2vw,2.75rem)] leading-none font-extrabold text-ink uppercase";
const INTRO = "mt-4 max-w-[46ch] text-lg leading-normal text-ink sm:text-[1.1875rem]";
const ROW_NAME = "font-display text-[1.1875rem] leading-[1.2] font-extrabold text-ink uppercase";

/**
 * One white section, split in two: Kesla's four values as a ruled list on the
 * left, the four sites with their addresses on the right. It sat on black
 * until the copy audit; on white, the video band stays the page's one black
 * band before the footer, as on Contacts (19 October 2026).
 */
export async function CareerValuesSites() {
  const t = await getTranslations("Career");

  return (
    <div className="border-t border-line text-grey gutter">
      <div className="wrap grid items-start gap-x-[clamp(32px,5vw,80px)] gap-y-12 py-[clamp(56px,8vw,96px)] min-[1001px]:grid-cols-2">
        <section aria-labelledby="values-title">
          <h2 id="values-title" className={TITLE}>
            {t("values.title")}
          </h2>
          <p className={INTRO}>{t("values.intro")}</p>
          <dl className="mt-6 border-t-[3px] border-ink">
            {VALUES.map((key) => (
              <div key={key} className="border-b border-line py-4">
                <dt className={ROW_NAME}>{t(`values.items.${key}.name`)}</dt>
                <dd className="mt-1.5 max-w-[58ch] text-grey">{t(`values.items.${key}.text`)}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section aria-labelledby="sites-title">
          <h2 id="sites-title" className={TITLE}>
            {t("sites.title")}
          </h2>
          <p className={INTRO}>{t("sites.intro")}</p>
          <ul className="mt-6 border-t-[3px] border-ink">
            {SITES.map((site) => (
              <li
                key={site.key}
                className="grid gap-x-5 gap-y-0.5 border-b border-line py-[13px] min-[561px]:grid-cols-[minmax(0,9em)_minmax(0,1fr)]"
              >
                <h3 className={`${ROW_NAME} min-[561px]:row-span-2`}>{site.name}</h3>
                <p className="text-ink">{t(`sites.roles.${site.key}`)}</p>
                <p className="inline-flex items-baseline gap-1.5 text-sm text-mute">
                  <MapPin className="size-[13px] shrink-0 translate-y-px" strokeWidth={2} aria-hidden="true" />
                  <span>
                    <span className="sr-only">{t("sites.address")}: </span>
                    {site.street}
                  </span>
                </p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
