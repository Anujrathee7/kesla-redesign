"use client";

import { ChevronDown } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";

import type { Locale } from "@/i18n/routing";
import { dealerName, hostOf, isDealerCountry, phonesOf, telHref, type DealerCountry } from "@/lib/dealers";
import { CRANE_COUNTRIES, DEFAULT_DEALER_COUNTRY, craneDealersOf } from "@/lib/product-dealers";

const CONTACT =
  "text-ink underline decoration-line decoration-2 underline-offset-4 hover:decoration-yellow pointer-coarse:inline-flex pointer-coarse:min-h-11 pointer-coarse:items-center";

/**
 * The country dropdown and that country's crane dealers, from the same
 * source as the Product page (`craneDealersOf`): Kesla's own sales first,
 * then the dealers in town order. Finland is picked first.
 */
export function TimberDealerList() {
  const t = useTranslations("TimberCranes.dealers");
  const tc = useTranslations("Dealers.countries");
  const locale = useLocale() as Locale;
  const [country, setCountry] = useState<DealerCountry>(DEFAULT_DEALER_COUNTRY);

  const countries = [...CRANE_COUNTRIES].sort((a, b) => tc(a).localeCompare(tc(b), locale));
  const dealers = craneDealersOf(country);

  return (
    <div>
      <label htmlFor="tc-dealer-country" className="mb-2 block caps text-ink">
        {t("country")}
      </label>
      <div className="relative">
        <select
          id="tc-dealer-country"
          value={country}
          onChange={(event) => {
            const value = event.target.value;
            if (isDealerCountry(value)) setCountry(value);
          }}
          className="w-full cursor-pointer appearance-none rounded-none border-2 border-ink bg-white py-3 pr-11 pl-3.5 font-sans text-lg leading-[1.2] font-medium text-ink"
        >
          {countries.map((code) => (
            <option key={code} value={code}>
              {t("option", { country: tc(code), count: craneDealersOf(code).length })}
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
        {t("count", { count: dealers.length, country: tc(country) })}
      </p>
      <ul>
        {dealers.map((d) => (
          <li
            key={d.id}
            className="grid gap-x-6 gap-y-1.5 border-t border-line py-4 last:border-b min-[561px]:grid-cols-[minmax(0,1fr)_auto]"
          >
            <div>
              <h3 className="font-display text-[1.0625rem] leading-[1.2] font-bold text-ink">
                {d.person ? `${dealerName(d, locale)} / ${d.person}` : dealerName(d, locale)}
              </h3>
              <address className="mt-1 text-[0.9375rem] not-italic">{d.address.join(", ")}</address>
            </div>
            <div className="flex flex-col items-start gap-1.5 text-[0.9375rem] min-[561px]:items-end min-[561px]:text-right">
              {phonesOf(d).map(([, number]) => (
                <a
                  key={number}
                  href={telHref(number, d.country)}
                  className={`${CONTACT} font-semibold whitespace-nowrap tabular-nums`}
                >
                  {number}
                </a>
              ))}
              {d.email.map((address) => (
                <a key={address} href={`mailto:${address}`} className={`${CONTACT} [overflow-wrap:anywhere]`}>
                  {address}
                </a>
              ))}
              {d.web.slice(0, 1).map((url) => (
                <a key={url} href={url} target="_blank" rel="noopener" className={`${CONTACT} whitespace-nowrap`}>
                  {hostOf(url)}
                </a>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
