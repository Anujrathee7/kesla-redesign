import { ArrowUpRight, ChevronRight } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

import type { Locale } from "@/i18n/routing";
import { EMAILS, GENERAL, hostOf, INVOICING, SITES, telHref } from "@/lib/contacts";

import { ContactForm } from "./contact-form";
import { ContactRow, ContactRows } from "./contact-row";

const FINE = "mt-2 max-w-[60ch] text-sm leading-[1.45] text-mute";
const LINK =
  "relative mt-2 inline-flex items-center gap-1.5 font-display text-sm leading-[1.3] font-semibold text-ink link-wipe after:absolute after:-inset-y-3 after:inset-x-0 after:content-['']";
/** A plain tel: link in the service point table's language: ink, a 2px hairline underline that turns yellow. */
const TEL =
  "relative mt-2 block w-fit font-display text-[0.9375rem] leading-[1.3] font-semibold text-ink tabular-nums whitespace-nowrap underline decoration-line decoration-2 underline-offset-[5px] transition-[text-decoration-color] duration-200 ease-out hover:decoration-yellow after:absolute after:-inset-y-3 after:inset-x-0 after:content-['']";
const ROW_TITLE = "font-display text-lg leading-[1.2] font-bold tracking-normal text-ink uppercase";

/** One contact that is always open: its title, then its rows. */
function Entry({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-line pt-4 pb-5">
      <h3 className={`${ROW_TITLE} mb-1.5`}>{title}</h3>
      {children}
    </div>
  );
}

/** Supplier reference (invoicing) stays folded. */
function Fold({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <details className="group border-b border-line">
      <summary
        className={`${ROW_TITLE} flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 pt-4 pb-[15px] transition-colors duration-200 ease-out hover:text-black [&::-webkit-details-marker]:hidden`}
      >
        <span className="decoration-yellow decoration-2 underline-offset-4 group-hover:underline">{title}</span>
        <ChevronRight
          className="size-4 shrink-0 rotate-90 text-mute transition-transform duration-200 ease-out-expo group-open:-rotate-90 group-hover:text-ink"
          strokeWidth={2.5}
          aria-hidden="true"
        />
      </summary>
      <div className="pb-[22px]">{children}</div>
    </details>
  );
}

/**
 * The last section before the video band, on white so it does not read as
 * part of the black video band and footer below it. Left, the other contacts
 * as a ruled list under a 3px ink rule: the general number, sales and the
 * four sites always open (the sites two by two, their values as plain links
 * like the service point table), and invoicing, which only suppliers need,
 * as the one fold. Right, the contact request form in a framed card with a
 * yellow top edge and the panel's cut corner.
 */
