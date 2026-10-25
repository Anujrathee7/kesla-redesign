import { ArrowDown, ArrowRight, ChevronRight } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { formatDate, openJobs } from "@/lib/career";

/**
 * The black page head, "Jobs first": breadcrumb, title and the squad line on
 * the left, the open positions as ruled rows on the right, because a job
 * seeker comes for them. Each row jumps to its posting further down the
 * page. Posts drop out after their deadline; with none open, one line says so
 * above the open application link. Then the frontpage's slanted yellow band.
 */
export async function CareerHead() {
  const t = await getTranslations("Career");
  const locale = (await getLocale()) as Locale;
  const jobs = await openJobs();

  return (
    <section aria-labelledby="career-title">
      <div className="bg-black text-on-dark gutter">
        <div className="wrap grid items-end gap-x-[clamp(32px,5vw,80px)] gap-y-9 pt-[clamp(32px,4vw,56px)] pb-[clamp(36px,5vw,64px)] min-[1001px]:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          <div>
            <nav aria-label={t("breadcrumb.label")}>
              <ol className="mt-[18px] mb-[18px] flex items-center gap-2 font-display text-lg leading-[1.2] font-semibold text-on-dark">
                <li className="flex items-center gap-2">
                  <Link
                    href="/"
                    className="relative text-on-dark-mute transition-colors after:absolute after:-inset-x-1 after:-inset-y-3 after:content-[''] hover:text-yellow"
                  >
                    {t("breadcrumb.home")}
                  </Link>
                  <ChevronRight className="size-3 shrink-0 text-on-dark-mute" strokeWidth={2.5} aria-hidden="true" />
                </li>
                <li aria-current="page">{t("meta.title")}</li>
              </ol>
            </nav>
            <h1
              id="career-title"
              className="text-[clamp(2.625rem,5.6vw,5rem)] leading-[0.95] font-extrabold tracking-[-0.015em] text-white uppercase"
            >
              {t("hero.titleLead")} <span className="block text-yellow">{t("hero.titleAccent")}</span>
            </h1>
            <p className="mt-[18px] max-w-[52ch] text-lg text-on-dark">{t("hero.intro")}</p>
          </div>

          <div>
            <h2
              id="open-now-title"
              className="mb-3 flex items-baseline gap-3 font-display text-sm leading-[1.2] font-bold tracking-[0.08em] text-yellow uppercase"
            >
              {t("hero.openNow")}
              <span className="inline-grid h-7 min-w-7 place-items-center rounded-full bg-yellow px-1.5 pt-0.5 text-base tracking-normal text-black tabular-nums">
                {jobs.length}
              </span>
            </h2>
            {jobs.length === 0 ? (
              <p className="border-t-[3px] border-b border-yellow border-b-dark-line pt-[18px] pb-[17px] font-display text-[clamp(1.25rem,2vw,1.5rem)] leading-[1.1] font-extrabold text-white uppercase">
                {t("jobs.none")}
              </p>
            ) : (
              <ul className="border-t-[3px] border-yellow">
                {jobs.map((job) => (
                  <li key={job.key}>
                    <a
                      href={`#job-${job.key}`}
                      className="group grid grid-cols-[minmax(0,1fr)_16px] items-center gap-x-6 gap-y-1.5 border-b border-dark-line pt-[18px] pb-[17px] text-white min-[721px]:grid-cols-[minmax(0,1fr)_auto_16px]"
                    >
                      <span>
                        <strong className="block font-display text-[clamp(1.25rem,2vw,1.5rem)] leading-[1.1] font-extrabold uppercase decoration-yellow decoration-[3px] underline-offset-[5px] group-hover:underline">
                          {job.title}
                        </strong>
                        <small className="mt-1 block text-[0.9375rem] text-on-dark-mute">
                          {t(`jobs.items.${job.key}.area`)} · Joensuu · {t("jobs.permanentLower")}
                        </small>
                      </span>
                      <span className="col-start-1 text-[0.9375rem] whitespace-nowrap text-on-dark-mute tabular-nums min-[721px]:col-start-auto">
                        {t("jobs.applyBy")}{" "}
                        <time dateTime={job.deadline} className="font-semibold text-on-dark">
                          {formatDate(job.deadline, locale)}
                        </time>
                      </span>
                      <ArrowDown
                        className="col-start-2 row-start-1 size-4 text-yellow transition-transform duration-200 ease-out-expo group-hover:translate-y-0.5 min-[721px]:col-start-3"
                        strokeWidth={2.5}
                        aria-hidden="true"
                      />
                    </a>
                  </li>
                ))}
              </ul>
            )}
            <a
              href="#open-application"
              className="relative mt-[18px] inline-flex items-center gap-1.5 font-display text-[0.9375rem] leading-[1.2] font-semibold text-white link-wipe [--wipe-color:var(--color-white)] after:absolute after:inset-x-0 after:-inset-y-3 after:content-['']"
            >
              {t("hero.openApplication")}
              <ArrowRight className="size-3 shrink-0" strokeWidth={2.5} aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>

      {/* The frontpage's brand band, same shear (see DESIGN.md, The Closed Shear Rule). */}
      <div className="on-yellow bg-yellow gutter [clip-path:polygon(clamp(16px,4vw,60px)_0,100%_0,100%_100%,0_100%)]">
        <p className="wrap flex flex-wrap items-center gap-x-[18px] gap-y-0.5 pt-3.5 pb-3 font-display text-[clamp(0.9375rem,1.6vw,1.1875rem)] leading-[1.2] font-extrabold tracking-[0.06em] text-black uppercase italic min-[561px]:gap-x-7">
          <span>{t("band.since")}</span>
        </p>
      </div>
    </section>
  );
}
