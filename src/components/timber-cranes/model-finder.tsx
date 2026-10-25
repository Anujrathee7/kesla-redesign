"use client";

import { Check, ChevronDown, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import type { Locale } from "@/i18n/routing";
import {
  activeCount,
  BOOM_COUNTS,
  BOOM_KEYS,
  DEFAULT_FILTERS,
  emptyReason,
  HYD_COUNTS,
  HYD_KEYS,
  metres,
  modelHref,
  REACH,
  reachRange,
  reachSet,
  results,
  SORT_KEYS,
  TORQUE,
  torqueRange,
  torqueSet,
  versionFits,
  type Filters,
  type Result,
} from "@/lib/timber-cranes";
import { cn } from "@/lib/utils";

import { setFilters, useFilters } from "./finder-state";
import { MODEL_IMAGES } from "./model-images";

const FORM_ID = "tc-filters";

/**
 * The Model finder: a filter rail with Kesla's own boom and hydraulics tags
 * plus outreach and lifting torque sliders, beside a ruled list of every
 * timber crane model. Outreach and torque are checked on the same version,
 * and once a slider is set the versions that fit are marked. At 1000px and
 * below the rail folds behind a Filters button above the list.
 */
export function ModelFinder() {
  const t = useTranslations("TimberCranes.finder");
  const locale = useLocale() as Locale;
  const filters = useFilters();
  const [open, setOpen] = useState(false);
  const countRef = useRef<HTMLParagraphElement>(null);

  const list = results(filters);
  const fitTotal = list.reduce((sum, r) => sum + r.fits.length, 0);
  const active = activeCount(filters);
  const sliding = reachSet(filters) || torqueSet(filters);

  const update = (patch: Partial<Filters>) => setFilters({ ...filters, ...patch });

  function toggle<K extends "boom" | "hyd">(key: K, value: Filters[K][number], on: boolean) {
    const now = filters[key] as readonly string[];
    const next = on ? [...now, value] : now.filter((v) => v !== value);
    update({ [key]: next } as Partial<Filters>);
  }

  function reset(moveFocus = false) {
    setFilters({ ...DEFAULT_FILTERS, sort: filters.sort });
    // The empty state's button goes away with the empty state: land on the count instead.
    if (moveFocus) requestAnimationFrame(() => countRef.current?.focus());
  }

  const reachText = (value: number) => (value > REACH.min ? t("reachValueText", { value: metres(value, locale) }) : t("any"));
  const torqueText = (value: number) => (value > TORQUE.min ? t("torqueValueText", { value }) : t("any"));

  return (
    <section aria-labelledby="finder-title" className="gutter">
      <h2 id="finder-title" className="sr-only">
        {t("label")}
      </h2>
      <div className="wrap grid items-start gap-x-[clamp(28px,4vw,56px)] gap-y-7 pt-[clamp(36px,5vw,56px)] pb-[clamp(48px,7vw,88px)] min-[1001px]:grid-cols-[272px_minmax(0,1fr)]">
        {/* ---------------- filter rail ---------------- */}
        <div className="min-[1001px]:sticky min-[1001px]:top-4">
          <button
            type="button"
            aria-expanded={open}
            aria-controls={FORM_ID}
            onClick={() => setOpen(!open)}
            className="flex min-h-11 w-full cursor-pointer items-center gap-2.5 border-2 border-ink bg-white px-3.5 pt-[13px] pb-3 font-display text-base leading-none font-bold tracking-[0.05em] text-ink uppercase min-[1001px]:hidden"
          >
            {t("filters")}
            {active > 0 && (
              <b className="bg-yellow px-1.5 pt-[3px] pb-0.5 text-[0.8125rem] text-black">
                <span aria-hidden="true">{active}</span>
                <span className="sr-only">{t("activeCount", { count: active })}</span>
              </b>
            )}
            <ChevronDown
              className={cn("ml-auto size-4 transition-transform duration-200 ease-out-expo", open && "rotate-180")}
              strokeWidth={2.5}
              aria-hidden="true"
            />
          </button>

          <form
            id={FORM_ID}
            aria-label={t("filters")}
            onSubmit={(event) => event.preventDefault()}
            className={cn(open ? "block pt-[18px] min-[1001px]:pt-0" : "hidden min-[1001px]:block")}
          >
            <fieldset className="m-0 border-0 p-0 pb-[22px]">
              <Legend>{t("boom")}</Legend>
              <div className="clear-both">
                {BOOM_KEYS.map((key) => (
                  <Tick
                    key={key}
                    label={t(`booms.${key}`)}
                    count={BOOM_COUNTS[key]}
                    countLabel={t("tagCount", { count: BOOM_COUNTS[key] })}
                    checked={filters.boom.includes(key)}
                    onChange={(on) => toggle("boom", key, on)}
                  />
                ))}
              </div>
            </fieldset>

            <Slider
              id="tc-reach"
              label={t("reach")}
              shown={reachSet(filters) ? t("atLeastM", { value: metres(filters.reach, locale) }) : t("any")}
              valueText={reachText(filters.reach)}
              scale={REACH}
              value={filters.reach}
              ends={[t("valueM", { value: String(REACH.min) }), t("valueM", { value: metres(REACH.max, locale) })]}
              onChange={(reach) => update({ reach })}
            />

            <Slider
              id="tc-torque"
              label={t("torque")}
              shown={torqueSet(filters) ? t("atLeastKnm", { value: filters.torque }) : t("any")}
              valueText={torqueText(filters.torque)}
              scale={TORQUE}
              value={filters.torque}
              ends={[t("valueKnm", { value: TORQUE.min }), t("valueKnm", { value: TORQUE.max })]}
              onChange={(torque) => update({ torque })}
            />

            <fieldset className="m-0 border-0 border-t border-line p-0 pt-[18px] pb-[22px]">
              <Legend>{t("hydraulics")}</Legend>
              <div className="clear-both">
                {HYD_KEYS.map((key) => (
                  <Tick
                    key={key}
                    label={t(`hyd.${key}`)}
                    count={HYD_COUNTS[key]}
                    countLabel={t("tagCount", { count: HYD_COUNTS[key] })}
                    checked={filters.hyd.includes(key)}
                    onChange={(on) => toggle("hyd", key, on)}
                  />
                ))}
              </div>
            </fieldset>

            <Button
              type="button"
              variant="outline-ink"
              size="sm"
              onClick={() => reset()}
              className="pointer-coarse:min-h-11"
            >
              {t("reset")}
            </Button>
          </form>
        </div>

        {/* ---------------- results ---------------- */}
        <div>
          <div className="flex flex-wrap items-center justify-between gap-x-5 gap-y-3 border-b-[3px] border-ink pb-3 max-[640px]:flex-col max-[640px]:items-start">
            <p
              ref={countRef}
              tabIndex={-1}
              aria-live="polite"
              aria-atomic="true"
              className="font-display text-xl leading-[1.2] font-extrabold text-ink uppercase focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-yellow focus-visible:outline-solid"
            >
              {t("models", { count: list.length })}
              <small className="ml-1.5 font-sans text-base font-medium text-mute normal-case">
                {t("versions", { count: fitTotal })}
              </small>
            </p>
            <div role="group" aria-labelledby="tc-sort-label" className="inline-flex items-center">
              <span id="tc-sort-label" className="mr-2.5 font-display text-xs leading-[1.2] font-bold tracking-[0.08em] text-mute uppercase">
                {t("sort")}
              </span>
              {SORT_KEYS.map((key) => (
                <button
                  key={key}
                  type="button"
                  aria-pressed={filters.sort === key}
                  onClick={() => update({ sort: key })}
                  className="-ml-px cursor-pointer border border-line bg-white px-3 pt-[9px] pb-2 font-display text-sm leading-none font-semibold text-ink transition-colors duration-200 ease-out first-of-type:ml-0 hover:bg-paper aria-pressed:relative aria-pressed:border-ink aria-pressed:bg-ink aria-pressed:text-white max-[640px]:min-h-11 pointer-coarse:min-h-11"
                >
                  {t(`sorts.${key}`)}
                </button>
              ))}
            </div>
          </div>

          {list.length ? (
            <ul aria-label={t("listLabel")}>
              {list.map((result) => (
                <ModelRow key={result.model.name} result={result} sliding={sliding} filters={filters} locale={locale} />
              ))}
            </ul>
          ) : (
            <EmptyState filters={filters} locale={locale} onReset={() => reset(true)} />
          )}
        </div>
      </div>
    </section>
  );
}

function Legend({ children }: { children: React.ReactNode }) {
  return <legend className="float-left mb-2.5 w-full p-0 caps text-ink">{children}</legend>;
}

function Tick({
  label,
  count,
  countLabel,
  checked,
  onChange,
}: {
  label: string;
  count: number;
  countLabel: string;
  checked: boolean;
  onChange: (on: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 py-1.5 text-base text-ink max-[1000px]:min-h-11 pointer-coarse:min-h-11">
      <span className="relative grid size-5 shrink-0 place-items-center">
        <input
          type="checkbox"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
          className="peer absolute inset-0 m-0 cursor-pointer appearance-none border-2 border-ink bg-white checked:bg-yellow"
        />
        <Check
          className="pointer-events-none relative size-3.5 text-black opacity-0 peer-checked:opacity-100"
          strokeWidth={3.5}
          aria-hidden="true"
        />
      </span>
      {label}
      <small className="ml-auto text-sm text-mute tabular-nums">
        <span aria-hidden="true">{count}</span>
        <span className="sr-only">({countLabel})</span>
      </small>
    </label>
  );
}

function Slider({
  id,
  label,
  shown,
  valueText,
  scale,
  value,
  ends,
  onChange,
}: {
  id: string;
  label: string;
  /** The value printed above the slider: "Any" or "≥ 9.5 m". */
  shown: string;
  /** What a screen reader hears for the value. */
  valueText: string;
  scale: { min: number; max: number; step: number };
  value: number;
  ends: [string, string];
  onChange: (value: number) => void;
}) {
  return (
    <div className="border-t border-line pt-[18px] pb-[22px]">
      <label htmlFor={id} className="mb-2.5 block caps text-ink">
        {label}
      </label>
      {/* The slider itself carries the value for screen readers (aria-valuetext). */}
      <output htmlFor={id} aria-hidden="true" className="mt-[-2px] mb-2 block font-display text-[1.375rem] leading-[1.1] font-extrabold text-ink tabular-nums">
        {shown}
      </output>
      <input
        id={id}
        type="range"
        min={scale.min}
        max={scale.max}
        step={scale.step}
        value={value}
        aria-valuetext={valueText}
        onChange={(event) => onChange(Number(event.target.value))}
        className="m-0 block h-7 w-full cursor-pointer accent-ink pointer-coarse:h-11"
      />
      <div aria-hidden="true" className="flex justify-between text-[0.8125rem] text-mute tabular-nums">
        <span>{ends[0]}</span>
        <span>{ends[1]}</span>
      </div>
    </div>
  );
}

function ModelRow({
  result,
  sliding,
  filters,
  locale,
}: {
  result: Result;
  sliding: boolean;
  filters: Filters;
  locale: Locale;
}) {
  const t = useTranslations("TimberCranes.finder");
  const { model } = result;
  const group = model.group === "ctl" || model.group === "tl" ? t(`groups.${model.group}`) : null;
  const meta = [t(`booms.${model.boom}`), t("class", { tm: model.tm }), group, t("versions", { count: model.versions.length })]
    .filter(Boolean)
    .join(" · ");

  return (
    <li className="group relative grid grid-cols-[148px_minmax(0,1fr)_minmax(0,11.5em)_16px] items-center gap-x-6 gap-y-2 border-b border-line py-4 max-[640px]:grid-cols-[104px_minmax(0,1fr)_14px] max-[640px]:items-start max-[640px]:gap-x-3.5 max-[640px]:gap-y-1.5">
      <span
        className={cn(
          "relative block aspect-[16/10] overflow-hidden",
          model.cutout ? "bg-white shadow-[inset_0_0_0_1px_var(--color-line)]" : "bg-warm",
        )}
      >
        <Image
          src={MODEL_IMAGES[model.name]}
          alt=""
          fill
          sizes="(max-width: 640px) 104px, 148px"
          className={cn(
            "transition-transform duration-700 ease-out-expo group-hover:scale-[1.04]",
            model.cutout ? "object-contain p-[4%]" : "object-cover",
          )}
        />
      </span>

      <div>
        <h3 className="text-xl leading-[1.1] font-extrabold uppercase max-[640px]:text-lg">
          {/* The link covers the whole row; its ring is drawn on that cover. */}
          <a
            href={modelHref(model, locale)}
            className="decoration-yellow decoration-[3px] underline-offset-4 group-hover:underline after:absolute after:inset-0 after:content-[''] focus-visible:outline-none focus-visible:after:outline-[3px] focus-visible:after:outline-offset-2 focus-visible:after:outline-yellow focus-visible:after:outline-solid"
          >
            KESLA {model.name}
          </a>
        </h3>
        <p className="mt-[3px] text-[0.9375rem] leading-[1.45] text-grey">{meta}</p>
        <ul aria-label={t("versionsLabel", { model: model.name })} className="mt-2 flex flex-wrap gap-1">
          {model.versions.map((v) => {
            const hit = sliding && versionFits(v, filters);
            return (
              <li
                key={v.name}
                className={cn(
                  "border px-[7px] pt-[5px] pb-1 font-display text-xs leading-none font-bold tracking-[0.06em] whitespace-nowrap uppercase",
                  hit ? "border-ink bg-ink text-white" : "border-line text-grey",
                )}
              >
                {v.name}
                {hit && <span className="sr-only">, {t("fits")}</span>}
              </li>
            );
          })}
        </ul>
      </div>

      <dl className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-3 gap-y-0.5 text-[0.9375rem] max-[640px]:col-start-2">
        <dt className="pt-0.5 font-display text-[0.8125rem] font-semibold tracking-[0.05em] text-mute uppercase">
          {t("outreach")}
        </dt>
        <dd className="m-0 text-right font-medium whitespace-nowrap text-ink tabular-nums max-[640px]:text-left">
          {t("valueM", { value: reachRange(result.reach, locale) })}
        </dd>
        <dt className="pt-0.5 font-display text-[0.8125rem] font-semibold tracking-[0.05em] text-mute uppercase">
          {t("torqueShort")}
        </dt>
        <dd className="m-0 text-right font-medium whitespace-nowrap text-ink tabular-nums max-[640px]:text-left">
          {t("valueKnm", { value: torqueRange(result.torque) })}
        </dd>
      </dl>

      <ChevronRight
        className="size-4 text-mute transition-[translate,color] duration-200 ease-out-expo group-hover:translate-x-1 group-hover:text-ink max-[640px]:col-start-3 max-[640px]:row-start-1 max-[640px]:size-3.5 max-[640px]:self-center"
        strokeWidth={2.25}
        aria-hidden="true"
      />
    </li>
  );
}

function EmptyState({ filters, locale, onReset }: { filters: Filters; locale: Locale; onReset: () => void }) {
  const t = useTranslations("TimberCranes.finder.empty");
  const tf = useTranslations("TimberCranes.finder");
  const reason = emptyReason(filters);

  let title: string;
  const lines: string[] = [];
  if (reason.kind === "tags") {
    title = t("tagsTitle");
    lines.push(t("tags"));
  } else {
    title = t("bothTitle");
    const reach = metres(filters.reach, locale);
    if (reachSet(filters)) {
      lines.push(
        reason.atReach
          ? t("atReach", { reach, version: reason.atReach.name, torque: reason.atReach.torque })
          : t("noReach", { reach }),
      );
    }
    if (torqueSet(filters)) {
      lines.push(
        reason.atTorque
          ? t("atTorque", {
              torque: filters.torque,
              version: reason.atTorque.name,
              reach: metres(reason.atTorque.reach / 1000, locale),
            })
          : t("noTorque", { torque: filters.torque }),
      );
    }
  }

  return (
    <div className="mt-5 flex flex-wrap items-center justify-between gap-x-7 gap-y-4 bg-warm px-[26px] pt-[26px] pb-7">
      <div>
        <p className="font-display text-xl leading-[1.15] font-extrabold text-ink uppercase">{title}</p>
        <p className="mt-1.5 max-w-[52ch]">{lines.join(" ")}</p>
      </div>
      <Button type="button" variant="dark" size="sm" onClick={onReset} className="pointer-coarse:min-h-11">
        {tf("reset")}
      </Button>
    </div>
  );
}
