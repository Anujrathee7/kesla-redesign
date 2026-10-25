import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { CareerFunctions } from "@/components/career/career-functions";
import { CareerHead } from "@/components/career/career-head";
import { CareerJobs } from "@/components/career/career-jobs";
import { CareerValuesSites } from "@/components/career/career-values-sites";
import { HomeMedia } from "@/components/home/home-media";
import { routing } from "@/i18n/routing";

type CareerPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: CareerPageProps): Promise<Metadata> {
  const { locale: requested } = await params;
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;
  const t = await getTranslations({ locale, namespace: "Career.meta" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

/**
 * Career, "Jobs first": the open positions sit in the head, because a job
 * seeker comes for them. Each posting then opens with pay, deadline, contact
 * and how to apply, followed by the five kinds of work, the values and the
 * sites. The videos, specialist strip and footer close the page as on the
 * Company page.
 */
export default async function CareerPage({ params }: CareerPageProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  return (
    <>
      <CareerHead />
      <CareerJobs />
      <CareerFunctions />
      <CareerValuesSites />
      <HomeMedia />
    </>
  );
}
