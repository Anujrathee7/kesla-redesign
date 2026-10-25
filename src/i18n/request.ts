import { hasLocale, type Messages } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { locale as rootLocale } from "next/root-params";
import { routing, type Locale } from "./routing";

// Must list exactly the namespaces typed in `src/global.d.ts`: `satisfies`
// fails the type check if one side gains or loses a namespace.
const NAMESPACES = {
  Common: "common",
  Home: "home",
  Products: "products",
  Company: "company",
  References: "references",
  Dealers: "dealers",
  TimberCranes: "timber-cranes",
  Career: "career",
  News: "news",
  Contacts: "contacts",
  Product: "product",
} as const satisfies Record<keyof Messages, string>;

async function loadMessages(locale: Locale) {
  const entries = await Promise.all(
    Object.entries(NAMESPACES).map(async ([namespace, file]) => {
      const mod = await import(`../messages/${locale}/${file}.json`);
      return [namespace, mod.default] as const;
    }),
  );
  return Object.fromEntries(entries);
}

export default getRequestConfig(async ({ locale: override }) => {
  // An explicit `getTranslations({locale})` wins; otherwise read the
  // `[locale]` root segment (static-friendly, no headers involved).
  const candidate = override ?? (await rootLocale());
  const locale: Locale = hasLocale(routing.locales, candidate)
    ? candidate
    : routing.defaultLocale;

  return {
    locale,
    timeZone: "Europe/Helsinki",
    messages: await loadMessages(locale),
  };
});
