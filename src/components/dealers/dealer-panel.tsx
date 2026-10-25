"use client";

import { ArrowDown, ChevronRight, Search, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import type { Locale } from "@/i18n/routing";
import {
  BIGGEST,
  cardCount,
  companiesOf,
  dealerName,
  dealersOf,
  hostOf,
  matches,
  nameMatches,
  ownCompany,
  ownOf,
  phonesOf,
  telHref,
  titleCase,
  type Dealer,
  type DealerCountry,
} from "@/lib/dealers";

import { CallButton, EmptySlot, SquareLink } from "./contact-actions";
import { DealerCompany } from "./dealer-company";

const RULE = "border-b-[3px] border-ink pt-1.5 pb-3";
const BIG = "text-[clamp(1.75rem,3vw,2.5rem)] leading-none font-extrabold uppercase max-[561px]:text-[1.875rem]";

/** No country picked yet: the five countries with the most dealers. */
export function PanelStart({ onPick }: { onPick: (country: DealerCountry) => void }) {
  const t = useTranslations("Dealers");

  return (
    <div data-dealer-start="">
      <p className="mb-2 max-w-[44ch] pt-1.5 text-grey">{t("start.lead")}</p>
      <ul>
        {BIGGEST.map((code) => (
          <li key={code} className="border-t border-line last:border-b">
            <button
              type="button"
              onClick={() => onPick(code)}
              className="group flex w-full cursor-pointer items-center justify-between gap-3 pt-3 pb-[11px] text-left font-display text-[1.0625rem] leading-[1.2] font-bold tracking-[0.02em] text-ink uppercase pointer-coarse:min-h-11"
            >
              <span className="decoration-yellow decoration-2 underline-offset-4 group-hover:underline">
                {t(`countries.${code}`)}
              </span>
              <span className="inline-flex items-center gap-2 text-sm font-semibold tracking-normal text-mute normal-case tabular-nums">
                {cardCount(code)}
                <ChevronRight
                  className="size-4 transition-transform duration-200 ease-out-expo group-hover:translate-x-1 group-hover:text-ink"
                  strokeWidth={2.25}
                  aria-hidden="true"
                />
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * One country's dealers, "By company": the country heading with its counts
 * and a search, then each company once with its contacts by town. On desktop
 * the list scrolls inside the sticky panel, company names sticky in it; at
 * 1000px and below the panel runs in the page under the map, and only the
 * country heading and search stay sticky on top.
 */
export function DealerPanel({ country, onChangeCountry }: { country: DealerCountry; onChangeCountry: () => void }) {
  const t = useTranslations("Dealers");
  const name = t(`countries.${country}`);
  const all = useMemo(() => dealersOf(country), [country]);
  const own = useMemo(() => ownOf(country), [country]);

  const [query, setQuery] = useState("");
  const [opened, setOpened] = useState<ReadonlySet<string>>(new Set());
  const [more, setMore] = useState(false);
  const body = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);

  // Kesla GmbH sits above Germany's dealers; Finland's factory sales is in the page head.
  const pinned = useMemo(() => (country === "FI" ? [] : own.map(ownCompany)), [own, country]);
  const companies = useMemo(() => [...pinned, ...companiesOf(all)], [pinned, all]);

  const q = query.trim();
  const visible = companies
    .map((company) => {
      const items = q && !nameMatches(company.name, q) ? company.items.filter((d) => matches(d, q)) : company.items;
      return { company, items };
    })
    .filter(({ items }) => items.length > 0);
  const shownCount = visible.filter(({ company }) => !company.own).reduce((n, { items }) => n + items.length, 0);

  // The "Scroll for more" cue shows while the desktop list has more below.
  const cue = useCallback(() => {
    const box = body.current;
    if (!box) return;
    setMore(box.scrollHeight - box.clientHeight - box.scrollTop >= 8);
  }, []);

  useLayoutEffect(cue, [cue, query, opened]);

  useEffect(() => {
    const box = body.current;
    if (!box) return;
    const observer = new ResizeObserver(cue);
    observer.observe(box);
    return () => observer.disconnect();
  }, [cue]);

  function search(value: string) {
    setQuery(value);
    if (body.current) body.current.scrollTop = 0;
  }

  function clear() {
    search("");
    input.current?.focus();
  }

  const heading = (
    <div className="shrink-0 bg-white max-[1001px]:sticky max-[1001px]:top-0 max-[1001px]:z-[5] max-[1001px]:pb-0.5 max-[1001px]:shadow-[0_1px_0_var(--color-line)]">
      {/* Desktop: name left, count right. Phones: name and "Change country" on one row, the count under them. */}
      <div className={`flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 ${RULE}`}>
        <h2 id="dealer-panel-title" className={`min-w-0 ${BIG}`}>
          {name}
        </h2>
        <p className="font-display text-[0.9375rem] leading-[1.2] font-semibold whitespace-nowrap text-mute max-[1001px]:order-last max-[1001px]:basis-full [&_b]:font-bold [&_b]:text-ink">
          {all.length === 0 ? t("panel.direct") : t.rich("panel.count", { count: all.length, b: (c) => <b>{c}</b> })}
        </p>
        <button
          type="button"
          onClick={onChangeCountry}
          className="hidden min-h-11 shrink-0 cursor-pointer items-center py-2.5 font-display text-sm leading-none font-semibold text-ink underline decoration-yellow decoration-2 underline-offset-4 max-[1001px]:inline-flex max-[1001px]:self-center"
        >
          {t("panel.change")}
        </button>
      </div>
      {all.length > 1 && (
        <div role="search" className="relative mt-3.5">
          <Search
            className="pointer-events-none absolute top-1/2 left-3.5 size-[18px] -translate-y-1/2 text-mute"
            strokeWidth={2.4}
            aria-hidden="true"
          />
          <input
            ref={input}
            type="search"
            value={query}
            onChange={(event) => search(event.target.value)}
            aria-label={t("panel.search")}
            placeholder={t("panel.search")}
            autoComplete="off"
            spellCheck={false}
            className="h-12 w-full appearance-none rounded-none bg-white pt-0.5 pr-[46px] pl-11 text-base font-medium text-ink shadow-[inset_0_0_0_1px_var(--color-line-strong)] placeholder:text-mute focus:shadow-[inset_0_0_0_3px_var(--color-yellow)] focus:outline-none [&::-webkit-search-cancel-button]:appearance-none"
          />
          {query && (
            <button
              type="button"
              onClick={clear}
              aria-label={t("panel.clear")}
              className="absolute top-1 right-1 grid size-10 cursor-pointer place-items-center text-ink focus-visible:outline-ink focus-visible:-outline-offset-3"
            >
              <X className="size-4" strokeWidth={2.6} aria-hidden="true" />
            </button>
          )}
        </div>
      )}
    </div>
  );

  // India and Malaysia: no dealer, only Kesla's own sales people.
  if (all.length === 0) {
    return (
      <div>
        {heading}
        {own.map((d) => (
          <OwnStrip key={d.id} dealer={d} />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col min-[1001px]:max-h-[calc(100vh-32px)]">
      {heading}
      <p aria-live="polite" className="shrink-0 pt-2.5 pb-2 text-sm leading-[1.4] text-mute empty:p-0 [&_b]:font-semibold [&_b]:text-ink">
        {shownCount !== all.length
          ? t.rich("panel.showing", { shown: shownCount, total: all.length, b: (c) => <b>{c}</b> })
          : null}
      </p>
      <div className="relative flex min-h-0 flex-1 flex-col">
        <div
          ref={body}
          role="region"
          tabIndex={0}
          aria-label={t("panel.region", { country: name })}
          onScroll={cue}
          className="min-h-0 flex-1 overflow-y-auto overscroll-contain border-t border-line pr-2.5 [scrollbar-color:var(--color-line-strong)_var(--color-paper)] [scrollbar-width:auto] max-[1001px]:overflow-visible max-[1001px]:border-t-0 max-[1001px]:pr-0 [&::-webkit-scrollbar]:w-2.5 [&::-webkit-scrollbar-thumb]:bg-line-strong [&::-webkit-scrollbar-track]:bg-paper"
        >
          {visible.length > 0 ? (
            visible.map(({ company, items }) => (
              <DealerCompany
                key={company.key}
                company={company}
                items={items}
                folded={!q && !opened.has(company.key)}
                onShowAll={() => setOpened(new Set(opened).add(company.key))}
              />
            ))
          ) : (
            <div className="py-[22px]">
              <p className="font-display text-[1.1875rem] leading-[1.2] font-extrabold text-ink uppercase">
                {t("panel.none")}
              </p>
              <p className="mt-1.5 text-[0.9375rem]">{t("panel.noneBody", { country: name })}</p>
              <Button type="button" variant="outline-ink" size="sm" onClick={clear} className="mt-3 max-sm:min-h-11">
                {t("panel.noneClear")}
              </Button>
            </div>
          )}
        </div>
        {more && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute right-2.5 bottom-0 left-0 flex h-16 items-end justify-center gap-1.5 bg-linear-to-b from-white/0 to-white to-70% pb-2 font-display text-[0.8125rem] leading-none font-semibold tracking-[0.02em] text-ink max-[1001px]:hidden"
          >
            <ArrowDown className="size-3" strokeWidth={2.5} />
            {t("panel.more")}
          </div>
        )}
      </div>
    </div>
  );
}

/** One of Kesla's own sales people, as a black strip with the call button. */
function OwnStrip({ dealer: d }: { dealer: Dealer }) {
  const t = useTranslations("Dealers");
  const locale = useLocale() as Locale;
  const main = phonesOf(d)[0];
  const where = /joensuu/i.test(d.town)
    ? t("factory.where")
    : titleCase(d.town.replace(/\s*\/\s*FI$/i, ""));
  const who = [dealerName(d, locale), d.person].filter(Boolean).join(", ");

  return (
    <aside
      aria-label={who}
      className="cut mt-3.5 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3.5 gap-y-1.5 bg-black py-3.5 pr-4 pl-[18px] text-on-dark [--cut:16px] [&+&]:mt-2 max-[561px]:pr-3 max-[561px]:pl-3.5"
    >
      <div className="min-w-0">
        <p className="font-display text-[1.0625rem] leading-[1.2] font-bold text-white">{who}</p>
        <p className="mt-0.5 text-sm text-on-dark-mute">
          {where}
          {main && (
            <>
              {" · "}
              <span className="text-on-dark tabular-nums">{main[1]}</span>
            </>
          )}
        </p>
      </div>
      <div className="flex items-center gap-1.5">
        {main && (
          <CallButton
            href={telHref(main[1], d.country)}
            number={main[1]}
            label={t("company.call", { who, number: main[1] })}
            className="focus-visible:outline-white"
          />
        )}
        {d.email[0] ? (
          <SquareLink href={`mailto:${d.email[0]}`} kind="email" dark label={t("company.email", { address: d.email[0] })} />
        ) : d.web[0] ? (
          <SquareLink href={d.web[0]} kind="web" dark label={t("company.website", { host: hostOf(d.web[0]) })} />
        ) : (
          <EmptySlot />
        )}
      </div>
    </aside>
  );
}
