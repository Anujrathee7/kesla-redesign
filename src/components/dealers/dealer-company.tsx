"use client";

import { ArrowUpRight, ChevronDown, Globe } from "lucide-react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useRef } from "react";

import {
  GROUP_FOLD,
  GROUP_SHOW,
  hostOf,
  phonesOf,
  rowLines,
  telHref,
  townOf,
  type Company,
  type Dealer,
  type GroupKey,
} from "@/lib/dealers";
import { FAMILY_KEYS, type FamilyKey } from "@/lib/routes";
import { cn } from "@/lib/utils";

import { CallButton, EmptySlot, SquareLink } from "./contact-actions";

/** Which short tags put a family's round icon on the company. */
const FAMILY_GROUPS: Record<FamilyKey, readonly GroupKey[]> = {
  cranes: ["cr"],
  logging: ["fc", "hh"],
  tractor: ["lt"],
};

const PHONE_KEYS = { "General number": "general", WhatsApp: "whatsapp", Mobile: "mobile" } as const;

/** Desktop rows: town, who, actions. Below 561px: town over who, actions beside both. */
const ROW =
  "grid grid-cols-[118px_minmax(0,1fr)_auto] items-center gap-x-3 gap-y-1 border-b border-line pt-2 pb-[7px] max-[561px]:grid-cols-[minmax(0,1fr)_auto] max-[561px]:gap-y-0.5 max-[561px]:pt-[9px] max-[561px]:pb-2";

/**
 * One company, once: its name, website, how many contacts in how many towns
 * and what it sells, then each contact as one line in town order. A company
 * with more than eight contacts shows six and a "Show all" button, unless a
 * search is on, when every match shows.
 */
export function DealerCompany({
  company,
  items,
  folded,
  onShowAll,
}: {
  company: Company;
  /** The contacts to show: all of them, or the ones the search matched. */
  items: readonly Dealer[];
  folded: boolean;
  onShowAll: () => void;
}) {
  const t = useTranslations("Dealers");
  const list = useRef<HTMLUListElement>(null);
  const cut = folded && items.length > GROUP_FOLD;
  const shown = cut ? items.slice(0, GROUP_SHOW) : items;
  const titleId = `co-${company.key.replace(/[^a-z0-9]+/g, "-")}`;
  const families = FAMILY_KEYS.filter((f) => FAMILY_GROUPS[f].some((g) => company.groups.includes(g)));

  const meta =
    !company.own && company.items.length > 1 ? t("company.contacts", { count: company.items.length }) : null;

  function showAll() {
    onShowAll();
    // The button goes away; carry focus to the first contact it revealed, or
    // to the row itself when it has no link ("No phone listed").
    requestAnimationFrame(() => {
      const row = list.current?.children[GROUP_SHOW];
      if (!(row instanceof HTMLElement)) return;
      (row.querySelector<HTMLElement>("a") ?? row).focus();
    });
  }

  return (
    <section aria-labelledby={titleId} className="pb-1.5 [&+&]:mt-3.5">
      {/* Sticky inside the desktop scroll area only; on phones the country heading alone sticks. */}
      <header className="sticky top-0 z-[2] grid grid-cols-[minmax(0,1fr)_auto] items-end gap-x-3 gap-y-1 border-b-2 border-ink bg-white pt-3.5 pb-2.5 max-[1001px]:static">
        <h3 id={titleId} className="text-[1.1875rem] leading-[1.15] font-extrabold tracking-[0.005em] [overflow-wrap:anywhere]">
          {company.name}
        </h3>
        {company.web ? (
          <a
            href={company.web}
            target="_blank"
            rel="noopener"
            className="link-wipe relative inline-flex items-center gap-1.5 font-display text-sm leading-[1.2] font-semibold whitespace-nowrap text-ink after:absolute after:inset-x-0 after:-inset-y-2.5 after:content-['']"
          >
            {hostOf(company.web)}
            <ArrowUpRight className="size-3.5" strokeWidth={2.5} aria-hidden="true" />
          </a>
        ) : (
          <span />
        )}
        <div className="col-span-full flex flex-wrap items-center gap-x-3 gap-y-1.5">
          {meta && <span className="font-display text-sm leading-[1.2] font-semibold text-ink">{meta}</span>}
          {families.length > 0 && (
            <span className="inline-flex items-center gap-1">
              {families.map((f) => (
                <Image
                  key={f}
                  src={`/images/icon-${f}.svg`}
                  alt={t(`company.families.${f}`)}
                  title={t(`company.families.${f}`)}
                  width={26}
                  height={26}
                  className="size-[26px]"
                />
              ))}
            </span>
          )}
          {company.groups.length > 0 && (
            <ul className="flex flex-wrap gap-1">
              {company.groups.map((g) => (
                <li
                  key={g}
                  className="px-[7px] pt-1.5 pb-[5px] font-display text-xs leading-none font-semibold whitespace-nowrap text-ink shadow-[inset_0_0_0_1px_var(--color-line)]"
                >
                  {t(`groups.${g}`)}
                </li>
              ))}
            </ul>
          )}
        </div>
      </header>

      <ul ref={list}>
        {shown.map((d, i) => (
          <ContactRow
            key={d.id}
            dealer={d}
            sameTown={i > 0 && townOf(shown[i - 1]) === townOf(d)}
            emailSlot={company.hasEmail}
            own={company.own}
          />
        ))}
      </ul>

      {cut && (
        <button
          type="button"
          onClick={showAll}
          className="group flex w-full cursor-pointer items-center justify-between gap-3 border-b border-line pt-3 pb-[11px] pointer-coarse:min-h-11 text-left font-display text-[0.9375rem] leading-[1.2] font-semibold text-ink focus-visible:-outline-offset-3"
        >
          <span className="underline decoration-yellow decoration-2 underline-offset-4">
            {t("company.showAll", { count: items.length, company: company.name })}
          </span>
          <ChevronDown className="size-4 shrink-0 text-mute group-hover:text-ink" strokeWidth={2.5} aria-hidden="true" />
        </button>
      )}
    </section>
  );
}

