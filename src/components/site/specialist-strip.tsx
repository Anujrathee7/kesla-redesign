import { getLocale, getTranslations } from "next-intl/server";

import { Button } from "@/components/ui/button";
import type { Locale } from "@/i18n/routing";
import { localHref } from "@/lib/routes";

/**
 * Replaces kesla.com's floating "contact a specialist" chat popup, which
 * covered the content on every page, with a yellow strip above the footer.
 */
export async function SpecialistStrip() {
  const t = await getTranslations("Common.specialist");
  const locale = (await getLocale()) as Locale;

  return (
    <section aria-labelledby="specialist-title" className="on-yellow bg-yellow gutter">
      <div className="wrap flex flex-wrap items-center justify-between gap-x-10 gap-y-5 pt-[30px] pb-7">
        <h2
          id="specialist-title"
          className="text-[clamp(1.25rem,2.2vw,1.75rem)] leading-[1.08] font-extrabold text-black uppercase"
        >
          {t("title")}
        </h2>
        <div className="flex flex-wrap gap-3">
          <Button asChild variant="dark">
            <a href={localHref("contacts", locale)}>{t("factory")}</a>
          </Button>
          <Button asChild variant="outline-dark">
            <a href={localHref("dealers", locale)}>{t("dealer")}</a>
          </Button>
        </div>
      </div>
    </section>
  );
}