export async function ContactsOther() {
  const t = await getTranslations("Contacts");
  const locale = (await getLocale()) as Locale;

  const call = (number: string, href: string | null, who: string) => (
    <ContactRow
      kind="tel"
      value={number}
      href={href}
      who={who}
      action={t("actions.call")}
      label={t("actions.callLabel", { number })}
    />
  );
  const write = (address: string, who: string) => (
    <ContactRow
      kind="mail"
      value={address}
      href={`mailto:${address}`}
      who={who}
      action={t("actions.write")}
      label={t("actions.writeLabel", { address })}
    />
  );

  const invoicing = [
    { key: "einvoice", label: t("other.invoicing.einvoice"), value: INVOICING.einvoice },
    {
      key: "operatorId",
      label: t("other.invoicing.operatorId"),
      value: `${INVOICING.operatorId} ${t("other.invoicing.or")} ${INVOICING.operator}`,
    },
    { key: "operator", label: t("other.invoicing.operator"), value: INVOICING.operator },
    { key: "vat", label: t("other.invoicing.vat"), value: INVOICING.vat[locale] },
  ];

  return (
    <section aria-label={t("other.title")} className="gutter">
      <div className="wrap grid items-start gap-x-[clamp(32px,5vw,80px)] gap-y-12 border-t border-line pt-[clamp(40px,5vw,64px)] pb-[clamp(56px,8vw,104px)] min-[1001px]:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <div>
          <h2 className="mb-5 text-[clamp(1.625rem,3vw,2.5rem)] leading-none font-extrabold uppercase">
            {t("other.title")}
          </h2>

          <div className="border-t-[3px] border-ink">
            <Entry title={t("other.general.title")}>
              <ContactRows>{call(GENERAL[locale], GENERAL.href, t("other.general.who"))}</ContactRows>
              <p className={FINE}>{t("other.general.fee")}</p>
            </Entry>

            <Entry title={t("other.sales.title")}>
              <ContactRows>{write(EMAILS.sales, t("other.sales.who"))}</ContactRows>
            </Entry>

            <Entry title={t("other.sites.title")}>
              <ul className="mt-1 grid grid-cols-2 gap-x-[clamp(16px,2.4vw,28px)]">
                {SITES.map((site) => {
                  const lines =
                    site.key === "gmbh"
                      ? [...site.lines, t("other.sites.gmbhPostal"), t("other.sites.germany")]
                      : [...site.lines, t("other.sites.finland")].filter(Boolean);
                  const tel = site.phone ? telHref(site.phone) : null;
                  return (
                    <li key={site.key} className="min-w-0 border-t border-line pt-3 pb-4">
                      <h4 className="font-display text-base leading-[1.25] font-bold tracking-normal text-ink">
                        {t(`other.sites.${site.key}`)}
                      </h4>
                      <p className="mt-1.5 text-[0.9375rem] leading-[1.45] text-grey">
                        {lines.map((line, i) => (
                          <span key={line}>
                            {i > 0 && <br />}
                            {line}
                          </span>
                        ))}
                      </p>
                      {site.phone && tel && (
                        <a
                          href={tel}
                          aria-label={t("actions.callLabel", { number: site.phone })}
                          className={TEL}
                        >
                          {site.phone}
                        </a>
                      )}
                      {site.web && (
                        <a href={site.web} target="_blank" rel="noopener" className={`${LINK} [overflow-wrap:anywhere]`}>
                          {hostOf(site.web)}
                          <ArrowUpRight className="size-3.5 shrink-0" strokeWidth={2.5} aria-hidden="true" />
                        </a>
                      )}
                      {site.register && <p className={FINE}>{site.register}</p>}
                      {site.map && (
                        <a href={site.map} target="_blank" rel="noopener" className={LINK}>
                          {t("other.sites.map")}
                          <ArrowUpRight className="size-3.5 shrink-0" strokeWidth={2.5} aria-hidden="true" />
                        </a>
                      )}
                    </li>
                  );
                })}
              </ul>
            </Entry>

            <Fold title={t("other.invoicing.title")}>
              <dl className="grid grid-cols-[minmax(0,15em)_minmax(0,1fr)] border-t border-line max-[561px]:grid-cols-[minmax(0,9em)_minmax(0,1fr)]">
                {invoicing.map(({ key, label, value }) => (
                  <div key={key} className="contents">
                    <dt className="border-b border-line pt-2.5 pr-4 pb-[9px] font-display text-sm leading-[1.4] font-semibold text-grey">
                      {label}
                    </dt>
                    <dd className="border-b border-line pt-2.5 pb-[9px] text-ink tabular-nums [overflow-wrap:anywhere]">
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>
              <ContactRows>{write(EMAILS.invoices, t("other.invoicing.who"))}</ContactRows>
              <p className={FINE}>{t("other.invoicing.note")}</p>
            </Fold>
          </div>
        </div>

        {/* The form card: a 2px hairline frame with the panel's 22px cut, and a yellow top edge. */}
        <div className="cut-frame px-[clamp(20px,3vw,40px)] pt-[clamp(28px,3.2vw,40px)] pb-[clamp(28px,3.4vw,44px)] [--cut:22px] [--frame-color:var(--color-line)] [--frame-fill:var(--color-white)]">
          <span aria-hidden="true" className="absolute inset-x-0 top-0 h-1.5 bg-yellow" />
          <h2 className="mb-3 text-[clamp(1.625rem,3vw,2.5rem)] leading-none font-extrabold uppercase">
            {t("form.title")}
          </h2>
          <p className="mb-5 max-w-[62ch]">{t("form.intro")}</p>
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
