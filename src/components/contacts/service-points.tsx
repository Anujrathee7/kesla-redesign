"use client";

import { ArrowUpRight, Mail, Phone, Search, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import type { Locale } from "@/i18n/routing";
import {
  AREA_COUNTS,
  AREA_KEYS,
  AREA_NAMES,
  domainOf,
  filterService,
  pick,
  SERVICE,
  telHref,
  type AreaKey,
  type ServicePoint,
} from "@/lib/contacts";
import { cn } from "@/lib/utils";

const GAP = "pr-[clamp(14px,1.8vw,24px)]";
const TEL =
  "font-display font-semibold text-ink tabular-nums whitespace-nowrap underline decoration-line decoration-2 underline-offset-[5px] transition-[text-decoration-color] duration-200 ease-out hover:decoration-yellow focus-visible:outline-offset-3";
/** A number that cannot be dialled as printed: the same type as TEL, no underline. */
const TEL_PLAIN = "font-display font-semibold text-ink tabular-nums whitespace-nowrap";
const TEXT_LINK =
  "text-ink underline decoration-line decoration-2 underline-offset-[5px] [overflow-wrap:anywhere] transition-[text-decoration-color] duration-200 ease-out hover:decoration-yellow focus-visible:outline-offset-3";

/**
 * Service points in Finland, list D "Table": a search and four region
 * buttons, then one table grouped by region with Town, Workshop, Phone,
 * Email and Website columns. Every value is a plain tel:, mailto: or https
 * link, with no buttons and no yellow; each extra number sits on its own line
 * with its label. A number printed without an area code is plain text. At 1000px and below each workshop stacks into lines tall
 * enough to tap, under sticky region headings.
 */
export function ServicePoints() {
  const t = useTranslations("Contacts.points");
  const [query, setQuery] = useState("");
  const [area, setArea] = useState<AreaKey | "all">("all");
  const input = useRef<HTMLInputElement>(null);

  const list = filterService(area, query);
  const groups = AREA_KEYS.map((key) => ({ key, items: list.filter((s) => s.area === key) })).filter(
    ({ items }) => items.length > 0,
  );

  function showAll() {
    setQuery("");
    setArea("all");
    input.current?.focus();
  }

  const areaButtons: { key: AreaKey | "all"; text: string; count: number }[] = [
    { key: "all", text: t("all"), count: SERVICE.length },
    ...AREA_KEYS.map((key) => ({ key, text: t(`short.${key}`), count: AREA_COUNTS[key] })),
  ];

  return (
    <section id="service-points" aria-labelledby="service-points-title" className="scroll-mt-4 gutter">
      <div className="wrap pt-[clamp(44px,6vw,80px)] pb-[clamp(56px,8vw,104px)]">
        <h2
          id="service-points-title"
          className="mb-3 text-[clamp(1.625rem,3vw,2.5rem)] leading-none font-extrabold uppercase"
        >
          {t("title")}
        </h2>
        <p className="max-w-[62ch]">{t("intro")}</p>

        <div className="mt-[clamp(20px,2.4vw,28px)] grid items-end gap-x-5 gap-y-3 min-[1001px]:grid-cols-[minmax(0,1fr)_auto]">
          <div role="search">
            <label htmlFor="service-search" className="mb-2 block caps text-ink">
              {t("search")}
            </label>
            <div className="relative">
              <Search
                className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-mute"
                strokeWidth={2.4}
                aria-hidden="true"
              />
              <input
                ref={input}
                id="service-search"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={t("placeholder")}
                autoComplete="off"
                spellCheck={false}
                aria-controls="service-results"
                className="h-[54px] w-full appearance-none rounded-none bg-white pt-0.5 pr-12 pl-12 font-display text-lg leading-[1.2] font-semibold text-ink caret-ink shadow-[inset_0_0_0_1px_var(--color-line-strong)] placeholder:font-medium placeholder:text-mute focus:shadow-[inset_0_0_0_1px_var(--color-ink),0_0_0_3px_var(--color-yellow)] focus:outline-none max-[721px]:h-[52px] max-[721px]:text-[1.0625rem] [&::-webkit-search-cancel-button]:appearance-none"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    input.current?.focus();
                  }}
                  aria-label={t("clear")}
                  className="absolute top-[5px] right-[5px] grid size-11 cursor-pointer place-items-center text-ink focus-visible:-outline-offset-3 focus-visible:outline-ink max-[721px]:top-1"
                >
                  <X className="size-4" strokeWidth={2.6} aria-hidden="true" />
                </button>
              )}
            </div>
          </div>

          <div
            role="group"
            aria-label={t("areas")}
            className="flex flex-wrap gap-1.5 max-[721px]:-mr-[max(clamp(16px,4vw,40px),env(safe-area-inset-right,0px))] max-[721px]:-ml-[max(clamp(16px,4vw,40px),env(safe-area-inset-left,0px))] max-[721px]:flex-nowrap max-[721px]:overflow-x-auto max-[721px]:pr-[max(clamp(16px,4vw,40px),env(safe-area-inset-right,0px))] max-[721px]:pl-[max(clamp(16px,4vw,40px),env(safe-area-inset-left,0px))] max-[721px]:py-1 max-[721px]:[scrollbar-width:none] max-[721px]:[&::-webkit-scrollbar]:hidden"
          >
            {areaButtons.map(({ key, text, count }) => (
              <button
                key={key}
                type="button"
                aria-pressed={area === key}
                onClick={() => setArea(key)}
                className="inline-flex h-[54px] shrink-0 cursor-pointer items-center gap-2 px-4 pt-0.5 font-display text-[0.9375rem] leading-none font-semibold whitespace-nowrap text-ink shadow-[inset_0_0_0_1px_var(--color-line)] transition-[box-shadow,background-color] duration-200 ease-out hover:shadow-[inset_0_0_0_1px_var(--color-ink)] focus-visible:outline-ink aria-pressed:bg-yellow aria-pressed:shadow-[inset_0_0_0_1px_var(--color-yellow)] max-[721px]:h-[46px] max-[721px]:px-3.5 max-[721px]:text-sm"
              >
                {text}
                <small
                  className={cn(
                    "text-xs font-semibold tabular-nums",
                    area === key ? "text-black" : "text-mute",
                  )}
                >
                  {count}
                </small>
              </button>
            ))}
          </div>
        </div>

        <p aria-live="polite" className="mt-3.5 text-[0.9375rem] [&_b]:font-semibold [&_b]:text-ink">
          {t.rich("count", { shown: list.length, total: SERVICE.length, b: (c) => <b>{c}</b> })}
        </p>

        <div id="service-results">
          {list.length === 0 ? (
            <div className="mt-4 border-t border-line pt-5">
              <p className="max-w-[60ch] text-ink [&_a]:underline [&_a]:decoration-yellow [&_a]:decoration-2 [&_a]:underline-offset-4">
                {t("empty")}
              </p>
              <Button type="button" variant="outline-ink" size="sm" onClick={showAll} className="mt-3.5 max-sm:min-h-11">
                {t("emptyClear")}
              </Button>
            </div>
          ) : (
            <>
              <ServiceTable groups={groups} />
              <ServiceStack groups={groups} />
            </>
          )}
        </div>
      </div>
    </section>
  );
}

