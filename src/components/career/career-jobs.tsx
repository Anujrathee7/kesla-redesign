import { ArrowUpRight, Banknote, CalendarDays, CalendarPlus, FileText, Mail, MapPin } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

import { SectionHeading } from "@/components/home/section-heading";
import { Button } from "@/components/ui/button";
import type { Locale } from "@/i18n/routing";
import { applyHref, formatDate, OPEN_APPLICATION, openJobs, RECRUITING_EMAIL } from "@/lib/career";

/** Grows a text link's hit area to 44px tall without moving the layout. */
const HIT = "relative after:absolute after:inset-x-0 after:-inset-y-2.5 after:content-['']";
const TEXT_LINK = `${HIT} text-ink tabular-nums underline decoration-yellow decoration-2 underline-offset-4 hover:decoration-[3px]`;

/**
 * One paragraph of a post, Kesla's own words in Kesla's own paragraphs. `lead`
 * is the sentence the post sets bold; a paragraph may be only a bold lead.
 */
type JobParagraph = { lead?: string; text?: string };

/**
 * Open positions: each posting as one ruled block, the facts a job seeker
 * filters on (place, contract, pay, deadline) on the left and what the job
 * is, who to ask and how to apply on the right. Posts drop out after their
 * deadline (see `openJobs`). An open application closes the list for everyone
 * the posts do not fit.
 */
export async function CareerJobs() {
  const t = await getTranslations("Career.jobs");
  const locale = (await getLocale()) as Locale;
  const jobs = await openJobs();

  return (
    <section aria-labelledby="jobs-title" className="gutter">
      <div className="wrap py-[clamp(56px,8vw,104px)]">
        <SectionHeading id="jobs-title" title={t("title")} />

        <div className="border-t-[3px] border-ink">
          {jobs.length === 0 && <p className="border-b border-line py-8 text-lg">{t("none")}</p>}
          {jobs.map((job) => {
            const titleId = `job-${job.key}-title`;
            return (
              <article
                key={job.key}
                id={`job-${job.key}`}
                aria-labelledby={titleId}
                className="grid scroll-mt-4 gap-x-[clamp(28px,4.4vw,64px)] gap-y-5 border-b border-line py-8 min-[1001px]:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]"
              >
                <div>
                  <h3
                    id={titleId}
                    className="text-[clamp(1.625rem,2.8vw,2.375rem)] leading-none font-extrabold uppercase"
                  >
                    {job.title}
                  </h3>
                  <ul className="mt-3.5 flex flex-wrap gap-x-5 gap-y-2 text-[0.9375rem] text-ink">
                    <li className="inline-flex items-baseline gap-[7px]">
                      <MapPin className="size-4 shrink-0 translate-y-0.5 text-mute" strokeWidth={2} aria-hidden="true" />
                      <span>
                        <span className="sr-only">{t("location")}: </span>Joensuu
                      </span>
                    </li>
                    <li className="inline-flex items-baseline gap-[7px]">
                      <FileText className="size-4 shrink-0 translate-y-0.5 text-mute" strokeWidth={2} aria-hidden="true" />
                      <span>
                        <span className="sr-only">{t("employment")}: </span>
                        {t("permanent")}
                      </span>
                    </li>
                    <li className="inline-flex items-baseline gap-[7px]">
                      <Banknote className="size-4 shrink-0 translate-y-0.5 text-mute" strokeWidth={2} aria-hidden="true" />
                      <span className="tabular-nums">
                        <span className="sr-only">{t("salary")}: </span>
                        {t(`items.${job.key}.salary`)}
                      </span>
                    </li>
                    <li className="inline-flex items-baseline gap-[7px]">
                      <CalendarDays className="size-4 shrink-0 translate-y-0.5 text-mute" strokeWidth={2} aria-hidden="true" />
                      <span>
                        {t("applyBy")}{" "}
                        <time dateTime={job.deadline} className="tabular-nums">
                          {formatDate(job.deadline, locale)}
                        </time>
                      </span>
                    </li>
                    <li className="inline-flex items-baseline gap-[7px] text-mute">
                      <CalendarPlus className="size-4 shrink-0 translate-y-0.5" strokeWidth={2} aria-hidden="true" />
                      <span>
                        {t("posted")}{" "}
                        <time dateTime={job.posted} className="tabular-nums">
                          {formatDate(job.posted, locale, "numeric")}
                        </time>
                      </span>
                    </li>
                  </ul>
                </div>

                <div>
                  <div className="max-w-[62ch] [&>*+*]:mt-3">
                    {(t.raw(`items.${job.key}.body`) as JobParagraph[]).map((para, index) => (
                      <p key={index}>
                        {para.lead && <strong className="font-semibold text-ink">{para.lead}</strong>}
                        {para.lead && para.text && " "}
                        {para.text}
                      </p>
                    ))}
                  </div>
                  <p className="mt-3.5 max-w-[62ch] text-base">
                    {t.rich(`items.${job.key}.contact`, {
                      name: job.contact.name,
                      phone: job.contact.phone.label,
                      email: job.contact.email ?? "",
                      b: (chunks) => <strong className="font-semibold text-ink">{chunks}</strong>,
                      tel: (chunks) => (
                        <a href={job.contact.phone.href} className={`${TEXT_LINK} whitespace-nowrap`}>
                          <span className="sr-only">{t("phone")}: </span>
                          {chunks}
                        </a>
                      ),
                      mail: (chunks) => (
                        <a href={`mailto:${job.contact.email}`} className={TEXT_LINK}>
                          <span className="sr-only">{t("email")}: </span>
                          {chunks}
                        </a>
                      ),
                    })}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-3">
                    <Button asChild>
                      <a href={applyHref(job)}>
                        {t("applyByEmail")}
                        <Mail className="size-[18px]" strokeWidth={2} aria-hidden="true" />
                      </a>
                    </Button>
                    <Button asChild variant="outline-ink">
                      <a href={job.posting[locale]} target="_blank" rel="noopener">
                        {t("fullPosting")}
                        <ArrowUpRight strokeWidth={2.5} aria-hidden="true" />
                      </a>
                    </Button>
                  </div>
                  <p className="mt-4 max-w-[62ch] text-[0.9375rem]">
                    {t.rich(`items.${job.key}.howToApply`, {
                      address: RECRUITING_EMAIL,
                      mail: (chunks) => (
                        <a href={applyHref(job)} className={`${TEXT_LINK} whitespace-nowrap`}>
                          {chunks}
                        </a>
                      ),
                    })}
                  </p>
                </div>
              </article>
            );
          })}
        </div>

        <div
          id="open-application"
          className="mt-10 flex scroll-mt-4 flex-wrap items-center justify-between gap-x-8 gap-y-4 border-t-[3px] border-ink pt-[26px]"
        >
          <div>
            <h3 className="text-[clamp(1.25rem,2vw,1.625rem)] leading-[1.1] font-extrabold uppercase">{t("openTitle")}</h3>
            <p className="mt-1.5 max-w-[56ch]">{t("openText")}</p>
          </div>
          <Button asChild variant="dark" className="w-full min-[561px]:w-auto">
            <a href={OPEN_APPLICATION[locale]}>
              {t("openCta")}
              <ArrowUpRight strokeWidth={2.5} aria-hidden="true" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
