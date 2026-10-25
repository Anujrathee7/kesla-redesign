import { ChevronRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { COUNTRIES } from "@/lib/reference-stories";

import { CountryPicker, type CountryOption } from "./country-picker";

/**
 * The short black head: breadcrumb, title and intro, then the ten countries
 * as tiles, so the first screen holds the countries and the newest video
 * together. Copy is resolved here so the client picker ships no messages.
 */
export async function ReferencesHead() {
  const t = await getTranslations("References");

  const options: CountryOption[] = COUNTRIES.map(({ code, count }) => ({
    code,
    name: t(`countries.${code}`),
    count: t("stories", { count }),
    status: t("picker.status", { country: t(`countries.${code}`) }),
  }));

  return (
    <section aria-labelledby="references-title" className="bg-black text-on-dark gutter">
      <div className="wrap pt-[clamp(24px,3vw,40px)] pb-[clamp(24px,3vw,36px)]">
        <nav aria-label={t("breadcrumb.label")}>
          <ol className="mb-3 flex items-center gap-2 font-display text-lg leading-[1.2] font-semibold text-on-dark">
            <li className="flex items-center gap-2">
              <Link
                href="/"
                className="relative text-on-dark-mute transition-colors after:absolute after:-inset-x-1 after:-inset-y-3 after:content-[''] hover:text-yellow"
              >
                {t("breadcrumb.home")}
              </Link>
              <ChevronRight className="size-3 shrink-0 text-on-dark-mute" strokeWidth={2.5} aria-hidden="true" />
            </li>
            <li aria-current="page">{t("meta.title")}</li>
          </ol>
        </nav>
        <div className="grid items-end gap-x-[clamp(32px,5vw,80px)] gap-y-3 min-[1001px]:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          <h1
            id="references-title"
            className="text-[clamp(2.25rem,4.4vw,3.75rem)] leading-[0.95] font-extrabold tracking-[-0.015em] text-white uppercase"
          >
            {t("meta.title")}
          </h1>
          <p className="max-w-[54ch] text-[1.0625rem] text-on-dark">{t("intro")}</p>
        </div>
        <CountryPicker label={t("picker.label")} options={options} />
      </div>
    </section>
  );
}
