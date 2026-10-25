import { ArrowUpRight, Mail, Phone } from "lucide-react";
import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";

import { Button } from "@/components/ui/button";
import { IR_CONTACT, IR_LINKS, PERSON_NAMES } from "@/lib/company";

import nieminenPhoto from "../../../public/images/company-mt-nieminen.jpg";
import { SectionTitle } from "./section-title";

/** Grows a text link's hit area to 44px tall without moving the layout. */
const HIT = "relative after:absolute after:inset-x-0 after:-inset-y-2.5 after:content-['']";

/**
 * Investors: kesla.com's investor section is Finnish only, so the English
 * page says so, links to it and names the IR contact.
 */
export async function CompanyInvestors() {
  const t = await getTranslations("Company.investors");
  const locale = await getLocale();
  // The investor pages are in Finnish; say so to the browser on the English page.
  const hrefLang = locale === "fi" ? undefined : "fi";
  const language = t("language");

  return (
    <section id="investors" aria-labelledby="investors-title" className="scroll-mt-4 border-t border-line gutter">
      <div className="wrap grid items-start gap-x-[clamp(32px,5vw,72px)] gap-y-12 py-[clamp(56px,8vw,104px)] min-[1001px]:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <div>
          <SectionTitle id="investors-title">{t("title")}</SectionTitle>
          {language && (
            <p className="mt-4 max-w-[46ch] text-lg leading-normal text-ink sm:text-[1.1875rem]">{language}</p>
          )}
          <Button asChild className="mt-6">
            <a href={IR_LINKS.root} target="_blank" rel="noopener" hrefLang={hrefLang}>
              {t("cta")}
              <ArrowUpRight strokeWidth={2.5} aria-hidden="true" />
            </a>
          </Button>
        </div>

        <div className="grid grid-cols-[72px_minmax(0,1fr)] items-center gap-4 border-t-[3px] border-ink pt-5">
          <Image src={nieminenPhoto} alt="" sizes="72px" className="size-[72px] object-cover" />
          <div>
            <p className="font-display text-lg leading-[1.2] font-bold text-ink">{PERSON_NAMES[IR_CONTACT.person]}</p>
            <p className="text-[0.9375rem]">{t("contactRole")}</p>
            <p className="mt-2 flex flex-wrap gap-x-[18px] gap-y-2">
              <a
                href={`mailto:${IR_CONTACT.email}`}
                className={`${HIT} inline-flex items-center gap-2 text-ink underline decoration-yellow decoration-2 underline-offset-4 hover:decoration-[3px]`}
              >
                <Mail className="size-4 shrink-0" strokeWidth={2} aria-hidden="true" />
                <span className="sr-only">{t("email")}: </span>
                {IR_CONTACT.email}
              </a>
              <a
                href={IR_CONTACT.phone.href}
                className={`${HIT} inline-flex items-center gap-2 text-ink tabular-nums underline decoration-yellow decoration-2 underline-offset-4 hover:decoration-[3px]`}
              >
                <Phone className="size-4 shrink-0" strokeWidth={2} aria-hidden="true" />
                <span className="sr-only">{t("phone")}: </span>
                {IR_CONTACT.phone.label}
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
