import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { OfferBar } from "@/components/product/offer-bar";
import { ProductDealers } from "@/components/product/product-dealers";
import { ProductHead } from "@/components/product/product-head";
import { ProductMedia } from "@/components/product/product-media";
import {
  DownloadsPanel,
  FaqPanel,
  OptionsPanel,
  OverviewPanel,
  TechnicalPanel,
  VideosPanel,
} from "@/components/product/product-panels";
import { ProductTabs, type ProductTab } from "@/components/product/product-tabs";
import { routing } from "@/i18n/routing";

type ProductPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { locale: requested } = await params;
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;
  const t = await getTranslations({ locale, namespace: "Product.meta" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

/**
 * KESLA 2112Z, "Black head" (tab C of variants/product-offer-variants.html),
 * chosen by Anuj on 19 October 2026 without the black offer strip that
 * followed the tabs on desktop. A full-width black head with the photos and
 * the offer card, six tabs under it, the crane dealers, and the 2112's own
 * videos. The version picked in the card drives every figure on the page.
 * The specialist strip and footer come from the layout.
 */
export default async function ProductPage({ params }: ProductPageProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations("Product.tabs");
  const tabs: ProductTab[] = [
    { key: "overview", label: t("overview"), panel: <OverviewPanel /> },
    { key: "technical-data", label: t("technical"), panel: <TechnicalPanel /> },
    { key: "options", label: t("options"), panel: <OptionsPanel /> },
    { key: "videos", label: t("videos"), panel: <VideosPanel /> },
    { key: "downloads", label: t("downloads"), panel: <DownloadsPanel /> },
    { key: "faq", label: t("faq"), panel: <FaqPanel /> },
  ];

  return (
    <>
      <ProductHead />
      <ProductTabs label={t("label")} tabs={tabs} />
      <ProductDealers />
      <ProductMedia />
      <OfferBar />
    </>
  );
}
