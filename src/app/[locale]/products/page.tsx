import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { FamilyPanel } from "@/components/products/family-selection";
import { ProductsFamily } from "@/components/products/products-family";
import { ProductsHead } from "@/components/products/products-head";
import { ProductsPicker } from "@/components/products/products-picker";
import { routing } from "@/i18n/routing";
import { FAMILY_KEYS } from "@/lib/routes";

type ProductsPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: ProductsPageProps): Promise<Metadata> {
  const { locale: requested } = await params;
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;
  const t = await getTranslations({ locale, namespace: "Products.meta" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

/**
 * Products, "Photo beside": the buyer picks the base machine they have and
 * sees the Kesla equipment that fits it. All three family panels are rendered
 * here on the server; the picker only decides which one is shown. The
 * specialist strip and footer come from the layout.
 */
export default async function ProductsPage({ params }: ProductsPageProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  return (
    <>
      <ProductsHead />
      <ProductsPicker />
      <div className="pt-[clamp(40px,5vw,64px)]">
        {FAMILY_KEYS.map((family) => (
          <FamilyPanel key={family} family={family}>
            <ProductsFamily family={family} />
          </FamilyPanel>
        ))}
      </div>
    </>
  );
}
