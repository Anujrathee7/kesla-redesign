"use client";

import { ArrowRight, ArrowUpRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useRef } from "react";

import { Button } from "@/components/ui/button";
import type { Locale } from "@/i18n/routing";
import { DATASHEET_HREF, KEY_FIGURES, VERSIONS, figure, versionOf } from "@/lib/product-2112z";
import { localHref } from "@/lib/routes";
import { cn } from "@/lib/utils";

import { setVersion, useVersion, useVersionInteracted } from "./version-store";

/**
 * The version switch as a radio group: one tab stop, the arrow keys move the
 * choice, and every figure on the page follows it.
 */
function VersionRadios({ labelId }: { labelId: string }) {
  const version = useVersion();
  const group = useRef<HTMLDivElement>(null);

  function onKeyDown(event: React.KeyboardEvent<HTMLButtonElement>, index: number) {
    const last = VERSIONS.length - 1;
    const next =
      event.key === "ArrowRight" || event.key === "ArrowDown"
        ? index === last
          ? 0
          : index + 1
        : event.key === "ArrowLeft" || event.key === "ArrowUp"
          ? index === 0
            ? last
            : index - 1
          : event.key === "Home"
            ? 0
            : event.key === "End"
              ? last
              : null;
    if (next == null) return;
    event.preventDefault();
    setVersion(VERSIONS[next].id);
    group.current?.querySelectorAll<HTMLButtonElement>("[role=radio]")[next]?.focus();
  }

  return (
    <div ref={group} role="radiogroup" aria-labelledby={labelId} className="grid grid-cols-3 gap-1">
      {VERSIONS.map((v, index) => {
        const checked = v.id === version;
        return (
          <button
            key={v.id}
            type="button"
            role="radio"
            aria-checked={checked}
            tabIndex={checked ? 0 : -1}
            onClick={() => setVersion(v.id)}
            onKeyDown={(event) => onKeyDown(event, index)}
            className={cn(
              "min-h-11 px-1 pt-2.5 pb-[9px] text-center font-display text-sm leading-[1.1] font-bold whitespace-nowrap tabular-nums shadow-[inset_0_0_0_1px_var(--color-dark-line)] transition-colors duration-200 ease-out focus-visible:outline-white",
              checked
                ? "bg-yellow text-black shadow-none"
                : "text-on-dark hover:shadow-[inset_0_0_0_1px_var(--color-on-dark-mute)]",
            )}
          >
            {v.id}
          </button>
        );
      })}
    </div>
  );
}

/** One quiet sentence for screen readers after a switch, never on load. */
export function VersionStatus() {
  const t = useTranslations("Product");
  const locale = useLocale() as Locale;
  const version = useVersion();
  const interacted = useVersionInteracted();
  const v = versionOf(version);

  return (
    <p role="status" className="sr-only">
      {interacted
        ? t("version.status", {
            version: v.id,
            outreach: figure(v, "outreach", locale),
            torque: figure(v, "torque", locale),
            weight: figure(v, "weight", locale),
          })
        : ""}
    </p>
  );
}

/**
 * The offer card in the black head: the model, the version switch, the five
 * figures that separate the versions, and the two ways on, a dealer and the
 * datasheet. Anuj removed the black offer strip that used to follow the tabs
 * on desktop (19 October 2026), so this card holds the only offer button
 * there; phones keep their own bar (offer-bar.tsx).
 */
export function OfferCard() {
  const t = useTranslations("Product");
  const locale = useLocale() as Locale;
  const v = versionOf(useVersion());

  return (
    <div className="pt-1">
      <h1
        id="product-title"
        className="text-[clamp(2.125rem,3.4vw,2.875rem)] leading-[0.95] font-extrabold tracking-[-0.01em] text-white uppercase">
        {t("name")}
      </h1>
      <p className="mt-2.5 font-display text-sm leading-[1.3] font-bold tracking-[0.05em] text-yellow uppercase">
        {t("sub")}
      </p>

      <p id="version-label" className="mt-[22px] mb-2 caps text-xs text-on-dark-mute">
        {t("version.label")}
      </p>
      <VersionRadios labelId="version-label" />
      <VersionStatus />

      <dl className="mt-3.5 grid grid-cols-[auto_1fr] text-[0.9375rem]">
        {KEY_FIGURES.map((key) => (
          <div key={key} className="contents">
            <dt className="border-t border-dark-line py-2 text-on-dark-mute">{t(`figures.${key}`)}</dt>
            <dd className="border-t border-dark-line py-2 text-right font-semibold text-white tabular-nums">
              {figure(v, key, locale)}
            </dd>
          </div>
        ))}
      </dl>

      <Button asChild className="mt-[22px] w-full focus-visible:outline-white max-[640px]:px-3 max-[640px]:tracking-[0.03em]">
        <a id="offer-button" href={localHref("dealers", locale)}>
          {t("offer")}
          <ArrowRight strokeWidth={2.5} aria-hidden="true" />
        </a>
      </Button>
      <Button asChild variant="outline-light" className="mt-2.5 w-full max-[640px]:px-3">
        <a href={DATASHEET_HREF} target="_blank" rel="noopener">
          {t("datasheet")}
          <ArrowUpRight strokeWidth={2.5} aria-hidden="true" />
          <span className="sr-only">, {t("newTab")}</span>
        </a>
      </Button>
    </div>
  );
}
