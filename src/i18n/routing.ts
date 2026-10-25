import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "fi"],
  // kesla.com opens in English (/en/frontpage), so the redesign does too.
  defaultLocale: "en",
  localePrefix: "always",
  // `/` always goes to `/en`; the visitor switches language explicitly.
  localeDetection: false,
});

export type Locale = (typeof routing.locales)[number];
