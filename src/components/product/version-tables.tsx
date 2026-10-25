"use client";

import { useLocale, useTranslations } from "next-intl";

import type { Locale } from "@/i18n/routing";
import {
  KEY_FIGURES,
  SPEC_KEYS,
  SPEC_UNITS,
  VERSIONS,
  figure,
  sameAcross,
  specValue,
} from "@/lib/product-2112z";
import { cn } from "@/lib/utils";

import { setVersion, useVersion } from "./version-store";

const CELL = "border-b border-line px-2 py-2 text-right tabular-nums max-[640px]:px-[3px] max-[640px]:text-[0.8125rem]";
const ROW_HEAD = "pl-0 text-left font-display text-[0.9375rem] leading-[1.3] font-semibold text-ink max-[640px]:text-[0.8125rem]";

/**
 * "The three versions" beside the overview text: the five key figures side by
 * side, and each column head is a button that switches the version the whole
 * page shows. The chosen column is shaded and its head underlined in yellow.
 */
export function CompareTable() {
  const t = useTranslations("Product");
  const locale = useLocale() as Locale;
  const version = useVersion();

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[0.9375rem] text-ink">
          <caption className="sr-only">{t("overview.caption")}</caption>
          <thead>
            <tr>
              <td className="border-b-[3px] border-ink" />
              {VERSIONS.map((v) => {
                const on = v.id === version;
                return (
                  <th
                    key={v.id}
                    scope="col"
                    className={cn(
                      "border-b-[3px] px-2 pt-1 pb-1.5 align-bottom max-[640px]:px-[3px]",
                      on ? "border-yellow bg-paper" : "border-ink",
                    )}
                  >
                    <button
                      type="button"
                      aria-pressed={on}
                      onClick={() => setVersion(v.id)}
                      className="group ml-auto block min-h-11 text-right"
                    >
                      <span className="block font-display text-base leading-[1.1] font-extrabold whitespace-nowrap text-ink decoration-yellow decoration-2 underline-offset-4 group-hover:underline max-[640px]:text-[0.8125rem]">
                        {v.id}
                      </span>
                      <span className="mt-[3px] block text-sm leading-[1.3] font-medium text-mute max-[640px]:hidden">
                        {t("version.extensions", { count: v.telescope.count })}
                      </span>
                    </button>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {KEY_FIGURES.map((key) => (
              <tr key={key} className="hover:bg-paper">
                <th scope="row" className={cn(CELL, ROW_HEAD)}>
                  {t(`figures.${key}`)}
                </th>
                {VERSIONS.map((v) => (
                  <td
                    key={v.id}
                    className={cn(CELL, "whitespace-nowrap", v.id === version && "bg-paper font-bold")}
                  >
                    {figure(v, key, locale)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

/**
 * The full technical data, all three versions, in kesla.com's row order.
 * Rows where the versions differ are set heavier; the chosen version's
 * column is shaded. An empty cell on kesla.com is a dash here.
 */
export function SpecTable() {
  const t = useTranslations("Product");
  const version = useVersion();

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-base text-ink max-[640px]:text-sm">
          <caption className="sr-only">{t("spec.caption")}</caption>
          <thead>
            <tr>
              <td className="border-b-[3px] border-ink" />
              {VERSIONS.map((v) => (
                <th
                  key={v.id}
                  scope="col"
                  className={cn(
                    "border-b-[3px] border-ink px-3 pt-1 pb-2 text-right align-bottom max-[640px]:px-1.5",
                    v.id === version && "bg-paper",
                  )}
                >
                  <span className="block font-display text-[clamp(1.125rem,1.8vw,1.375rem)] leading-[1.1] font-extrabold whitespace-nowrap max-[640px]:text-[0.9375rem]">
                    {v.id}
                  </span>
                  <span className="mt-[3px] block text-sm leading-[1.3] font-medium text-mute max-[640px]:text-xs">
                    {t("version.extensions", { count: v.telescope.count })}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SPEC_KEYS.map((key) => {
              const same = sameAcross(key);
              return (
                <tr key={key} className="hover:bg-paper">
                  <th
                    scope="row"
                    className="border-b border-line py-[11px] pr-3 text-left font-display text-[0.9375rem] leading-[1.3] font-semibold max-[640px]:py-[9px] max-[640px]:text-sm"
                  >
                    {t(`spec.rows.${key}`)}
                    <span className="ml-1 font-medium text-mute">{SPEC_UNITS[key]}</span>
                  </th>
                  {VERSIONS.map((v) => {
                    const value = specValue(v, key);
                    return (
                      <td
                        key={v.id}
                        className={cn(
                          "border-b border-line px-3 py-[11px] text-right whitespace-nowrap tabular-nums max-[640px]:px-1.5 max-[640px]:py-[9px]",
                          value == null ? "text-mute" : same ? "text-grey" : "font-semibold",
                          v.id === version && "bg-paper",
                        )}
                      >
                        {value ?? (
                          <>
                            <span aria-hidden="true">–</span>
                            <span className="sr-only">{t("spec.none")}</span>
                          </>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
