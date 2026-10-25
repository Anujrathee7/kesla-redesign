import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { HomeFamilies } from "@/components/home/home-families";
import { HomeHero } from "@/components/home/home-hero";
import { HomeHighlights } from "@/components/home/home-highlights";
import { HomeMedia } from "@/components/home/home-media";
import { HomeNews } from "@/components/home/home-news";
import { routing } from "@/i18n/routing";

type HomePageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: HomePageProps): Promise<Metadata> {
  const { locale: requested } = await params;
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;
  const t = await getTranslations({ locale, namespace: "Home.meta" });

  return {
    title: { absolute: t("title") },
    description: t("description"),
  };
}

/**
 * Frontpage: who Kesla is, the three product families, the current
 * highlight, news, then the videos.
 * The specialist strip and footer come from the layout.
 */
export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  return (
    <>
      <HomeHero />
      <HomeFamilies />
      <HomeHighlights />
      <HomeNews />
      <HomeMedia />
    </>
  );
}
