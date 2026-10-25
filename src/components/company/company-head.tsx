import { ChevronRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { SECTIONS } from "@/lib/company";

type Fact = { label: string; text: string };

/**
 * The black page head, "Fact file": breadcrumb, title, intro and the jump
 * chips on the left, Kesla in seven ruled facts on the right, then the
 * slanted yellow brand band with the tagline.
 */
export async function CompanyHead() {
  const t = await getTranslations("Company");
  const facts = t.raw("hero.facts") as Fact[];

  return (
    <section aria-labelledby="company-title">
      <div className="bg-black text-on-dark gutter">
        <div className="wrap grid items-start gap-x-[clamp(32px,5vw,80px)] gap-y-9 pt-[clamp(32px,4vw,56px)] pb-[clamp(36px,5vw,64px)] min-[1001px]:grid-cols-2">
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
              id="company-title"
              className="text-[clamp(2.625rem,5.6vw,4.75rem)] leading-[0.95] font-extrabold tracking-[-0.015em] text-white uppercase"
            >
              {t("hero.titleLead")} <span className="block whitespace-nowrap text-yellow">{t("hero.titleAccent")}</span>
            </h1>
            <p className="mt-[18px] max-w-[52ch] text-lg text-on-dark">{t("hero.intro")}</p>

            <nav aria-label={t("hero.jumpLabel")} className="mt-7">
              <ul className="flex flex-wrap gap-1.5">
                {SECTIONS.map((key) => (
                  <li key={key}>
                    <a
                      href={`#${key}`}
                      className="inline-flex min-h-11 items-center border border-dark-line px-3 pt-2.5 pb-[9px] font-display text-sm leading-none font-semibold text-on-dark transition-colors duration-200 ease-out hover:border-yellow hover:text-yellow sm:min-h-0 pointer-coarse:min-h-11"
                    >
                      {t(`hero.jump.${key}`)}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <dl aria-label={t("hero.factsLabel")} className="border-b border-dark-line min-[1001px]:mt-2">
            {facts.map((fact) => (
              <div
                key={fact.label}
                className="grid gap-0.5 border-t border-dark-line py-[13px] min-[561px]:grid-cols-[minmax(0,10em)_minmax(0,1fr)] min-[561px]:gap-5"
              >
                <dt className="font-display text-base leading-[1.35] font-bold tracking-[0.04em] text-on-dark uppercase">
                  {fact.label}
                </dt>
                <dd className="text-[1.0625rem] leading-[1.4] text-on-dark">{fact.text}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* The frontpage's brand band, same shear (see DESIGN.md, The Closed Shear Rule). */}
      <div className="on-yellow bg-yellow gutter [clip-path:polygon(clamp(16px,4vw,60px)_0,100%_0,100%_100%,0_100%)]">
        <p className="wrap flex flex-wrap items-center gap-x-[18px] gap-y-0.5 pt-3.5 pb-3 font-display text-[clamp(0.9375rem,1.6vw,1.1875rem)] leading-[1.2] font-extrabold tracking-[0.06em] text-black uppercase italic min-[561px]:gap-x-7">
          <span lang="en">{t("band.tagline")}</span>
        </p>
      </div>
    </section>
  );
}
