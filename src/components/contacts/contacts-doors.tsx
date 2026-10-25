import { ArrowRight, ArrowUpRight } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

import { Button } from "@/components/ui/button";
import type { Locale } from "@/i18n/routing";
import { EMAILS, GMBH, hostOf, SERVICE_SITES, telHref, USTA } from "@/lib/contacts";
import { localHref } from "@/lib/routes";

import { ContactRow, ContactRows } from "./contact-row";

const LINK =
  "relative inline-flex items-center gap-1.5 font-display text-[0.9375rem] leading-[1.2] font-semibold text-ink link-wipe after:absolute after:-inset-y-3 after:inset-x-0 after:content-['']";

/**
 * The three doors under the head: service and warranty, chipper parts (now
 * USTA's), and outside Finland. Each door has the same four parts in the
 * same rows (title, text, contacts, way on), so the three columns line up.
 * Service and warranty has no text (copy audit CONT-3), so its contacts take
 * the text row as well.
 */
export async function ContactsDoors() {
  const t = await getTranslations("Contacts");
  const locale = (await getLocale()) as Locale;

  const call = (number: string, who: string) => (
    <ContactRow
      kind="tel"
      value={number}
      href={telHref(number)}
      who={who}
      action={t("actions.call")}
      label={t("actions.callLabel", { number })}
    />
  );
  const write = (address: string, who?: string) => (
    <ContactRow
      kind="mail"
      value={address}
      href={`mailto:${address}`}
      who={who}
      action={t("actions.write")}
      label={t("actions.writeLabel", { address })}
    />
  );

  const doors = [
    {
      key: "service",
      body: null,
      rows: (
        <>
          <ContactRows>{write(EMAILS.service, t("doors.service.who"))}</ContactRows>
          <p className="mt-0 border-t border-line pt-2 text-[0.9375rem] leading-[1.45]">
            {SERVICE_SITES.map((line, i) => (
              <span key={line}>
                {i > 0 && <br />}
                {line}
              </span>
            ))}
          </p>
        </>
      ),
      foot: (
        <a href="#service-points" className={LINK}>
          {t("doors.service.find")}
          <ArrowRight className="size-3.5" strokeWidth={2.5} aria-hidden="true" />
        </a>
      ),
    },
    {
      key: "chipper",
      body: t("doors.chipper.body"),
      rows: (
        <ContactRows>
          {call(USTA.phone, t("doors.chipper.who", { name: USTA.name }))}
          {write(USTA.email)}
        </ContactRows>
      ),
      foot: (
        <a href={USTA.web} target="_blank" rel="noopener" className={LINK}>
          {hostOf(USTA.web)}
          <ArrowUpRight className="size-3.5" strokeWidth={2.5} aria-hidden="true" />
        </a>
      ),
    },
    {
      key: "abroad",
      body: t("doors.abroad.body"),
      rows: (
        <ContactRows>
          {write(EMAILS.sales, t("doors.abroad.sales"))}
          {call(GMBH.phone, t("doors.abroad.gmbh"))}
        </ContactRows>
      ),
      foot: (
        <Button asChild variant="dark" size="sm" className="max-[721px]:min-h-11">
          <a href={localHref("dealers", locale)}>
            {t("doors.abroad.dealer")}
            <ArrowRight className="size-3.5" strokeWidth={2.5} aria-hidden="true" />
          </a>
        </Button>
      ),
    },
  ] as const;

  return (
    <section className="gutter">
      <div className="wrap py-[clamp(44px,6vw,80px)]">
        <div className="grid gap-x-[clamp(24px,3.4vw,48px)] min-[721px]:grid-cols-2 min-[1001px]:grid-cols-3">
          {doors.map(({ key, body, rows, foot }) => (
            <article
              key={key}
              aria-labelledby={`door-${key}`}
              className="row-span-4 grid min-w-0 grid-rows-subgrid gap-y-2.5 border-t-[3px] border-ink pt-4 pb-8 max-[721px]:pb-6"
            >
              <h3
                id={`door-${key}`}
                className="text-[clamp(1.25rem,2vw,1.5rem)] leading-[1.1] font-extrabold uppercase"
              >
                {t(`doors.${key}.title`)}
              </h3>
              {body && <p className="max-w-[48ch] text-[0.9375rem] leading-[1.45]">{body}</p>}
              <div className={body ? "self-start" : "row-span-2 self-start"}>{rows}</div>
              <div className="self-end">{foot}</div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
