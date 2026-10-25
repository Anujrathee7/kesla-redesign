import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { HomeMedia } from "@/components/home/home-media";
import { CountryPanel } from "@/components/references/country-selection";
import { ReferencesCountry } from "@/components/references/references-country";
import { ReferencesHead } from "@/components/references/references-head";
import type { StoryContext } from "@/components/references/story-parts";
import { routing } from "@/i18n/routing";
import { COUNTRIES } from "@/lib/reference-stories";
import { COUNTRY_CODES, type CountryCode } from "@/lib/references";

type ReferencesPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: ReferencesPageProps): Promise<Metadata> {
  const { locale: requested } = await params;
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;
  const t = await getTranslations({ locale, namespace: "References.meta" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

/**
 * References, "Picker in the head": the visitor picks the country closest to
 * where they work and sees its customers' stories, newest first by product
 * group. All ten country panels are rendered here on the server; the picker
 * only decides which one is shown. The specialist strip and footer come from
 * the layout.
 */
export default async function ReferencesPage({ params }: ReferencesPageProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations("References");
  const ctx: StoryContext = {
    locale,
    countries: Object.fromEntries(COUNTRY_CODES.map((code) => [code, t(`countries.${code}`)])) as Record<
      CountryCode,
      string
    >,
    video: t("video"),
    otherLanguage: t("otherLanguage"),
    watchVideo: (title) => t("watchRow", { title }),
  };

  return (
    <>
      <ReferencesHead />
      <div className="gutter">
        <div className="wrap pt-[clamp(32px,4vw,56px)] pb-[clamp(56px,7vw,96px)]">
          {COUNTRIES.map(({ code }) => (
            <CountryPanel key={code} country={code}>
              <ReferencesCountry country={code} ctx={ctx} />
            </CountryPanel>
          ))}
        </div>
      </div>
      <HomeMedia />
    </>
  );
}
