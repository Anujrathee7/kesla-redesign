import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { CompanyHead } from "@/components/company/company-head";
import { CompanyHistory } from "@/components/company/company-history";
import { CompanyInvestors } from "@/components/company/company-investors";
import { CompanyManagement } from "@/components/company/company-management";
import { CompanyQuality } from "@/components/company/company-quality";
import { CompanySites } from "@/components/company/company-sites";
import { routing } from "@/i18n/routing";

type CompanyPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: CompanyPageProps): Promise<Metadata> {
  const { locale: requested } = await params;
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;
  const t = await getTranslations({ locale, namespace: "Company.meta" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

/**
 * Company, "Fact file": kesla.com's Company page as it is, put in order.
 * Facts in the head, then the sites, quality and certificates, the history
 * strip, the management team and the investor links, each reachable from
 * the head's chips. The specialist strip and footer come from the layout.
 */
export default async function CompanyPage({ params }: CompanyPageProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  return (
    <>
      <CompanyHead />
      <CompanySites />
      <CompanyQuality />
      <CompanyHistory />
      <CompanyManagement />
      <CompanyInvestors />
    </>
  );
}
