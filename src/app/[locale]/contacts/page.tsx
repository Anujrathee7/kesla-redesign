import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { ContactsDoors } from "@/components/contacts/contacts-doors";
import { ContactsHead } from "@/components/contacts/contacts-head";
import { ContactsOther } from "@/components/contacts/contacts-other";
import { ServicePoints } from "@/components/contacts/service-points";
import { HomeMedia } from "@/components/home/home-media";
import { routing } from "@/i18n/routing";

type ContactsPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: ContactsPageProps): Promise<Metadata> {
  const { locale: requested } = await params;
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;
  const t = await getTranslations({ locale, namespace: "Contacts.meta" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

/**
 * Contacts, "Three doors" with the "Table" service point list: spare part
 * sales in the black head, three doors (service and warranty, chipper parts,
 * outside Finland), the 45 service points in Finland as a table grouped by
 * region, then the other contacts beside the contact request form on white.
 * The specialist strip and footer come from the layout.
 */
export default async function ContactsPage({ params }: ContactsPageProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  return (
    <>
      <ContactsHead />
      <ContactsDoors />
      <ServicePoints />
      <ContactsOther />
      <HomeMedia />
    </>
  );
}
