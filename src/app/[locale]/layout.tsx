import type { Metadata } from "next";
import { Exo_2, Hind } from "next/font/google";
import { notFound } from "next/navigation";
import { locale as rootLocale } from "next/root-params";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations } from "next-intl/server";

import { SiteFooter } from "@/components/site/footer";
import { SiteHeader } from "@/components/site/header";
import { SpecialistStrip } from "@/components/site/specialist-strip";
import { routing } from "@/i18n/routing";

import "../globals.css";

// Exo stands in for kesla.com's "Exo SemiBold" headings, Hind for its Frutiger body text.
const exo = Exo_2({
  subsets: ["latin", "latin-ext"],
  weight: ["500", "600", "700", "800"],
  style: ["normal", "italic"],
  variable: "--font-exo",
  display: "swap",
});

const hind = Hind({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  variable: "--font-hind",
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Common.meta");

  return {
    title: { default: t("title"), template: t("titleTemplate") },
    description: t("description"),
    applicationName: t("siteName"),
    // Concept redesign, not the official site: keep it out of search results.
    robots: { index: false, follow: false },
    metadataBase: new URL("https://kesla-redesign.vercel.app"),
    // The link preview (WhatsApp, LinkedIn) must say up front that this is a concept.
    openGraph: {
      type: "website",
      siteName: "Kesla redesign concept",
      title: "Kesla website redesign concept by Anuj Rathee",
      description: "Unofficial redesign concept. Not Kesla's site.",
      images: [
        {
          url: "/images/hero-truck-crane.jpg",
          width: 1540,
          height: 640,
          alt: "Kesla truck crane",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Kesla website redesign concept by Anuj Rathee",
      description: "Unofficial redesign concept. Not Kesla's site.",
      images: ["/images/hero-truck-crane.jpg"],
    },
  };
}

export default async function LocaleLayout({ children }: { children: React.ReactNode }) {
  const locale = await rootLocale();
  if (!hasLocale(routing.locales, locale)) notFound();

  const t = await getTranslations("Common");

  return (
    <html lang={locale} className={`${exo.variable} ${hind.variable}`}>
      <body className="flex min-h-dvh flex-col">
        <a
          href="#main"
          className="sr-only z-50 bg-yellow px-3 py-2 caps text-black focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
        >
          {t("skipToContent")}
        </a>
        <NextIntlClientProvider>
          <SiteHeader />
          <main id="main" className="flex-1">
            {children}
          </main>
          <SpecialistStrip />
          <SiteFooter />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
