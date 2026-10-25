import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { DealerFinder } from "@/components/dealers/dealer-finder";
import { DealersHead } from "@/components/dealers/dealers-head";
import { HomeMedia } from "@/components/home/home-media";
import { routing } from "@/i18n/routing";
import { pendingScript } from "@/lib/dealers";

type DealersPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: DealersPageProps): Promise<Metadata> {
  const { locale: requested } = await params;
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;
  const t = await getTranslations({ locale, namespace: "Dealers.meta" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

/**
 * Dealers, the Map page with the "By company" panel: Europe as a map with
 * dealer counts, the countries outside Europe as a list under it, and the
 * picked country's dealers grouped by company beside it. Kesla's factory
 * sales sits in the head. The dealer list is drawn in the browser from the
 * card data, since the search filters it as the visitor types; the inline
 * script keeps a deep link (#fi) from flashing "Pick a country" first. The
 * specialist strip and footer come from the layout.
 */
export default async function DealersPage({ params }: DealersPageProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  return (
    <>
      <DealersHead />
      <script dangerouslySetInnerHTML={{ __html: pendingScript() }} />
      <DealerFinder />
      <HomeMedia />
    </>
  );
}