function ContactRow({
  dealer: d,
  sameTown,
  emailSlot,
  own,
}: {
  dealer: Dealer;
  sameTown: boolean;
  emailSlot: boolean;
  own: boolean;
}) {
  const t = useTranslations("Dealers");
  const locale = useLocale();
  const phones = phonesOf(d);
  const main = phones[0];
  const extra = phones.slice(1);
  const lines = rowLines(d);
  const second = own && d.note ? d.note[locale === "fi" ? 1 : 0] : lines.second;
  const who = [d.name, d.person].filter(Boolean).join(", ");
  // A row with nothing to tab to can still take focus after "Show all".
  const linkless = !main && !d.web[0] && !(emailSlot && d.email[0]);

  return (
    <li className={ROW} tabIndex={linkless ? -1 : undefined}>
      <span
        className={cn(
          "font-display text-xs leading-[1.2] font-bold tracking-[0.04em] break-words text-ink uppercase max-[561px]:col-start-1",
          sameTown && "invisible max-[561px]:visible",
        )}
      >
        {townOf(d)}
      </span>
      <span className="min-w-0 text-[0.9375rem] leading-[1.3] text-ink max-[561px]:col-start-1">
        {lines.first}
        {second && <small className="block text-sm text-mute">{second}</small>}
        {extra.length > 0 && (
          <small className="block text-sm text-mute">
            {t("company.also")}{" "}
            {extra.map(([label, number], i) => (
              <span key={number}>
                {i > 0 && ", "}
                {label && `${t(`phoneLabels.${PHONE_KEYS[label]}`)} `}
                <a
                  href={telHref(number, d.country)}
                  className="text-ink tabular-nums underline decoration-line decoration-1 underline-offset-2 hover:decoration-yellow"
                >
                  {number}
                </a>
              </span>
            ))}
          </small>
        )}
        {main && (
          <span className="mt-[3px] hidden font-display text-sm leading-[1.3] font-semibold text-ink tabular-nums max-[561px]:block">
            {main[1]}
          </span>
        )}
      </span>
      <span className="flex items-center justify-end gap-1.5 max-[561px]:col-start-2 max-[561px]:row-span-2 max-[561px]:row-start-1">
        {main ? (
          <CallButton
            href={telHref(main[1], d.country)}
            number={main[1]}
            label={t("company.call", { who, number: main[1] })}
            className="focus-visible:outline-ink"
          />
        ) : (
          <NoPhone web={d.web[0]} />
        )}
        {emailSlot &&
          (d.email[0] ? (
            <SquareLink
              href={`mailto:${d.email[0]}`}
              kind="email"
              label={t("company.email", { address: d.email[0] })}
            />
          ) : (
            <EmptySlot />
          ))}
      </span>
    </li>
  );
}

/** Four cards list no phone: send the buyer to the website, or say so plainly. */
function NoPhone({ web }: { web?: string }) {
  const t = useTranslations("Dealers");

  if (web) {
    return (
      <a
        href={web}
        target="_blank"
        rel="noopener"
        aria-label={t("company.website", { host: hostOf(web) })}
        className="inline-flex h-10 w-[188px] shrink-0 items-center gap-2 bg-white px-3 pt-0.5 font-display text-sm leading-none font-semibold whitespace-nowrap text-black shadow-[inset_0_0_0_1px_var(--color-ink)] transition-colors duration-200 ease-out hover:bg-black hover:text-yellow focus-visible:outline-ink max-[561px]:size-12 max-[561px]:justify-center max-[561px]:p-0"
      >
        <Globe className="size-3.5 shrink-0 max-[561px]:size-[18px]" strokeWidth={2} aria-hidden="true" />
        <span className="truncate max-[561px]:sr-only">{t("company.noPhoneWeb")}</span>
      </a>
    );
  }

  return (
    <span className="inline-flex h-10 w-[188px] shrink-0 items-center bg-paper px-3 pt-0.5 font-display text-[0.8125rem] leading-none font-medium text-mute max-[561px]:hidden">
      {t("company.noPhone")}
    </span>
  );
}
