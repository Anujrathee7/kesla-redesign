"use client";

import { ArrowRight, ChevronDown } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";

import type { Locale } from "@/i18n/routing";
import { dealerName, hostOf, isDealerCountry, phonesOf, telHref, type DealerCountry } from "@/lib/dealers";
import { CRANE_COUNTRIES, DEFAULT_DEALER_COUNTRY, craneDealersOf } from "@/lib/product-dealers";
import { localHref } from "@/lib/routes";

const CONTACT =
  "inline-flex items-center text-ink decoration-line decoration-2 underline-offset-4 underline transition-[text-decoration-color] duration-200 hover:decoration-yellow max-[640px]:min-h-11";

/**
 * Pick a country, see the dealers there who sell Kesla cranes, call or write.
 * Opens on Finland. The full finder, with the map and the search, is the
 * Dealers page, one link away.
 */
export function ProductDealerList() {
  const t = useTranslations("Product.dealers");
  const td = useTranslations("Dealers");
  const locale = useLocale() as Locale;
  const [country, setCountry] = useState<DealerCountry>(DEFAULT_DEALER_COUNTRY);

  const name = (code: DealerCountry) => td(`countries.${code}`);
  const collator = new Intl.Collator(locale);
  const countries = [...CRANE_COUNTRIES].sort((a, b) => collator.compare(name(a), name(b)));
  const dealers = craneDealersOf(country);

  return (
    <div>
      <label htmlFor="product-dealer-country" className="mb-2 block caps text-ink">
        {t("country")}
      </label>
      <div className="relative">
        <select
          id="product-dealer-country"
          value={country}
          onChange={(event) => {
            const value = event.target.value;
            if (isDealerCountry(value)) setCountry(value);
          }}
          className="w-full cursor-pointer appearance-none rounded-none border-2 border-ink bg-white py-[13px] pr-11 pl-3.5 font-sans text-lg leading-[1.2] font-medium text-ink"
        >
          {countries.map((code) => (
            <option key={code} value={code}>
              {td("picker.option", { country: name(code), count: craneDealersOf(code).length })}
            </option>
          ))}
        </select>
        <ChevronDown
          className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-ink"
          strokeWidth={2.5}
          aria-hidden="true"
        />
      </div>

      <p aria-live="polite" className="mt-5 mb-2 text-[0.9375rem] text-mute">
        {t("count", { count: dealers.length, country: name(country) })}
      </p>
      <ul>
        {dealers.map((d) => {
          const phones = phonesOf(d);
          const dealer = dealerName(d, locale);
          const who = d.person ? `${dealer} / ${d.person}` : dealer;
          return (
            <li
              key={d.id}
              className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-x-4 gap-y-1 border-t border-line py-3 last:border-b max-[480px]:grid-cols-1"
            >
              <div className="min-w-0">
                <p className="font-display text-base leading-[1.3] font-bold text-ink [overflow-wrap:anywhere]">{who}</p>
                <p className="text-sm text-mute">{d.address.join(", ")}</p>
              </div>
              <div className="flex flex-col items-end gap-0.5 text-[0.9375rem] max-[480px]:items-start">
                {phones.map(([, number]) => (
                  <a
                    key={number}
                    href={telHref(number, d.country)}
                    aria-label={t("call", { who: dealer, number })}
                    className={`${CONTACT} font-semibold whitespace-nowrap tabular-nums`}
                  >
                    {number}
                  </a>
                ))}
                {d.email.map((address) => (
                  <a
                    key={address}
                    href={`mailto:${address}`}
                    aria-label={t("email", { address })}
                    className={`${CONTACT} text-sm [overflow-wrap:anywhere]`}
                  >
                    {address}
                  </a>
                ))}
                {d.web.slice(0, 1).map((url) => (
                  <a
                    key={url}
                    href={url}
                    target="_blank"
                    rel="noopener"
                    aria-label={t("website", { host: hostOf(url) })}
                    className={`${CONTACT} text-sm`}
                  >
                    {hostOf(url)}
                  </a>
                ))}
              </div>
            </li>
          );
        })}
      </ul>

      <a
        href={`${localHref("dealers", locale)}#${country.toLowerCase()}`}
        className="relative mt-6 inline-flex items-center gap-1.5 font-display font-semibold text-ink link-wipe after:absolute after:inset-x-0 after:-inset-y-2.5 after:content-['']"
      >
        {t("all")}
        <ArrowRight className="size-4" strokeWidth={2.5} aria-hidden="true" />
      </a>
    </div>
  );
}
