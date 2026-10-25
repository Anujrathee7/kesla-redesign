import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { ModelFinder } from "@/components/timber-cranes/model-finder";
import { TimberDealers } from "@/components/timber-cranes/timber-dealers";
import { TimberHead } from "@/components/timber-cranes/timber-head";
import { TimberMedia } from "@/components/timber-cranes/timber-media";
import { TimberFeatures, TimberHelp } from "@/components/timber-cranes/timber-more";
import { routing } from "@/i18n/routing";

type TimberCranesPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: TimberCranesPageProps): Promise<Metadata> {
  const { locale: requested } = await params;
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;
  const t = await getTranslations({ locale, namespace: "TimberCranes.meta" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

/**
 * Timber cranes, "Current" Model finder: the category head, then every
 * timber crane model in a ruled list beside a filter rail (boom, outreach,
 * lifting torque, hydraulics), then kesla.com's features, questions,
 * brochures and datasheets, the dealers by country and the videos. The
 * specialist strip and footer come from the layout.
 */
export default async function TimberCranesPage({ params }: TimberCranesPageProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  return (
    <>
      <TimberHead />
      <ModelFinder />
      <TimberFeatures />
      <TimberHelp />
      <TimberDealers />
      <TimberMedia />
    </>
  );
}