type Group = { key: AreaKey; items: ServicePoint[] };

function GroupTitle({ area, count, id }: { area: AreaKey; count: number; id?: string }) {
  const locale = useLocale() as Locale;
  return (
    <h3
      id={id}
      className="flex items-baseline gap-2.5 text-[clamp(1.1875rem,1.8vw,1.375rem)] leading-[1.1] font-extrabold uppercase"
    >
      {pick(AREA_NAMES[area], locale)}
      <small className="font-display text-sm leading-none font-semibold tracking-normal text-mute normal-case tabular-nums">
        {count}
      </small>
    </h3>
  );
}

/** Above 1000px: a real table with a sticky column header. */
function ServiceTable({ groups }: { groups: Group[] }) {
  const t = useTranslations("Contacts.points");
  const locale = useLocale() as Locale;
  const columns = [t("town"), t("workshop"), t("phone"), t("email"), t("website")];
  const none = (
    <>
      <span aria-hidden="true" className="text-line-strong">
        –
      </span>
      <span className="sr-only">{t("none")}</span>
    </>
  );

  return (
    <table className="mt-2.5 hidden w-full table-fixed border-separate border-spacing-0 text-left min-[1001px]:table">
      <caption className="sr-only">{t("caption")}</caption>
      <colgroup>
        <col className="w-[11.5%]" />
        <col className="w-[24%]" />
        <col className="w-[22%]" />
        <col className="w-[28%]" />
        <col className="w-[14.5%]" />
      </colgroup>
      <thead>
        <tr>
          {columns.map((label, i) => (
            <th
              key={label}
              scope="col"
              className={cn(
                "sticky top-0 z-[4] bg-white pt-3.5 pb-[9px] align-bottom caps text-xs text-mute shadow-[inset_0_-3px_0_var(--color-ink)]",
                i < 4 && GAP,
              )}
            >
              {label}
            </th>
          ))}
        </tr>
      </thead>
      {groups.map(({ key, items }) => (
        <tbody key={key}>
          <tr>
            <th scope="rowgroup" colSpan={5} className="border-b border-ink pt-[26px] pb-2.5 text-left font-normal">
              <GroupTitle area={key} count={items.length} />
            </th>
          </tr>
          {items.map((s) => (
            <tr key={s.id} className="align-top transition-colors duration-200 ease-out hover:bg-paper">
              <th scope="row" className={cn("border-b border-line pt-3.5 pb-[11px] text-left font-normal", GAP)}>
                <span className="block font-display text-sm leading-[1.25] font-bold tracking-[0.05em] text-ink uppercase">
                  {s.town}
                </span>
                <span className="mt-[3px] block font-display text-xs leading-[1.3] font-semibold tracking-[0.06em] text-mute uppercase">
                  {pick(s.region, locale)}
                </span>
              </th>
              <td className={cn("border-b border-line pt-3 pb-[11px]", GAP)}>
                <p className="font-display text-base leading-[1.25] font-bold text-ink [overflow-wrap:anywhere]">{s.name}</p>
                {s.notes.map((note) => (
                  <p key={note[0]} className="mt-0.5 text-sm leading-[1.4]">
                    {pick(note, locale)}
                  </p>
                ))}
                <p className="mt-[3px] text-sm leading-[1.4]">{s.address}</p>
              </td>
              <td className={cn("border-b border-line pt-3 pb-[11px]", GAP)}>
                <ul className="grid gap-[7px]">
                  {s.phones.map(({ who, number }) => {
                    const href = telHref(number);
                    return (
                      <li key={number}>
                        {href ? (
                          <a href={href} className={cn(TEL, "text-base leading-[1.25]")}>
                            {number}
                          </a>
                        ) : (
                          <span className={cn(TEL_PLAIN, "text-base leading-[1.25]")}>{number}</span>
                        )}
                        {who && <span className="mt-1 block text-[0.8125rem] leading-[1.3]">{pick(who, locale)}</span>}
                      </li>
                    );
                  })}
                </ul>
              </td>
              <td className={cn("border-b border-line pt-3 pb-[11px]", GAP)}>
                {s.email.length ? (
                  <ul className="grid gap-[7px]">
                    {s.email.map((address) => (
                      <li key={address}>
                        <a href={`mailto:${address}`} className={cn(TEXT_LINK, "text-[0.9375rem] leading-[1.35]")}>
                          {address}
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  none
                )}
              </td>
              <td className="border-b border-line pt-3 pb-[11px]">
                {s.web.length ? (
                  <ul className="grid gap-[7px]">
                    {s.web.map((url) => (
                      <li key={url}>
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener"
                          className={cn(TEXT_LINK, "inline-flex items-baseline gap-1.5 text-[0.9375rem] leading-[1.35]")}
                        >
                          {domainOf(url)}
                          <ArrowUpRight className="size-[11px] shrink-0 text-mute" strokeWidth={2.5} aria-hidden="true" />
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  none
                )}
              </td>
            </tr>
          ))}
        </tbody>
      ))}
    </table>
  );
}

const STACK_LINK = "group flex min-h-12 items-center gap-2 py-1.5 focus-visible:outline-offset-0";
const STACK_ICON = "size-3.5 shrink-0 text-mute";

/** At 1000px and below: stacked entries under sticky region headings, 48px link rows. */
function ServiceStack({ groups }: { groups: Group[] }) {
  const locale = useLocale() as Locale;

  return (
    <div className="mt-2.5 min-[1001px]:hidden">
      {groups.map(({ key, items }) => (
        <section key={key} aria-labelledby={`sp-group-${key}`}>
          <div className="sticky top-0 z-[3] border-b-[3px] border-ink bg-white pt-[26px] pb-2.5">
            <GroupTitle area={key} count={items.length} id={`sp-group-${key}`} />
          </div>
          {items.map((s) => (
            <article
              key={s.id}
              aria-labelledby={`sp-${s.id}`}
              className="border-b border-line pt-3.5 pb-1.5"
            >
              <div className="pb-1.5">
                <h4 id={`sp-${s.id}`} className="font-display text-base leading-[1.25] font-bold text-ink [overflow-wrap:anywhere]">
                  {s.name}
                </h4>
                {/* Town and region follow the name, never above it (the No Eyebrow Rule). */}
                <p className="mt-0.5 text-sm leading-[1.4] text-mute">
                  {s.town} · {pick(s.region, locale)}
                </p>
                {s.notes.map((note) => (
                  <p key={note[0]} className="mt-0.5 text-sm leading-[1.4]">
                    {pick(note, locale)}
                  </p>
                ))}
                <p className="mt-[3px] text-sm leading-[1.4]">{s.address}</p>
              </div>
              <ul>
                {s.phones.map(({ who, number }) => {
                  const href = telHref(number);
                  const icon = <Phone className={cn(STACK_ICON, "fill-current")} strokeWidth={0} aria-hidden="true" />;
                  return (
                    <li key={number} className="border-t border-line">
                      {href ? (
                        <a href={href} className={cn(STACK_LINK, "text-lg leading-[1.25]")}>
                          {icon}
                          <span className={cn(TEL, "group-hover:decoration-yellow")}>{number}</span>
                        </a>
                      ) : (
                        <p className="flex min-h-12 items-center gap-2 py-1.5 text-lg leading-[1.25]">
                          {icon}
                          <span className={TEL_PLAIN}>{number}</span>
                        </p>
                      )}
                      {who && <span className="-mt-2 mb-2 ml-[22px] block text-[0.8125rem] leading-[1.3]">{pick(who, locale)}</span>}
                    </li>
                  );
                })}
                {s.email.map((address) => (
                  <li key={address} className="border-t border-line">
                    <a href={`mailto:${address}`} className={cn(STACK_LINK, "text-base leading-[1.35]")}>
                      <Mail className={STACK_ICON} strokeWidth={2.2} aria-hidden="true" />
                      <span className={cn(TEXT_LINK, "min-w-0 group-hover:decoration-yellow")}>{address}</span>
                    </a>
                  </li>
                ))}
                {s.web.map((url) => (
                  <li key={url} className="border-t border-line">
                    <a href={url} target="_blank" rel="noopener" className={cn(STACK_LINK, "text-base leading-[1.35]")}>
                      <span className={cn(TEXT_LINK, "min-w-0 group-hover:decoration-yellow")}>{domainOf(url)}</span>
                      <ArrowUpRight className="size-[11px] shrink-0 text-mute" strokeWidth={2.5} aria-hidden="true" />
                    </a>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </section>
      ))}
    </div>
  );
}
