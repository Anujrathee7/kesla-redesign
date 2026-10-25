import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { HomeMedia } from "@/components/home/home-media";
import { NewsHead } from "@/components/news/news-head";
import { NewsTopics } from "@/components/news/news-topics";
import { routing } from "@/i18n/routing";

type NewsPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: NewsPageProps): Promise<Metadata> {
  const { locale: requested } = await params;
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;
  const t = await getTranslations({ locale, namespace: "News.meta" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

/**
 * News, "For buyers": kesla.com's news, press releases and events in one
 * list, sorted by what a machine buyer needs from it. New machines first with
 * the F-series release as the lead, then the fairs on black, dealer and parts
 * notices, company releases and careers. A topic filter narrows it to one
 * section. The videos close the page; the specialist strip and footer come
 * from the layout.
 */
export default async function NewsPage({ params }: NewsPageProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  return (
    <>
      <NewsHead />
      <NewsTopics />
      <HomeMedia />
    </>
  );
}
